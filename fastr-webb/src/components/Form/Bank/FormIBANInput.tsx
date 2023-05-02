import * as React from "react";
import ReactInputMask from "react-input-mask";
import {FormFeedback, FormGroup, InputProps} from "reactstrap";
import {ChangeEvent} from "react";
import {withFormsy} from "formsy-react";
import {PassDownProps} from "formsy-react/dist/Wrapper";

interface Props {
    forceInvalid?: boolean
    small?: boolean
}

interface State {
    forceInvalid?: boolean
}

type PropType = PassDownProps & InputProps & Props ;

class FormIBANInput extends React.Component<PropType, State> {

    constructor(props: PropType) {
        super(props);
        this.state = {
            forceInvalid: this.props.forceInvalid
        }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.forceInvalid !== this.props.forceInvalid) {
            this.setState({forceInvalid: this.props.forceInvalid});
        }
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
        if (!this.props.isValid || this.state.forceInvalid) {
            return {invalid: true, valid: false}
        } else {
            return {invalid: false, valid: true}
        }
    }

    public render(): JSX.Element {
        return (
            <FormGroup className="mb-2">
                <ReactInputMask
                    maskChar=" "
                    {...this.props}
                    className={(this.props.small ? "form-control-sm" : "") + (!this.props.isValid || this.state.forceInvalid ? " form-control is-invalid" : " form-control is-valid")}
                    onChange={this.changeValue}
                    mask="aa99 **** **** **** **** **** **** ***"
                    value={this.props.value || ''}
                    {...this.getValidState()}/>
                {this.getErrorMessage()}
            </FormGroup>
        )
    }
}

export default withFormsy<string, PropType>(FormIBANInput);
