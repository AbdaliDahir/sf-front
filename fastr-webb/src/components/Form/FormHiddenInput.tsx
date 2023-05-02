import {ChangeEvent} from "react";
import * as React from "react";
import {FormGroup, Input, InputProps} from "reactstrap";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import {withFormsy} from "formsy-react";

type PropType = PassDownProps & InputProps ;

interface Props extends PropType {
    classNameToProps?: string
}

class FormHiddenInput extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public changeValue = (event: ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChange !== undefined) {
            this.props.onChange(event);
        }
        this.props.setValue(event.currentTarget.value);
    };

    public render(): JSX.Element {
        return (
            <FormGroup className={this.props.classNameToProps}>
                <Input  {...this.props} value={this.props.value || ''} onChange={this.changeValue} type="hidden">
                    {this.props.children}
                </Input>
            </FormGroup>
        )
    }
}

export default withFormsy<Props>(FormHiddenInput);
