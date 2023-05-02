import * as React from "react";
import {FormGroup} from "reactstrap";
import Label from "reactstrap/lib/Label";
import {FormattedMessage} from "react-intl";
import FormTextAreaInput from "../../../../components/Form/FormTextAreaInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
interface Props {
    name: string
    closeSavCommentInput?: () => void | undefined
}
export class SavCommentForm extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <div>
                <FormGroup>
                    <div className="d-flex justify-content-between">
                        <Label for={`${this.props.name}.comment`}>
                            <div className="sav-omnicanal__title">
                                <FormattedMessage id="adg.sav.omnicanal.comment.title"/><span className="text-danger">*</span>
                            </div>
                        </Label>
                        <div className="d-flex align-items-center justify-content-center sav-omnicanal__cancel" onClick={this.props.closeSavCommentInput}>
                            <span className="mr-2"><FormattedMessage id="adg.sav.omnicanal.comment.cancel"/></span>
                            <span className="icon icon-close"/>
                        </div>
                    </div>

                    <FormTextAreaInput
                        value={""}
                        validations={{
                            isRequired: ValidationUtils.notEmpty,
                            "inputMinLength": 20,
                            "inputMaxLength": 4000
                        }}
                        id={`${this.props.name}.comment`} name={`${this.props.name}.comment`}/>

                </FormGroup>
            </div>
        );
    }
}