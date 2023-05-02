import * as React from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {AppState} from "../../../../store";
import CaseNoteV2 from "./CaseNoteV2";
import Formsy from "formsy-react";
import {AddNoteRequestDTO} from "../../../../model/AddNoteRequestDTO";
import {Case} from "../../../../model/Case";
import CaseService from "../../../../service/CaseService";
import {Contact} from "../../../../model/Contact";
import {NotificationManager} from "react-notifications";


interface Props {
    case: Case,
    contact: Contact,
    isOpen: boolean,
    toggle,
    onSubmitSuccess
}

interface State {
    isFormsyValid: boolean,
    blockingUI: boolean
}

class CaseAddNoteModalV2 extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isFormsyValid: false,
            blockingUI:false
        }
    }

    private caseService: CaseService = new CaseService(true)
    private refToFormsy?: React.RefObject<any> = React.createRef()

    private onFormsyValid = () => {
        this.setState({isFormsyValid: true});
    }

    private onFormsyInValid = () => {
        this.setState({isFormsyValid: false});
    }

    private handleOnSubmit = async (formsyCase) => {
        if (this.state.isFormsyValid) {
            try {
                this.setState({blockingUI :true});
                const updatedCase : Case = await this.caseService.addNote(this.props.case.caseId, this.formatAddNoteRequest(formsyCase));
                NotificationManager.success(<FormattedMessage
                    id="cases.add.note.success"/>, null, 3000);
                this.props.toggle();
                this.props.onSubmitSuccess(updatedCase)
            } catch (e) {
                console.error(e)
                NotificationManager.error(<FormattedMessage
                    id="cases.add.note.error"/>, null, 10000);
            } finally {
                this.setState({blockingUI :false});
            }

        }
    }

    private formatAddNoteRequest = (formValues): AddNoteRequestDTO => {

        const addNoteRequest: AddNoteRequestDTO = {
            caseId: this.props.case.caseId,
            type: "NOTE",
            description: formValues.note,
            contact: {
                clientId: this.props.contact.clientId,
                serviceId: this.props.contact.serviceId,
                contactId: this.props.contact.contactId,
                channel: this.props.contact.channel,
                media: this.props.contact.media
            },
            // ignored by the back for add note only
            status: this.props.case.status,
            processingConclusion: "",
            actTransactionIds: [],
            callTransfer: undefined,
            category: this.props.case.category
        };
        return addNoteRequest;

    }

    private handleOnCancel = () => {
        this.props.toggle();
    }

    public render(): JSX.Element {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.handleOnCancel} backdrop="static" size={"lg"}>
                <ModalHeader><h4><FormattedMessage id="cases.buttons.add.note"/></h4></ModalHeader>
                <Formsy onValid={this.onFormsyValid} onInvalid={this.onFormsyInValid} onSubmit={this.handleOnSubmit}
                        ref={this.refToFormsy}>
                    <ModalBody>
                        <CaseNoteV2
                            name="note"
                            id="note"
                            value={""}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button id="caseEditModal.toglleModal.button.id" color="light"
                                onClick={this.handleOnCancel} disabled={this.state.blockingUI}><FormattedMessage
                            id="cases.button.cancel"
                            /></Button>
                        <Button id="caseEditModal.submit.button.id" color="primary" type="submit"

                                disabled={!this.state.isFormsyValid || this.state.blockingUI}>
                            <FormattedMessage
                                id="cases.button.submit"/></Button>
                    </ModalFooter>
                </Formsy>
            </Modal>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    contact: state.store.contact.currentContact
})

export default connect(mapStateToProps)(CaseAddNoteModalV2)
