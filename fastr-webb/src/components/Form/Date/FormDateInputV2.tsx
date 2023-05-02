import { withFormsy } from "formsy-react";
import * as moment from "moment-timezone";
import * as React from "react";
import { InputHTMLAttributes } from "react";
import DatePicker from "react-datepicker";
import { Input } from "reactstrap";
import FormGroup from "reactstrap/lib/FormGroup";
import { getValidState } from "../FormUtils";
import { PassDownProps } from "formsy-react/dist/Wrapper";

type PropType = PassDownProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>;

interface Props extends PropType {
    minDate?: Date
    maxDate?: Date
    peekNextMonth?: boolean
    showMonthDropdown?: boolean
    showYearDropdown?: boolean
    disabled?: boolean
    filterDate?: (date: Date) => boolean
    classNameFormGroup?: string
    isClearable?: boolean
    handleActionDateChange?: (date: Date | undefined) => void
    className?: string
    id: string
    name: string
    small?: boolean
    onChange
}

class FormDateInputV2 extends React.Component<Props> {

    private LANGUAGE = process.env.REACT_APP_FASTR_LANGUAGE;

    private DATE_FORMAT = process.env.REACT_APP_FASTR_DATE_FORMAT;

    public componentDidMount() {
        this.props.setValue(this.props.value)
    }

    public handleChange = (date: Date) => {
        if (date) {
            // Permet de set la date au jour selectionné sans prendre en compte les fuseaux horaires
            const selectedDate: Date = moment(date).hour(0).utc(true).toDate();
            this.props.setValue(selectedDate);
            if (this.props.handleActionDateChange) {
                this.props.handleActionDateChange(selectedDate)
            }
            if (this.props.onChange) {
                this.props.onChange(date)
            }
        } else {
            if (this.props.handleActionDateChange) {
                this.props.handleActionDateChange(undefined)
            }
            this.props.setValue(undefined);
            if (this.props.onChange) {
                this.props.onChange(undefined)
            }
        }
    };

    public getErrorMessage(): JSX.Element {
        return <div className="requiredValueMsg" hidden={this.props.isValid}>{this.props.errorMessage}</div>
    }

    public render(): JSX.Element {
        const controlValid = (!this.props.isValid ? " form-control is-invalid" : " form-control is-valid");
        const classNameValue = (this.props.small ? "form-control-sm" : "") + controlValid;

        return (
            <FormGroup className={this.props.classNameFormGroup}>
                <DatePicker
                    peekNextMonth={this.props.peekNextMonth}
                    showMonthDropdown={this.props.showMonthDropdown}
                    showYearDropdown={this.props.showYearDropdown}
                    disabled={this.props.disabled}
                    filterDate={this.props.filterDate}
                    selected={this.props.value}
                    onChange={this.handleChange}
                    dateFormat={this.DATE_FORMAT}
                    minDate={this.props.minDate}
                    maxDate={this.props.maxDate}
                    locale={this.LANGUAGE}
                    isClearable={this.props.isClearable}
                    id={this.props.id}
                    name={this.props.name}
                    customInput={
                        <DateStringInput {...getValidState(this.props.isValid, this.props.isPristine)}
                            className={classNameValue + " " + this.props.className}
                            validations={this.props.readOnly || this.props.validations}
                            errorMessage={this.getErrorMessage()} />
                    }
                />
            </FormGroup>
        )
    }
}

const DateStringInput = (props) => (<React.Fragment>
    <Input {...props} autoComplete="off" />
    {props.errorMessage}
</React.Fragment>
)
    ;

export default withFormsy<Props>(FormDateInputV2);
