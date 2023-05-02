import * as React from "react";
import {ChangeEvent} from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {CaseQualification} from "../../../../model/CaseQualification";
import {AppState} from "../../../../store";
import QualificationStepV2 from "./QualificationStepV2";
import {Card, CardBody, CardHeader, Collapse, UncontrolledTooltip} from "reactstrap";
import QualificationSearch from "./QualificationSearchV2";
import FormTextInput from "../../../../components/Form/FormTextInput";
import * as _ from "lodash"
import "./QualificationSelection.scss"
import {CaseDataProperty} from "../../../../model/CaseDataProperty";
import {CaseState} from "../../../../store/reducers/v2/case/CasesPageReducerV2";
import {
    setAdditionalDataV2,
    setCanCurrentCaseBeScaledV2,
    setCaseMotifV2,
    setIsCurrentlyRequalifyingV2,
    setQualificationIsNotSelectedV2,
    setQualificationLeafV2,
    setQualificationSelectedV2,
    updateSectionsV2
} from "../../../../store/actions/v2/case/CaseActions";
import QualificationAdditionalDataV2 from "../CaseData/QualificationAdditionalDataV2";
import {CaseCategory} from "../../../../model/CaseCategory";
import {CaseStatus} from "../../../../model/case/CaseStatus";


interface Props {
    formsyRef,
    getDiffFromPristine,
    isEditable: boolean,
    isExpandable: boolean,
    isExpanded: boolean,
    caseId: string
    currentCases: any
    motif?: CaseQualification
    qualification
    context: string
    idAct?: string
    getValuesFromFields?
    setQualificationIsNotSelected: (caseId) => void
    setQualificationIsSelected: (caseId) => void
    setCaseMotif: (caseId, motif) => void
    setQualificationLeaf: (caseId, qualificationLeaf) => void
    // setCaseQualification: (qcaseId,ualif) => void
    qualificationLeaf
    setAdditionalData: (caseId, additionalData) => void
    additionalData: Array<CaseDataProperty>
    setHandleCancelModalMatchingCase
    setIsCurrentUserObligedToReQualifyImmediateCase
    isCurrentCaseScaled: boolean,
    mustCCReQualifyCurrentCase: boolean
    canCCReQualifyCurrentCase: boolean,
    qualificationSection
    isCurrentlyRequalifying: boolean
    setIsCurrentlyRequalifyingV2: (caseId, value) => void
    updateSectionsV2: (caseId, value) => void
    setCanCurrentCaseBeScaledV2: (caseId, value) => void
    currentCaseIsClosed
}

interface State {
    isQualifExpanded: boolean,
    qualifHeaderValue: JSX.Element[],
    themeHeaderValue: JSX.Element[],
    qualificationSearchValue?: string,
    delayedQualificationSearchValue?: string,
    qualificationHierarchyFromSearch: Map<number, string> | undefined,
    previousQualif,
    previousLeaf,
    previousAdditionalData,
    previousSections,
    previousScalingEligibility
}

class QualificationSelectionV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isQualifExpanded: this.props.isExpanded || this.props.mustCCReQualifyCurrentCase,
            qualifHeaderValue: [],
            themeHeaderValue: [],
            qualificationSearchValue: "",
            delayedQualificationSearchValue: "",
            qualificationHierarchyFromSearch: undefined,
            previousQualif: this.currentCaseState()?.motif,
            previousLeaf: this.currentCaseState()?.qualificationLeaf,
            previousAdditionalData: this.currentCaseState()?.additionalData,
            previousSections: this.currentCaseState()?.sections ? [...this.currentCaseState()?.sections] : [],
            previousScalingEligibility: this.currentCaseState()?.scalingEligibility
        }
        this.updateDelayedSearchValue = _.debounce(this.updateDelayedSearchValue, 1000);
    }

    public componentDidMount() {
        if (this.props.mustCCReQualifyCurrentCase) {
            this.triggerRequalification();
        }
    }

    private currentCaseState = (): CaseState => {
        return this.props.currentCases[this.props.caseId]
    }

    private toggleQualif = () => {
        this.setState({
            isQualifExpanded: !this.state.isQualifExpanded
        })
    }

    private setQualifHeaderValue = (elements: JSX.Element[]) => {
        this.setState({
            qualifHeaderValue: elements
        })
    }

    private handelSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            qualificationSearchValue: event.target.value
        });
        this.updateDelayedSearchValue();
    }

    private updateDelayedSearchValue = () => {
        this.setState({
            delayedQualificationSearchValue: this.state.qualificationSearchValue
        });

    }

    private canExpandQualification = () => {
        const {currentCases, caseId} = this.props;
        const currentCaseCategory = currentCases[caseId]?.category;
        const isScaled = currentCaseCategory === CaseCategory.SCALED || this.props.isCurrentCaseScaled;
        return !isScaled && (this.props.isEditable && this.props.isExpandable || this.props.isCurrentlyRequalifying) && !this.props.currentCaseIsClosed;
    }

    private shouldDisplayRequalificationButton = (): boolean => {

        return this.props.canCCReQualifyCurrentCase
            && this.currentCaseState().currentCase?.status !== CaseStatus.CREATED
            && !this.props.mustCCReQualifyCurrentCase
            && !this.props.isCurrentCaseScaled
            && !this.props.currentCaseIsClosed;
    }

    public onSelectQualification = (qualification) => {
        let selectedHierarchyFromSearch = new Map<number, string>();
        qualification.ancestors.forEach((ancestor, index) => {
            selectedHierarchyFromSearch.set(index + 1, ancestor);
        });
        selectedHierarchyFromSearch.set(qualification.level, qualification.id);
        if (qualification.leaf) {
            this.setState({
                qualificationHierarchyFromSearch: selectedHierarchyFromSearch,
                qualificationSearchValue: "",
                delayedQualificationSearchValue: ""
            });
        } else {
            this.setState({
                qualificationHierarchyFromSearch: selectedHierarchyFromSearch
            });
        }
    }

    private toggleRequalif = (event?) => {
        event?.stopPropagation();
        if (!this.props.isCurrentlyRequalifying) {
            this.triggerRequalification();
        } else {
            this.cancelRequalif();
        }
    }

    private triggerRequalification = () => {
        if (!this.props.isCurrentlyRequalifying) {
            this.setState({
                previousQualif: this.currentCaseState()?.motif,
                previousLeaf: this.currentCaseState()?.qualificationLeaf,
                previousAdditionalData: this.currentCaseState()?.additionalData,
                previousSections: [...this.currentCaseState()?.sections],
                previousScalingEligibility: this.currentCaseState()?.scalingEligibility
            })
        }
        this.setState({
            isQualifExpanded: true,
        });
        this.props.setIsCurrentlyRequalifyingV2(this.props.caseId, true);
        // reset Additional Data
        this.props.setAdditionalData(this.props.caseId, []);
        this.props.setCaseMotif(this.props.caseId, null);
        this.props.setQualificationLeaf(this.props.caseId, null)
        this.props.setQualificationIsNotSelected(this.props.caseId);
        if (this.props.qualificationSection) {
            this.props.qualificationSection.editable = true;
        }
    }

    private cancelRequalif = () => {
        this.props.setCaseMotif(this.props.caseId, this.state.previousQualif);
        this.props.setQualificationLeaf(this.props.caseId, this.state.previousLeaf);
        this.props.setAdditionalData(this.props.caseId, this.state.previousAdditionalData);
        this.props.setQualificationIsSelected(this.props.caseId);
        this.props.setCanCurrentCaseBeScaledV2(this.props.caseId, this.state.previousScalingEligibility);
        this.setState({
            isQualifExpanded: false,
            previousQualif: null,
            previousLeaf: null,
            previousAdditionalData: null,
            previousSections: null,
            previousScalingEligibility: null
        })
        this.props.setIsCurrentlyRequalifyingV2(this.props.caseId, false);
        if (this.props.qualificationSection) {
            this.props.qualificationSection.editable = false
        }
        this.props.updateSectionsV2(this.props.caseId, this.state.previousSections);
    }

    private resetSearchField = () => {
        this.setState({
            qualificationSearchValue: ""
        });
        this.updateDelayedSearchValue();
    }

    public render() {
        const {currentCases, caseId} = this.props;
        const qualifAdditionalDataSection = currentCases[caseId]?.sections?.find((section) => section.code === "ADDITIONAL_DATA");
        const readOnly = !qualifAdditionalDataSection?.editable;
        const isQualificationSelected = currentCases[caseId]?.isQualificationSelected
        return <section className={"qualificationSelectionV2__wrapper"}>
            <Card className="my-2">
                <CardHeader className="qualification-scaling-selectionV2__card-header"
                            onClick={this.canExpandQualification() && !this.shouldDisplayRequalificationButton() ? this.toggleQualif : undefined}>
                    <section className="qualificationSelectionV2__breadcrumb-header-section">
                        <i className={`icon-gradient icon-rom mr-2`}/>
                        <FormattedMessage id={"cases.get.details.qualification"}/>
                        {(!this.canExpandQualification() || (this.state.qualifHeaderValue.length > 0 && !this.state.isQualifExpanded))
                            && this.state.qualifHeaderValue}
                    </section>

                    {
                        this.shouldDisplayRequalificationButton() &&
                        <div className='qualificationSelectionV2__requalification_button'>
                            <section className="btn btn-primary btn-sm btn-dark" onClick={this.toggleRequalif}>
                                <FormattedMessage id={this.props.isCurrentlyRequalifying ?
                                    "cases.get.details.update.cancel.requalify" :
                                    "cases.get.details.update.trigger.requalify"}/>
                            </section>
                        </div>
                    }
                    { // exclusive with requalif button
                        this.props.mustCCReQualifyCurrentCase && !isQualificationSelected &&
                        <div className='qualificationSelectionV2__must-requalif-warning'>
                            <span id="mustRequalifyMessage">
                                <FormattedMessage id='cases.get.details.update.mustRequalify'/>
                                <UncontrolledTooltip placement="top" target="mustRequalifyMessage">
                                    <FormattedMessage id="cases.get.details.update.mustRequalifyTooltip"/>
                                </UncontrolledTooltip>
                            </span>
                        </div>
                    }

                    {(this.canExpandQualification() && !this.shouldDisplayRequalificationButton()) &&
                        <section className="float-right">
                            <i className={`icon icon-black ${this.state.isQualifExpanded ? 'icon-up' : 'icon-down'}`}/>
                        </section>
                    }
                </CardHeader>
                <Collapse isOpen={this.state.isQualifExpanded && this.canExpandQualification()}>
                    <CardBody>
                        {this.state.isQualifExpanded && this.canExpandQualification() &&
                            <section className="qualification-scaling-selectionV2__search-field-section">
                                <FormTextInput
                                    onClick={(event) => {
                                        event.stopPropagation()
                                    }}
                                    id={"qualificationSearchValue"}
                                    name={"qualificationSearchValue"}
                                    onChange={this.handelSearchValueChange}
                                    validations={{minLength: 2}}
                                    value={this.state.qualificationSearchValue ? this.state.qualificationSearchValue : ""}
                                    style={{width: "250px"}}
                                />
                                <span onClick={this.resetSearchField}
                                      className="qualification-scaling-selectionV2__reset-search-field icon icon-close"/>
                            </section>
                        }
                        {this.state.delayedQualificationSearchValue!.length >= 2 &&
                            <QualificationSearch onSelectQualification={this.onSelectQualification}
                                                 searchValue={this.state.delayedQualificationSearchValue}
                                                 category="MOTIF"
                                                 name="qualification"
                                                 idAct={this.props.idAct}
                                                 getValuesFromFields={this.props.getValuesFromFields}/>
                        }

                        <QualificationStepV2 name="qualification"
                                             caseId={this.props.caseId}
                                             value={undefined}
                                             formsyRef={this.props.formsyRef}
                                             getDiffFromPristine={this.props.getDiffFromPristine}
                                             idAct={this.props.idAct}
                                             displayOutput={this.setQualifHeaderValue}
                                             toggleCard={this.toggleQualif}
                                             isQualifExpanded={this.state.isQualifExpanded}
                                             getValuesFromFields={this.props.getValuesFromFields}
                                             setHandleCancelModalMatchingCase={this.props.setHandleCancelModalMatchingCase}
                                             qualificationHierarchyFromSearch={this.state.qualificationHierarchyFromSearch}/>
                    </CardBody>
                </Collapse>
                {isQualificationSelected && qualifAdditionalDataSection &&
                    <QualificationAdditionalDataV2 caseId={this.props.caseId} readOnly={readOnly}/>
                }
            </Card>
        </section>
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    currentCases: state.store.cases.casesList,
    isCurrentCaseScaled: state.store.cases.casesList[ownProps.caseId]?.isCurrentCaseScaled,
    canCCReQualifyCurrentCase: state.store.cases.casesList[ownProps.caseId]?.caseBooleans?.canCCReQualifyCurrentCase,
    mustCCReQualifyCurrentCase: state.store.cases.casesList[ownProps.caseId]?.caseBooleans?.mustCCReQualifyCurrentCase,
    qualificationSection: state.store.cases.casesList[ownProps.caseId]?.sections?.find((section) => section.code === "QUALIFICATION"),
    isCurrentlyRequalifying: state.store.cases.casesList[ownProps.caseId]?.isCurrentlyRequalifying,
    currentCaseIsClosed: state.store.cases.casesList[ownProps.caseId]?.currentCase?.status === CaseStatus.CLOSED
});

const mapDispatchToProps = dispatch => ({
    setQualificationIsSelected: (caseId) => dispatch(setQualificationSelectedV2(caseId)),
    setQualificationIsNotSelected: (caseId) => dispatch(setQualificationIsNotSelectedV2(caseId)),
    setCaseMotif: (caseId, motif) => dispatch(setCaseMotifV2(caseId, motif)),
    setQualificationLeaf: (caseId, qualificationLeaf) => dispatch(setQualificationLeafV2(caseId, qualificationLeaf)),
    setAdditionalData: (caseId, additionalData) => dispatch(setAdditionalDataV2(caseId, additionalData)),
    setIsCurrentlyRequalifyingV2: (caseId, value) => dispatch(setIsCurrentlyRequalifyingV2(caseId, value)),
    updateSectionsV2: (caseId, value) => dispatch(updateSectionsV2(caseId, value)),
    setCanCurrentCaseBeScaledV2: (caseId, value) => dispatch(setCanCurrentCaseBeScaledV2(caseId, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(QualificationSelectionV2)
