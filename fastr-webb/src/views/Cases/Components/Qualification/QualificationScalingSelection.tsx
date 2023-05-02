import * as React from "react";
import {ChangeEvent} from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import Breadcrumb from "reactstrap/lib/Breadcrumb";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import {CaseQualification} from "../../../../model/CaseQualification";
import {AppState} from "../../../../store";
import QualificationStep from "./QualificationStep";
import QualificationSet from "./QualificationSet";
import {Card, CardBody, CardHeader, Collapse, UncontrolledTooltip} from "reactstrap";
import QualificationSearch from "./QualificationSearch";
import FormTextInput from "../../../../components/Form/FormTextInput";
import * as _ from "lodash"
import RoutingInformation from "./RoutingInformation";
import "./QualificationScalingSelection.scss"
import {setQualificationIsNotSelected, setQualificationIsSelected} from "../../../../store/actions";
import {
    setAdditionalData,
    setCaseMotif,
    setCaseQualification, setIsCurrentUserObligedToReQualifyImmediateCase,
    setQualificationLeaf,
} from "../../../../store/actions/CasePageAction";
import {CaseDataProperty} from "../../../../model/CaseDataProperty";
import {Case} from "../../../../model/Case";

interface Props {
    motif?: CaseQualification
    qualification
    isScalingMode: boolean
    context: string
    idAct?: string
    scaled: boolean
    revertScalingCaseMode: boolean
    getValuesFromFields?
    themeQualification?: CaseQualification
    qualifWasGivenInThePayload
    idActDisRC: string
    validRoutingRule
    setQualificationIsNotSelected: () => void
    setQualificationIsSelected: (qualificationCode, serviceType) => void
    setCaseMotif: (motif) => void
    updateMode: boolean,
    setQualificationLeaf: (qualificationLeaf) => void
    setCaseQualification: (qualif) => void
    storeCase: (casee) => void
    qualificationLeaf
    isCurrUserEliToReQualifyImmediateCase: boolean
    isCurrUserObligedToReQualifyImmediateCase: boolean
    shouldStartWithRequalif?: boolean
    setAdditionalData: (additionalData) => void
    additionalData: Array<CaseDataProperty>
    retrievedCase: Case,
    setIsCurrentUserObligedToReQualifyImmediateCase
}

interface State {
    isQualifExpanded: boolean,
    isQualifSetExpanded: boolean,
    isThemeQualifExpanded: boolean,
    qualifHeaderValue: JSX.Element[],
    themeHeaderValue: JSX.Element[],
    qualificationSearchValue?: string,
    delayedQualificationSearchValue?: string,
    qualificationHierarchyFromSearch: Map<number, string> | undefined,
    isCurrentlyRequalifying: boolean,
    previousQualif,
    previousLeaf,
    previousAdditionalData
}

class QualificationScalingSelection extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isQualifExpanded: this.props.context === "CreateCasePage",
            isQualifSetExpanded: true,
            isThemeQualifExpanded: true,
            qualifHeaderValue: [],
            themeHeaderValue: [],
            qualificationSearchValue: "",
            delayedQualificationSearchValue: "",
            qualificationHierarchyFromSearch: undefined,
            isCurrentlyRequalifying: false,
            previousQualif: this.props.motif,
            previousLeaf: this.props.qualificationLeaf,
            previousAdditionalData: this.props.additionalData
        }
        this.updateDelayedSearchValue = _.debounce(this.updateDelayedSearchValue, 1000);
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevProps.updateMode !== this.props.updateMode && this.props.shouldStartWithRequalif ||
            !prevProps.shouldStartWithRequalif && this.props.shouldStartWithRequalif && this.props.updateMode) {
            this.triggerRequalification();
            this.props.setIsCurrentUserObligedToReQualifyImmediateCase(false);
        }
    }

    private toggleQualif = () => {
        this.setState({
            isQualifExpanded: !this.state.isQualifExpanded
        })
    }

    private toggleQualifSet = () => {
        this.setState({
            isQualifSetExpanded: !this.state.isQualifSetExpanded
        })
    }

    private toggleThemeQualif = () => {
        this.setState({
            isThemeQualifExpanded: !this.state.isThemeQualifExpanded
        })
    }

    private setQualifHeaderValue = (elements: JSX.Element[]) => {
        this.setState({
            qualifHeaderValue: elements
        })
    }

    private setThemeHeaderValue = (elements: JSX.Element[]) => {
        this.setState({
            themeHeaderValue: elements
        })
    }

    private handelSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState(
            {
                qualificationSearchValue: event.target.value
            }
        );
        this.updateDelayedSearchValue();
    }

    private updateDelayedSearchValue = () => {
        this.setState(
            {
                delayedQualificationSearchValue: this.state.qualificationSearchValue
            }
        );

    }

    private canExpandQualification = () => {
        return (!this.props.qualifWasGivenInThePayload && !this.props.idActDisRC
            && !this.props.isScalingMode && (!this.props.scaled || !this.props.revertScalingCaseMode))
            || this.state.isCurrentlyRequalifying;
    }

    private shouldDisplayRequalificationButton = (): boolean => {
        return this.props.updateMode && this.props.isCurrUserEliToReQualifyImmediateCase &&
            !this.props.isCurrUserObligedToReQualifyImmediateCase &&
            (!this.props.scaled || this.props.revertScalingCaseMode);
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
        if (!this.state.isCurrentlyRequalifying) {
            this.triggerRequalification();
        } else {
            this.cancelRequalif();
        }
    }

    private cancelRequalif = () => {
        this.props.setCaseMotif(this.state.previousQualif);
        this.props.setQualificationLeaf(this.state.previousLeaf);
        this.props.setCaseQualification(this.state.previousQualif);
        this.props.setAdditionalData(this.state.previousAdditionalData);
        this.props.setQualificationIsSelected(this.state.previousLeaf.code, this.props.retrievedCase.serviceType);
        this.setState({
            isCurrentlyRequalifying: false,
            isQualifExpanded: false,
            previousQualif: null,
            previousLeaf: null,
            previousAdditionalData: null
        })
    }

    private triggerRequalification = () => {
        if(!this.state.isCurrentlyRequalifying){
            this.setState({
                previousQualif: this.props.motif,
                previousLeaf: this.props.qualificationLeaf,
                previousAdditionalData: this.props.additionalData
            })
        }
        this.setState({
            isCurrentlyRequalifying: true,
            isQualifExpanded: true,
        });
        // reset Additional Data
        this.props.setAdditionalData([]);
        this.props.setCaseMotif(null);
        this.props.setQualificationLeaf(null)
        this.props.setCaseQualification(null)
        this.props.setQualificationIsNotSelected();
    }

    private resetSearchField = () => {
        this.setState({
            qualificationSearchValue: ""
        });
        this.updateDelayedSearchValue();
    }


    private displayThemeQualification(): JSX.Element {
        const {themeQualification} = this.props;
        if (themeQualification) {
            return (
                <Card className="my-2">
                    <CardHeader className="qualification-scaling-selection__card-header"
                                onClick={this.toggleThemeQualif}>
                        <section>
                            <i className={`icon-gradient icon-rom mr-2`}/>
                            <FormattedMessage id={"cases.get.details.theme"}/>
                            <Breadcrumb>
                                {themeQualification.tags.map((event, index) => (
                                    <BreadcrumbItem key={index}>
                                        {event}
                                    </BreadcrumbItem>
                                ))}
                            </Breadcrumb>
                        </section>
                    </CardHeader>
                </Card>
            );
        } else {
            return <React.Fragment/>;
        }
    }

    public render() {
        const shouldDisplayArrow = this.canExpandQualification() && (this.props.context === "CreateCasePage" || this.props.updateMode);
        return <section className={"qualificationScalingSelection__wrapper"}>
            <Card className="my-2">
                <CardHeader className="qualification-scaling-selection__card-header"
                            onClick={shouldDisplayArrow ? this.toggleQualif : undefined}>
                    <section className="qualificationScalingSelection__breadcrumb-header-section">
                        <i className={`icon-gradient icon-rom mr-2`}/>
                        <FormattedMessage id={"cases.get.details.motif"}/>
                        {(!this.canExpandQualification() || (this.state.qualifHeaderValue.length > 0 && !this.state.isQualifExpanded))
                        && this.state.qualifHeaderValue}
                    </section>

                    {
                        this.shouldDisplayRequalificationButton() &&
                        <div className='qualificationScalingSelection__requalification_button'>
                            <section className="btn btn-primary" onClick={this.toggleRequalif}>
                                <FormattedMessage id={this.state.isCurrentlyRequalifying ?
                                    "cases.get.details.update.cancel.requalify" :
                                    "cases.get.details.update.trigger.requalify"}/>
                            </section>
                        </div>
                    }
                    { // exclusive with requalif button
                        this.props.isCurrUserObligedToReQualifyImmediateCase &&
                        this.props.updateMode && !this.props.qualificationLeaf &&
                        <div className='qualificationScalingSelection__must-requalif-warning'>
                            <span id="mustRequalifyMessage">
                                <FormattedMessage id='cases.get.details.update.mustRequalify'/>
                                <UncontrolledTooltip placement="top" target="mustRequalifyMessage">
                                    <FormattedMessage id="cases.get.details.update.mustRequalifyTooltip"/>
                                </UncontrolledTooltip>
                            </span>
                        </div>
                    }

                    {shouldDisplayArrow &&
                    <section className="float-right">
                        <i className={`icon icon-black ${this.state.isQualifExpanded ? 'icon-up' : 'icon-down'}`}/>
                    </section>
                    }

                </CardHeader>
                <Collapse isOpen={this.state.isQualifExpanded && this.canExpandQualification()}>
                    <CardBody>
                        {this.state.isQualifExpanded && this.canExpandQualification() &&
                        <section className="qualification-scaling-selection__search-field-section">
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
                                  className="qualification-scaling-selection__reset-search-field icon icon-close"/>
                        </section>
                        }
                        {this.state.delayedQualificationSearchValue!.length >= 2 &&
                        <QualificationSearch onSelectQualification={this.onSelectQualification}
                                             searchValue={this.state.delayedQualificationSearchValue}
                                             category={this.props.isScalingMode ? "THEME" : "MOTIF"}
                                             name="qualification" context={this.props.context} idAct={this.props.idAct}
                                             getValuesFromFields={this.props.getValuesFromFields}/>
                        }

                        <QualificationStep name="qualification"
                                           context={this.props.context}
                                           idAct={this.props.idAct}
                                           displayOutput={this.setQualifHeaderValue}
                                           toggleCard={this.toggleQualif}
                                           isQualifExpanded={this.state.isQualifExpanded}
                                           getValuesFromFields={this.props.getValuesFromFields}
                                           qualificationHierarchyFromSearch={this.state.qualificationHierarchyFromSearch}/>

                    </CardBody>
                </Collapse>
            </Card>


            {this.props.isScalingMode && (!this.props.scaled || this.props.revertScalingCaseMode) &&
            <Card className="my-2">
                <CardHeader className="qualification-scaling-selection__card-header" onClick={this.toggleQualifSet}>
                    <section>
                        <i className={`icon-gradient icon-rom mr-2`}/>
                        <FormattedMessage id={"cases.get.details.theme"}/>
                        {this.state.themeHeaderValue.length > 0 && !this.state.isQualifSetExpanded && this.state.themeHeaderValue}
                    </section>
                    <i className={`icon icon-black float-right  ${this.state.isQualifSetExpanded ? 'icon-up' : 'icon-down'}`}/>
                </CardHeader>
                <Collapse isOpen={this.state.isQualifSetExpanded}>
                    <CardBody>
                        <QualificationSet name="themeQualification" displayOutput={this.setThemeHeaderValue}
                                          toggleCard={this.toggleQualifSet}/>
                    </CardBody>
                </Collapse>
                <RoutingInformation routingRule={this.props.validRoutingRule}/>
            </Card>

            }

            {this.props.scaled && !this.props.revertScalingCaseMode &&
            this.displayThemeQualification()
            }
        </section>
    }
}


const mapStateToProps = (state: AppState) => ({
    qualification: state.casePage.qualification,
    isScalingMode: state.casePage.isScalingMode,
    scaled: state.case.currentCase !== undefined ? state.case.currentCase.category === "SCALED" : false,
    themeQualification: state.case.currentCase !== undefined ? state.case.currentCase.themeQualification : undefined,
    revertScalingCaseMode: state.casePage.revertScalingCaseMode,
    qualifWasGivenInThePayload: state.casePage.qualifWasGivenInThePayload,
    idActDisRC: state.casePage.idActDisRC,
    validRoutingRule: state.casePage.validRoutingRule,
    motif: state.casePage.motif,
    updateMode: state.casePage.updateMode,
    qualificationLeaf: state.casePage.qualificationLeaf,
    isCurrUserEliToReQualifyImmediateCase: state.casePage.isCurrUserEliToReQualifyImmediateCase,
    isCurrUserObligedToReQualifyImmediateCase: state.casePage.isCurrUserObligedToReQualifyImmediateCase,
    additionalData: state.casePage.additionDataOfQualifsAndTheme,
    retrievedCase: state.case.currentCase
});
const mapDispatchToProps = dispatch => ({
    setQualificationIsSelected: (qualificationCode, serviceType) => dispatch(setQualificationIsSelected(qualificationCode, serviceType)),
    setQualificationIsNotSelected: () => dispatch(setQualificationIsNotSelected()),
    setCaseMotif: (motif) => dispatch(setCaseMotif(motif)),
    setQualificationLeaf: (qualificationLeaf) => dispatch(setQualificationLeaf(qualificationLeaf)),
    setCaseQualification: (qualif) => dispatch(setCaseQualification(qualif)),
    setAdditionalData: (additionalData) => dispatch(setAdditionalData(additionalData)),
    setIsCurrentUserObligedToReQualifyImmediateCase: (value) => dispatch(setIsCurrentUserObligedToReQualifyImmediateCase(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(QualificationScalingSelection)
