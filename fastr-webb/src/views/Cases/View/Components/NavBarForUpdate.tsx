import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {Nav, NavItem} from "reactstrap";
import Button from "reactstrap/lib/Button";
import {compose} from "redux";
import {Case} from "../../../../model/Case";
import {CaseCategory} from "../../../../model/CaseCategory";
import {CaseRoutingRule} from "../../../../model/CaseRoutingRule";
import FastService from "../../../../service/FastService";
import {AppState} from "../../../../store";
import {
    fetchAndStoreExternalApps,
    setFinishingTreatmentToTrue,
    setIsWithAutoAssignTrue
} from "../../../../store/actions";
import {isMaxwelCase} from "../../../../utils/MaxwellUtils";
import ScalingButton from "./ScalingButton";
import {
    setDisplayGridADGForDISRC,
    setForceAutoAssignFalse,
    setForceAutoAssignTrue,
    setIsCurrentUserEliToAutoAssign
} from "../../../../store/actions/CasePageAction";
import moment from "moment-timezone";
import CaseService from "../../../../service/CaseService";
import CaseScalingButtons from "../../Create/Components/CaseScalingButtons";
import {autoAssignCaseToCurrentUser} from "../../../../store/actions/CaseActions";
import {setIsRecentCasesListDisplayed} from "../../../../store/actions/RecentCasesActions";
import {BlocksExternalAppsConfig} from "../../../Clients/ExternalAppsConfig";
import ExternalLinksBlock from "../../../Clients/ExternalLinksBlock";
import {IdParams} from "../../../Clients/ExternalApplicationPage";
import ExternalAppsUtils from "../../../../utils/ExternalAppsUtils";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {forceAutoAssign} from "../../../../utils/CaseUtils";

interface Props extends RouteComponentProps {
    isScalingMode: boolean
    scalingEligibility: boolean
    finishingTreatment: boolean
    isCurrentOwner: boolean
    isFormCompleted: boolean
    isFormsyValid: boolean
    isAutoAssignEnabled: boolean
    validRoutingRule: CaseRoutingRule
    retrievedCase: Case
    revertScalingCaseMode: boolean
    setFinishingTreatmentToTrue: () => void
    setIsWithAutoAssignTrue: () => void
    setForceAutoAssignTrue: () => void
    setForceAutoAssignFalse: () => void
    setIsRecentCasesListDisplayed: (state: boolean) => void
    setDisplayGridADGForDISRC: (state: boolean) => void
    showModal: () => void
    location
    boucleADG: boolean
    isFormMaxellCompleted: boolean
    authorizations
    isCurrUserEliToUpdateScaledCase: boolean
    displayCancelButton: boolean
    idActDisRC: string
    blockingUI: boolean
    setIsCurrentUserEliToAutoAssign: (value: boolean) => void
    autoAssignCaseToCurrentUser: (id: string) => void
    hasCallTransfer: boolean
    isCallTransferStatusOK: boolean
    fetchAndStoreExternalApps: () => void
    qualificationLeaf
    payload
    externalApps
    isForceAutoAssign?: boolean
    theme?: CasesQualificationSettings
    userActivity
    isWithAutoAssign: boolean
    scalingConclusionRef
}

interface State {
    isUserActivityMatching: boolean,
    isOwnerLoginMatchingCCLongin: boolean,
    showExternalApps: boolean
}

class NavBarForUpdate extends Component<Props, State> {

    private caseService: CaseService = new CaseService(true);

    private externalAppsSettings = BlocksExternalAppsConfig.fastrCases.navBarForUpdate;

    constructor(props: Props) {
        super(props);
        this.state = {
            isUserActivityMatching: false,
            isOwnerLoginMatchingCCLongin: false,
            showExternalApps: false
        };
    }

    public componentDidMount = async () => {
        const isUserActivityMatching: boolean = await this.caseService.isUserActivityMatching(this.props.retrievedCase.caseOwner.activity.code);
        const isOwnerLoginMatchingCCLongin: boolean = await this.caseService.isOwnerLoginMatchingCCLongin(this.props.retrievedCase.caseOwner.login);
        const isCaseOnGoing = this.props.retrievedCase.status === "ONGOING";
        this.setState({
            isOwnerLoginMatchingCCLongin,
            isUserActivityMatching
        });

        this.shouldForceAutoAssign(forceAutoAssign(this.props.userActivity, this.props.theme?.incident, this.props.isScalingMode, this.props.validRoutingRule, isCaseOnGoing))
        this.props.fetchAndStoreExternalApps();
    }

    public shouldForceAutoAssign = (shouldForceAutoAssign) => {
        shouldForceAutoAssign ? this.props.setForceAutoAssignTrue() : this.props.setForceAutoAssignFalse()
    }

    public componentDidUpdate(prevProps: Props) {
        if (prevProps.externalApps.appsList !== this.props.externalApps.appsList) {
            const showExternalApps = ExternalAppsUtils.isExternalAppAuthorized(this.props.externalApps.appsList, this.externalAppsSettings);
            this.setState({
                showExternalApps
            });
        }

        if (prevProps.validRoutingRule !== this.props.validRoutingRule) {
            const isCaseOnGoing = this.props.retrievedCase?.status === "ONGOING";
            this.shouldForceAutoAssign(forceAutoAssign(this.props.userActivity, this.props.theme?.incident, this.props.isScalingMode, this.props.validRoutingRule, isCaseOnGoing))
        }
    }

    public isAllowedToAutoAssign = (retrievedCase) => {
        const startDate = moment(retrievedCase.updateDate);
        const timeEnd = moment(new Date());
        const diff = timeEnd.diff(startDate);
        const diffDuration = moment.duration(diff);
        const isCaseOwnerNotNull = retrievedCase.caseOwner!.perId && retrievedCase.caseOwner!.login ? true : false;

        const isOwnerEligible = !isCaseOwnerNotNull && this.state.isUserActivityMatching ? true : false;
        const isNotUpdatedRecently = isCaseOwnerNotNull && this.state.isUserActivityMatching && !this.state.isOwnerLoginMatchingCCLongin
        && (diffDuration.hours() >= 2 || diffDuration.days() > 0) ? true : false;
        if (isOwnerEligible || isNotUpdatedRecently) {
            return true;
        } else {
            return false;
        }
    }

    public submitUpdatesWithAutoAssign = async () => {
        this.props.setIsCurrentUserEliToAutoAssign(false);
        try {
            await this.props.autoAssignCaseToCurrentUser(this.props.retrievedCase.caseId);
        } finally {
            this.props.setIsCurrentUserEliToAutoAssign(true);
        }
        this.props.setIsWithAutoAssignTrue()
        this.submitUpdates();
    }

    public submitUpdates = () => {
        if (this.props.retrievedCase) {
            if (!(this.props.isFormCompleted && this.props.isFormsyValid)) {
                NotificationManager.error(<FormattedMessage id="validation.general.message"/>);
            }
        }
    }

    public cancelUpdates = () => {
        this.props.setDisplayGridADGForDISRC(true)
        this.props.setIsRecentCasesListDisplayed(true);
        // this.props.history.push("/cases/list" + this.props.location.search)
        FastService.postAbortMessage({
            idCase: this.props.retrievedCase.caseId,
            serviceId: this.props.retrievedCase.serviceId
        });
    }

    public canUserAccessCaseFinishProcessing = () => {
        return this.props.authorizations.indexOf("ADG_RETENTION") !== -1 || this.props.authorizations.indexOf("ADG_ANTICHURN") !== -1
            ? this.props.isCurrUserEliToUpdateScaledCase : true;
    }

    public handleFinishingTreatmentActions = () => {
        this.props.setFinishingTreatmentToTrue();
        this.props.scalingConclusionRef && this.props.scalingConclusionRef.scrollIntoView()
    }


    public render() {
        const {showExternalApps} = this.state;
        const isAllowedToAutoAssign = this.isAllowedToAutoAssign(this.props.retrievedCase);
        const isCaseClosed = this.props.retrievedCase.status === "CLOSED"
        const isCaseScaled = this.props.retrievedCase.category === CaseCategory.SCALED;
        const isMaxwellCase = isMaxwelCase(this.props.retrievedCase)
        const scalingNotLeafSelected = (this.props.isScalingMode && !this.props.validRoutingRule)
        const isActiviteBeBCoFixe = this.props.authorizations.indexOf("isActiviteBeBCoFixe ") !== -1
        const submitDisabled = !(this.props.isFormsyValid && this.props.isFormCompleted) || this.props.boucleADG || !this.props.isFormMaxellCompleted || scalingNotLeafSelected;
        const displaySubmit = !this.props.isForceAutoAssign
        const idParams: IdParams = {
            clientId: this.props.retrievedCase.clientId,
            serviceId: this.props.retrievedCase.serviceId,
            caseId: this.props.payload.idCase,
            contactId: this.props.payload.idContact
        }
        return (
            <Nav navbar>
                <NavItem>
                    {showExternalApps ?
                        <ExternalLinksBlock
                            settings={this.externalAppsSettings}
                            isLoading={this.props.retrievedCase}
                            idParams={idParams}
                            indsideFastrCase={true}
                            isQualificationLeaf={this.props.qualificationLeaf}
                        />
                        : <React.Fragment/>
                    }
                    {this.props.displayCancelButton &&
                    <Button id="navBarForUpdate.cancelUpdates.button.id" className="ml-2" size="lg" type="button"
                            color="light" onClick={this.cancelUpdates}>
                        <FormattedMessage id="cases.create.cancel"/>
                    </Button>
                    }
                    {isAllowedToAutoAssign && !isCaseClosed && isCaseScaled ?
                        <Button id="navBarForUpdate.submitUpdatesWithAutoAssign.button.id" className="ml-2 bg-light"
                                size="lg"
                                color="secondary" type="submit"
                                disabled={(!this.props.isAutoAssignEnabled || !(this.props.isFormsyValid && this.props.isFormCompleted)) && !isActiviteBeBCoFixe || this.props.blockingUI}
                                onClick={this.submitUpdatesWithAutoAssign}>
                            <FormattedMessage id="cases.create.transfer.autoAssign"/>
                        </Button>
                        : <React.Fragment/>}

                    {(isCaseScaled && !isMaxwellCase && this.canUserAccessCaseFinishProcessing()) ?
                        <Button id="navBarForUpdate.setFinishingTreatmentToTrue.button.id" className="ml-2 bg-light"
                                size="lg"
                                type="button" color="secondary"
                                onClick={this.handleFinishingTreatmentActions}
                                disabled={this.props.finishingTreatment || this.props.revertScalingCaseMode}>
                            <FormattedMessage id="cases.scaling.finishingTreatment.title"/>
                        </Button>
                        : <React.Fragment/>}

                    {!isCaseScaled && this.props.scalingEligibility && !this.props.isScalingMode && !this.props.idActDisRC ?
                        <ScalingButton location={this.props.location} isCreation={false}/>
                        : <React.Fragment/>}
                    {this.props.isScalingMode && (!isCaseScaled || this.props.revertScalingCaseMode) &&
                    <CaseScalingButtons forceAutoAssign={forceAutoAssign}/>
                    }
                    {displaySubmit &&
                    <Button id="navBarForUpdate.submitUpdates.button.id" className="mx-2" size="lg" color="primary"
                            onClick={this.submitUpdates} type="submit"
                            disabled={submitDisabled || this.props.blockingUI}>
                        {this.props.hasCallTransfer && this.props.isCallTransferStatusOK ?
                            <FormattedMessage id="cases.button.transfer"/> :
                            <FormattedMessage id="cases.button.submit"/>}
                    </Button>
                    }
                </NavItem>
            </Nav>
        );
    }
}


const mapDispatchToProps = {
    setIsWithAutoAssignTrue,
    setFinishingTreatmentToTrue,
    setDisplayGridADGForDISRC,
    setIsCurrentUserEliToAutoAssign,
    autoAssignCaseToCurrentUser,
    setIsRecentCasesListDisplayed,
    fetchAndStoreExternalApps,
    setForceAutoAssignTrue,
    setForceAutoAssignFalse
}

const mapStateToProps = (state: AppState) => ({
    isScalingMode: state.casePage.isScalingMode,
    scalingEligibility: state.casePage.scalingEligibility,
    finishingTreatment: state.casePage.finishingTreatment,
    isCurrentOwner: state.casePage.isCurrentOwner,
    validRoutingRule: state.casePage.validRoutingRule,
    retrievedCase: state.case.currentCase,
    isFormsyValid: state.casePage.isFormsyValid,
    revertScalingCaseMode: state.casePage.revertScalingCaseMode,
    isAutoAssignEnabled: state.casePage.isAutoAssignEnabled,
    isFormCompleted: state.casePage.isFormCompleted,
    isFormMaxellCompleted: state.casePage.isFormMaxellCompleted,
    boucleADG: state.casePage.boucleADG,
    displayCancelButton: state.casePage.displayCancelButton,
    authorizations: state.authorization.authorizations,
    isCurrUserEliToUpdateScaledCase: state.casePage.isCurrUserEliToUpdateScaledCase,
    idActDisRC: state.casePage.idActDisRC,
    blockingUI: state.ui.blockingUI,
    hasCallTransfer: state.casePage.hasCallTransfer,
    appsList: state.externalApps.appsList,
    isCallTransferStatusOK: state.casePage.isCallTransferStatusOK,
    qualificationLeaf: state.casePage.qualificationLeaf,
    payload: state.payload.payload,
    externalApps: state.externalApps,
    theme: state.casePage.theme,
    userActivity: state.casePage.userActivity,
    isWithAutoAssign: state.casePage.isWithAutoAssign,
    isForceAutoAssign: state.casePage.isForceAutoAssign,
    scalingConclusionRef: state.casePage.scalingConclusionRef


})

// tslint:disable-next-line:no-any
export default compose<any>(withRouter, connect(mapStateToProps, mapDispatchToProps))(NavBarForUpdate)
