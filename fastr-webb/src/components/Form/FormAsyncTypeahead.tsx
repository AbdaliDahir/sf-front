import * as React from "react";
import {FormGroup} from "reactstrap";
import {AsyncTypeahead, AsyncTypeaheadProps} from "react-bootstrap-typeahead";
import { getValidState} from "./FormUtils";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import {withFormsy} from "formsy-react";

type PropType = PassDownProps & AsyncTypeaheadProps<object> ;


class FormAsyncTypeahead extends React.Component<PropType> {

    constructor(props: PropType) {
        super(props);
    }

    public getErrorMessage(): JSX.Element {
        if (!this.props.isValid) {
            return (
                <div className="requiredValueMsg">{this.props.errorMessage}</div>
            )
        } else {
            return <span/>
        }
    }

    public render(): JSX.Element {
        return (
            <FormGroup>
                <AsyncTypeahead
                    {...getValidState(this.props.isValid, this.props.isPristine)}
                    {...this.props}
                />
                {this.getErrorMessage()}
            </FormGroup>
        )
    }
}

export default withFormsy<PropType>(FormAsyncTypeahead);
