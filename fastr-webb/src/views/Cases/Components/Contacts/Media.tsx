import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {FormGroup} from "reactstrap";
import Label from "reactstrap/lib/Label";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {AppState} from "../../../../store";
import {
    getOrFetchContact,
    setAddContactToTrue,
    setCallTransferStatusOK,
    setHasCallTransfer
} from "../../../../store/actions/CasePageAction";
import CallTransfer from "../../Create/Components/CallTransfer";
import {Payload} from "../../Create/CreateCasePage";
import ContactDirection from "./ContactDirection";
import ContactMedia from "./ContactMedia";
import {MediaSetting} from "../../../../model/media/MediaSetting";
import {fetchAndStoreMediaSettings} from "../../../../store/actions";
import "./Media.scss";
import {MediaKind} from "../../../../model/MediaKind";
import {AddNoteRequestDTO} from "../../../../model/AddNoteRequestDTO";
import {MediaDirection} from "../../../../model/MediaDirection";
import {Case} from "../../../../model/Case";
import {CaseCategory} from "../../../../model/CaseCategory";
import {addNewContact} from "../../../../store/actions/CaseActions";
import NoteForEdition from "../../View/Elements/NoteForEdition";
import {NotificationManager} from "react-notifications";
import FastService from "../../../../service/FastService";
import {ContactWrapper} from "../../../../model/Contact";
import {ContactMediaEnum} from "./ContactEnum";
import Tooltip from "reactstrap/lib/Tooltip";

interface Props {
    payload: Payload,
    addContact: boolean,
    shouldDisplayTransfer: boolean,
    qualificationLeaf,
    setAddContactToTrue: () => void,
    setHasCallTransfer: (value: boolean) => void
    fetchAndStoreMediaSettings: (activity: string | undefined) => void
    hasCallTransfer: boolean
    mediaSetting?: MediaSetting
    addNewContact: (note: AddNoteRequestDTO, id: string) => void
    onNewContact?: () => void
    currentCase: Case
    idAct?: string
    handleFormChanges?
    currentContactId: string
    getOrFetchContact: (contactId: string, alreadyLoadedContacts: Map<string, ContactWrapper>, callback?) => void
    alreadyLoadedContacts: Map<string, ContactWrapper>,
    authorizations: Array<string>
}

interface State {
    currentMediaType: MediaKind | undefined,
    currentMediaDirection: MediaDirection | undefined
    lockDirection: boolean
    clientResponse: { noteDescription: string }
    formChecking: boolean
    blockInteraction: boolean
    tooltipOpenNouveauContact: boolean
}

class Media extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            currentMediaType: undefined,
            currentMediaDirection: undefined,
            lockDirection: false,
            clientResponse: {noteDescription: ""},
            formChecking: this.props.addContact,
            blockInteraction: false,
            tooltipOpenNouveauContact: false
        }
    }

    public async componentDidMount() {
        let contactMediaType;
        let contactMediaDirection;
        await this.props.getOrFetchContact(this.props.currentContactId, this.props.alreadyLoadedContacts, async () => {
            const targetContact = this.props.alreadyLoadedContacts.get(this.props.currentContactId);
            if (targetContact && targetContact.contact && targetContact.contact.media) {
                if (!this.props.mediaSetting || !this.props.mediaSetting.mediaTypesList || !this.props.mediaSetting.mediaTypesList.length) {
                    await this.props.fetchAndStoreMediaSettings(this.props.payload.activite?.code);
                }
                contactMediaType = targetContact.contact.media.type;
                contactMediaDirection = targetContact.contact.media.direction;
                this.setState({
                    formChecking: true
                });
            } else {
                await this.props.fetchAndStoreMediaSettings(this.props.payload.activite?.code);
                if (this.props.mediaSetting?.mediaType) {
                    contactMediaType = this.props.mediaSetting.mediaType;
                }
                if (this.props.mediaSetting?.mediaSens) {
                    contactMediaDirection = this.props.mediaSetting.mediaSens;
                }
                // else formChecking already initialized
            }

            this.setState({
                currentMediaType: contactMediaType,
                currentMediaDirection: contactMediaDirection,
            })
        });
    }

    public componentWillUpdate = async (newProps: Props) => {
        if (this.props.currentContactId !== newProps.currentContactId) {
            await this.props.getOrFetchContact(newProps.currentContactId, this.props.alreadyLoadedContacts);
        }
    };

    public handleCallTransfer = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.setHasCallTransfer(event.currentTarget.checked);
    };

    private handleMediaTypeChanged = (value) => {
        this.setState({
            currentMediaType: value
        });
    }
    private handleMediaDirectionChanged = (value) => {
        this.setState({
            currentMediaDirection: value
        });
    }

    private handleClientResponseChanged = (value) => {
        this.setState({
            clientResponse: value
        });
        if (this.props.handleFormChanges) {
            this.props.handleFormChanges(value);
        }
    }

    private handleFormCheckingUpdate = (value: boolean) => {
        this.setState({
            formChecking: value,
            currentMediaDirection: "ENTRANT"
        });
    }

    private checkValidForm = (): boolean => {
        // if not planning on saving the current contact, skip form validation
        return !this.state.formChecking || (!!this.state.currentMediaType && !!this.state.currentMediaDirection &&
            this.state.clientResponse.noteDescription.length >= 20 &&
            this.state.clientResponse.noteDescription.length < 4000);
    }

    private registerNewContact = async () => {
        if (!this.checkValidForm() || !this.props.qualificationLeaf || this.state.blockInteraction) {
            return;
        }
        this.setState({
            blockInteraction: true
        });
        const noteRequest: AddNoteRequestDTO = {
            caseId: this.props.currentCase.caseId,
            type: "NOTE",
            description: this.state.clientResponse.noteDescription,
            contact: {
                clientId: this.props.payload.idClient,
                serviceId: this.props.payload.idService,
                contactId: this.props.currentContactId,
                channel: this.props.payload.contactChannel,
                media: {
                    type: this.state.currentMediaType,
                    direction: this.state.currentMediaDirection
                }
            },
            // ignored by the back for add note only
            status: this.props.currentCase.status,
            processingConclusion: "",
            actTransactionIds: [],
            callTransfer: undefined,
            category: CaseCategory.IMMEDIATE
        };
        try {
            await this.props.addNewContact(noteRequest, noteRequest.caseId);

            if (this.props.onNewContact) {
                await this.props.onNewContact(); // parent will get next sequence
            }
            FastService.postUpdateContactIdMessage({
                idCase: this.props.payload.idCase,
                serviceId: this.props.payload.idService,
                contact: {
                    idContact: this.props.currentContactId
                }
            })
            this.resetAfterNewContact();
            NotificationManager.success(<FormattedMessage id="contact.add.success"/>);
        } catch (err) {
            NotificationManager.warning(<FormattedMessage id="contact.add.failed"/>);
        } finally {
            this.setState({
                blockInteraction: false
            });
        }
    }

    private resetAfterNewContact = () => {
        const defaultState: any = {
            currentMediaDirection: "SORTANT",
            currentMediaType: "",
            lockDirection: true,
            clientResponse: {noteDescription: ""},
            formChecking: true
        };
        this.setState(defaultState);
        this.props.setAddContactToTrue();
    }

    private isCurrentMediaTypeAuthorizedValue = (value) => {
        if (value !== undefined && value !== "" && !ContactMediaEnum.hasOwnProperty(value)) {
            this.setState({
                currentMediaType: undefined,
                currentMediaDirection: undefined
            });
        }
    }

    private toggleTooltipNouveauContact = () => this.setState(prevState => ({tooltipOpenNouveauContact: !prevState.tooltipOpenNouveauContact}));

    public render() {
        const isActiviteBeBCoFixe = this.props.authorizations.indexOf("isActiviteBeBCoFixe") !== -1;
        const isActiviteBeB = this.props.authorizations.indexOf("isActiviteBeB") !== -1;
        const {addContact, qualificationLeaf} = this.props;
        const loadedContact = this.props.alreadyLoadedContacts.get(this.props.currentContactId);
        const isContactEditLocked = loadedContact ? loadedContact.isContactComplete : false;
        this.isCurrentMediaTypeAuthorizedValue(this.state.currentMediaType);
        return (
            <section className={"media__wrapper"}>
                {!this.props.hasCallTransfer && this.props.shouldDisplayTransfer && (isActiviteBeBCoFixe || isActiviteBeB) && !this.props.payload.fromQA &&
                    <section className='media__new_contact_button'>
                        <Tooltip placement="left"
                                 target={"btn-nouveau-contact"}
                                 isOpen={this.state.tooltipOpenNouveauContact}
                                 toggle={this.toggleTooltipNouveauContact}>
                            Nouveau contact
                        </Tooltip>
                        <span id={"btn-nouveau-contact"}
                              className={`btn btn-primary btn-sm ${!this.checkValidForm() || !qualificationLeaf || this.state.blockInteraction ? 'disabled' : ''}`}
                              onClick={this.registerNewContact}>+</span>
                    </section>

                }
                <section className='media__first-line-section'>
                    <ContactMedia value={this.state.currentMediaType}
                                  name="contact.media.type"
                                  validation={!isContactEditLocked && addContact}
                                  disabled={!addContact || isContactEditLocked}
                                  onChange={this.handleMediaTypeChanged}
                                  disableLast2Options={this.state.lockDirection}
                                  activateFormChecking={this.handleFormCheckingUpdate}
                                  contactCreatedByFast={false}
                                  listOfMediaTypesToDisplay={this.props.mediaSetting?.mediaTypesList}/>
                    <ContactDirection value={this.state.currentMediaDirection}
                                      name="contact.media.direction"
                                      validation={!isContactEditLocked && addContact}
                                      sansContact={this.state.currentMediaType === 'SANS_CONTACT'}
                                      onChange={this.handleMediaDirectionChanged}
                                      addContact={addContact}
                                      disabled={!addContact || this.state.lockDirection || isContactEditLocked}/>
                </section>
                {this.props.shouldDisplayTransfer &&
                    <section>
                        <NoteForEdition caseToBeUpdated={this.props.currentCase}
                                        getNoteChanges={this.handleClientResponseChanged}
                                        value={this.state.clientResponse.noteDescription}
                                        idAct={this.props.idAct}/>
                    </section>
                }
                {this.props.shouldDisplayTransfer && this.state.currentMediaType === 'VOIX' &&
                    <section className='media__second-line-section'>
                        <FormGroup className="my-0">
                            <Label for="call-transfer-input"><FormattedMessage
                                id="contact.call.transfer"/></Label>
                            <FormSwitchInput color="primary"
                                             valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                             valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                             name="callTransfer.active"
                                             id="call-transfer-input"
                                             disabled={!qualificationLeaf}
                                             value={this.props.hasCallTransfer}
                                             onChange={this.handleCallTransfer}/>
                        </FormGroup>
                        {this.props.shouldDisplayTransfer &&
                            this.props.hasCallTransfer && <CallTransfer/>
                        }

                    </section>
                }
            </section>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    addContact: state.casePage.addContact,
    currentCase: state.case.currentCase,
    hasCallTransfer: state.casePage.hasCallTransfer,
    qualificationLeaf: state.casePage.qualificationLeaf,
    mediaSetting: state.mediaSetting.mediaSetting,
    alreadyLoadedContacts: state.casePage.alreadyLoadedContacts,
    authorizations: state.authorization.authorizations
});

const mapDispatchToProps = {
    setHasCallTransfer,
    setCallTransferStatusOK,
    setAddContactToTrue,
    fetchAndStoreMediaSettings,
    addNewContact,
    getOrFetchContact
}

export default connect(mapStateToProps, mapDispatchToProps)(Media)
