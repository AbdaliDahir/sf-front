import {ChangeEvent} from "react";
import * as React from "react";
import {FormFeedback, FormGroup, Input, InputProps} from "reactstrap";
import {getValidState} from "./FormUtils";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import {withFormsy} from "formsy-react";


type PropType = PassDownProps & InputProps & { classNameToProps: string };

interface Props extends PropType {
    forceDirty?: boolean
    forcedValue?: any
    resetActionConclusionFlag?: React.MutableRefObject<boolean>
    onChangeActionConclusion?: (value: string) => void
    handleSansContactClicked?: () => void
    dontShowActiveWhenDisabled?: boolean
    saved?:boolean
}

class FormSelectInput extends React.Component<Props> {

    public ACTION_PROCESSING_CONCLUSION_ID: string = "actionProcessingConclusion"
    public PROCESSING_CONCLUSION_ID: string = "processingConclusion"

    constructor(props: Props) {
        super(props);
        const value = this.props.forcedValue ? this.props.forcedValue : this.props.value
        if (value) {
            this.props.setValue(value);
        } else {
            this.props.setValue('');
        }
    }

    public componentDidUpdate(prevProps: Props) {
        const {forcedValue, id} = this.props;
        if (prevProps.forcedValue !== forcedValue && forcedValue !== undefined) {
            this.updateValue(forcedValue, {currentTarget: {value: forcedValue}});
        }
        if (id && id === this.ACTION_PROCESSING_CONCLUSION_ID && this.props.resetActionConclusionFlag?.current) { // Case SelectInput for ActionConclusion
            this.props.resetValue()
            // @ts-ignore
            this.props.resetActionConclusionFlag?.current = false
        }
        if (id === this.PROCESSING_CONCLUSION_ID && forcedValue !== prevProps.forcedValue) {
            this.updateValue(forcedValue, { currentTarget: { value: forcedValue } });
        }
    }

    public changeValue = (event: ChangeEvent<HTMLInputElement>) => {
        this.updateValue(event.currentTarget.value, event)
        if (this.props.onChangeActionConclusion) {
            this.props.onChangeActionConclusion(event.currentTarget.value)
        }

        if (event.currentTarget.value === 'SANS_CONTACT' && this.props.handleSansContactClicked) {
            this.props.handleSansContactClicked()
        }
    };

    public updateValue = (value, event) => {
        const {onChange} = this.props;
        this.props.setValue(value);
        if (onChange !== undefined) {
            onChange(event);
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
        return (
            <FormGroup className={this.props.classNameToProps + ' ' + (this.props.dontShowActiveWhenDisabled ? '' : 'show-active-disabled')}>
                <Input
                    {...this.props}
                    type="select"
                    value={this.props.value || ''}
                    onChange={this.changeValue}
                    {...getValidState(this.props.isValid,
                        this.props.value || this.props.forceDirty ? false : this.props.isPristine)}
                    onValid={this.onValid()}
                    className={this.props.saved? "initial-filter-border" :""}>
                    {this.props.children}
                </Input>
                {this.getErrorMessage()}
            </FormGroup>
        )
    }
}

export default withFormsy<PropType>(FormSelectInput);
