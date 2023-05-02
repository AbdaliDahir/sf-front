import {ChangeEvent} from "react";
import * as React from "react";
import {FormFeedback, Input, InputProps} from "reactstrap";
import { withFormsy} from 'formsy-react';
import {PassDownProps} from "formsy-react/dist/Wrapper";

type PropType = PassDownProps & InputProps

class SearchInput extends React.Component<PropType> {


    constructor(props: PropType) {
        super(props);
    }

    public changeValue = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.setValue(event.currentTarget.value);

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


    public render(): JSX.Element {
        return (
            <Input {...this.props} onChange={this.changeValue} value={this.props.value || ''}/>
        );
    }
}

export default withFormsy(SearchInput);
