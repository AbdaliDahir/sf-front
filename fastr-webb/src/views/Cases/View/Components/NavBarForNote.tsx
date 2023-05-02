import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Nav, NavItem} from "reactstrap";
import Button from "reactstrap/lib/Button";
import {Case} from "../../../../model/Case";
import {CaseCategory} from "../../../../model/CaseCategory";
import {AppState} from "../../../../store";
import {
    hideModal,
    resetRetentionForm,
    setForceNoteToTrue,
    setIsCurrentUserEliToAutoAssign,
    setIsCurrentUserEliToReQualifyImmediateCase,
    setIsCurrentUserEliToUpdateImmediateCase,
    setOnlyNoteToTrue,
    setRevertScalingTrue,
    setScaledCaseIsEligibleToModification,
    setUpdateModeToTrue,
    showModal,
} from "../../../../store/actions/CasePageAction";

import {autoAssignCaseToCurrentUser} from "../../../../store/actions/CaseActions";
import CaseService from "../../../../service/CaseService";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {
    hideModalForCaseManager,
    setModalParameters,
    showModalForCaseManager
} from "../../../../store/actions/ModalAction";
import {isMaxwelCase, isCaseHasInProgressMaxwellV2Incident} from "../../../../utils/MaxwellUtils";
import {isActRetentionPresent} from "../../../../utils/CaseUtils";
import moment from "moment-timezone";
import {IncidentsListItem} from "../../../../model/IncidentsList";
import FastService from "../../../../service/FastService";

interface Props {
    retrievedCase: Case
    hideModal: () => void
    showModal: () => void
    hideModalForCaseManager: () => void
    showModalForCaseManager: () => void
    setModalParameters: (parameterName: string, parameterValue: string | boolean) => void
    setUpdateModeToTrue: () => void
    setRevertScalingTrue: () => void
    setOnlyNoteToTrue: () => void
    setForceNoteToTrue: () => void
    isCurrUserEliToUpdateScaledCase: boolean
    isCurrUserEliToUpdateImmediateCase: boolean
    isCurrUserEliToReQualifyImmediateCase: boolean,
    isCurrUserObligedToReQualifyImmediateCase: boolean,
    isCurrUserEliToUpdateMandatoryADGForCurrentCase: boolean,
    isCurrUserEliToAddNoteToCase: boolean,
    // tslint:disable-next-line:no-any
    authorizations: any
    isUpdateEnabled: boolean
    showModalState: boolean
    isCurrentUserEliToAutoAssign: boolean
    autoAssignCaseToCurrentUser: (id: string) => void
    showModalForCaseManagerState: boolean
    setScaledCaseIsEligibleToModification: () => void
    setIsCurrentUserEliToAutoAssign: (value:boolean) => void
    setIsCurrentUserEliToUpdateImmediateCase: (value:boolean) => void
    setIsCurrentUserEliToReQualifyImmediateCase: (value:boolean) => void
    resetRetentionForm: (value: boolean) => void
    blockingUI:boolean
    incidentsList: Array<IncidentsListItem>
}

interface State {
    isUserActivityMatching: boolean,
    isOwnerLoginMatchingCCLongin: boolean
}

class NavBarForNote extends Component<Props, State> {

    private caseService: CaseService = new CaseService(true);

    constructor(props: Props) {
        super(props);
        this.state = {isUserActivityMatching: false,isOwnerLoginMatchingCCLongin: false};
    }

    public componentDidMount = async () => {
        const isUserActivityMatching: boolean = await this.caseService.isUserActivityMatching(this.props.retrievedCase.caseOwner.activity.code);
        this.setState({
            isUserActivityMatching
        });

        const isOwnerLoginMatchingCCLongin: boolean = await this.caseService.isOwnerLoginMatchingCCLongin(this.props.retrievedCase.caseOwner.login);
        this.setState({
            isOwnerLoginMatchingCCLongin
        });
    };

    public toggleEditModalOnlyForTheNote = () => {
        if (this.props.showModalState) {
            this.props.hideModal()
        } else {
            this.props.showModal()
        }
        this.props.setOnlyNoteToTrue()
    }

    public toggleResolutionReminderModal = () => {
        this.props.hideModal()
        this.props.setModalParameters("CASE_RESOLUTION_DUNNING", true)
        this.props.setModalParameters("SET_SUCCESS_MODAL_MESSAGE_ID", "RESOLUTION_DUNNING")
        this.props.setModalParameters("SET_ERROR_MODAL_MESSAGE_ID", "RESOLUTION_DUNNING")

        if (this.props.showModalForCaseManagerState) {
            this.props.hideModalForCaseManager()
        } else {
            this.props.showModalForCaseManager()
        }

    }

    public handleCancelScaledCase = () => {
        this.props.setRevertScalingTrue()
        const isBeb = this.props.authorizations.indexOf("isActiviteBeB") !== -1;
        this.props.setIsCurrentUserEliToUpdateImmediateCase(isBeb);
        this.props.setIsCurrentUserEliToReQualifyImmediateCase(isBeb);
        if(isBeb){
            this.props.setScaledCaseIsEligibleToModification();
            this.props.setUpdateModeToTrue();
        }
    }

    public enableUpdateCase = () => {
        /*Button 'Modifier'*/
        if (this.props.retrievedCase && this.props.retrievedCase.status !== 'CLOSED') {
            this.props.setForceNoteToTrue()
            this.props.setUpdateModeToTrue()
            this.handleResetRetentionForm()
        } else {
            NotificationManager.error(<FormattedMessage id="cases.update.closed.error"/>);
        }
    };

    // condition for handling reset retention
    public handleResetRetentionForm = () => {
        if (isActRetentionPresent(this.props.retrievedCase) && this.props.authorizations.indexOf("ADG_RETENTION") !== -1) {
            this.props.resetRetentionForm(true)
        } else {
            this.props.resetRetentionForm(false)
        }
    }

    // handle auto assign case to current user (similar to tray)
    public handleAutoAssignScaledCase = async () => {
        this.props.setIsCurrentUserEliToAutoAssign(false);
        try{
            await this.props.autoAssignCaseToCurrentUser(this.props.retrievedCase.caseId);
        } finally {
            this.props.setIsCurrentUserEliToAutoAssign(true);
        }

        if (this.props.retrievedCase.status === 'ONGOING') {
            // Enable Update button if we auto Assign Case
            this.props.setScaledCaseIsEligibleToModification();
            NotificationManager.success(this.buildAutoAssignSuccessMsg());
            if (this.props.authorizations.indexOf("isActiviteBeB") !== -1 || (this.isCaseForLandLine(this.props.retrievedCase) && this.props.authorizations.indexOf("isActiviteBeBCoFixe") !== -1)) {
                this.props.setUpdateModeToTrue()
            }
        }
    };

    public buildAutoAssignSuccessMsg = () => {
        const scaledCase = this.props.retrievedCase
        const scalingSuccess = translate.formatMessage({id: "case.number"})
            .concat(' ', scaledCase.caseId)
            .concat(' ', translate.formatMessage({id: "case.scaled.assign"}))
            .concat(' ', scaledCase.caseOwner.login)
        return scalingSuccess;
    }

    public isCaseForLandLine = (retrievedCase) => {
        return retrievedCase.offerCategory === "FIXE"
    }

    public isAllowedToAutoAssign = (retrievedCase) =>{
        const startDate = moment(retrievedCase.updateDate);
        const timeEnd = moment(new Date());
        const diff = timeEnd.diff(startDate);
        const diffDuration = moment.duration(diff);
        const isCaseOwnerNotNull = retrievedCase.caseOwner!.perId && retrievedCase.caseOwner!.login ? true : false;

        const isOwnerEligible = !isCaseOwnerNotNull && this.state.isUserActivityMatching ? true : false;
        const isNotUpdatedRecently = isCaseOwnerNotNull && this.state.isUserActivityMatching  && !this.state.isOwnerLoginMatchingCCLongin
                                        && (diffDuration.hours() >= 2 || diffDuration.days() > 0) ? true : false;
        const isResolvedOrUnresolved = this.props.retrievedCase.status === "RESOLVED" || this.props.retrievedCase.status === "UNRESOLVED"
        return (isOwnerEligible || isNotUpdatedRecently) && !isResolvedOrUnresolved;
    }

    public cancelUpdates = () => {
        // this.props.history.push("/cases/list" + this.props.location.search)
        FastService.postAbortMessage({
            idCase: this.props.retrievedCase.caseId,
            serviceId: this.props.retrievedCase.serviceId
        });
    }

    public render() {
        const isCaseScaled = this.props.retrievedCase.category === CaseCategory.SCALED;
        const isMaxwellCase = isMaxwelCase(this.props.retrievedCase)
        const isCaseHasMaxwellV2Incident = isCaseHasInProgressMaxwellV2Incident(this.props.incidentsList)
        const landLine = this.isCaseForLandLine(this.props.retrievedCase)
        const isActiviteBeBMobile = this.props.authorizations.indexOf("isActiviteBeB") !== -1 && !landLine
        const isActiviteBeBCoFixe = this.props.authorizations.indexOf("isActiviteBeBCoFixe") !== -1 && landLine
        const isAllowedToAutoAssign = this.isAllowedToAutoAssign(this.props.retrievedCase);
        const isResolvedOrUnresolved = this.props.retrievedCase.status === "RESOLVED" || this.props.retrievedCase.status === "UNRESOLVED"
        const isUpdateButtonEnabledForScaledCase = (isCaseScaled && this.props.isCurrUserEliToUpdateScaledCase)
        const isUpdateButtonEnabledForImmediateCase = (!isCaseScaled && this.props.isCurrUserEliToUpdateImmediateCase)
        const isUpdateButtonEnabledForMandatoryADGUpdate = this.props.isCurrUserEliToUpdateMandatoryADGForCurrentCase
        const isCaseClosed = this.props.retrievedCase.status === "CLOSED"

        const shouldDisableUpdate = landLine && !isActiviteBeBCoFixe ? true :
            (
                (   !isUpdateButtonEnabledForImmediateCase
                    && !isUpdateButtonEnabledForScaledCase
                    && !isUpdateButtonEnabledForMandatoryADGUpdate
                )
                || isCaseClosed
                || !(isActiviteBeBMobile || isActiviteBeBCoFixe)
            );

        return (

            <Nav navbar>
                <NavItem>
                    <Button id="navBarForUpdate.cancelUpdates.button.id" className="ml-2" size="lg" type="button"
                            color="light" onClick={this.cancelUpdates}>
                        <FormattedMessage id="cases.create.cancel"/>
                    </Button>
                    {!isCaseHasMaxwellV2Incident && !isMaxwellCase && isCaseScaled && this.props.retrievedCase.status === 'QUALIFIED' ?
                        <Button className="ml-2" size="lg" type="button" color="light"
                                id="navbarfornote.handleCancelScaledCase.button.id"
                                disabled={this.props.authorizations.indexOf("BEB_SCALING_CANCELLATION") === -1 || this.state.isUserActivityMatching}
                                onClick={this.handleCancelScaledCase}>
                            <FormattedMessage id="cases.get.details.cancel.scaled"/>
                        </Button>
                        : <React.Fragment/>}
                    {isCaseScaled && isResolvedOrUnresolved && !isMaxwellCase && (isActiviteBeBCoFixe || isActiviteBeBMobile) ?  // Bouton relance de résolution de
                        // dossier (on ne l'affiche ni pour les dossiers escaladés de type maxwell ni pour les activités
                        // non BEB!!)
                        <Button id="navbarfornote.toggleResolutionReminderModal.button.id" size="lg" type="button"
                                className="ml-2 bg-white"
                                color="secondary" onClick={this.toggleResolutionReminderModal}>
                            <FormattedMessage id="cases.resolution.dunning.title"/>
                        </Button>
                        : <div/>
                    }

                    {isAllowedToAutoAssign && !isCaseClosed && isCaseScaled ?
                        <Button id="navbarfornote.handleAutoAssignScaledCase.button.id" className="ml-2 bg-white"
                                size="lg"
                                type="button" color="secondary"
                                disabled={!isActiviteBeBCoFixe && !isActiviteBeBMobile}
                                onClick={this.handleAutoAssignScaledCase}>
                            <FormattedMessage id="cases.create.transfer.autoAssign"/>
                        </Button>
                        : <React.Fragment/>}

                    {this.props.retrievedCase.status !== "CLOSED" &&
                    <React.Fragment>
                        { this.props.isCurrUserEliToAddNoteToCase  &&
                            <Button id="navbarfornote.toggleEditModalOnlyForTheNote.button.id" size="lg"
                                    className="ml-2"
                                    type="button" color="primary"
                                    onClick={this.toggleEditModalOnlyForTheNote}>
                                <FormattedMessage id="cases.get.details.add.note"/>
                            </Button>
                        }
                        <React.Fragment>
                            { !shouldDisableUpdate  &&
                                <span id="button-update">
                                    <Button id="navbarfornote.enableUpdateCase.button.id" size="lg"
                                            type="button"
                                            color="primary"
                                            className={"mx-2"}
                                            onClick={this.enableUpdateCase}
                                            disabled={this.props.blockingUI}>
                                        {
                                            this.props.isCurrUserObligedToReQualifyImmediateCase ?
                                            <FormattedMessage id="cases.get.details.update.reQualify"/>
                                            :
                                            <FormattedMessage id="cases.get.details.update"/>
                                        }
                                    </Button>
                                </span>
                            }
                        </React.Fragment>
                    </React.Fragment>
                    }
                </NavItem>
            </Nav>
        );
    }
}

const mapDispatchToProps = {
    hideModal,
    showModal,
    setUpdateModeToTrue,
    setRevertScalingTrue,
    setIsCurrentUserEliToUpdateImmediateCase,
    setIsCurrentUserEliToReQualifyImmediateCase,
    setOnlyNoteToTrue,
    setForceNoteToTrue,
    autoAssignCaseToCurrentUser,
    showModalForCaseManager,
    hideModalForCaseManager,
    setModalParameters,
    setScaledCaseIsEligibleToModification,
    setIsCurrentUserEliToAutoAssign,
    resetRetentionForm
}

const mapStateToProps = (state: AppState) => ({
    retrievedCase: state.case.currentCase,
    authorizations: state.authorization.authorizations,
    showModalState: state.casePage.showModal,
    showModalForCaseManagerState: state.modalManager.showModalForCaseManagerState,
    isCurrUserEliToUpdateScaledCase: state.casePage.isCurrUserEliToUpdateScaledCase,
    isUpdateEnabled: state.casePage.isUpdateEnabled,
    isCurrentUserEliToAutoAssign: state.casePage.isCurrentUserEliToAutoAssign,
    isCurrUserEliToUpdateImmediateCase: state.casePage.isCurrUserEliToUpdateImmediateCase,
    isCurrUserEliToReQualifyImmediateCase: state.casePage.isCurrUserEliToReQualifyImmediateCase,
    isCurrUserObligedToReQualifyImmediateCase: state.casePage.isCurrUserObligedToReQualifyImmediateCase,
    isCurrUserEliToAddNoteToCase: state.casePage.isCurrUserEliToAddNoteToCase,
    isCurrUserEliToUpdateMandatoryADGForCurrentCase: state.casePage.isCurrUserEliToUpdateMandatoryADGForCurrentCase,
    blockingUI: state.ui.blockingUI,
    incidentsList: state.casePage.incidentsList
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBarForNote)
