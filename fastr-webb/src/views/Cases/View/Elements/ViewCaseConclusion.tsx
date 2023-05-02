import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, Row} from "reactstrap";
import {FormChanges} from "../ViewCasePage";
import {Case} from "../../../../model/Case";
import ValidationUtils from "../../../../utils/ValidationUtils";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {CaseConclusion as Conclusion} from "../../../../model/CaseConclusion";
import {default as CaseStatusComponent} from "../../Components/Contacts/CaseStatus";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {Status} from "../../../../model/Status";
import GenericCardToggle from "../../../../components/Bootstrap/GenericCardToggle";
import {Activity} from "../../../../model/Activity";
import {fetchAndStoreSessionUserActivity} from "../../../../store/actions";
import SessionService from "../../../../service/SessionService";

interface Props {
    case: Case
    updateMode: boolean
    getConclusionChanges: (formChanges: FormChanges) => void
    results: Conclusion[],
    hasCallTransfer: boolean,
    isCallTransferStatusOK: boolean,
    idAct?: string,
    currentCase: Case,
    isQualificationSelected: boolean,
    isCurrUserEliToUpdateImmediateCase: boolean,
    userActivity?: Activity,
    fetchAndStoreSessionUserActivity: (sessionId: string) => void
}

export interface State {
    conclusions: JSX.Element[];
    updateMode: boolean;
    forceValue: Status | "";
    selectedConclusion
}

class ViewCaseConclusion extends React.Component<Props, State> {

    public static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.updateMode !== prevState.updateMode) {
            return {updateMode: nextProps.updateMode};
        } else {
            return null;
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            conclusions: this.initConclusions(),
            updateMode: this.props.updateMode,
            forceValue: "",
            selectedConclusion: ""
        };
    }

    public async componentDidMount() {
        this.refreshConclusions();
        const sessionId = SessionService.getSession();
        if (sessionId) {
            await this.props.fetchAndStoreSessionUserActivity(sessionId);
        }
        this.setState({
            forceValue: this.isCallTransferOk() ? 'UNRESOLVED' : this.props.updateMode ? "" : this.props.case.status
        });
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.updateMode !== this.props.updateMode) {
            this.setState({updateMode: this.props.updateMode});
            this.handleCaseStatus("")
            this.refreshConclusions();
        }
        if (this.props.updateMode) {
            if (this.props.results !== prevProps.results && prevProps.results !== undefined) { // leaf changed
                this.handleCaseStatus("");
                this.refreshConclusions();
            }
            if (prevProps.isCallTransferStatusOK !== this.props.isCallTransferStatusOK || prevProps.hasCallTransfer !== this.props.hasCallTransfer) {
                if (!this.isCallTransferOk()) {
                    this.handleCaseStatus("");
                } else {
                    this.handleCaseStatus("UNRESOLVED");
                }
            }
        }
    }

    public refreshConclusions = () => {
        if (this.props.updateMode) {
            this.setState({
                conclusions: this.retrieveConclusions(this.props.case.status),
                selectedConclusion: ""
            }, () => this.props.getConclusionChanges({
                conclusion: "",
            }));
        } else {
            this.setState({
                conclusions: [<option key={this.props.case.processingConclusion} disabled
                                      value={this.props.case.processingConclusion}>{this.props.case.processingConclusion}</option>],
                selectedConclusion: this.props.case.processingConclusion
            }, () => this.props.getConclusionChanges({
                conclusion: this.props.case.processingConclusion
            }));
        }
    };

    public handleConclusionChange = (event: React.FormEvent<HTMLInputElement>) => {
        const formChanges: FormChanges = {
            conclusion: event.currentTarget.value,
        };
        this.props.getConclusionChanges(formChanges);
        this.setState({
            selectedConclusion: event.currentTarget.value
        })
    };

    public filterConclusionByHabilitedActivites = () => {
        if (this.props.userActivity && this.props.results) {
            const conclusionsResult = this.props.results.filter(conclusion =>
                conclusion?.activities && conclusion.activities.indexOf(this.props.userActivity?.code!) > -1);
            return conclusionsResult;
        } else {
            // Bizarre, ne devrait pas arriver
            return this.props.results;
        }
    }

    public retrieveConclusions = (status: string): JSX.Element[] => {
        const results = this.filterConclusionByHabilitedActivites().sort(function (a, b) {
            return a.label.trim().toLowerCase().localeCompare(b.label.trim().toLowerCase());
        });
        let caseStatus = this.props.case.status;
        if (status === "RESOLVED" || status === "UNRESOLVED") {
            caseStatus = status;
            if (results !== undefined && results.length > 0) {
                const conclusions: Array<JSX.Element> = [];
                for (const conclusion of results) {
                    if ((caseStatus === "RESOLVED" && conclusion.realized) || (caseStatus === "UNRESOLVED" && !conclusion.realized)) {
                        conclusions.push(<option key={conclusion.label}>{conclusion.label}</option>)
                    }
                }
                return conclusions;
            } else {
                return [(<option><FormattedMessage id={"cases.get.details.conclusions.none"}/></option>)]
            }
        }
        return [(<option value=""/>)]
    };

    public initConclusions = () => {
        const conclusions: Array<JSX.Element> = [];
        conclusions.push(<option
            key={this.props.case.processingConclusion}>{this.props.case.processingConclusion}</option>);
        return conclusions;
    };

    public handleCaseStatus = (status: 'RESOLVED' | 'UNRESOLVED' | '') => {
        if (status === "RESOLVED" || status === "UNRESOLVED") {
            const formChanges: FormChanges = {
                caseStatus: status
            };
            this.props.getConclusionChanges(formChanges);
        }
        this.setState({
            conclusions: this.retrieveConclusions(status),
            selectedConclusion: "",
            forceValue: status
        });
    };

    public isCallTransferOk = () => {
        return this.props.hasCallTransfer && this.props.isCallTransferStatusOK;
    };

    public getConclusions = () => {
        if (this.isCallTransferOk()) {
            return <option selected>{translate.formatMessage({id: "cases.conclusion.callTransfer.OK"})}</option>;
        } else {
            return this.state.conclusions;
        }
    };

    public getConclusionValue = () => {
        if (!this.state.updateMode) {
            return this.props.case.processingConclusion;
        } else if (this.isCallTransferOk()) {
            return translate.formatMessage({id: "cases.conclusion.callTransfer.OK"});
        }
        return this.state.selectedConclusion;
    };

    public render(): JSX.Element {
        const {updateMode, case: {status: caseStatus}} = this.props;
        const {forceValue} = this.state;
        const disabled = !this.props.isQualificationSelected || !updateMode
            || !this.props.isCurrUserEliToUpdateImmediateCase || this.isCallTransferOk();
        return (
            <GenericCardToggle title={"cases.create.treatmentConclusion"} icon={"icon-contract"}>
                <Row>
                    <Col md={6}>
                        <CaseStatusComponent handleStatusChange={this.handleCaseStatus}
                                             active={this.props.currentCase && !updateMode ? this.props.currentCase.processing : undefined}
                                             value={forceValue}
                                             disabled={disabled}/>
                    </Col>
                    <Col md={6}>
                        {updateMode && this.props.isCurrUserEliToUpdateImmediateCase &&
                            <FormSelectInput
                                key={caseStatus}
                                value={this.getConclusionValue()}
                                validations={{isRequired: ValidationUtils.notEmpty}}
                                name="processingConclusion" id="processingConclusion"
                                disabled={disabled}
                                bsSize={"sm"}
                                onChange={this.handleConclusionChange}>
                                <option value="" disabled selected/>
                                {this.getConclusions()}
                            </FormSelectInput>
                        }
                        {(!updateMode || !this.props.isCurrUserEliToUpdateImmediateCase) &&
                            <p>{this.props.case.processingConclusion}</p>
                        }
                    </Col>
                </Row>
            </GenericCardToggle>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    hasCallTransfer: state.casePage.hasCallTransfer,
    isCallTransferStatusOK: state.casePage.isCallTransferStatusOK,
    currentCase: state.case.currentCase,
    isCurrUserEliToUpdateImmediateCase: state.casePage.isCurrUserEliToUpdateImmediateCase,
    userActivity: state.session.userActivity,
    isQualificationSelected: state.casePage.isQualificationSelected
});

const mapDispatchToProps = dispatch => ({
    fetchAndStoreSessionUserActivity: (value) => dispatch(fetchAndStoreSessionUserActivity(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewCaseConclusion)
