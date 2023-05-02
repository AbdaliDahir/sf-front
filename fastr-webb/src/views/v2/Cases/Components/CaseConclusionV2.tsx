import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Card, CardBody, CardHeader, Collapse, FormGroup} from "reactstrap";
import ValidationUtils from "../../../../utils/ValidationUtils";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {compose} from "redux";
import {CaseState} from "../../../../store/reducers/v2/case/CasesPageReducerV2";
import CaseStatusV2 from "./CaseStatusV2";
import {Status} from "../../../../model/Status";
import {ApplicationInitialState} from "../../../../model/ApplicationInitialState";
import ScaledCaseConclusionV2 from "./ScaledCaseConclusionV2";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {Case} from "../../../../model/Case";
import {CaseStatus} from "../../../../model/case/CaseStatus";
import { HistoRapideSetting } from "src/model/HistoRapideSetting";

interface Props {
    caseId: string
    currentCases: any
    icon: string
    isEditable: boolean,
    isExpandable: boolean,
    isExpanded: boolean,
    formsyRef
    isCurrentCaseScaled: boolean
    isTreatmentEnd: boolean
    applicationInitialState: ApplicationInitialState
    currentCase: Case,
    isCallTransferStatusOKV2: boolean
    hasCallTransfer: boolean
    validRoutingRule
    userActivity,
    caseStatus,
    currentQualificationLeaf,
    isCurrentlyRequalifying,
    isFromQa: boolean;
    histoCode?: string;
    histoRapides: HistoRapideSetting[];
    additionalData
}

interface State {
    options: JSX.Element[],
    isCardExpanded: boolean,
    lastCaseStatusBeforeClosure: string | undefined
}

class CaseConclusionV2 extends React.Component<Props & RouteComponentProps, State> {

    private caseStatus: Status | '' = '';
    private initialStatusValue: Status | '' = "";
    private refToProcessingConclusionInput: React.RefObject<any> = React.createRef()

    constructor(props) {
        super(props);
        this.state = {
            options: [],
            isCardExpanded: this.props.isExpanded,
            lastCaseStatusBeforeClosure: ""
        }
    }

    public componentDidMount() {
        if (this.currentCaseState().currentCase) { // there is an initial value
            this.initConclusionValues();
        }
    }

    public componentDidUpdate(prevProps) {
        if (prevProps.isCurrentlyRequalifying !== this.props.isCurrentlyRequalifying && !this.props.isCurrentlyRequalifying && this.isConclusionBlockDisabled()) {
            this.initConclusionValues();
        }
        if (prevProps.additionalData !== this.props.additionalData && this.currentCaseState().isQualificationSelected) {
            this.handleCaseStatus('');
            this.handleConclusionsIfClosedCase()
            
           
        }
    }

    public initConclusionValues = () => {
        const caseStatus = this.currentCaseState().currentCase!.status;
        const isCaseStatusDisplayabled = caseStatus === "RESOLVED" || caseStatus === "UNRESOLVED";
        const isCallTransfer = this.props.hasCallTransfer && this.props.isCallTransferStatusOKV2
        const caseStatusIfCallTranfer = isCaseStatusDisplayabled && !this.props.isEditable ? caseStatus : ""
        const notCallTransferCaseStatus = isCaseStatusDisplayabled ? caseStatus : ""
        this.initialStatusValue = isCallTransfer ? caseStatusIfCallTranfer : notCallTransferCaseStatus;
        this.handleCaseStatus(this.initialStatusValue);
        this.handleConclusionsIfClosedCase()
    }

    public filterConclusionByHabilitedActivites = () => {
        if (this.props.applicationInitialState?.user?.activity) {
            return this.currentCaseState().qualificationLeaf.conclusions.filter(conclusion =>
                conclusion?.activities && conclusion.activities.find(a => a === this.props.applicationInitialState?.user?.activity.code));
        } else {
            return this.currentCaseState().qualificationLeaf.conclusions;
        }
    }

    public retrieveConclusions = () => {
        if (this.props.hasCallTransfer && this.props.isCallTransferStatusOKV2) {
            return;
        }
        const resultConclusions: JSX.Element[] = [<option value="" disabled selected/>];

        if (this.props.isEditable) {
            if (this.currentCaseState().qualificationLeaf &&
                this.currentCaseState().qualificationLeaf.conclusions !== undefined &&
                this.currentCaseState().qualificationLeaf.conclusions.length > 0) {

                const conclusionsResult = this.filterConclusionByHabilitedActivites().sort(function (a, b) {
                    return a.label.trim().toLowerCase().localeCompare(b.label.trim().toLowerCase());
                });
                for (const conclusion of conclusionsResult) {
                    if ((this.caseStatus === "RESOLVED" && conclusion.realized) || (this.caseStatus === "UNRESOLVED" && !conclusion.realized)) {
                        resultConclusions.push(<option key={conclusion.label}>{conclusion.label}</option>)
                    }
                }

            } else {
                resultConclusions.push(<option key={"none"}>
                    {translate.formatMessage({id: "cases.get.details.conclusions.none"})}
                </option>)
            }

        } else {
            resultConclusions.push(<option key={"none"}>
                {this.currentCaseState().currentCase?.processingConclusion}
            </option>)
        }

        this.setState({
            options: resultConclusions
        })
    };

    public getConclusions = () => {
        if (this.props.hasCallTransfer && this.props.isCallTransferStatusOKV2) {
            if (!this.state.options.find((element) => element.props.value === "Transfert OK")) {
                return [...this.state.options, <option key={"callTransferOK"} value={"Transfert OK"}
                >{translate.formatMessage({id: "cases.conclusion.callTransfer.OK"})}</option>]
            }
        }

        if (this.caseStatus === "") {
            if (!this.state.options.find((element) => element.props.value === "")) {
                return [...this.state.options, <option value="" disabled selected/>]
            }
        }
        return this.state.options;

    };

    public handleCaseStatus = (status: Status | '') => {
        this.props.formsyRef().current?.setValue("status", status);
        this.caseStatus = status;
        if (this.props.isCurrentlyRequalifying) {
            this.initialStatusValue = status
        }

        // If call not transfer then reset input
        if(!this.isConclusionBlockDisabled()){
            this.refToProcessingConclusionInput.current?.setValue('');
        }
        this.retrieveConclusions();
    };

    private toggleCard = () => {
        if (this.props.isExpandable) {
            this.setState({
                isCardExpanded: !this.state.isCardExpanded
            })
        }
    }
    private getSelectedHistoRapid = () => {
        const histRapid = this.props.histoRapides.filter(a => a.code === this.props.histoCode);
        if (this.props.isFromQa && histRapid.length > 0) {
            this.caseStatus = histRapid[0].status;
            return histRapid[0];
        } else {
            return null;
        }
    }
    private handleInitialValues = () => {
        let initialStatusValue;
        let initialConclusionValue;

        if (!this.props.isCurrentCaseScaled) { // immediate case
            const callTransferCondition = this.props.hasCallTransfer && this.props.isCallTransferStatusOKV2;
            if (this.props.isEditable && !this.props.isFromQa) { // editable true
                if (callTransferCondition) { // cas du call transfert
                    initialStatusValue = "UNRESOLVED"
                    initialConclusionValue = "Transfert OK"
                }
            } else { // editable false
                const selectedHistoRapid = this.getSelectedHistoRapid();
                if(callTransferCondition){
                    initialStatusValue = "UNRESOLVED"
                    initialConclusionValue = "Transfert OK"
                } else {
                    initialStatusValue = selectedHistoRapid != null ? selectedHistoRapid.status : this.initialStatusValue;
                    initialConclusionValue = selectedHistoRapid != null ? selectedHistoRapid.processingConclusion : this.currentCaseState().currentCase?.processingConclusion;
                }
            }
        }

        return {initialStatusValue, initialConclusionValue}
    }

    private handleConclusionsIfClosedCase = () => {
        const lastClosingCaseEvent = this.currentCaseState().currentCase?.events && this.currentCaseState().currentCase?.events.filter(closingEvent => closingEvent.type === "CLOSE" )[0];
        this.setState({lastCaseStatusBeforeClosure: lastClosingCaseEvent && lastClosingCaseEvent.valueChangeEvents ? lastClosingCaseEvent.valueChangeEvents[0].previousValue : ""})

    }

    private isConclusionBlockDisabled = () => !this.currentCaseState().isQualificationSelected || !this.props.isEditable || (this.props.hasCallTransfer && this.props.isCallTransferStatusOKV2);

    public render() {
        const isOwnerActivityMatching = this.props.validRoutingRule?.receiverActivity.code === this.props.userActivity?.code;
        const processingConclusionDisabled = this.isConclusionBlockDisabled()
        const {initialStatusValue, initialConclusionValue} = this.handleInitialValues()
        const currentCaseIsClosed = this.currentCaseState().currentCase!.status === CaseStatus.CLOSED;
        const { lastCaseStatusBeforeClosure } = this.state

        if (this.props.isCurrentCaseScaled) {// case scaled, Treatment End or nothing
            if (this.props.currentCase.status === CaseStatus.CREATED && !isOwnerActivityMatching) { // case scaled + created, nothing (!_! except when autoassign)
                return <React.Fragment/>
            } else {
                if (this.props.isTreatmentEnd) { // case scaled + not created + progressStatus==treatmentEnd, Treatment End section
                    return (
                        <Card className="my-2">
                            <CardHeader className={"justify-between-and-center"} onClick={this.toggleCard}>
                                <section>
                                    <i className={`icon-gradient ${this.props.icon} mr-2`}/>
                                    <FormattedMessage id={"cases.create.treatmentConclusion"}/>
                                </section>
                                {this.props.isExpandable &&
                                    <i className={`icon icon-black float-right  ${this.state.isCardExpanded ? 'icon-up' : 'icon-down'}`}/>
                                }
                            </CardHeader>
                            <Collapse isOpen={this.state.isCardExpanded}>
                                <CardBody className={"p-1"}>
                                    <FormGroup>
                                        <CaseStatusV2 handleStatusChange={this.handleCaseStatus}
                                            initialValue={this.initialStatusValue}
                                                      disabled={!this.currentCaseState().isQualificationSelected || !this.props.isEditable || currentCaseIsClosed}/>
                                    </FormGroup>
                                    <section>
                                        <ScaledCaseConclusionV2
                                            disabled={currentCaseIsClosed}
                                            selectedStatus={this.caseStatus}
                                            caseId={this.props.caseId}
                                        />
                                    </section>
                                </CardBody>
                            </Collapse>
                        </Card>
                    )
                } else { // case scaled + not created + progressStatus!==treatmentEnd, nothing
                    return <React.Fragment/>
                }
            }
        } else {

            return (
                <Card className="my-2">
                    <CardHeader onClick={this.toggleCard}>
                        <section>
                            <i className={`icon-gradient ${this.props.icon} mr-2`}/>
                            <FormattedMessage id={"cases.get.details.conclusion"}/>
                        </section>
                        {this.props.isExpandable &&
                            <i className={`icon icon-black float-right  ${this.state.isCardExpanded ? 'icon-up' : 'icon-down'}`}/>
                        }
                    </CardHeader>
                    <Collapse isOpen={this.state.isCardExpanded}>
                        <CardBody className={"p-1"}>
                            <CaseStatusV2 handleStatusChange={this.handleCaseStatus}
                                initialValue={currentCaseIsClosed ? lastCaseStatusBeforeClosure : initialStatusValue}
                                disabled={!this.currentCaseState().isQualificationSelected || !this.props.isEditable || (this.props.hasCallTransfer && this.props.isCallTransferStatusOKV2) || currentCaseIsClosed}
                                position={"left"}
                                          className={"mb-2"}/>
                            <FormSelectInput
                                forceDirty={true}
                                disabled={processingConclusionDisabled || currentCaseIsClosed}
                                ref={this.refToProcessingConclusionInput}
                                validations={{isRequired: ValidationUtils.notEmpty}}
                                name="processingConclusion" id="processingConclusion"
                                label={translate.formatMessage({id: "input.validations.processingConclusion"})}
                                forcedValue={initialConclusionValue}
                                classNameToProps={"mb-1"}
                                className={"custom-select-sm"}>
                                {this.getConclusions()}
                            </FormSelectInput>
                        </CardBody>
                    </Collapse>
                </Card>
            )
        }
    }

    private currentCaseState = (): CaseState => {
        return this.props.currentCases[this.props.caseId]
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    currentCases: state.store.cases.casesList,
    currentCase: state.store.cases.casesList[ownProps.caseId]?.currentCase,
    isCurrentCaseScaled: state.store.cases.casesList[ownProps.caseId]?.isCurrentCaseScaled,
    currentQualificationLeaf: state.store.cases.casesList[ownProps.caseId]?.qualificationLeaf,
    isCurrentlyRequalifying: state.store.cases.casesList[ownProps.caseId]?.isCurrentlyRequalifying,
    isTreatmentEnd: state.store.cases.casesList[ownProps.caseId]?.isTreatmentEnd,
    applicationInitialState: state.store.applicationInitialState,
    hasCallTransfer: state.store.cases.casesList[ownProps.caseId].hasCallTransfer,
    isCallTransferStatusOKV2: state.store.cases.casesList[ownProps.caseId].isCallTransferStatusOKV2,
    validRoutingRule: state.store.cases.casesList[ownProps.caseId].validRoutingRule,
    userActivity: state.store.applicationInitialState.user?.activity,
    isFromQa: state.store.cases.adgQuickAccessPayload?.fromQA,
    histoCode: state.store.cases.adgQuickAccessPayload?.histoCode,
    histoRapides: state.store.applicationInitialState.histoRapideSettings,
    additionalData: state.store.cases.casesList[ownProps.caseId]?.additionalData

});

export default compose(withRouter, connect(mapStateToProps))(CaseConclusionV2)
