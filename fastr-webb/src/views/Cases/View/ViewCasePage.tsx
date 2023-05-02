import Formsy from "formsy-react";
import * as _ from "lodash"
import React, {lazy} from 'react';
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {setFinishingTreatmentToFalse, setFinishingTreatmentToTrue} from "../../../store/actions";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import FastrPayloadPage from "../../../components/Pages/FastrPayloadPage";
import TransactionDTO from "../../../model/acts/TransactionDTO";
import {AddNoteRequestDTO} from "../../../model/AddNoteRequestDTO";
import {Case} from "../../../model/Case";
import {CaseCategory} from "../../../model/CaseCategory";
import {CaseDataProperty} from "../../../model/CaseDataProperty";
import {CaseNote} from "../../../model/CaseNote";
import {CaseResource} from "../../../model/CaseResource";
import {CaseRoutingRule} from "../../../model/CaseRoutingRule";
import {CasesQualificationSettings} from "../../../model/CasesQualificationSettings";
import {CaseUpdateDTO} from "../../../model/CaseUpdateDTO";
import {Channel} from "../../../model/Channel";
import {FastrConclusion} from "../../../model/FastrConclusion";
import {GenericIncident} from "../../../model/GenericIncident";
import {MediaDirection} from "../../../model/MediaDirection";
import {MediaKind} from "../../../model/MediaKind";
import {Service} from "../../../model/service";
import {TroubleTicketResponse} from "../../../model/TroubleTicketResponse";
import ErrorModel, {FieldErrorModel} from "../../../model/utils/ErrorModel";
import ADGDataDispatcher from "../../../service/ADGDataDispatcher";
import CaseService from "../../../service/CaseService";
import FastService from "../../../service/FastService";
import {AppState} from "../../../store/";

import * as queryString from "querystring";
import {
    addNoteCase,
    fetchAndStoreAuthorizations,
    fetchAndStoreCase,
    fetchAndStoreCaseQualification,
    setScaledCaseIsNotEligibleToModification,
    storeCase,
    toggleBlockingUI,
    updateCase
} from "../../../store/actions/";
import {storingAditionalData} from "../../../store/actions/CaseActions";
import {
    allowMaxwellModalClosing,
    beginCreatingMaxwellCase,
    createTroubleTicket,
    creatingMaxwellCaseKO,
    creatingMaxwellCaseOk,
    dontAllowMaxwellModalClosing,
    fetchAndStoreUserActivity,
    getOrFetchContact,
    hideMaxwellModalProcesses,
    initMaxwellProcess,
    openMaxwellModal,
    setAddContactToFalse,
    setAddContactToTrue,
    setAdditionalData,
    setAdgFailureReason,
    setCaseMotif,
    setCaseQualification,
    setCurrentContactId,
    setDisplayCancelButton,
    setDisplayGridADGForDISRC,
    setFormsyIsInvalid,
    setFormsyIsValid,
    setIncidentsList,
    setIsCurrentOwner,
    setIsCurrentUserEliToAutoAssign,
    setIsCurrentUserEliToUpdateImmediateCase,
    setIsUpdateModeEnabledToTrue,
    setIsWithAutoAssignFalse,
    setOnlyNoteToFalse,
    setQualificationLeaf,
    setQualificationSelected,
    setScaledCaseIsEligibleToModification,
    setScalingEligibilityFalse,
    setScalingEligibilityTrue,
    setUpdateModeToFalse,
    setUpdateModeToTrue,
    showMaxwellModalProcesses,
    toggleModal,
    uploadMaxwellFiles
} from "../../../store/actions/CasePageAction";
import {DataLoad, fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import {CasePageState} from "../../../store/reducers/CasePageReducer";
import {ModalState} from "../../../store/reducers/ModalReducer";
import ClientContextProps from "../../../store/types/ClientContext";
import CaseUtils, {retrieveLastResource} from "../../../utils/CaseUtils";

import {
    buildInitalCaseIncident,
    buildTroubleTicketUpdateDto,
    getKoTroubleTicketResponse,
    isMaxwellCase,
    isProcessKO,
    isProcessOK
} from "../../../utils/MaxwellUtils";
import {handleScalingBusinessLogic} from "../../../utils/ScalingUtils";
import QualificationScalingSelection from "../Components/Qualification/QualificationScalingSelection";
import CaseConclusionViewCase from "./Components/CaseConclusionViewCase";
import ViewCaseNavBar from "./Components/ViewCaseNavBar";
import ClientRequestAndNote from "./Components/ClientRequestAndNote";
import InfoBar from "./Components/InfoBar";
import {Contact, ContactWrapper} from "../../../model/Contact";
import Loading from "../../../components/Loading";
import AdgFastrViewSection from "../../Acts/AdgFastrViewSection";
import {ACT_ID} from "../../../model/actId";
import {formatDataForRetentionChange} from "../../Acts/Retention/RetentionFormat";
import CaseHistory from "../Components/CaseHistory/CaseHistory";

import SockJsClient from 'react-stomp';
import {compose} from "redux";
import {CaseQualification} from "../../../model/CaseQualification";
import SessionService from "../../../service/SessionService";
import GenericCardToggle from "../../../components/Bootstrap/GenericCardToggle";
import {Status} from "../../../model/Status";
import {formatDataForAntiChurnChange} from "../../../model/acts/antichurn/AntiChurnFormat";
import FASTRAct from "../../../model/acts/FASTRAct";
import Act from "../../../model/acts/Act";
import {setIsRecentCasesListDisplayed} from "../../../store/actions/RecentCasesActions";
import {setPayload} from "../../../store/PayloadSlice";
import {fetchActivationFlags} from "../../../store/ActivationFlagSlice";
import DateUtils from "../../../utils/DateUtils";
import * as moment from "moment";
import {IncidentsListItem} from "../../../model/IncidentsList";

export interface Payload {
    idContact: string
    contactCreatedByFast: boolean
    contactMediaType: MediaKind
    contactChannel: Channel
    contactMediaDirection: MediaDirection
    contactStartDate: string
    results: [FastrConclusion],
    idClient: string,
    idService: string,
    idAct?: string,
    iccId: string
    motif
}

export interface FormChanges {
    clientRequest?: string,
    conclusion?: string,
    processing?: boolean,
    noteDescription?: string,
    data?: Array<CaseDataProperty>
    additionalDataValid?: boolean
    caseStatus?: Status
    incident?: GenericIncident
}

export interface Props extends RouteComponentProps<Params> {
    retrievedCase: Case
    isFormsyValid: boolean
    toggleBlockingUI: () => void
    fetchAndStoreCase: (id) => void
    fetchAndStoreCaseQualification: (id) => void
    setIsUpdateModeEnabledToTrue: () => void
    setScalingEligibilityFalse: () => void
    setIsCurrentUserEliToUpdateImmediateCase: (value: boolean) => void,
    setScalingEligibilityTrue: () => void
    setScaledCaseIsNotEligibleToModification: () => void
    setScaledCaseIsEligibleToModification: () => void
    setQualificationSelected: () => void
    setIsCurrentOwner: (value: boolean) => void
    setIsRecentCasesListDisplayed: (value: boolean) => void
    setUpdateModeToTrue: () => void
    setUpdateModeToFalse: () => void
    currentCaseQualification: CasesQualificationSettings
    match
    authorizations
    location
    fetchAndStoreClient: (clientId: string, serviceId: string, howToLoad: DataLoad) => void
    settingValidRoutingResult: (rule: CaseRoutingRule) => void
    toggleModal: () => void
    addNoteCase: (note: AddNoteRequestDTO, id: string) => void
    validRoutingRule: CaseRoutingRule
    revertScalingCaseMode: boolean
    updateCase: (caseUpdated: CaseUpdateDTO, id: string) => void
    storeCase: (caseToStore: Case) => void
    storingAditionalData: (currentCase: Case) => void
    setIsWithAutoAssignFalse: () => void
    setOnlyNoteToFalse: () => void
    setFormsyIsValid: () => void
    setFormsyIsInvalid: () => void
    setAdgFailureReason: (errorMessage: string) => void
    finishingTreatment: boolean
    setIsCurrentUserEliToAutoAssign: (value: boolean) => void
    fetchAndStoreAuthorizations: (sessionId: string) => void
    fetchAndStoreUserActivity: (sessionId: string) => void
    isCurrentOwner: boolean,
    addContact: boolean
    setCaseMotif: (motif) => void
    matchingCase
    setCaseQualification: (code) => void
    setQualificationLeaf: (qualificationLeaf) => void
    setAddContactToTrue: () => void
    setAddContactToFalse: () => void
    boucleADG: boolean
    initMaxwellProcess: () => void
    openMaxwellModal: () => void
    hideMaxwellModalProcesses: () => void
    showMaxwellModalProcesses: () => void
    allowMaxwellModalClosing: () => void
    dontAllowMaxwellModalClosing: () => void
    beginCreatingMaxwellCase: () => void
    creatingMaxwellCaseOk: () => void
    creatingMaxwellCaseKO: () => void
    setCurrentContactId: (value) => void
    setPayload: (value) => void
    createTroubleTicket
    uploadMaxwellFiles
    setDisplayCancelButton
    retentionSetting
    retentionRefusSetting
    antiChurnSetting
    storedPayload?
    idADG?
    disRcAdgMotif: CaseQualification
    idActDisRC: string
    setDisplayGridADGForDISRC
    caseQualification
    isCurrUserObligedToReQualifyImmediateCase: boolean
    currentContactId: string
    setFinishingTreatmentToTrue: () => void
    setFinishingTreatmentToFalse: () => void
    getOrFetchContact: (contactId: string, alreadyLoadedContacts: Map<string, ContactWrapper>, callback?) => void
    alreadyLoadedContacts: Map<string, ContactWrapper>
    setAdditionalData: (additionalData) => void
    fetchActivationFlags: () => void
    activationFlags,
    setIncidentsList: (incidentsList: Array<IncidentsListItem>) => void
}

interface Params {
    id: string
}

interface State {
    currentPayload
}

type PropType = ClientContextProps<Service> & CasePageState & ModalState

// tslint:disable-next-line:no-any
class ViewCasePage extends FastrPayloadPage<Props & PropType, State, Payload, Params> {

    private ModalMaxwell = lazy(() => import("../Create/ModalMaxwell"));
    private CaseManagerModal = lazy(() => import("../../../components/Modals/CaseManagerModal"));
    private CaseEditModal = lazy(() => import("./Edit/CaseEditModal"));
    private Media = lazy(() => import("../Components/Contacts/Media"));
    private CardForADGInsideCase = lazy(() => import( "../../Acts/CardForADGInsideCase"));
    private ADGWrapper = lazy(() => import( "../Components/ADGWrapper"));
    private EditRetentionCard = lazy(() => import("../../Acts/Retention/EditRetentionCard"));
    private AntiChurnCard = lazy(() => import("../../Acts/AntiChurn/AntiChurnCard"));
    private maxwellIncidentList = lazy(() => import("../Components/IncidentsListV1"));

    private submitBtnRef: React.RefObject<HTMLButtonElement> = React.createRef<HTMLButtonElement>();
    // tslint:disable-next-line:no-any
    private refToFormsy?: React.RefObject<any> = React.createRef();
    private caseService: CaseService = new CaseService(true);

    constructor(props) {
        super(props);
        // if storedPayload is set -> DISRC
        const selectedPayload = this.props.storedPayload ? this.props.storedPayload : this.payload;
        this.state = {
            currentPayload: selectedPayload
        }
    }

    public getValuesFromFields = () => this.refToFormsy!.current.getModel()

    public componentWillMount = async () => {
        // check for session ID and init array of authorizations
        let currentSessionId: string | undefined;
        try {
            currentSessionId = queryString.parse(this.props.location.search.replace("?", "")).sessionId.toString();
        } catch (e) {
            currentSessionId = SessionService.getSession();
        }
        if (currentSessionId === undefined) {
            currentSessionId = ""
        }
        if (!this.props.activationFlags || !this.props.activationFlags.length) {
            await this.props.fetchActivationFlags()
        }
        await this.props.fetchAndStoreAuthorizations(currentSessionId);
        await this.props.fetchAndStoreUserActivity(currentSessionId);
        this.props.setCurrentContactId(this.state.currentPayload.idContact);
    };

    public componentDidMount = async () => {
        try {
            this.props.toggleBlockingUI();
            !this.props.idActDisRC ? this.props.fetchAndStoreClient(this.state.currentPayload.idClient, this.state.currentPayload.idService, DataLoad.ALL_SERVICES)
                : this.props.fetchAndStoreClient(this.state.currentPayload.idClient, this.state.currentPayload.idService, DataLoad.ALL_SERVICES)

            if (this.props.matchingCase) {
                await this.props.fetchAndStoreCase(this.props.matchingCase.caseId);
            } else {
                await this.props.fetchAndStoreCase(this.props.match.params.id);
            }

            if (this.props.retrievedCase.finishingTreatmentConclusion) {
                this.props.setFinishingTreatmentToTrue()
            } else {
                this.props.setFinishingTreatmentToFalse()
            }

            await this.props.storingAditionalData(this.props.retrievedCase);
            this.props.setCaseMotif(this.props.retrievedCase.qualification);

            let rightMotif = this.state.currentPayload.idAct ? this.state.currentPayload.motif : "";
            if (!rightMotif && this.props.disRcAdgMotif && this.props.disRcAdgMotif.code !== "") {
                rightMotif = this.props.disRcAdgMotif
            }

            if (rightMotif) {
                const caseQualification: CasesQualificationSettings = await this.caseService.getCaseQualifSettings(rightMotif.code);
                this.props.setCaseQualification(caseQualification);
                this.props.setCaseMotif(rightMotif)
            }
            try {
                await this.props.fetchAndStoreCaseQualification(this.props.retrievedCase.qualification.code)
            } catch (e) {
                NotificationManager.warning(<FormattedMessage id="cases.qualification.settings.warning"/>);
                if (this.props.retrievedCase.category !== "SCALED") {
                    this.props.toggleBlockingUI(); // blocks access to update function ("Modifier" button) -> no action available to switch back the access
                }
            }
            this.props.toggleBlockingUI();
            if (_.get(this.props.currentCaseQualification, "isLeaf")) {
                this.props.setQualificationLeaf(this.props.currentCaseQualification);
                this.props.setQualificationSelected();

                if (this.props.currentCaseQualification.data && this.props.retrievedCase.data.length === 0) {
                    this.props.setAdditionalData(this.props.currentCaseQualification.data);
                }
            }
            // if contact not already filled
            await this.props.getOrFetchContact(this.props.currentContactId, this.props.alreadyLoadedContacts, () => {
                const targetContact = this.props.alreadyLoadedContacts.get(this.props.currentContactId);
                if (targetContact?.isContactComplete) {
                    this.props.setAddContactToFalse()
                } else {
                    this.props.setAddContactToTrue()
                }
            });
            this.fetchIncidentsList()
        } catch (error) {
            console.error(error);
        }

        await this.settingScalingPossibility();
        await this.settingEligibilityModification();
        this.canUserAccessEditMode();
    };

    public isCaseForLandLine = (retrievedCase) => {
        return retrievedCase.offerCategory === "FIXE"
    }
    // scnario where we can access edit mode of current case (edit on URL)
    // check if we can update case IMMEDIATE/SCALED before entering edit mode
    // authorization isActiviteBeB is to replace isUpdateEnabled jira FASTRDEV-214
    // WARNING for Immediate Cases
    public canUserAccessEditMode() {
        const {location} = this.props;
        const currentCase = this.props.retrievedCase
        const isCCELiUpdateScaledCase = currentCase.category === CaseCategory.SCALED &&
            !currentCase.incident && this.props.isCurrUserEliToUpdateScaledCase &&
            (this.props.authorizations.indexOf("isActiviteBeB") !== -1 || (this.props.authorizations.indexOf("isActiviteBeB") !== -1 && this.isCaseForLandLine(this.props.retrievedCase)))
        if (location.search.includes("edit") && this.props.retrievedCase.status !== 'CLOSED') {
            if ((currentCase.category === CaseCategory.IMMEDIATE) || isCCELiUpdateScaledCase) {
                this.props.setUpdateModeToTrue();
                if (this.state.currentPayload.fromdisrc && !this.props.boucleADG) {
                    this.props.setIsCurrentUserEliToUpdateImmediateCase(true);
                }
            }
        } else {
            this.props.setUpdateModeToFalse()
        }

    }

    public settingScalingPossibility = async () => {
        if (this.props.currentCaseQualification !== undefined && this.props.retrievedCase.category !== CaseCategory.SCALED) {
            try {
                await this.motifContainAtLeastOneThemeWithRoutingRules(this.props.currentCaseQualification.code);
            } catch (error) {
                NotificationManager.error(<FormattedMessage id="cases.scaling.possibility.error"/>);
            }
        }
    };

    public async motifContainAtLeastOneThemeWithRoutingRules(qualifCode: string) {
        return await this.caseService.atLeastOneThemeContainRoutingRule(qualifCode, this.props.retrievedCase.serviceType) ?
            this.props.setScalingEligibilityTrue()
            : this.props.setScalingEligibilityFalse()
    }

    public settingEligibilityModification = async () => {
        const retrievedCase = this.props.retrievedCase;
        if (!retrievedCase || !retrievedCase.category || retrievedCase.category === CaseCategory.IMMEDIATE) {
            return
        }
        if (retrievedCase.category === CaseCategory.SCALED) {
            const {caseOwner} = this.props.retrievedCase;
            if (caseOwner && caseOwner.perId && caseOwner.perId !== "") {
                this.props.setIsCurrentOwner(false)
                try {
                    this.props.setIsCurrentOwner(await this.caseService.isCurrentUserTheOwner(caseOwner.login))
                } catch (error) {
                    NotificationManager.error(<FormattedMessage id="cases.scaling.check.case.belonging.error"/>);
                }
            } else {
                this.props.setScaledCaseIsNotEligibleToModification()
            }
        }

    }

    public handleUpdateFormChanges = (formChanges) => {
        if (this.props.retrievedCase) {
            if (formChanges.conclusion) {
                this.props.storeCase({...this.props.retrievedCase, processingConclusion: formChanges.conclusion})
            }
            if (formChanges.clientRequest) {
                this.props.storeCase({...this.props.retrievedCase, clientRequest: formChanges.clientRequest})
            }
            if (formChanges.data) {
                this.props.storeCase({...this.props.retrievedCase, data: formChanges.data})
            }
            if (formChanges.caseStatus) {
                this.props.storeCase({...this.props.retrievedCase, status: formChanges.caseStatus})
            }
        }
    };

    public handleSubmitOfTheForm = async () => {
        const node = this.submitBtnRef.current;
        if (node) {
            node.click()
        }
    }

    public checkCaseOrThrowError(caseToCheck ?: Case): Case {
        if (!caseToCheck) {
            NotificationManager.error(translate.formatMessage({id: "case.not.found"}));
            throw new Error(translate.formatMessage({id: "case.not.found"}));
        } else {
            return caseToCheck;
        }
    }

    public handleDISRCVariables = () => {
        // used only for disrc grid adg
        this.props.setDisplayGridADGForDISRC(true)
        this.props.setIsRecentCasesListDisplayed(true);
        //this.props.setUpdateModeToFalse();
    }


    public updateCase = async (dto: AddNoteRequestDTO, idTransaction: string, withError: boolean) => {
        // Quand on est dans le cas de la boucle ADG (càd qu'on a rajouté un ADG dans le dossier), Il faut bypasser l'enregistrement du dossier, on laisse le Formsy dans CardForADGInsideCase s'occuper de l'enregistrement
        // L'enregistrement de l'ADG doit se faire en amont de l'enregistrement du dossier. On récupère ensuite son id pour le mettre dans les ressources du dossier
        try {
            const currentCase: Case = this.checkCaseOrThrowError(this.props.retrievedCase);
            const {addContact} = this.props;

            if (!this.props.updateMode) {
                if (idTransaction && idTransaction !== "") {
                    dto.actTransactionIds = [];
                    dto.actTransactionIds.push(idTransaction)
                }
                dto.caseId = currentCase.caseId;

                if (dto.doNotResolveBeforeDate) {
                    currentCase.doNotResolveBeforeDate = DateUtils.toGMT0ISOString(moment(dto.doNotResolveBeforeDate));
                } else {
                    currentCase.doNotResolveBeforeDate = null;
                }

                /*_______________________Note__________________________*/
                dto.type = "NOTE";
                dto.contact.channel = this.state.currentPayload.contactChannel;
                dto.contact.clientId = this.state.currentPayload.idClient;
                dto.contact.serviceId = this.state.currentPayload.idService;

                if (addContact) {
                    dto.contact.contactId = this.props.currentContactId;
                } else {
                    dto.contact.media = {type: "SANS_CONTACT", direction: "SANS_CONTACT"};
                }
                await this.props.addNoteCase(dto, dto.caseId);

            } else {
                // Scaling from Immediate
                handleScalingBusinessLogic(currentCase, dto, this.props)

                // Contact + Note
                const caseNote: CaseNote = ({
                    type: "NOTE",
                    description: dto.description,
                });
                caseNote.contact = {
                    channel: this.state.currentPayload.contactChannel,
                    contactId: this.props.currentContactId,
                    clientId: this.state.currentPayload.idClient,
                    serviceId: this.state.currentPayload.idService,
                    media: {type: "", direction: ""}
                }
                if (addContact && dto.contact.media) {
                    caseNote.contact.media = dto.contact.media;
                } else {
                    caseNote.contact.media = {type: "SANS_CONTACT", direction: "SANS_CONTACT"};
                }
                currentCase.notes.push(caseNote);
                if (dto.callTransfer && !!dto.callTransfer.transferOk) {
                    currentCase.processingConclusion = dto.processingConclusion;
                }
                if (dto.callTransfer && dto.callTransfer.active) {
                    dto.callTransfer.initialContactId = this.props.currentContactId;
                }

                // Requalif
                if (this.props.caseQualification && this.props.caseQualification.code !== currentCase.qualification.code) {
                    currentCase.qualification = this.props.caseQualification;
                }

                // set AdditionalData from the redux store
                if (this.props.additionDataOfQualifsAndTheme) {
                    currentCase.data = this.props.additionDataOfQualifsAndTheme
                }

                if (dto.doNotResolveBeforeDate) {
                    currentCase.doNotResolveBeforeDate = DateUtils.toGMT0ISOString(moment(dto.doNotResolveBeforeDate));
                } else {
                    currentCase.doNotResolveBeforeDate = null;
                }

                // ADG
                const actTransactionToExecuteIds: string[] = [];
                if (idTransaction && idTransaction !== "") {
                    actTransactionToExecuteIds.push(idTransaction)
                }
                const caseToSend: CaseUpdateDTO = {
                    caseToUpdate: currentCase,
                    actTransactionIds: actTransactionToExecuteIds,
                    autoAssign: this.props.isWithAutoAssign,
                    callTransfer: dto.callTransfer,
                    revertScaledToImmediate: currentCase.category === CaseCategory.SCALED && this.props.revertScalingCaseMode,
                    processing: this.props.retrievedCase.processing
                };

                caseToSend.actBodys = []
                // retention
                if (dto.retentionDataForm && !dto.retentionDataForm.isConsultation) {
                    const retentionActBody: FASTRAct<Act> | undefined = formatDataForRetentionChange(dto, this.props.retentionSetting, this.props.retentionRefusSetting, this.state.currentPayload)
                    if (retentionActBody) {
                        caseToSend.actBodys.push(retentionActBody)
                    }
                }

                // antiChurn
                if (dto.antiChurnDataForm && !dto.antiChurnDataForm.isConsultation) {
                    const antiChurnActBody: FASTRAct<Act> | undefined = formatDataForAntiChurnChange(dto, this.props.antiChurnSetting, this.state.currentPayload)
                    if (antiChurnActBody) {
                        caseToSend.actBodys.push(antiChurnActBody)
                    }
                }

                if (isMaxwellCase(dto)) {
                    this.initMaxwellProcessesUpdate()

                    // TICKET CREATION
                    const res: TroubleTicketResponse = await this.createTroubleTicket(currentCase, dto);

                    if (this.props.ticketCreationProcess && isProcessOK(this.props.ticketCreationProcess.state)) {
                        this.handleProcessesAfterTicketModification(caseToSend, res);
                    } else if (this.props.ticketCreationProcess && isProcessKO(this.props.ticketCreationProcess.state)) {
                        this.allowMaxwellModalClosing()
                    }
                } else {
                    await this.props.updateCase(caseToSend, caseToSend.caseToUpdate.caseId)
                }
            } // Fin IF

            // withError true => transaction for the act has failed (so no adg) ; otherwise if idTransaction empty => only note (so no adg)
            const actResource: CaseResource | undefined = withError || idTransaction === "" ? undefined : CaseUtils.retrieveLastAdg(this.props.retrievedCase);

            withError = actResource ? !actResource.valid : withError;

            // const transferNotKo = _.get(dto.callTransfer, "transferOk", true);

            if (!isMaxwellCase(dto)) {
                if (this.props.isScalingMode && dto.receiverActivity) {
                    NotificationManager.success(`Dossier escaladé vers ${dto.receiverActivity.label}`)
                }
                this.postingSubmitMessageAndContact(withError);
            }

            // Has act failed after update ?
            if (actResource) {
                if (actResource.valid) {
                    NotificationManager.success(translate.formatMessage({id: "case.save.success"}))
                } else {
                    !!actResource.failureReason ? this.props.setAdgFailureReason(actResource.failureReason) : NotificationManager.error(translate.formatMessage({id: "adg.failed"}))
                }
            } else {
                if (this.props.finishingTreatment) {
                    NotificationManager.success(translate.formatMessage({id: "case.scaled.conclusion.success"}));
                } else if (!isMaxwellCase(dto)) {
                    NotificationManager.success(translate.formatMessage({id: "case.save.success"}));
                }
            }

            this.handleDISRCVariables();
        } catch (error) {
            this.props.toggleBlockingUI(); // only toggle block if error, the case page closes normally on success
            // TODO : Pop edits that failed
            return error.then((element: ErrorModel) => {
                NotificationManager.error(element.message, "");
                this.props.setIsWithAutoAssignFalse();
                if (element.status === 400) {
                    const submissionErrors: object = {};
                    element.fieldsErrors.forEach((validationError: FieldErrorModel) => {
                        _.set(submissionErrors, validationError.field, validationError.message);
                    });
                }
            });
        }
    };


    public createTroubleTicket = async (caseToUpdate: Case, formsyCase) => {
        try {
            return this.props.createTroubleTicket(buildTroubleTicketUpdateDto(caseToUpdate, formsyCase, this.state.currentPayload, this.props, this.props.motif));
        } catch (e) {
            NotificationManager.warning(<FormattedMessage
                id="cases.maxwell.error.ticket.creation.msg"/>);
            return getKoTroubleTicketResponse()
        }
    };


    public handleSubmit = async (form: AddNoteRequestDTO) => {
        if (this.props.boucleADG) {
            return
        }

        this.props.toggleBlockingUI();
        if (!this.props.updateMode) {
            this.props.toggleModal();
        }
        let withError = false;
        let executeAdgResponse: TransactionDTO = {idTransaction: ""};

        // If there is an adg and the user doesn't only add a note, submit the adg
        if ((this.state.currentPayload.idAct || this.props.idActDisRC) && !this.props.isOnlyNote) {
            const transactionService = new ADGDataDispatcher();
            let adaptedIdAct = ""
            let caseId = ""

            let adaptedPayload = this.state.currentPayload
            if (this.state.currentPayload.idAct) {
                adaptedIdAct = this.state.currentPayload.idAct
                caseId = this.props.match.params.id
            } else {
                adaptedIdAct = this.props.idActDisRC
                caseId = this.state.currentPayload.idCase
                adaptedPayload = this.state.currentPayload
            }
            try {
                executeAdgResponse = await transactionService.startWorking(form, adaptedPayload, adaptedIdAct, this.props.client, caseId);
            } catch (error) {
                withError = true;
            }
            await this.updateCase(form, executeAdgResponse.idTransaction, withError);
            this.props.setOnlyNoteToFalse()
        } else {
            await this.updateCase(form, executeAdgResponse.idTransaction, false)
        }
        this.props.toggleBlockingUI();
    };


    // MAXWELL
    public initMaxwellProcessesUpdate = () => {
        this.props.initMaxwellProcess();
        this.props.openMaxwellModal();
        this.props.showMaxwellModalProcesses()
    };

    public allowMaxwellModalClosing = () => {
        this.props.allowMaxwellModalClosing()
    };

    public handleProcessesAfterTicketModification = async (caseToSend: CaseUpdateDTO, res: TroubleTicketResponse) => {
        this.props.beginCreatingMaxwellCase();
        caseToSend.caseToUpdate.incident = buildInitalCaseIncident(res);
        // MAXWELL CASE CREATION
        await this.props.updateCase(caseToSend, caseToSend.caseToUpdate.caseId);

        const {retrievedCase} = this.props;
        if (retrievedCase.incident && retrievedCase.incident.ticketId) {
            await this.props.creatingMaxwellCaseOk()
        } else {
            await this.props.creatingMaxwellCaseKO()
        }
        if (isProcessOK(this.props.maxwellCaseCreationProcess)) {
            if (this.props.uploadedFiles) {
                // FILES UPLOAD
                await this.props.uploadMaxwellFiles(this.props.uploadedFiles, retrievedCase.caseId, this.props.ticketCreationProcess.idTicket);
            }
            this.postingSubmitMessageAndContact(retrievedCase.caseId)

        } else if (isProcessKO(this.props.maxwellCaseCreationProcess)) {
            this.allowMaxwellModalClosing()
        }
    };

    public postingSubmitMessageAndContact = (withError) => {
        FastService.postSubmitMessage({
            idCase: this.props.retrievedCase.caseId,
            contact: this.buildFastrContactModification(this.props.retrievedCase.contacts, this.state.currentPayload, this.props.addContact),
            error: withError,
            serviceId: !this.props.idActDisRC ? this.state.currentPayload.idService : this.state.currentPayload.idService,
            shouldntClose: this.props.isWithAutoAssign
        });

        this.props.setUpdateModeToTrue();
        this.props.setIsWithAutoAssignFalse()
    }


    public cantSubmit = () => {
        if (!this.props.boucleADG) {
            NotificationManager.error(translate.formatMessage({id: "missing.data.or.incomplete"}))
        }
    };

    public onFormsyValid = () => {
        if (!this.props.isFormsyValid) {
            this.props.setFormsyIsValid()
        }
    };

    public onFormsyInValid = () => {
        if (this.props.isFormsyValid) {
            this.props.setFormsyIsInvalid()
        }
    };

    public buildFastrContactCreation(contacts: Contact[], payload: Payload) {

        let shouldContactbeCreatedInFast = false;

        if (!payload.contactCreatedByFast && contacts && contacts.length) {
            shouldContactbeCreatedInFast = true;
        }
        const contactFastr = contacts[0];

        return {
            idContact: contactFastr ? contactFastr.contactId : "",
            mediaType: contactFastr && contactFastr.media ? contactFastr.media.type : "",
            mediaDirection: contactFastr && contactFastr.media ? contactFastr.media.direction : "",
            contactStartDate: contactFastr ? contactFastr.startDate : "",
            contactCreationDate: contactFastr ? contactFastr.createdDate : "",
            shouldBeCreatedInFast: shouldContactbeCreatedInFast
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

    public onMessage = (caseFromKafka) => {
        const eventArraySortedByDate = caseFromKafka.events.sort((a, b) => {
            a = new Date(a.date).getTime();
            b = new Date(b.date).getTime();
            return a > b ? -1 : a < b ? 1 : 0;
        });
        caseFromKafka.events = eventArraySortedByDate
        if (caseFromKafka.events[0].type === "ADD_ADG") {
            this.props.setDisplayCancelButton(false)
        }
        this.props.storeCase(caseFromKafka)
    }

    public renderRetentionSection = () => {
        if (!this.props.client || !this.props.client.service) {
            return <React.Fragment/>
        }
        const lastRetentionResource = retrieveLastResource(this.props.retrievedCase, "ACT_FASTR", ACT_ID.ADG_RETENTION);
        if (!this.props.authorizations.includes(ACT_ID.ADG_RETENTION) || !this.props.updateMode) {
            return lastRetentionResource ?
                <AdgFastrViewSection resourceType={"ACT_FASTR"} resourceDescription={ACT_ID.ADG_RETENTION}
                                     opened={this.props.authorizations.includes(ACT_ID.ADG_RETENTION)}/> :
                <React.Fragment/>
        }

        return (
            <React.Suspense fallback={<Loading/>}>
                <this.EditRetentionCard lastResource={lastRetentionResource}/>
            </React.Suspense>
        )
    }

    public renderAntiChurnSection = () => {
        if (!this.props.client || !this.props.client.service) {
            return <React.Fragment/>
        }
        const lastAntiChurnResource = retrieveLastResource(this.props.retrievedCase, "ACT_FASTR", ACT_ID.ADG_ANTICHURN);
        if (!this.props.authorizations.includes(ACT_ID.ADG_ANTICHURN) || !this.props.updateMode) {
            return lastAntiChurnResource ?
                <AdgFastrViewSection resourceType={"ACT_FASTR"} resourceDescription={ACT_ID.ADG_ANTICHURN}
                                     opened={this.props.authorizations.includes(ACT_ID.ADG_ANTICHURN)}/> :
                <React.Fragment/>
        }

        return (
            <React.Suspense fallback={<Loading/>}>
                <this.AntiChurnCard lastResource={lastAntiChurnResource}/>
            </React.Suspense>
        )
    }


    public fetchIncidentsList = async () => {
        try {
            const incidentsArr : Array<IncidentsListItem> = await this.caseService.getIncidentsList(this.props.retrievedCase.caseId)
            if(incidentsArr && incidentsArr.length > 0) {
                this.props.setIncidentsList(incidentsArr)
            }
        } catch (e) {
            const error = await e;
            console.error(error)
        }
    }


    public CaseIncidentsListSection = () => {
        try {
            const incidentsArr = this.props.incidentsList
            if(incidentsArr?.length > 0) {
                return <this.maxwellIncidentList incidents={incidentsArr}/>
            } else {
                return <React.Fragment/>
            }
        } catch (e) {
            return <React.Fragment/>
        }
    }

    public render = () => {
        let rightIdAct = this.state.currentPayload.idAct
        if (!rightIdAct && this.props.idActDisRC) {
            rightIdAct = this.props.idActDisRC
        }

        const {retrievedCase} = this.props;
        const isCaseScaled = retrievedCase?.category === CaseCategory.SCALED && !this.props.revertScalingCaseMode;
        const isAgentRetention = this.props.authorizations.includes(ACT_ID.ADG_RETENTION);
        const isCurrentUserTheCaseOwner = retrievedCase?.caseOwner.login === retrievedCase?.caseCreator?.login

        let allowAdgBlock;
        if (isCaseScaled && isAgentRetention && !isCurrentUserTheCaseOwner) {
            allowAdgBlock = false;
        } else {
            allowAdgBlock = true;
        }

        if (this.props.retrievedCase) {
            return (
                <div>
                    <SockJsClient url={process.env.REACT_APP_FASTR_API_URL + "/fastr-cases/subscribe-dossier/"}
                                  topics={["/topic/subscribeDossier-" + this.props.retrievedCase.caseId]}
                                  onMessage={this.onMessage}/>
                    {this.props.showModalForCaseManagerState &&
                    <React.Suspense fallback={<Loading/>}>
                        <this.CaseManagerModal
                            modalTitle={translate.formatMessage({id: "cases.resolution.dunning.modal.title"})}
                            payload={this.state.currentPayload}/>
                    </React.Suspense>
                    }

                    {this.props.showModalForMaxwellProcess &&
                    <React.Suspense fallback={<Loading/>}>
                        <this.ModalMaxwell payload={this.state.currentPayload}
                                           canBeClosed={this.props.maxwellModalCanBeClose}
                                           idCase={this.props.retrievedCase.caseId}/>
                    </React.Suspense>
                    }

                    <Formsy onValidSubmit={this.handleSubmit} onInvalidSubmit={this.cantSubmit}
                            onValid={this.onFormsyValid} onInvalid={this.onFormsyInValid}
                            ref={this.refToFormsy}>
                        {this.props.showModal &&
                        <React.Suspense fallback={<Loading/>}>

                            <this.CaseEditModal payload={this.state.currentPayload}
                                                onSubmit={this.handleSubmitOfTheForm}
                                                getValuesFromFields={this.getValuesFromFields}
                                                idAct={this.state.currentPayload.idAct}/>
                        </React.Suspense>
                        }
                        <ViewCaseNavBar location={this.props.location} idService={this.state.currentPayload.idService}/>
                        <InfoBar qualification={this.props.qualificationLeaf}/>
                        {this.props.client.data &&
                        <QualificationScalingSelection context="ViewCasePage"
                                                       shouldStartWithRequalif={this.props.isCurrUserObligedToReQualifyImmediateCase}
                                                       getValuesFromFields={this.getValuesFromFields}/>
                        }
                        <ClientRequestAndNote idAct={this.state.currentPayload.idAct}
                                              handleFormChanges={this.handleUpdateFormChanges}/>

                        {this.renderRetentionSection()}

                        {this.renderAntiChurnSection()}

                        {this.CaseIncidentsListSection()}

                        {this.props.updateMode && this.props.authorizations.indexOf("isADGIntoDir") !== -1 && !rightIdAct &&
                        <React.Suspense fallback={<Loading/>}>
                            {allowAdgBlock &&
                            <this.CardForADGInsideCase payload={this.state.currentPayload}
                                                       getValuesFromFields={this.getValuesFromFields}
                                                       context="ViewCasePage"/>
                            }
                        </React.Suspense>
                        }

                        {rightIdAct ?
                            <React.Suspense fallback={<Loading/>}>
                                <this.ADGWrapper
                                    getValuesFromFields={this.getValuesFromFields}
                                    payload={this.state.currentPayload}
                                    handleUpdateFormChanges={this.handleUpdateFormChanges}
                                />
                            </React.Suspense> : <React.Fragment/>
                        }
                        {this.props.updateMode &&
                        <React.Suspense fallback={<Loading/>}>
                            <GenericCardToggle title={"cases.create.contact"} icon={"icon-user"}>
                                <this.Media payload={this.state.currentPayload}
                                            onNewContact={this.updateCurrentContactId}
                                            idAct={this.state.currentPayload.idAct}
                                            currentContactId={this.props.currentContactId}
                                            handleFormChanges={this.handleUpdateFormChanges}
                                            shouldDisplayTransfer={true}/>
                            </GenericCardToggle>
                        </React.Suspense>
                        }
                        <CaseConclusionViewCase handleUpdateFormChanges={this.handleUpdateFormChanges}
                                                payload={this.state.currentPayload}/>
                        <CaseHistory/>
                        <button id="viewCasePage.submitBtnRef.button.id" type="submit" hidden={true}
                                ref={this.submitBtnRef}/>
                    </Formsy>
                </div>
            )
        } else {
            return (<Loading/>)
        }
    }

    private updateCurrentContactId = async () => {
        this.props.setCurrentContactId(await this.caseService.getNextContactSequence());
    }
}

const mapDispatchToProps = {
    toggleBlockingUI,
    fetchAndStoreCase,
    fetchAndStoreCaseQualification,
    updateCase,
    storeCase,
    addNoteCase,
    fetchAndStoreClient,
    fetchAndStoreAuthorizations,
    fetchAndStoreUserActivity,
    setIsCurrentOwner,
    setIsUpdateModeEnabledToTrue,
    setUpdateModeToTrue,
    setUpdateModeToFalse,
    setScalingEligibilityTrue,
    setScalingEligibilityFalse,
    setIsCurrentUserEliToUpdateImmediateCase,
    setFormsyIsValid,
    setFormsyIsInvalid,
    toggleModal,
    setIsWithAutoAssignFalse,
    setOnlyNoteToFalse,
    setAdgFailureReason,
    setScaledCaseIsEligibleToModification,
    setScaledCaseIsNotEligibleToModification,
    setCaseMotif,
    setIsCurrentUserEliToAutoAssign,
    setCaseQualification,
    setQualificationLeaf,
    setAddContactToTrue,
    setAddContactToFalse,
    openMaxwellModal,
    initMaxwellProcess,
    dontAllowMaxwellModalClosing,
    allowMaxwellModalClosing,
    hideMaxwellModalProcesses,
    showMaxwellModalProcesses,
    createTroubleTicket,
    creatingMaxwellCaseOk,
    creatingMaxwellCaseKO,
    beginCreatingMaxwellCase,
    uploadMaxwellFiles,
    storingAditionalData,
    setDisplayCancelButton,
    setDisplayGridADGForDISRC,
    setQualificationSelected,
    setCurrentContactId,
    setFinishingTreatmentToTrue,
    setFinishingTreatmentToFalse,
    getOrFetchContact,
    setAdditionalData,
    setIsRecentCasesListDisplayed,
    setPayload,
    fetchActivationFlags,
    setIncidentsList
};

const mapStateToProps = (state: AppState) => ({
    addContact: state.casePage.addContact,
    additionDataOfQualifsAndTheme: state.casePage.additionDataOfQualifsAndTheme,
    adgFailureReason: state.casePage.adgFailureReason,
    authorizations: state.authorization.authorizations,
    boucleADG: state.casePage.boucleADG,
    client: state.client,
    caseQualification: state.casePage.qualification,
    currentCaseQualification: state.case.currentCaseQualification,
    currentContactId: state.casePage.currentContactId,
    disRcAdgMotif: state.casePage.disRcAdgMotif,
    finishingTreatment: state.casePage.finishingTreatment,
    idActDisRC: state.casePage.idActDisRC,
    incidentSelected: state.casePage.incidentSelected,
    isCurrentOwner: state.casePage.isCurrentOwner,
    isCurrUserEliToUpdateImmediateCase: state.casePage.isCurrUserEliToUpdateImmediateCase,
    isCurrUserEliToUpdateScaledCase: state.casePage.isCurrUserEliToUpdateScaledCase,
    isCurrUserObligedToReQualifyImmediateCase: state.casePage.isCurrUserObligedToReQualifyImmediateCase,
    isCurrUserEliToUpdateMandatoryADGForCurrentCase: state.casePage.isCurrUserEliToUpdateMandatoryADGForCurrentCase,
    isFormCompleted: state.casePage.isFormCompleted,
    isFormsyValid: state.casePage.isFormsyValid,
    isOnlyNote: state.casePage.isOnlyNote,
    isScalingMode: state.casePage.isScalingMode,
    isWithAutoAssign: state.casePage.isWithAutoAssign,
    matchingCase: state.recentCases.matchingCaseFound,
    maxwellCaseCreationProcess: state.casePage.maxwellCaseCreationProcess,
    maxwellModalCanBeClose: state.casePage.maxwellModalCanBeClose,
    motif: state.casePage.motif,
    retentionRefusSetting: state.retention.retentionRefusSetting,
    retentionSetting: state.retention.retentionSetting,
    antiChurnSetting: state.antiChurn.antiChurnSettings,
    retrievedCase: state.case.currentCase,
    revertScalingCaseMode: state.casePage.revertScalingCaseMode,
    showModal: state.casePage.showModal,
    showModalForCaseManagerState: state.modalManager.showModalForCaseManagerState,
    showModalForMaxwellProcess: state.casePage.showModalForMaxwellProcess,
    storedPayload: state.payload.payload,
    theme: state.casePage.theme,
    ticketCreationProcess: state.casePage.ticketCreationProcess,
    updateMode: state.casePage.updateMode,
    uploadedFiles: state.casePage.uploadedFiles,
    validRoutingRule: state.casePage.validRoutingRule,
    alreadyLoadedContacts: state.casePage.alreadyLoadedContacts,
    activationFlags: state.activationFlag.activationFlags,
    incidentsList: state.casePage.incidentsList
})

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ViewCasePage)
