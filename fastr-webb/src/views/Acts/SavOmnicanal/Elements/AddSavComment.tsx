import * as React from "react";
import Formsy from "formsy-react";
import {SavCommentForm} from "./SavCommentForm";
import {FormattedMessage} from "react-intl";
import {Button} from "reactstrap";
import ActService from "../../../../service/ActService";
import {NotificationManager} from "react-notifications";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

interface Props {
    closeSavCommentInput?: () => void
    fromFastrCase?: boolean
    reference?: string
    globalcareReference?: string
    updateSAV?: () => void
}

interface State {
    disabled : boolean
}

export class AddSavComment extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {disabled: true}
    }

    public submitSavComment =  async (form) => {
        const {fromFastrCase, reference, globalcareReference} = this.props
        let request;
        if(fromFastrCase){
            request = {
                idSavSbe: globalcareReference,
                clientId: reference,
                comment: form.savOmnicanal.comment
            }
        } else {
            request = {
                idSavSbe: globalcareReference,
                technicalSupportId: reference,
                comment: form.savOmnicanal.comment
            }
        }

        if(this.props.updateSAV) {
            this.props.updateSAV();
        }
        try {
            await this.actService.saveComment(request)
            NotificationManager.success(translate.formatMessage({id: "boucle.adg.success"}))
        } catch (exp) {
            NotificationManager.error(translate.formatMessage({id: "boucle.adg.failure"}))
        }
        if(this.props.closeSavCommentInput) {
            this.props.closeSavCommentInput()
        }
    }

    public enableSaveButton = () => (this.setState({disabled: false}))
    public disableSaveButton = () => (this.setState({disabled: true}))


    public render() {
        return (
            <div className="pl-4 pt-4 pr-4">
                <Formsy onSubmit={this.submitSavComment}
                        onValid={this.enableSaveButton}
                        onInvalid={this.disableSaveButton}>
                    <SavCommentForm name="savOmnicanal" closeSavCommentInput={this.props.closeSavCommentInput}/>
                    <div className="d-flex justify-content-end">
                        <Button submit="true" color="primary" size="sm" disabled={this.state.disabled}>
                            <FormattedMessage
                                id="cases.button.submit"/></Button>
                    </div>
                </Formsy>
            </div>
        );
    }
}
