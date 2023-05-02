import * as React from "react";
import {ChangeEvent} from "react";
import {FormFeedback, FormGroup, Input, InputProps} from "reactstrap";

import FormTextAreaInputValidation from "./Validation/FormTextAreaInputValidation";
import {getValidState} from "./FormUtils";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import {withFormsy} from "formsy-react";

type PropType = PassDownProps & InputProps & { clientRequest: boolean, forceValue?:string }


class FormTextAreaInput extends React.Component<PropType> {

    constructor(props: PropType) {
        super(props);
        if(this.props.forceValue){
            const changeEvent: ChangeEvent<HTMLInputElement> = {currentTarget: {value: this.props.forceValue}} as ChangeEvent<HTMLInputElement>;
            this.changeValue(changeEvent);
        }
    }

    public componentDidUpdate(prevProps: PropType) {
        const {forceValue} = this.props;
        if (prevProps.forceValue !== forceValue && forceValue !== undefined) {
            const changeEvent: ChangeEvent<HTMLInputElement> = {currentTarget: {value: forceValue}} as ChangeEvent<HTMLInputElement>;
            this.changeValue(changeEvent);
        }
    }

    public changeValue = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.setValue(event.currentTarget.value);
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    };

    public getErrorMessage(): JSX.Element {
        if (!this.props.isValid) {
            return (
                <FormFeedback invalid style={{ fontSize:'9px' }}>{this.props.errorMessage}</FormFeedback>
            )
        } else {
            return <span/>
        }
    }


    public render(): JSX.Element {

        const controlValid = this.props.isValid ? " is-valid" : " is-invalid";

        return (
            <FormGroup>
                <Input
                    {...this.props}
                    style={this.props.name === "comment" ? {height: 150} : {}}
                    value={this.props.value || ''}
                    onChange={this.changeValue}
                    type="textarea"
                    className={"form-control " + this.props.className + controlValid }
                    {...getValidState(this.props.isValid, this.props.value?false:this.props.isPristine)}
                    defaultValue={this.props.defaultValue}/>
                {this.getErrorMessage()}
                <FormTextAreaInputValidation
                    {...this.props}
                    currentLength={this.props.value ? this.props.value.length : 0}/>
            </FormGroup>
        );
    }
}

export default withFormsy<PropType>(FormTextAreaInput);
