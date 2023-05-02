import * as React from "react";
import {FormattedMessage} from "react-intl";
import {FormGroup} from "reactstrap";
import Label from "reactstrap/lib/Label";
import FormTextAreaInput from "../../../Form/FormTextAreaInput";
import ValidationUtils from "../../../../utils/ValidationUtils";

interface Props {
    defaultNoteText?: string
    name:string
}


export class NoteFormForModal extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div>
                <FormGroup>
                    <Label for={`${this.props.name}.description`}>
                        <FormattedMessage id="cases.create.note"/><span className="text-danger">*</span>
                    </Label>

                    <FormTextAreaInput
                        value={this.props.defaultNoteText}
                        validations={{
                            isRequired: ValidationUtils.notEmpty,
                            "inputMinLength": 20,
                            "inputMaxLength": 4000
                        }}
                        id={`${this.props.name}.description`} name={`${this.props.name}.description`}/>

                </FormGroup>
            </div>
        )
    }
}

