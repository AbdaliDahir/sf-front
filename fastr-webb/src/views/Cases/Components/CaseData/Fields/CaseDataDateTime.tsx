import * as React from "react";
import FormDateTimeInput from "../../../../../components/Form/Date/FormDateTimeInput";
import {CaseDataProperty} from "../../../../../model/CaseDataProperty";
import ValidationUtils from "../../../../../utils/ValidationUtils";

interface Props {
    data: CaseDataProperty
    disabled?: boolean
    isDataAction?: boolean
    name: string
    value?: string
    onChange?: (id: string, val: string) => void
    otherValidations: object
    className?: string
}

export default class CaseDataDateTime extends React.Component<Props> {

    public handleCaseDataDateTimeChange = (date: string) => {
        if (this.props.onChange) {
            const id = this.props.data.id;
            const value = date;
            this.props.onChange(id, value)
        }
    };

    public render(): JSX.Element {
        const {data} = this.props;
        const {disabled} = this.props;
        const required = data.required;
        let validations
        if (!disabled) {
            validations = {
                respectPattern: ValidationUtils.respectPattern(data.pattern),
                ...this.props.otherValidations
            };
            if (required) {
                validations = {...validations, isRequired: ValidationUtils.notEmpty}
            }
        }
        const val = this.props.isDataAction && data.value ? new Date(data.value) : data.value;

        return <FormDateTimeInput
            id={data.code}
            value={val}
            validations={validations}
            name={this.props.name}
            label={this.props.data.label}
            readOnly={disabled}
            disabled={disabled}
            required={required}
            className={this.props.className}
            onSelectDateTime={this.handleCaseDataDateTimeChange}
        />
    }
}