import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Nav, Navbar, NavItem} from "reactstrap";
import {CaseRoutingRule} from "../../../../model/CaseRoutingRule";
import {AppState} from "../../../../store";
import {showModal} from "../../../../store/actions/CasePageAction";
import CreationDate from "./CreationDate";
import NavBarForNote from "./NavBarForNote";
import NavBarForUpdate from "./NavBarForUpdate";
import UpdateDate from "./UpdateDate";

interface Props {
    // tslint:disable-next-line:no-any
    retrievedCase: any
    updateMode: boolean
    validRoutingRule: CaseRoutingRule
    showModal: () => void
    isFormCompleted: boolean
    isFormsyValid: boolean
    isFormMaxellCompleted: boolean
    // tslint:disable-next-line:no-any
    location: any
    payload
}

class ViewCaseNavBar extends Component<Props> {
    constructor(props: Props) {
        super(props)
    }

    public submitUpdates = () => {
        if (this.props.retrievedCase) {
            if (!(this.props.isFormCompleted && this.props.isFormsyValid) || !this.props.isFormMaxellCompleted) {
                NotificationManager.error(<FormattedMessage id="validation.general.message"/>);
            } else {
                this.props.showModal()
            }
        }
    }

    public render() {
        return (
                <Navbar className={this.props.payload.fromdisrc?"":"sticky-top "  +"bg-light p-1 border-bottom pl-3 pr-3"}
                        style={{backgroundColor: "rgba(255,255,255,1)"}}>
                    <Nav className="m-1" navbar>
                        <NavItem>
                            <h4 className={"mb-0"}>
                                <FormattedMessage id="cases.get.details.title"/>
                                <span id="headerCaseId">{this.props.retrievedCase ? this.props.retrievedCase.caseId : "Not found"}</span>
                            </h4>
                            {this.props.retrievedCase !== undefined || this.props.retrievedCase !== null ?
                                <React.Fragment>
                                    <CreationDate retrievedCase={this.props.retrievedCase}/>
                                    <UpdateDate retrievedCase={this.props.retrievedCase}/>
                                </React.Fragment>
                                : <React.Fragment/>}
                        </NavItem>
                    </Nav>
                    {this.props.updateMode ?
                        <NavBarForUpdate/>
                        : <NavBarForNote/>}
                </Navbar>
        );
    }
}

const mapDispatchToProps = {
    showModal,
}

const mapStateToProps = (state: AppState) => ({
    updateMode: state.casePage.updateMode,
    retrievedCase: state.case.currentCase,
    isFormCompleted: state.casePage.isFormCompleted,
    isFormsyValid: state.casePage.isFormsyValid,
    isFormMaxellCompleted: state.casePage.isFormMaxellCompleted,
    validRoutingRule: state.casePage.validRoutingRule,
    payload: state.payload.payload
})

export default connect(mapStateToProps, mapDispatchToProps)(ViewCaseNavBar)

