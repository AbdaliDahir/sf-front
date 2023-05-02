import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Col, FormGroup, Row} from "reactstrap";
import Label from "reactstrap/lib/Label";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {AppState} from "../../../../store";
import ContactDirection from "../../../Cases/Components/Contacts/ContactDirection";
import {MediaSetting} from "../../../../model/media/MediaSetting";
import "../../../Cases/Components/Contacts/Media.scss";
import {MediaKind} from "../../../../model/MediaKind";
import {AddNoteRequestDTO} from "../../../../model/AddNoteRequestDTO";
import {MediaDirection} from "../../../../model/MediaDirection";
import {ContactWrapper} from "../../../../model/Contact";
import {CaseState} from "../../../../store/reducers/v2/case/CasesPageReducerV2";
import {NotificationManager} from "react-notifications";
import {
    addNewContactV2,
    getOrFetchContactV2,
    setAddContactV2,
    setCallTransferStatusOKV2,
    setCurrentNoteV2,
    setHasCallTransferV2
} from "../../../../store/actions/v2/case/CaseActions";
import {fetchAndStoreMediaSettingsV2} from "../../../../store/actions/v2/media/MediaActions";
import CaseNoteV2 from "./CaseNoteV2";
import Loading from "../../../../components/Loading";
import ContactMediaV2 from "./ContactMediaV2";
import CallTransferV2 from "./CallTransfertV2";
import {Channel} from "../../../../model/Channel";
import {CaseCategory} from "../../../../model/CaseCategory";
import FastService from "../../../../service/FastService";
import {storeMediaCurrentContact, storePartialContactV2} from "../../../../store/actions/v2/contact/ContactActions";
import CaseService from "../../../../service/CaseService";
import Tooltip from "reactstrap/lib/Tooltip";
import {Media} from 'src/model/Media';
import {ApplicationMode} from "../../../../model/ApplicationMode";

interface Props {
    caseId: string
    sessionIsFrom: string
    currentCases: any
    isEditable: boolean,
    userActivity,
    mediaSetting?: MediaSetting
    idAct?: string
    handleFormChanges?
    currentContactId?: string
    authorizations: Array<string>;
    onNewContact?: () => void
    addNewContactV2: (caseId: string, note: AddNoteRequestDTO) => void
    fetchAndStoreMediaSettingsV2: (activity: string | undefined) => void
    getOrFetchContactV2: (caseId: string, contactId: string, alreadyLoadedContacts: Map<string, ContactWrapper>, callback?) => void
    setAddContactV2: (caseId: string, value: boolean) => void,
    setHasCallTransferV2: (caseId: string, value: boolean) => void
    addContact,
    hasCallTransfer: boolean
    contactChannel: Channel,
    storePartialContactV2: (contactId: string) => void
    setCurrentNoteV2: (caseId: string, value: string) => void,
    currentNoteValue?: string
    currentNoteFromStore?: string
    fromActionModal?: boolean
    storeMediaCurrentContact: (type: string | undefined, direction: string | undefined) => void
    mediaChanged: boolean;
    currentContactMediaFromStore?: Media;
}

interface State {
    lockDirection: boolean
    blockInteraction: boolean
    shouldDisplayTransfer: boolean
    currentMediaType?: MediaKind
    currentMediaDirection?: MediaDirection | string
    initialMediaType?: MediaKind
    initialMediaDirection?: MediaDirection
    loading: boolean
    caseNoteValue: string
    initialNoteValue?: string
    tooltipOpenNouveauContact: boolean
}

class CaseMediaV2 extends Component<Props, State> {
    private noteRef?: React.RefObject<any> = React.createRef();
    private caseService: CaseService = new CaseService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            lockDirection: false,
            blockInteraction: false,
            shouldDisplayTransfer: this.props.sessionIsFrom === ApplicationMode.FAST || this.props.sessionIsFrom === ApplicationMode.GOFASTR,
            currentMediaType: undefined,
            currentMediaDirection: undefined,
            initialMediaType: undefined,
            initialMediaDirection: undefined,
            loading: true,
            caseNoteValue: "",
            initialNoteValue: "",
            tooltipOpenNouveauContact: false
        }
    }

    public async componentDidMount() {
        this.fetchContact();
        if (!this.props.currentNoteValue) {
            this.setState({initialNoteValue: this.props.currentNoteFromStore})
        } else {
            this.setState({initialNoteValue: this.props.currentNoteValue})
        }
        if (!this.state.currentMediaType && this.props.currentContactMediaFromStore?.type) {
            this.setState({currentMediaType: this.props.currentContactMediaFromStore.type as MediaKind})
        }
    }

    public fetchContact = async () => {
        let contactMediaType;
        let contactMediaDirection;
        this.setState({
            loading: true
        });
        if (this.props.currentContactId) {
            await this.props.getOrFetchContactV2(this.props.caseId, this.props.currentContactId,
                this.currentCaseState().alreadyLoadedContacts, async () => {
                    const targetContact = this.currentCaseState().alreadyLoadedContacts.get(this.props.currentContactId!);
                    if (targetContact && targetContact.contact && targetContact.contact.media) {
                        if (!this.props.mediaSetting || !this.props.mediaSetting.mediaTypesList || this.props.mediaSetting.mediaTypesList.length === 0) {
                            await this.props.fetchAndStoreMediaSettingsV2(this.props.userActivity?.code);
                        }
                        contactMediaType = targetContact.contact.media.type;
                        contactMediaDirection = targetContact.contact.media.direction;
                        this.setState({
                            initialMediaDirection: contactMediaDirection,
                            initialMediaType: contactMediaType
                        });
                    } else {
                        this.setState({
                            initialMediaDirection: undefined,
                            initialMediaType: undefined
                        });
                        await this.props.fetchAndStoreMediaSettingsV2(this.props.userActivity?.code);
                        if (this.props.mediaSetting?.mediaType && this.props.mediaSetting.mediaType !== "EMPTY") {
                            contactMediaType = this.props.mediaSetting?.mediaType;
                        }
                        if (this.props.mediaSetting?.mediaSens && this.props.mediaSetting.mediaSens !== "EMPTY") {
                            contactMediaDirection = this.props.mediaSetting?.mediaSens;
                        }
                    }
                    this.setState({
                        currentMediaDirection: contactMediaDirection,
                        currentMediaType: contactMediaType,
                        loading: false
                    });
                    if (this.state?.currentMediaType && this.state.currentMediaDirection) {
                        this.props.storeMediaCurrentContact(this.state?.currentMediaType, this.state.currentMediaDirection)
                    }
                });
        }
    }
    public componentWillUpdate = async (newProps: Props) => {
        if (this.props.currentContactId !== newProps.currentContactId && newProps.currentContactId) {
            await this.props.getOrFetchContactV2(this.props.caseId, newProps.currentContactId, this.currentCaseState().alreadyLoadedContacts);
        }
        if (this.props.mediaChanged !== newProps.mediaChanged) {
            this.fetchContact();
        }
    };
    public handleCallTransfer = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.setHasCallTransferV2(this.props.caseId, event.currentTarget.checked);
    };
    private currentCaseState = (): CaseState => {
        return this.props.currentCases[this.props.caseId]
    }
    private updateCurrentMediaType = (event) => {
        this.setState({
            currentMediaType: event.currentTarget.value
        })
        if (this.state.currentMediaType === "SANS_CONTACT") {
            this.setState({
                currentMediaDirection: ""
            })
        }
        if (event.currentTarget.value === "SANS_CONTACT") {
            this.setState({
                currentMediaDirection: "SANS_CONTACT"
            })
        }
        this.props.storeMediaCurrentContact(this.state?.currentMediaType, this.state.currentMediaDirection)
    }
    private updateCurrentMediaDirection = (value) => {
        this.setState({
            currentMediaDirection: value
        })
        this.props.storeMediaCurrentContact(this.state.currentMediaType, this.state.currentMediaDirection)
    }
    private onChangeCaseNote = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({caseNoteValue: event.currentTarget.value})
        this.props.setCurrentNoteV2(this.props.caseId, event.currentTarget.value);
    }
    private checkValidForm = (): boolean => {
        return !!this.state.currentMediaType
            && !!this.state.currentMediaDirection
            && (this.state.caseNoteValue.length >= 20)
            && (this.state.caseNoteValue.length <= 4000);
    }
    private registerNewContact = async () => {
        if (!this.checkValidForm() || !this.currentCaseState().qualificationLeaf || this.state.blockInteraction) {
            return;
        }
        this.setState({
            blockInteraction: true
        });
        const noteRequest: AddNoteRequestDTO = {
            caseId: this.props.caseId,
            type: "NOTE",
            description: this.state.caseNoteValue,
            contact: {
                clientId: this.currentCaseState().currentCase?.clientId,
                serviceId: this.currentCaseState().currentCase?.serviceId,
                contactId: this.props.currentContactId!,
                channel: this.props.contactChannel,
                media: {
                    type: this.state.currentMediaType,
                    direction: this.state.currentMediaDirection
                }
            },
            // ignored by the back for add note only
            status: this.currentCaseState().currentCase!.status,
            processingConclusion: "",
            actTransactionIds: [],
            callTransfer: undefined,
            category: CaseCategory.IMMEDIATE
        };
        try {
            await this.props.addNewContactV2(noteRequest.caseId, noteRequest);
            this.props.storePartialContactV2(String(await this.caseService.getNextContactSequence()));
            FastService.postUpdateContactIdMessage({
                idCase: this.props.caseId,
                serviceId: this.currentCaseState().currentCase?.serviceId,
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
            initialMediaType: "",
            currentMediaType: "",
            lockDirection: true,
            caseNoteValue: ""
        };
        this.setState(defaultState);
        this.noteRef?.current.setValue("");
        this.props.setAddContactV2(this.props.caseId, true);
    }
    private toggleTooltipNouveauContact = () => this.setState(prevState => ({tooltipOpenNouveauContact: !prevState.tooltipOpenNouveauContact}));

    public render() {
        const isActiviteBeBCoFixe = this.props.authorizations.indexOf("isActiviteBeBCoFixe") !== -1;
        const isActiviteBeB = this.props.authorizations.indexOf("isActiviteBeB") !== -1;
        const loadedContact = this.props.currentContactId ? this.currentCaseState().alreadyLoadedContacts?.get(this.props.currentContactId) : undefined;
        const isContactEditLocked = loadedContact ? loadedContact.isContactComplete : false;
        const activityIsSansContactOnly = this.props.mediaSetting?.mediaTypesList?.length === 1 && this.props.mediaSetting?.mediaTypesList[0] === "SANS_CONTACT";
        const displayNewContact = !this.state.loading &&
            !this.props.hasCallTransfer &&
            this.state.shouldDisplayTransfer &&
            (isActiviteBeBCoFixe || isActiviteBeB) &&
            !activityIsSansContactOnly;
        return (
            <section className={"mediaV2__wrapper"}>
                {displayNewContact &&
                    <section className='mediaV2__new_contact_button'>
                        <Tooltip placement="left"
                                 target={"btn-nouveau-contact"}
                                 isOpen={this.state.tooltipOpenNouveauContact}
                                 toggle={this.toggleTooltipNouveauContact}>
                            Nouveau contact
                        </Tooltip>
                        <span id={"btn-nouveau-contact"}
                              className={`btn btn-primary btn-sm ${!this.checkValidForm() || !this.currentCaseState().qualificationLeaf || this.state.blockInteraction ? 'disabled' : ''}`}
                              onClick={this.registerNewContact}>+</span>
                    </section>
                }
                {
                    this.state.loading ? (
                        <Loading/>
                    ) : (
                        <section>
                            <Row>
                                <Col md={6}>
                                    <ContactMediaV2 value={this.state.initialMediaType}
                                                    forceValue={this.state.currentMediaType}
                                                    name="contact.media.type"
                                                    validation={!isContactEditLocked && this.props.addContact}
                                                    disabled={!this.props.isEditable || isContactEditLocked}
                                                    disableLast2Options={this.state.lockDirection}
                                                    listOfMediaTypesToDisplay={this.props.mediaSetting?.mediaTypesList}
                                                    contactCreatedByFast={false}
                                                    onChange={this.updateCurrentMediaType}
                                                    caseId={this.props.caseId}
                                    />
                                </Col>
                                <Col md={6}>
                                    <ContactDirection value={this.state.initialMediaDirection}
                                                      forceValue={this.state.currentMediaDirection}
                                                      name="contact.media.direction"
                                                      validation={!isContactEditLocked}
                                                      sansContact={this.state.currentMediaType === 'SANS_CONTACT'}
                                                      addContact={this.props.addContact}
                                                      disabled={!this.props.isEditable || this.state.lockDirection || isContactEditLocked}
                                                      onChange={this.updateCurrentMediaDirection}
                                    />
                                </Col>
                            </Row>
                        </section>
                    )
                }
                {!this.props.fromActionModal &&
                    <section>
                        <CaseNoteV2 name="description"
                                    id="description"
                                    value={""}
                                    onChange={this.onChangeCaseNote}
                                    forceValue={this.state.initialNoteValue}
                                    passRef={this.noteRef}
                                    disabled={!this.props.isEditable}/>
                    </section>
                }
                {this.state.shouldDisplayTransfer && this.state.currentMediaType === 'VOIX' && !this.props.fromActionModal &&
                    <section className='p-0 d-flex flex-column'>
                        <FormGroup className="my-0 d-flex align-items-baseline">
                            <Label for="call-transfer-input" className={"font-weight-bold"}>
                                <FormattedMessage id="contact.call.transfer"/>
                            </Label>
                            <FormSwitchInput color="primary"
                                             valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                             valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                             name="callTransfer.active"
                                             id="call-transfer-input"
                                             disabled={!this.props.isEditable || !this.currentCaseState().qualificationLeaf}
                                             value={this.currentCaseState().hasCallTransfer}
                                             onChange={this.handleCallTransfer}
                                             className={"mb-1"}
                                             thickness={"sm"}
                            />
                        </FormGroup>
                        {(this.state.shouldDisplayTransfer && this.props.hasCallTransfer) &&
                            <CallTransferV2 caseId={this.props.caseId}/>
                        }
                    </section>
                }
            </section>
        )
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    currentCases: state.store.cases.casesList, // liste de caseState
    mediaSetting: state.store.mediaSettings.mediaSetting,
    authorizations: state.store.applicationInitialState.authorizations,
    sessionIsFrom: state.store.applicationInitialState.sessionIsFrom,
    userActivity: state.store.applicationInitialState.user?.activity,
    currentContactId: state.store.contact.currentContact?.contactId,
    currentContactMediaFromStore: state.store.contact.currentContact?.media,
    contactChannel: state.store.contact.contactChannel,
    addContact: state.store.cases.casesList[ownProps.caseId].addContact,
    hasCallTransfer: state.store.cases.casesList[ownProps.caseId].hasCallTransfer,
    currentNoteFromStore: state.store.cases.casesList[ownProps.caseId].currentNote,
    mediaChanged: state.store.contact.currentContact?.mediaChanged,
});
const mapDispatchToProps = {
    setHasCallTransferV2,
    setCallTransferStatusOKV2,
    setAddContactV2,
    fetchAndStoreMediaSettingsV2,
    addNewContactV2,
    getOrFetchContactV2,
    storePartialContactV2,
    storeMediaCurrentContact,
    setCurrentNoteV2
}
export default connect(mapStateToProps, mapDispatchToProps)(CaseMediaV2)