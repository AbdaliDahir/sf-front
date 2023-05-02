import fr from 'date-fns/locale/fr';
import {withFormsy} from "formsy-react";

import * as moment from "moment-timezone";
import * as React from "react";
import {InputHTMLAttributes} from "react";
import DatePicker, {registerLocale} from "react-datepicker";
import {FormFeedback, Input} from "reactstrap";
import FormGroup from "reactstrap/lib/FormGroup";
import {getValidState} from "../FormUtils";
import {PassDownProps} from "formsy-react/dist/Wrapper";

type PropType = PassDownProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>;

interface Props extends PropType {
    minDate?: Date
    maxDate?: Date
    peekNextMonth?: boolean
    showMonthDropdown?: boolean
    showYearDropdown?: boolean
    saveData?: (key: string, value: Date) => void
    onSelectDate?: (stringDate: string) => void
    disabled?: boolean
    filterDate?: (date: Date) => boolean
    classNameFormGroup?: string
    isClearable?: boolean
    onChange
    small?: boolean
}

class FormDateInput extends React.Component<Props> {

    private LANGUAGE = process.env.REACT_APP_FASTR_LANGUAGE;

    private TIMEZONE = process.env.REACT_APP_FASTR_TIMEZONE || 'Europe/Paris';

    private DATE_FORMAT = process.env.REACT_APP_FASTR_DATE_FORMAT;

    private MOMENT_DATE_FORMAT = process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT;

    public handleChange = (date: Date) => {
        if (date) {

            const selectedMoment = moment.utc(date).tz(this.TIMEZONE)
            const selectedDate = selectedMoment.toDate()

            this.props.setValue(selectedDate);

            if (this.props.onSelectDate) {
                const stringDate = selectedMoment.format(this.MOMENT_DATE_FORMAT)
                this.props.onSelectDate(stringDate)
            }

            if (this.props.saveData) {
                this.props.saveData(this.props.name!, selectedDate)
            }
            if (this.props.onChange) {
                this.props.onChange(date)
            }
        } else {
            this.props.setValue(undefined);
            if (this.props.onChange) {
                this.props.onChange(undefined)
            }
        }
    };

    public getErrorMessage(): JSX.Element {
        if (!this.props.isValid) {
            return (<FormFeedback invalid>{this.props.errorMessage}</FormFeedback>)
        } else {
            return <span/>
        }
    }

    public render(): JSX.Element {
        registerLocale(this.LANGUAGE || "fr", fr);

        const val = this.props.value;
        const controlValid = this.props.isValid ? " is-valid" : " is-invalid";
        const classNameValue = "form-control " + (this.props.small ? " form-control-sm" : "") + (this.props.disabled ? "" : controlValid);

        return (
            <FormGroup className={this.props.classNameFormGroup}>
                <DatePicker
                    peekNextMonth={this.props.peekNextMonth}
                    showMonthDropdown={this.props.showMonthDropdown}
                    showYearDropdown={this.props.showYearDropdown}
                    disabled={this.props.disabled}
                    filterDate={this.props.filterDate}
                    selected={val !== undefined ? val : null}
                    onChange={this.handleChange}
                    dateFormat={this.DATE_FORMAT}
                    minDate={this.props.minDate}
                    maxDate={this.props.maxDate}
                    locale={this.LANGUAGE}
                    name={this.props.name}
                    isClearable={this.props.isClearable}
                    customInput={
                        <DateStringInput {...getValidState(this.props.isValid, this.props.isPristine)}
                                         className={classNameValue + " " + this.props.className}
                                         validations={this.props.validations}
                                         errorMessage={this.getErrorMessage()}/>
                    }
                />
            </FormGroup>
        )
    }
}

const DateStringInput = (props) => (
        <FormGroup>
            <Input {...props} autoComplete="off"/>
            {props.errorMessage}
        </FormGroup>
    )
;

export default withFormsy<Props>(FormDateInput);
