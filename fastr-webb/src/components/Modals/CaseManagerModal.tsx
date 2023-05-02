import * as React from "react";
import {connect} from "react-redux";
import {Modal} from "reactstrap";
import {CaseManagerModalHeader} from "./CaseManagerModalHeader";
import CaseManagerModalBody from "./CaseManagerModalBody";
import {Case} from "../../model/Case";
import {Payload} from "../../views/Cases/View/ViewCasePage";
import {translate} from "../Intl/IntlGlobalProvider";
import {AppState} from "../../store";
import Formsy from "formsy-react";
import {NotificationManager} from "react-notifications";
import {
    addNoteCase,
    fetchAndStoreAuthorizations,
    fetchAndStoreCase,
    fetchAndStoreCaseQualification,
    setFormsyIsInvalid,
    setFormsyIsValid,
    setIsCurrentOwner,
    setIsUpdateModeEnabledToTrue,
    setModalParameters,
    setOnlyNoteToFalse,
    setScaledCaseIsEligibleToModification,
    setScaledCaseIsNotEligibleToModification,
    setUpdateModeToFalse,
    setUpdateModeToTrue,
    setIsWithAutoAssignFalse,
    toggleBlockingUI,
    toggleModal,
    updateCase,
} from "../../store/actions";
import {fetchAndStoreClient} from "../../store/actions/ClientContextActions";
import {
    hideModalForCaseManager,
    setModalFormsyIsInvalid,
    setModalFormsyIsValid,
    showModalForCaseManager,
    toggleModalForCaseManager
} from "../../store/actions/ModalAction";
import {ModalState} from "../../store/reducers/ModalReducer";
import {setAdgFailureReason} from "../../store/actions/CasePageAction";
import {ManageCaseRequestDTO, ManagementContext} from "../../model/ManageCaseRequestDTO";
import CaseService from "../../service/CaseService";
import CaseManagerModalFooter from "./CaseManagerModalFooter";
import Loading from "../Loading";
import FastService from "../../service/FastService";
import {Contact} from "../../model/Contact";

type PropType = ModalState

interface Props {
    payload: Payload
    retrievedCase: Case
    defaultNoteText?: string
    modalTitle: string
    isFormsyValid: boolean
    addContactForModal: boolean
    toggleBlockingUI: () => void
    toggleModalForCaseManager: () => void
    setFormsyIsValid: () => void
    setFormsyIsInvalid: () => void
    showCaseResolutionDunningComponents: boolean
    showModalForCaseManagerState: boolean
    isModalFormsyValid: boolean,
    successModalMessageId: string
    errorModalMessageId: string
    addContact: boolean
}

interface State {
    addContactForNote: boolean
    modal: boolean
}

/**
 * This modal will be used for operation executed on cases
 */
class CaseEditModal extends React.Component<Props & PropType, State> {

    private caseService: CaseService = new CaseService(true);

    constructor(props: Props & PropType) {
        super(props);
        this.state = {
            modal: false,
            addContactForNote: true,
        }
    }


    public addManagementContextToRequestDto = (): ManagementContext => {
        if (this.props.showCaseResolutionDunningComponents) {
            return ManagementContext.RESOLUTION_DUNNING;

        } else {
            return ManagementContext.DEFAULT;
        }
    }

    public buildFastrContactModification(contacts: Contact[], payload: Payload, contactAdded: boolean) {
        let contactFastr: Contact | undefined;
        if (contacts && contacts.length >= 1 && contacts[contacts.length - 1]) {
            contactFastr = contacts[contacts.length - 1];
        }
        const shouldBeCreatingContactInFast = !payload && contactAdded && contactFastr;
        return {
            idContact: contactFastr ? contactFastr.contactId : "",
            mediaType: contactFastr && contactFastr.media ? contactFastr.media.type : "",
            mediaDirection: contactFastr && contactFastr.media ? contactFastr.media.direction : "",
            contactStartDate: contactFastr ? contactFastr.startDate : "",
            contactCreationDate: contactFastr ? contactFastr.createdDate : "",
            shouldBeCreatedInFast: shouldBeCreatingContactInFast
        }
    }

    public handleSubmit = async (form: ManageCaseRequestDTO) => {
        const {successModalMessageId, errorModalMessageId, addContactForModal} = this.props
        this.props.toggleBlockingUI();
        try {
            if (form) {
                form.retrievedCase = this.props.retrievedCase
                form.managementContext = this.addManagementContextToRequestDto();
                form.addContact = addContactForModal;

                if (this.props.payload.contactCreatedByFast) {
                    form.addContact = true;
                    form.contact = {
                        contactId: this.props.payload.idContact,
                        clientId: this.props.payload.idClient,
                        serviceId: this.props.payload.idService,
                        channel: this.props.payload.contactChannel,
                        media: {
                            type: this.props.payload.contactMediaType,
                            direction: this.props.payload.contactMediaDirection
                        },
                        startDate: this.props.payload.contactStartDate,
                    };
                } else {
                    form.contact.contactId = this.props.payload.idContact;
                    form.contact.startDate = this.props.payload.contactStartDate;
                    form.contact.channel = this.props.payload.contactChannel;
                }

                this.caseService.manageCase(this.props.retrievedCase.caseId, form);
                NotificationManager.success(translate.formatMessage({id: "cases.manage.modal.submit.success." + successModalMessageId}));
                FastService.postSubmitMessage({
                    idCase: this.props.retrievedCase.caseId,
                    serviceId:this.props.retrievedCase.serviceId,
                    contact: this.buildFastrContactModification(this.props.retrievedCase.contacts, this.props.payload, this.props.addContact),
                    error: false
                });
            }
            this.props.toggleModalForCaseManager()

        } catch (error) {
            NotificationManager.error(translate.formatMessage({id: "cases.manage.modal.submit.error." + errorModalMessageId}));
        }

        this.props.toggleBlockingUI();
    }

    public cantSubmit = () => {
        NotificationManager.error(translate.formatMessage({id: "missing.data.or.incomplete"}))
    }

    public enableSubmitButton = () => (this.props.setFormsyIsValid());

    public disableSubmitButton = () => (this.props.setFormsyIsInvalid());

    public render(): JSX.Element {
        const {showModalForCaseManagerState, payload, defaultNoteText, modalTitle} = this.props;
        if (this.props.retrievedCase !== undefined) {
            return (
                <Modal isOpen={showModalForCaseManagerState} toggle={this.props.toggleModalForCaseManager}
                       backdrop="static">
                    <Formsy onValidSubmit={this.handleSubmit} onInvalidSubmit={this.cantSubmit}
                            onValid={this.enableSubmitButton}
                            onInvalid={this.disableSubmitButton}>
                        <CaseManagerModalHeader modalTitle={modalTitle}/>
                        <CaseManagerModalBody payload={payload} defaultNoteText={defaultNoteText}/>
                        <CaseManagerModalFooter/>
                    </Formsy>

                </Modal>
            )
        } else {
            return (<Loading />)
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    addContact: state.casePage.addContact,
    showModalForCaseManagerState: state.modalManager.showModalForCaseManagerState,
    showCaseResolutionDunningComponents: state.modalManager.showCaseResolutionDunningComponents,
    successModalMessageId: state.modalManager.successModalMessageId,
    errorModalMessageId: state.modalManager.errorModalMessageId,
    isModalFormsyValid: state.modalManager.isModalFormsyValid,
    retrievedCase: state.case.currentCase,
    isFormsyValid: state.casePage.isFormsyValid,
    updateMode: state.casePage.updateMode,
    isWithAutoAssign: state.casePage.isWithAutoAssign,
    currentCaseQualification: state.case.currentCaseQualification,
    isFormCompleted: state.casePage.isFormCompleted,
    client: state.client,
    authorizations: state.authorization.authorizations,
    showModal: state.casePage.showModal,
    adgFailureReason: state.casePage.adgFailureReason,
    isScalingMode: state.casePage.isScalingMode,
    finishingTreatment: state.casePage.finishingTreatment,
    revertScalingCaseMode: state.casePage.revertScalingCaseMode,
    addContactForModal: state.modalManager.addContactForModal
})

const mapDispatchToProps = {
    toggleBlockingUI,
    fetchAndStoreClient,
    setModalParameters,
    showModalForCaseManager,
    hideModalForCaseManager,
    toggleModalForCaseManager,
    setModalFormsyIsValid,
    setModalFormsyIsInvalid,
    fetchAndStoreCase,
    fetchAndStoreCaseQualification,
    updateCase,
    addNoteCase,
    fetchAndStoreAuthorizations,
    setIsCurrentOwner,
    setIsUpdateModeEnabledToTrue,
    setUpdateModeToTrue,
    setUpdateModeToFalse,
    setFormsyIsValid,
    setFormsyIsInvalid,
    toggleModal,
    setIsWithAutoAssignFalse,
    setOnlyNoteToFalse,
    setAdgFailureReason,
    setScaledCaseIsEligibleToModification,
    setScaledCaseIsNotEligibleToModification
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseEditModal)
