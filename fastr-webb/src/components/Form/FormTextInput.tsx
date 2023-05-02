import * as React from "react";
import {ChangeEvent} from "react";
import {FormFeedback, FormGroup, Input, InputProps} from "reactstrap";
import {getValidState} from "./FormUtils";
import {withFormsy} from "formsy-react";
import {PassDownProps} from "formsy-react/dist/Wrapper";


type PropType = PassDownProps & InputProps

interface Props extends PropType {
    uppercase?: boolean
    onFieldValidation?: (isValid: boolean) => void
    forceDirty?: boolean
    forcedValue: string
    classNameToProps?: string
}

class FormTextInput extends React.Component<Props> {

    public componentDidUpdate(prevProps: Props) {
        const {forcedValue} = this.props;
        if (prevProps.forcedValue !== forcedValue && forcedValue !== undefined) {
            this.updateValue(forcedValue, {currentTarget: {value: forcedValue}});
        }
    }


    public changeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.currentTarget;
        this.updateValue(value, event)
    };

    public updateValue = (value, event) => {
        if (this.props.uppercase) {
            this.props.setValue(event.currentTarget.value.toLocaleUpperCase());
        } else {
            this.props.setValue(event.currentTarget.value)
        }

        // Because our input is a "text" one, we have to call the onChange manually (on text inputs onChange listens for input events)
        // we can either dispatch the event or call the hypothetical onChange prop
        if (this.props.onChange) {
            this.props.onChange(event)
        }
    };


public getErrorMessage(): JSX.Element {
        if (this.props.isValid) {
            return <span/>
        } else {
            return (
                <FormFeedback invalid>{this.props.errorMessage}</FormFeedback>
            )
        }
    }


    public onValid = () => {
        if (this.props.onFieldValidation) {
            this.props.onFieldValidation(this.props.isValid)
        }
    }

    public render(): JSX.Element {
        const controlValid = this.props.isValid ? " is-valid" : " is-invalid";
        return (
            <FormGroup className={this.props.classNameToProps}>
                <Input
                    {...this.props}
                    onChange={this.changeValue}
                    value={this.props.value || ''}
                    className={"form-control " + this.props.className + controlValid }
                    {...getValidState(this.props.isValid,
                        this.props.value || this.props.forceDirty ? false : this.props.isPristine)}
                    onValid={this.onValid()}/>
                {this.getErrorMessage()}
            </FormGroup>
        );
    }
}

export default withFormsy<Props>(FormTextInput);
