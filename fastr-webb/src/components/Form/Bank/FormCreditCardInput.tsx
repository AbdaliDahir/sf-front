import * as React from "react";
import ReactInputMask from "react-input-mask";
import {FormFeedback, FormGroup, InputProps} from "reactstrap";
import {ChangeEvent} from "react";
import {withFormsy} from "formsy-react";
import {PassDownProps} from "formsy-react/dist/Wrapper";



interface State {
    value: string;
}

type PropType = PassDownProps & InputProps ;

class FormCreditCardInput extends React.Component<PropType, State> {

    constructor(props: PropType) {
        super(props);
    }

    public changeValue = (event: ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChange !== undefined) {
            this.props.onChange(event);
        }
        this.props.setValue(event.currentTarget.value);

    };

    public getErrorMessage(): JSX.Element {
        if (this.props.errorMessage !== undefined) {
            return (
                <FormFeedback invalid>{this.props.getErrorMessage}</FormFeedback>
            )
        } else {
            return <span/>
        }
    }

    public getValidState(): { valid: boolean, invalid: boolean } {
        if (!this.props.isValid) {
            return {invalid: true, valid: false}
        } else {
            return {invalid: false, valid: true}
        }
    }

    public render(): JSX.Element {
        return (
            <FormGroup>
                <ReactInputMask
                    maskChar=" "
                    className="form-control"
                    {...this.props}
                    onChange={this.changeValue}
                    mask="9999 9999 9999 9999"
                    {...this.getValidState()}/>
            </FormGroup>
        )
    }
}

export default withFormsy<PropType>(FormCreditCardInput)