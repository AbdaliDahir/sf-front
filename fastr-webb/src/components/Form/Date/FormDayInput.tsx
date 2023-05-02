import {withFormsy} from "formsy-react";

import * as React from "react";
import ReactDatePicker, {registerLocale} from "react-datepicker";
import {FormFeedback} from "reactstrap";
import Input, {InputProps} from "reactstrap/lib/Input";
// Components
import fr from "date-fns/locale/fr";
import { getValidState} from "../FormUtils";
import {PassDownProps} from "formsy-react/dist/Wrapper";

type PropType = PassDownProps & InputProps;

interface Props extends PropType {
    includeDays?: number[]
}
// Register date local
registerLocale('fr', fr);
class FormDayInput extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public handleChange = (date: Date) => {
        this.props.setValue(date.toString())
    };


    public getErrorMessage(): JSX.Element {
        if (this.props.isValid) {
            return <span/>
        } else {
            return (
                <FormFeedback invalid>{this.props.getErrorMessage}</FormFeedback>
            )
        }
    }

    public filter = (date: Date) => {

        if (this.props.includeDays) {
            return date <= new Date("01/31/2019")
                && date >= new Date("01/01/2019")
                && this.props.includeDays.indexOf(date.getDate()) > -1
        } else {
            return date <= new Date("01/31/2019")
                && date >= new Date("01/01/2019")
        }
    };

    public parseValue() {
        const value = this.props.value;
        if (value && value !== "") {
            return new Date(value)
        } else {
            return new Date("01/01/2019");
        }
    }

    public render(): JSX.Element {
        const selectedDate: string = this.props.value;

        return (
            <div className="daypicker" style={{width: "242px", margin: "0 auto"}}>
                <Input  {...this.props}
                        value={selectedDate}
                        type="hidden"
                        {...getValidState(this.props.isValid, this.props.isPristine)}
                />
                <ReactDatePicker
                    openToDate={new Date("01/01/2019")}
                    filterDate={this.filter}
                    inline
                    showDisabledMonthNavigation
                    forceShowMonthNavigation={false}
                    className="form-control"
                    selected={this.parseValue()}

                    onChange={this.handleChange}
                    dateFormat="dd"
                    disabled={this.props.disabled}
                />
                {this.getErrorMessage()}
            </div>
        )
    }
}

export default withFormsy<Props>(FormDayInput);
