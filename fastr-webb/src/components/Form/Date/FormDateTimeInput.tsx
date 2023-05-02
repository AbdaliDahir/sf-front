import {withFormsy} from "formsy-react";

import * as moment from "moment";
import * as React from "react";
import ReactDatePicker, {registerLocale} from "react-datepicker";
import {FormGroup, Input, InputProps} from "reactstrap";

// Components
import fr from "date-fns/locale/fr";
import {getValidState} from "../FormUtils";
import {PassDownProps} from "formsy-react/dist/Wrapper";

moment.locale(process.env.REACT_APP_FASTR_LANGUAGE);

type PropType = PassDownProps & InputProps;


interface Props extends PropType {
    onSelectDateTime?: (stringDate?: string) => void
}

// Register date local
registerLocale('fr', fr);

const invalidFeedbackStyle = {
    "width": "100%",
    "marginTop": "0.25rem",
    "fontSize": "80%",
    "color": "#bf3b05",
}

class FormDateTimeInput extends React.Component<Props> {

    constructor(props: PropType) {
        super(props);
    }

    public handleChange = (date: Date) => {
        const value = date ? date.toISOString() : undefined;
        this.props.setValue(value);
        if (this.props.onSelectDateTime) {
            this.props.onSelectDateTime(value)
        }
    };

    public getErrorMessage(): JSX.Element {
        if (!this.props.isValid) {
            return <div style={invalidFeedbackStyle}>{this.props.errorMessage}</div>
        } else {
            return <span/>
        }
    }


    public render(): JSX.Element {

        const val = this.props.value;
        const controlValid = this.props.isValid ? " is-valid" : " is-invalid";

        return (
            <FormGroup >
                <Input value={this.props.value} type="hidden" {...this.props}/>
                <ReactDatePicker
                    timeCaption="Heure"
                    className={"form-control " + this.props.className + controlValid }
                    showTimeSelect
                    selected={val !== undefined ? new Date(val) : null}
                    onChange={this.handleChange}
                    timeFormat="HH:mm"
                    {...getValidState(this.props.isValid, this.props.isPristine)}
                    disabled={this.props.disabled}
                    dateFormat={"dd/MM/yyyy HH:mm"}
                />
                {this.getErrorMessage()}
            </FormGroup>
        )
    }
}

export default withFormsy<Props>(FormDateTimeInput);
