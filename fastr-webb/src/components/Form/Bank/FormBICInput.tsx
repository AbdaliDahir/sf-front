import {withFormsy} from 'formsy-react';
import * as React from "react";
import {ChangeEvent} from "react";
import ReactInputMask from "react-input-mask";
import {FormFeedback, FormGroup, InputProps} from "reactstrap";
import {PassDownProps} from "formsy-react/dist/Wrapper";

type PropType = PassDownProps & InputProps & Props;

interface Props {
    small?: boolean
}

class FormBICInput extends React.Component<PropType> {

    constructor(props: PropType) {
        super(props);
    }

    public changeValue = (event: ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChange !== undefined) {
            this.props.onChange(event)
        }

        this.props.setValue(event.currentTarget.value);


    };

    public getErrorMessage(): JSX.Element {
        if (this.props.errorMessage !== undefined) {
            return (
                <FormFeedback invalid>{this.props.errorMessage}</FormFeedback>
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
                <ReactInputMask maskChar=""
                                {...this.props}
                                onChange={this.changeValue}
                                className={(this.props.small ? "form-control-sm" : "") + (!this.props.isValid ? " form-control is-invalid" : " form-control is-valid")}
                                mask={"aaaa aa ** ***"}
                                value={this.props.value || ''}
                                {...this.getValidState()}/>
                {this.getErrorMessage()}
            </FormGroup>
        )
    }
}

export default withFormsy<PropType>(FormBICInput);