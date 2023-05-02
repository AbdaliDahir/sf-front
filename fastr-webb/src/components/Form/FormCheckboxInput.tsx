import { ChangeEvent, InputHTMLAttributes } from "react";
import * as React from "react";
import { Input } from "reactstrap";
import { PassDownProps } from "formsy-react/dist/Wrapper";
import { withFormsy } from "formsy-react";
import './Css/FormCheckboxInput.scss';


type PropType = PassDownProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>

interface Props extends PropType {
    functionalId: string
    toggleChecked: (functionalId: string, checked: boolean) => void
}

interface State {
    stateValue: boolean
}

class FormCheckboxInput extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.props.setValue(this.props.value);
    }

    public changeValue = (event: ChangeEvent<HTMLInputElement>) => {
        this.updateValue(event.currentTarget.checked);
    };

    public updateValue = (value) => {
        this.setState({ stateValue: value });
        this.props.setValue(value);
        this.props.toggleChecked(this.props.functionalId, value)
    };

    public render(): JSX.Element {
        return (
            <label className="checkbox-container">
                <Input
                    {...this.props}
                    type="checkbox"
                    checked={this.props.value}
                    onChange={this.changeValue} />
                <span className="checkmark"></span>
            </label>
        );
    }
}

export default withFormsy<PropType>(FormCheckboxInput);