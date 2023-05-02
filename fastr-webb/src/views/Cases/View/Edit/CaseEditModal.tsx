import * as React from "react";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import FormTextAreaInput from "../../../../components/Form/FormTextAreaInput";
import {Case} from "../../../../model/Case";
import {AppState} from "../../../../store";
import {setAddContactToFalse, setAddContactToTrue, toggleModal} from "../../../../store/actions/CasePageAction";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {Payload} from "../ViewCasePage";
import Media from "../../Components/Contacts/Media";

interface Props {
    payload: Payload
    case: Case
    toggleModal: () => void
    noteInput?: string
    onSubmit: () => void
    idAct?: string
    getValuesFromFields
    isFormsyValid: boolean
    modal: boolean
    addContact: boolean
    setAddContactToTrue: () => void
    setAddContactToFalse: () => void
    blockingUI: boolean
}

interface State {
    modal: boolean
}

class CaseEditModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            modal: false
        }
    }

    public handleAddContactPreferences = (event: React.FormEvent<HTMLInputElement>) => {
        event.currentTarget.checked ? this.props.setAddContactToTrue() : this.props.setAddContactToFalse();
    };

    public render(): JSX.Element {
        const {modal} = this.props;
        return (
            <Modal isOpen={modal} toggle={this.props.toggleModal} backdrop="static" size={"lg"}>
                <ModalHeader><h4><FormattedMessage id="cases.buttons.add.note"/></h4></ModalHeader>
                <ModalBody>
                    <Media payload={this.props.payload}/>
                    <FormGroup>
                        <FormTextAreaInput
                            value={this.props.getValuesFromFields().newNote}
                            validations={{
                                isRequired: ValidationUtils.notEmpty,
                                "inputMinLength": 20,
                                "inputMaxLength": 4000
                            }}
                            id="description" name="description"/>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button id="caseEditModal.toglleModal.button.id" color="light"
                            onClick={this.props.toggleModal}><FormattedMessage
                        id="cases.button.cancel"/></Button>
                    <Button id="caseEditModal.submit.button.id" color="primary" onClick={this.props.onSubmit}
                            disabled={!this.props.isFormsyValid || this.props.blockingUI}>
                        <FormattedMessage
                            id="cases.button.submit"/></Button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    addContact: state.casePage.addContact,
    modal: state.casePage.showModal,
    isFormsyValid: state.casePage.isFormsyValid,
    retrievedCase: state.case.currentCase,
    updateMode: state.casePage.updateMode,
    case: state.case.currentCase,
    mediaSetting: state.mediaSetting.mediaSetting,
    blockingUI: state.ui.blockingUI
})
const mapDispatchToProps = {
    setAddContactToTrue,
    setAddContactToFalse,
    toggleModal
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseEditModal)
