import * as React from "react";
import {StepProps} from "../../../../../components/Form/StepForm/StepForm"
import {CaseDataProperty} from "../../../../../model/CaseDataProperty"
import ValidationUtils from "../../../../../utils/ValidationUtils"
import CaseDataInput from "../Fields/CaseDataInput"
import {GenericIncident} from "../../../../../model/GenericIncident";

interface Props extends StepProps {
    data: CaseDataProperty[]
    readOnly?: boolean
    onChange?: (id: string, val: string, incidentSelected?: GenericIncident) => void
}

class AdditionalDataStep extends React.Component<Props> {

    public componentDidMount(): void {
        const amountInvalidField = this.props.data
            .filter(caseData => this.isNotValid(caseData.value, caseData))
            .length

        if (this.props.changeValidation) {
            this.props.changeValidation(!amountInvalidField)
        }
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
                        return this.isNotValid(val, caseData)
                    } else {
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

    public renderData = () => {
        return this.props.data.map((element, i) =>
                (<CaseDataInput key={element.id} data={element}
                                index={i} disabled={this.props.readOnly}
                                onChange={this.handleValidationAndOnChange}/>)
            );
    }

    public render = () => {
        return (
            <div>
                {this.renderData()}
            </div>
        )
    }

}

export default AdditionalDataStep;
