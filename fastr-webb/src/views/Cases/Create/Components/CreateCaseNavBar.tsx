import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Badge, Button, Nav, Navbar, NavItem} from "reactstrap";
import {CaseRoutingRule} from "../../../../model/CaseRoutingRule";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import FastService from "../../../../service/FastService";
import {AppState} from "../../../../store";
import {
    fetchAndStoreExternalApps,
    setCallTransferStatusOK,
    setHasCallTransfer
} from "../../../../store/actions";
import {setDisplayGridADGForDISRC} from "../../../../store/actions/CasePageAction";
import ScalingButton from "./ScalingButton";
import CaseScalingButtons from "./CaseScalingButtons";
import {compose} from "redux";
import {RouteComponentProps, withRouter} from "react-router";
import {setIsRecentCasesListDisplayed} from "../../../../store/actions/RecentCasesActions";
import {BlocksExternalAppsConfig} from "../../../Clients/ExternalAppsConfig";
import ExternalLinksBlock from "../../../Clients/ExternalLinksBlock";
import {IdParams} from "../../../Clients/ExternalApplicationPage";
import ExternalAppsUtils from "../../../../utils/ExternalAppsUtils";
import {Case} from "../../../../model/Case";
import {forceAutoAssign} from "../../../../utils/CaseUtils";

interface Props {
    caseNumber: string
    isFormsyValid: boolean
    isScalingMode: boolean
    isFormCompleted: boolean
    setHasCallTransfer: (value: boolean) => void
    setCallTransferStatusOK: (value: boolean) => void
    setIsRecentCasesListDisplayed: (value: boolean) => void
    qualification: CasesQualificationSettings
    matchingCase
    qualificationLeaf
    isLoadingQualification
    validRoutingRule: CaseRoutingRule
    boucleADG: boolean
    isFormMaxellCompleted: boolean
    sessionId: string
    displayCancelButton: boolean
    setDisplayGridADGForDISRC
    idActDisRC: string
    blockingUI: boolean
    idService: string
    idClient: string
    currentContactId?: string
    payload
    hasCallTransfer:boolean
    isCallTransferStatusOK:boolean
    fetchAndStoreExternalApps: () => void
    externalApps,
    retrievedCase: Case,
    theme?: CasesQualificationSettings
    userActivity
}

interface State {
    enabledButton: boolean,
    showExternalApps : boolean
    forceAutoAssign: boolean
}


class CreateCaseNavBar extends Component<Props & RouteComponentProps, State> {

    private  externalAppsSettings = BlocksExternalAppsConfig.fastrCases.createCaseNavBar;

    constructor(props) {
        super(props)
        this.state = {
            enabledButton: false,
            showExternalApps : false,
            forceAutoAssign: false
        }
    }

    public async componentDidMount() {
        this.props.fetchAndStoreExternalApps();
        const isCaseOnGoing = this.props.retrievedCase?.status === "ONGOING";
        this.setState({
            forceAutoAssign : forceAutoAssign(this.props.userActivity, this.props.theme?.incident, this.props.isScalingMode, this.props.validRoutingRule, isCaseOnGoing)
        });
    }

    public async componentDidUpdate(prevProps: Props) {
        if(prevProps.externalApps.appsList !== this.props.externalApps.appsList) {
            const showExternalApps = ExternalAppsUtils.isExternalAppAuthorized(this.props.externalApps.appsList, this.externalAppsSettings);
            this.setState({
                showExternalApps
            });
        }
        if(prevProps.validRoutingRule !== this.props.validRoutingRule) {
            const isCaseOnGoing = this.props.retrievedCase?.status === "ONGOING";
            this.setState({
                forceAutoAssign : forceAutoAssign(this.props.userActivity, this.props.theme?.incident, this.props.isScalingMode, this.props.validRoutingRule, isCaseOnGoing)
            });
        }
    }

    public generateBadge() {
        let type = ""
        if (this.props.qualification && this.props.qualification.type) {
            type = this.props.qualification.type
        } else {
            if (this.props.qualificationLeaf && this.props.qualificationLeaf.type) {
                type = this.props.qualificationLeaf.type
            }
        }
        if (type === "") {
            return <React.Fragment/>
        } else {
            return <Badge className="mr-2" color="secondary">{type}</Badge>
        }
    }

    public cancelCaseCreation = () => {
        this.props.setHasCallTransfer(false);
        this.props.setCallTransferStatusOK(true);
        this.props.setDisplayGridADGForDISRC(true);
        this.props.setIsRecentCasesListDisplayed(true);
        FastService.postAbortMessage({
            idCase: this.props.caseNumber,
            serviceId: this.props.idService
        })
    }

    public render() {
        const {showExternalApps, forceAutoAssign} = this.state;
        const scalingNotLeafSelected = (this.props.isScalingMode && !this.props.validRoutingRule)
        const fromDisrc = this.props.payload.fromdisrc;
        const submitDisabled = !this.props.isFormsyValid || !this.props.isFormCompleted || !this.props.qualificationLeaf || this.props.boucleADG || !this.props.isFormMaxellCompleted || scalingNotLeafSelected;
        const idParams : IdParams = {
            clientId : this.props.idClient,
            serviceId : this.props.idService,
            caseId : this.props.payload.idCase,
            contactId : this.props.payload.idContact
        }
        return (
            <Navbar className={fromDisrc? "":"sticky-top "+"p-1 border-bottom pl-3 pr-3 bg-light"}
                    style={{backgroundColor: "rgba(255,255,255,1)"}}>
                <h4>
                    {this.generateBadge()}
                    <FormattedMessage id="cases.get.details.title"/>{this.props.caseNumber}
                </h4>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        {showExternalApps ?
                            <ExternalLinksBlock
                                settings={this.externalAppsSettings}
                                isLoading={true}
                                idParams={idParams}
                                indsideFastrCase={true}
                                isQualificationLeaf={this.props.qualificationLeaf}
                            />
                            : <React.Fragment/>
                        }
                        {this.props.displayCancelButton &&
                        <Button id="caseNavbar.cancel.button.id" size="lg" className="mr-2" color="light"
                                onClick={this.cancelCaseCreation}>
                            <FormattedMessage id="cases.create.cancel"/>
                        </Button>
                        }
                        {this.props.isScalingMode ?
                            <CaseScalingButtons forceAutoAssign={forceAutoAssign}/>
                            : !this.props.idActDisRC ? <ScalingButton qualificationLeaf={this.props.qualificationLeaf}
                                                                      sessionId={this.props.sessionId}
                                                                      isCreation={true}/> : <React.Fragment/>}
                        {!forceAutoAssign &&
                            <Button id="caseNavbar.submit.button.id" type="submit" size="lg" color="primary"
                                    className="mx-2"
                                    disabled={submitDisabled || this.props.blockingUI}>
                                {this.props.hasCallTransfer && this.props.isCallTransferStatusOK ? <FormattedMessage id="cases.button.transfer"/> : <FormattedMessage id="cases.create.create"/>}
                            </Button>
                        }
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    isFormsyValid: state.casePage.isFormsyValid,
    isScalingMode: state.casePage.isScalingMode,
    isFormCompleted: state.casePage.isFormCompleted,
    qualification: state.casePage.qualification,
    displayCancelButton: state.casePage.displayCancelButton,
    matchingCase: state.recentCases.matchingCaseFound,
    isLoadingQualification: state.casePage.isLoadingQualification,
    qualificationLeaf: state.casePage.qualificationLeaf,
    validRoutingRule: state.casePage.validRoutingRule,
    boucleADG: state.casePage.boucleADG,
    isFormMaxellCompleted: state.casePage.isFormMaxellCompleted,
    idActDisRC: state.casePage.idActDisRC,
    blockingUI: state.ui.blockingUI,
    payload: state.payload.payload,
    hasCallTransfer: state.casePage.hasCallTransfer,
    isCallTransferStatusOK: state.casePage.isCallTransferStatusOK,
    externalApps: state.externalApps,
    retrievedCase: state.case.currentCase,
    theme: state.casePage.theme,
    userActivity: state.casePage.userActivity
})

const mapDispatchToProps = {
    setHasCallTransfer,
    setCallTransferStatusOK,
    setDisplayGridADGForDISRC,
    setIsRecentCasesListDisplayed,
    fetchAndStoreExternalApps
}

// tslint:disable-next-line:no-any
export default compose<any>(withRouter, connect(mapStateToProps, mapDispatchToProps))(CreateCaseNavBar)
