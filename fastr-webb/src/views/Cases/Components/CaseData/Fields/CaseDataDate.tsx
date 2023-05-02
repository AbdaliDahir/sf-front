import * as React from "react";
import FormDateInput from "../../../../../components/Form/Date/FormDateInput";
import {CaseDataProperty} from "../../../../../model/CaseDataProperty";
import ValidationUtils from "../../../../../utils/ValidationUtils";
import moment from "moment";

interface Props {
    data: CaseDataProperty
    disabled?: boolean
    isDataAction?: boolean
    name: string
    value?: string
    onChange?: (id: string, val: string) => void
    otherValidations: object
}

export default class CaseDataDate extends React.Component<Props> {

    private MOMENT_DATE_FORMAT = process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT;


    public handleCaseDataDateChange = (date: string) => {

        if (this.props.onChange) {
            const id = this.props.data.id;
            this.props.onChange(id, date)
        }
    };

    public render(): JSX.Element {
        const {data} = this.props;
        const {disabled} = this.props;
        const required = data.required;
        const value = this.props.isDataAction && data.value ? new Date(data.value) : data.value;
        let validations;
        if (!disabled) {
            validations ={
                respectPattern: ValidationUtils.respectPattern(data.pattern),
                ...this.props.otherValidations
            };
            if(required){
                validations = {...validations , isRequired: ValidationUtils.notEmpty}
            }
        }
        return <FormDateInput peekNextMonth showMonthDropdown showYearDropdown
                              id={data.code}
                              value={value !== undefined ? moment(value, this.MOMENT_DATE_FORMAT).toDate() : undefined}
                              validations={validations}
                              name={this.props.name}
                              label={this.props.data.label}
                              readOnly={disabled}
                              disabled={disabled}
                              className={"form-control-sm"}
                              onSelectDate={this.handleCaseDataDateChange}
        />
    }
}
