import {ChangeEvent, InputHTMLAttributes} from "react";
import * as React from "react";
import {FormFeedback, FormGroup} from "reactstrap";


// Components
import Switch, {SwitchProps} from "../Bootstrap/Switch";
import {getValidState} from "./FormUtils";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import {withFormsy} from "formsy-react";


type PropType = PassDownProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> & SwitchProps

interface Props extends PropType {
    forcedValue?: boolean;
    onForce?: (boolean) => void;
    thickness: string
    className: string
}


class FormSwitchInput extends React.Component<Props> {


    constructor(props: Props) {
        super(props);
        this.props.setValue(this.props.value);
    }

    public componentDidUpdate(prevProps: Props) {
        const {forcedValue} = this.props;

        if (prevProps.forcedValue !== forcedValue && forcedValue !== undefined) {
            this.forceValue(forcedValue);
        }
    }

    public changeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const {onChange, setValue} = this.props;
        const {checked} = event.currentTarget;

        if (onChange) {
            onChange(event);
        }
        setValue(checked);
    };

    public forceValue = (value: boolean) => {
        const {onForce, setValue} = this.props;
        setValue(value);

        if (onForce) {
            onForce(value);
        }
    }

    public getErrorMessage(): JSX.Element {
        if (!this.props.isValid) {
            return (
                <FormFeedback invalid>{this.props.errorMessage}</FormFeedback>
            )
        } else {
            return <span/>
        }
    }


    public render(): JSX.Element {
        return (
            <FormGroup className={this.props.className}>
                <Switch {...this.props}
                        checked={this.props.value}
                        onChange={this.changeValue}
                        {...getValidState(this.props.isValid, this.props.isPristine)}
                />
                {this.getErrorMessage()}
            </FormGroup>

        );
    }
}

export default withFormsy<PropType>(FormSwitchInput);
