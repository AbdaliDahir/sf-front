import React from 'react';
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Button, Nav, Navbar, NavItem} from "reactstrap";
import FastService from "../../../../service/FastService";
import {AppState} from "../../../../store";
import {CaseRoutingRule} from "../../../../model/CaseRoutingRule";
import {setDisplayGridADGForDISRC} from "../../../../store/actions/CasePageAction";
import {setIsRecentCasesListDisplayed} from "../../../../store/actions/RecentCasesActions";
import {Case} from "../../../../model/Case";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {forceAutoAssign} from "../../../../utils/CaseUtils";

interface Props {
    isFormsyValid: boolean
    isFormCompleted: boolean
    caseNumber: string
    boucleADG: boolean
    isFormMaxellCompleted: boolean
    displayCancelButton: boolean
    isScalingMode: boolean
    validRoutingRule: CaseRoutingRule
    qualificationLeaf
    blockingUI: boolean
    idService?: string
    setIsRecentCasesListDisplayed: (state: boolean) => void
    setDisplayGridADGForDISRC: (state: boolean) => void
    hasCallTransfer:boolean
    isCallTransferStatusOK:boolean
    retrievedCase: Case,
    theme?: CasesQualificationSettings
    userActivity
}

interface State {
    forceAutoAssign: boolean
}

class CaseFooterNavBar extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            forceAutoAssign: false,
        }
    }

    public async componentDidMount() {
        const isCaseOnGoing = this.props.retrievedCase?.status === "ONGOING";
        this.setState({
            forceAutoAssign : forceAutoAssign(this.props.userActivity, this.props.theme?.incident, this.props.isScalingMode, this.props.validRoutingRule, isCaseOnGoing)
        });
    }

    public async componentDidUpdate(prevProps: Props) {
        if(prevProps.validRoutingRule !== this.props.validRoutingRule) {
            const isCaseOnGoing = this.props.retrievedCase?.status === "ONGOING";
            this.setState({
                forceAutoAssign : forceAutoAssign(this.props.userActivity, this.props.theme?.incident, this.props.isScalingMode, this.props.validRoutingRule, isCaseOnGoing)
            });
        }
    }

    public cancelCaseCreation = () => {
        this.props.setDisplayGridADGForDISRC(true)
        this.props.setIsRecentCasesListDisplayed(true);
        FastService.postAbortMessage({
            idCase: this.props.caseNumber,
            serviceId: this.props.idService
        })
    }

    public render = () => {
        const {forceAutoAssign} = this.state;
        const scalingNotLeafSelected = (this.props.isScalingMode && !this.props.validRoutingRule)
        const submitDisabled = !this.props.isFormsyValid || !this.props.isFormCompleted || !this.props.qualificationLeaf || this.props.boucleADG || !this.props.isFormMaxellCompleted || scalingNotLeafSelected;
        return (
            <Navbar>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        {this.props.displayCancelButton &&
                        <Button id="CaseFooterNavBar.cancel.button.id" size="lg" className="mr-2" color="light"
                                onClick={this.cancelCaseCreation}>
                            <FormattedMessage id="cases.create.cancel"/>
                        </Button>
                        }
                        {!forceAutoAssign &&
                        <Button id="CaseFooterNavBar.show.button.id" type="submit" size="lg" color="primary"
                                className="mr-2"
                                disabled={submitDisabled || this.props.blockingUI}>
                            {this.props.hasCallTransfer && this.props.isCallTransferStatusOK ?
                                <FormattedMessage id="cases.button.transfer"/> :
                                <FormattedMessage id="cases.create.create"/>}
                        </Button>
                        }
                    </NavItem>
                </Nav>
            </Navbar>
        )
    }
}

const mapDispatchToProps = {
    setDisplayGridADGForDISRC,
    setIsRecentCasesListDisplayed
}


const mapStateToProps = (state: AppState) => ({
    isFormsyValid: state.casePage.isFormsyValid,
    isFormCompleted: state.casePage.isFormCompleted,
    boucleADG: state.casePage.boucleADG,
    displayCancelButton: state.casePage.displayCancelButton,
    isFormMaxellCompleted: state.casePage.isFormMaxellCompleted,
    qualificationLeaf: state.casePage.qualificationLeaf,
    validRoutingRule: state.casePage.validRoutingRule,
    isScalingMode: state.casePage.isScalingMode,
    blockingUI: state.ui.blockingUI,
    hasCallTransfer: state.casePage.hasCallTransfer,
    isCallTransferStatusOK: state.casePage.isCallTransferStatusOK,
    retrievedCase: state.case.currentCase,
    theme: state.casePage.theme,
    userActivity: state.casePage.userActivity
})

export default connect(mapStateToProps, mapDispatchToProps)(CaseFooterNavBar)
