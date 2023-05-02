import * as React from 'react';
import {FormattedMessage} from "react-intl"
import {Button} from "reactstrap"
import FormButtonGroupRadio from "../../../../../components/Form/FormButtonGroupRadio"
import {CaseDataProperty} from "../../../../../model/CaseDataProperty"
import ValidationUtils from "../../../../../utils/ValidationUtils"

interface Props {
    data: CaseDataProperty
    disabled?: boolean
    name: string
    value?: string
    onChange?: (id: string, val: string) => void
    otherValidations: object
}

class CaseDataRadioBoolean extends React.Component<Props> {


    public handleCaseDataChange = (value: 'yes' | 'no' | '') => {
        if (this.props.onChange) {
            const id = this.props.data.id;
            this.props.onChange(id, value)
        }
    };

    public render() {
        const {required} = this.props.data;
        const {disabled} = this.props;
        let validations;
        if (!disabled) {
            validations={
                respectPattern: ValidationUtils.respectPattern(this.props.data.pattern),
                ...this.props.otherValidations
            };
            if(required){
                validations = {...validations , isRequired: ValidationUtils.notEmpty}
            }
        }
        return (
            <FormButtonGroupRadio name={this.props.name}
                                  label={this.props.data.label}
                                  validations={validations}
                                  id="switch" value={this.props.data.value}
                                  onValueChange={this.handleCaseDataChange}
                                  disabled={this.props.disabled}>
                <Button size="sm" color={"primary"} outline={this.props.data.value !== "true"} id="yes" value="yes">
                    <FormattedMessage id={"component.switch.yes"}/>
                </Button>
                <Button size="sm" color={"primary"} outline={this.props.data.value !== "true"} id="no" value="no">
                    <FormattedMessage id={"component.switch.no"}/>
                </Button>
            </FormButtonGroupRadio>
        );
    }
}

export default CaseDataRadioBoolean;