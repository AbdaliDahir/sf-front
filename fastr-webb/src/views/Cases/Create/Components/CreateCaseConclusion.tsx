import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, Row} from "reactstrap";
import ValidationUtils from "../../../../utils/ValidationUtils";
import CaseStatus from "../../Components/Contacts/CaseStatus";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import GenericCardToggle from "../../../../components/Bootstrap/GenericCardToggle";
import {Case} from "../../../../model/Case";
import CaseService from "../../../../service/CaseService";
import * as queryString from "querystring";
import {RouteComponentProps, withRouter} from "react-router";
import {compose} from "redux";
import {NotificationManager} from "react-notifications";
import SessionService from "../../../../service/SessionService";

interface Props {
    idAct?: string
    qualificationLeaf
    isQualificationSelected: boolean,
    isCallTransferStatusOK: boolean,
    hasCallTransfer: boolean,
    currentCase: Case
}

interface State {
    caseStatus: 'RESOLVED' | 'UNRESOLVED' | '',
    forceValue: 'RESOLVED' | 'UNRESOLVED' | '',
    userActivity: string
}

class CreateCaseConclusion extends React.Component<Props & RouteComponentProps, State> {

    private caseService: CaseService = new CaseService(true);

    constructor(props) {
        super(props);
        this.state = {
            caseStatus: '',
            forceValue: '',
            userActivity: ''
        }
    }

    public componentWillMount = async () => {
        try {
            let currentSessionId: string | undefined = "";
            try {
                currentSessionId = queryString.parse(this.props.location.search.replace("?", "")).sessionId.toString();
            } catch (e) {
                currentSessionId = SessionService.getSession();
            }
            if (currentSessionId === undefined) {
                currentSessionId = ""
            }
            const userActivity: string = await this.caseService.getUserActivitieFromSession(currentSessionId);
            this.setState({userActivity: userActivity});
        } catch (e) {
            this.setState({userActivity: ''});
            NotificationManager.warning(<FormattedMessage id="cases.create.conclusion.filterByUserActivity.error"/>);
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>): void {
        if (prevProps.isCallTransferStatusOK !== this.props.isCallTransferStatusOK || prevProps.hasCallTransfer !== this.props.hasCallTransfer) {
            if (!this.isCallTransferOk()) {
                this.setState({forceValue: ""})
            } else {
                this.setState({forceValue: "UNRESOLVED"})
            }
        } else if (prevProps.isQualificationSelected !== this.props.isQualificationSelected && !this.props.isQualificationSelected) {
            this.setState({caseStatus: ""})
        }
    }

    public filterConclusionByHabilitedActivites = () => {
        if (this.state.userActivity) {
            const conclusionsResult = this.props.qualificationLeaf.conclusions.filter(conclusion =>
                conclusion?.activities && conclusion.activities.indexOf(this.state.userActivity) > -1);
            return conclusionsResult;
        } else {
            return this.props.qualificationLeaf.conclusions;
        }
    }

    public retrieveConclusions = () => {
        if (this.state.caseStatus === "") {
            return;
        }
        if (this.props.qualificationLeaf &&
            this.props.qualificationLeaf.conclusions !== undefined &&
            this.props.qualificationLeaf.conclusions.length > 0) {

            const resultConclusions: Array<JSX.Element> = [];
            const conclusionsResult = this.filterConclusionByHabilitedActivites().sort(function (a, b) {
                return a.label.trim().toLowerCase().localeCompare(b.label.trim().toLowerCase());
            });
            for (const conclusion of conclusionsResult) {
                if ((this.state.caseStatus === "RESOLVED" && conclusion.realized) || (this.state.caseStatus === "UNRESOLVED" && !conclusion.realized)) {
                    resultConclusions.push(<option key={conclusion.label}>{conclusion.label}</option>)
                }
            }
            return resultConclusions;
        } else {
            return (<option><FormattedMessage id={"cases.get.details.conclusions.none"}/></option>)
        }
    };

    public handleCaseStatus = (status: 'RESOLVED' | 'UNRESOLVED' | '') => {
        this.setState({
            caseStatus: status,
        })
    };

    public isCallTransferOk = () => {
        return this.props.hasCallTransfer && this.props.isCallTransferStatusOK;
    };

    public getConclusionValue = () => {
        if (this.isCallTransferOk()) {
            return translate.formatMessage({id: "cases.conclusion.callTransfer.OK"});
        }
        return null;
    };

    public render() {
        const {isQualificationSelected} = this.props;
        const {caseStatus, forceValue} = this.state;
        return (
            <GenericCardToggle title={"cases.create.treatmentConclusion"} icon={"icon-contract"}>
                <Row>
                    <Col>
                        <CaseStatus handleStatusChange={this.handleCaseStatus}
                                    forceValue={forceValue}
                                    active={this.props.currentCase ? this.props.currentCase.processing : undefined}
                                    disabled={this.isCallTransferOk() || !isQualificationSelected}
                                    value={this.isCallTransferOk() ? 'UNRESOLVED' : isQualificationSelected ? caseStatus : ''}/>
                    </Col>
                    <Col>
                        <FormSelectInput disabled={this.isCallTransferOk() || !isQualificationSelected}
                                         key={caseStatus}
                                         validations={{isRequired: ValidationUtils.notEmpty}}
                                         name="processingConclusion" id="processingConclusion"
                                         bsSize={"sm"}
                                         value={this.getConclusionValue()}>
                            {this.isCallTransferOk() ?
                                <option selected>{translate.formatMessage({id: "cases.conclusion.callTransfer.OK"})}</option>
                                : this.retrieveConclusions()}
                            <option value="" disabled selected/>
                        </FormSelectInput>
                    </Col>
                </Row>
            </GenericCardToggle>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    hasCallTransfer: state.casePage.hasCallTransfer,
    isCallTransferStatusOK: state.casePage.isCallTransferStatusOK,
    qualificationLeaf: state.casePage.qualificationLeaf,
    isQualificationSelected: state.casePage.isQualificationSelected,
    currentCase: state.case.currentCase
});

export default compose<any>(withRouter, connect(mapStateToProps))(CreateCaseConclusion)
