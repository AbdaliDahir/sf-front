import * as React from "react";
import {CaseDataProperty} from "../../../../model/CaseDataProperty";
import {GenericIncident} from "../../../../model/GenericIncident";
import ValidationUtils from "../../../../utils/ValidationUtils";
import CaseDataInput from "../../../Cases/Components/CaseData/Fields/CaseDataInput";
import {StepProps} from "src/components/Form/StepForm/StepForm";
import {Breadcrumb, Col, Row} from "reactstrap";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {EMaxwellCallOrigin} from "../../../../model/maxwell/enums/EMaxwellCallOrigin";

interface Props extends StepProps {
    data: CaseDataProperty[]
    caseId: string
    readOnly?: boolean
    onChange?: (id: string, val: string, incidentSelected?: GenericIncident) => void
    currentCase,
    themeSelected,
    currentSelectedTheme,
    callOrigin?: EMaxwellCallOrigin
}

interface State {
    isThemeExpanded: boolean,
    themeHeaderValue: JSX.Element[],
}

class AdditionalDataStepV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isThemeExpanded: true,
            themeHeaderValue: [],
        }
    }

    public componentDidMount(): void {
        if (this.props.readOnly) {
            this.renderBreadcrumb();
        }
        const amountInvalidField = this.props?.data?.filter(caseData => this.isNotValid(caseData?.value, caseData))
            .length

        if (this.props.changeValidation) {
            this.props.changeValidation(!amountInvalidField)
        }
    }

    public setThemeHeaderValue = (elements: JSX.Element[]) => {
        this.setState({
            themeHeaderValue: elements
        })
    }

    public toggleTheme = () => {
        this.setState({
            isThemeExpanded: !this.state.isThemeExpanded
        })
    }

    public isNotValid = (val: string, caseData) => {
        let isNotExpectedValue = false
        if (caseData.expectedValue) {
            isNotExpectedValue = val !== caseData.expectedValue
        }
        const noRespectPatternValidation = ValidationUtils.respectPattern(caseData.pattern)([val], val) !== true
        const isNotValid = noRespectPatternValidation || isNotExpectedValue
        return isNotValid
    }


    public handleValidationAndOnChange = (id: string, val: string) => {
        if (this.props.changeValidation) {
            const amountInvalidField = this.props.data.filter(caseData => {
                    if (caseData.id === id) {
                        caseData.category = "MAXWELL"
                        return this.isNotValid(val, caseData)
                    } else {
                        caseData.category = "MAXWELL"
                        return this.isNotValid(caseData.value, caseData)
                    }
                }
            ).length

            this.props.changeValidation(!amountInvalidField)
        }
        if (this.props.onChange) {
            this.props.onChange(id, val)
        }
    }

    public renderBreadcrumb() {
        const arr: JSX.Element[] = [];
        const themesFromCase = this.props.currentCase?.themeQualification?.tags;
        let themesToDisplay;
        if (this.props.callOrigin !== EMaxwellCallOrigin.FROM_HISTORY) {
            themesToDisplay = themesFromCase && themesFromCase.length > 1 ? themesFromCase : [this.props.currentSelectedTheme[0].label];
        } else { // si appel depuis l'historique ne pas prendre le theme du dossier mais plutôt celui de l'acte
            themesToDisplay = this.props.currentSelectedTheme.label;
        }
        arr.push(<Breadcrumb>
            {themesToDisplay?.map((theme, index) => (
                <BreadcrumbItem key={index}>
                    {theme}
                </BreadcrumbItem>)
            )}
        </Breadcrumb>)
        this.setThemeHeaderValue(
            arr
        );
    }

    public renderData = () => {
        const result = this.props.data?.map((element, i) =>
            (<CaseDataInput key={element.id} data={element}
                            index={i} disabled={this.props.readOnly}
                            onChange={this.handleValidationAndOnChange}/>)
        );

        return <>
            {(this.props.readOnly && this.props.currentCase) &&
                <section className={"theme-selection-v2__card-header-breadcrumb"}>
                    <FormattedMessage id={"cases.maxwell.modal.history.qualification.incident"}/>
                    {this.state.themeHeaderValue?.length > 0 && this.state.themeHeaderValue}
                </section>
            }
            <Row>
                <Col className={"qualification-additional-data"}>
                    {result}
                </Col>
            </Row>
        </>
    }

    public render = () => {
        return (
            <div>
                {this.renderData()}
            </div>
        )
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    currentCase: state.store.cases.casesList[ownProps.caseId]?.currentCase,
    themeSelected: state.store.cases.casesList[ownProps.caseId]?.themeSelected
});

export default connect(mapStateToProps, null)(AdditionalDataStepV2);