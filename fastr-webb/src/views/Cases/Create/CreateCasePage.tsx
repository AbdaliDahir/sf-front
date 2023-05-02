import Formsy from "formsy-react";
import * as _ from "lodash"
import * as moment from "moment";
import React, {lazy} from 'react';
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Redirect, RouteComponentProps, withRouter} from "react-router";
import {Container,} from "reactstrap";
import {compose} from "redux";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import FastrPayloadPage from "../../../components/Pages/FastrPayloadPage";
import {DataLoad} from "../../../context/ClientContext";
import {Activity} from "../../../model/Activity";
import {Case} from "../../../model/Case";
import {CaseCategory} from "../../../model/CaseCategory";
import {CaseDataProperty} from "../../../model/CaseDataProperty";
import {CaseQualification} from "../../../model/CaseQualification";
import {CaseResource} from "../../../model/CaseResource";
import {CaseRoutingRule} from "../../../model/CaseRoutingRule";
import {CasesQualificationSettings} from "../../../model/CasesQualificationSettings";
import {Channel} from "../../../model/Channel";
import {Contact, ContactWrapper} from "../../../model/Contact";
import {MaxwellProcess} from "../../../model/enums/MaxwellProcess";
import {GenericIncident} from "../../../model/GenericIncident";
import {MediaDirection} from "../../../model/MediaDirection";
import {MediaKind} from "../../../model/MediaKind";
import {Service} from "../../../model/service";
import {TicketCreationState} from "../../../model/TicketCreationState";
import {TroubleTicketRequest} from "../../../model/TroubleTicketRequest";
import {TroubleTicketResponse} from "../../../model/TroubleTicketResponse";
import ErrorModel from "../../../model/utils/ErrorModel";
import CaseService from "../../../service/CaseService";
import FastService from "../../../service/FastService";
import {AppState} from "../../../store";
import {
    fetchAndStoreAuthorizations,
    fetchAndStoreUserActivity,
    setFormsyIsInvalid,
    setFormsyIsValid,
    setHasCallTransfer,
    setUpdateModeToTrue,
    toggleBlockingUI
} from "../../../store/actions";
import {
    beginCreatingMaxwellCase,
    createTroubleTicket,
    creatingMaxwellCaseKO,
    creatingMaxwellCaseOk,
    getOrFetchContact,
    initMaxwellProcess,
    openMaxwellModal,
    setActivitySelected,
    setAddContactToFalse,
    setAddContactToTrue,
    setAdditionalData,
    setAdgFailureReason, setAutoAssignButtonDisabledFalse, setAutoAssignButtonDisabledTrue,
    setCaseMotif,
    setCaseMotifLoading,
    setCaseQualification,
    setCurrentContactId,
    setDisplayCancelButton,
    setDisplayGridADGForDISRC,
    setIsAutoAssign,
    setIsWithAutoAssignFalse,
    setScalingEligibilityFalse,
    setScalingEligibilityTrue,
    setValidRoutingRule,
    uploadMaxwellFiles,
} from "../../../store/actions/CasePageAction";
import {storeCase} from "../../../store/actions/CaseActions";
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import {
    fetchRecentCases,
    setIsRecentCasesListDisplayed,
    setMatchingCase
} from "../../../store/actions/RecentCasesActions";
import {CasePageState} from "../../../store/reducers/CasePageReducer";
import ClientContextProps, {ClientContext} from "../../../store/types/ClientContext";
import CaseUtils from "../../../utils/CaseUtils";
import {
    buildFastrContactCreation,
    buildInitalCaseIncident,
    buildTroubleTicketDto,
    getKoTroubleTicketResponse,
    isMaxwellCase,
    isProcessKO,
    isProcessOK
} from "../../../utils/MaxwellUtils";
import {handleNotificationSuccessMessage} from "../../../utils/ScalingUtils";
import CardForADGInsideCase from "../../Acts/CardForADGInsideCase";
import ADGWrapper from "../Components/ADGWrapper";
import CaseData from "../Components/CaseData/CaseData";
import QualificationScalingSelection from "../Components/Qualification/QualificationScalingSelection";
import CreateCaseConclusion from "./Components/CreateCaseConclusion";
import CaseDescription from "./Components/CaseDescription";
import CreateCaseNavBar from "./Components/CreateCaseNavBar";
import ModalMatchingCase from "./Components/ModalMatchingCase";
import {formatCase} from "./createCaseFormatAndSend";
import ModalMaxwell from "./ModalMaxwell";
import CaseHistory from "../Components/CaseHistory/CaseHistory";
import SockJsClient from 'react-stomp';
import {ACT_ID} from "../../../model/actId";
import Loading from "../../../components/Loading";
import {formatDataForRetentionChange} from "../../Acts/Retention/RetentionFormat";
import SessionService from "../../../service/SessionService";
import GenericCardToggle from "../../../components/Bootstrap/GenericCardToggle";
import {formatDataForAntiChurnChange} from "../../../model/acts/antichurn/AntiChurnFormat";
import FASTRAct from "../../../model/acts/FASTRAct";
import Act from "../../../model/acts/Act";
import {FastrConclusion} from "../../../model/FastrConclusion";
import {fetchActivationFlags} from "../../../store/ActivationFlagSlice";
import {fetchAndStoreApplicationInitialStateV2} from "../../../store/actions/v2/applicationInitalState/ApplicationInitalStateActions";
import {ApplicationInitialState} from "../../../model/ApplicationInitialState";

export interface Payload {
    idClient: string
    idService: string
    idCase: string
    idContact: string
    idAct?: string
    iccId: string
    motif: CaseQualification
    theme: CaseQualification
    offerCode: string
    contactCreatedByFast: boolean
    contactMediaType: MediaKind
    contactChannel: Channel
    contactMediaDirection: MediaDirection
    contactStartDate: string
    activite?: Activity
    fastTabId: string
    fromdisrc: boolean
    results: [FastrConclusion]
    fromQA?: boolean
}

type PropType = ClientContextProps<Service> & CasePageState

export interface CreateCaseProps extends RouteComponentProps<void> {
    payload
    client: ClientContext<Service>
    isFormsyValid: boolean
    fetchAndStoreClient: (idClient: string, idService: string, howToLoadClient: DataLoad) => void,
    toggleBlockingUI: () => void
    qualification: CasesQualificationSettings
    isLoadingQualification: boolean
    isLoadingMotif: boolean
    isScalingMode: boolean
    setCaseQualification: (qualification: CasesQualificationSettings) => void
    createTroubleTicket: (req: TroubleTicketRequest) => TroubleTicketResponse
    uploadMaxwellFiles
    setCaseMotif: (motif: CaseQualification) => void
    setAdditionalData: (additionalData) => void
    // tslint:disable-next-line:no-any
    additionDataOfQualifsAndTheme: Array<CaseDataProperty>
    setValidRoutingRule: (routingRule: CaseRoutingRule) => void
    setIsWithAutoAssignFalse: () => void
    setActivitySelected: (activity: Activity) => void
    location
    setScalingEligibilityTrue: () => void
    setScalingEligibilityFalse: () => void
    setIsAutoAssign: (value: boolean) => void
    setAdgFailureReason: (errorMessage: string) => void
    isWithAutoAssign: boolean
    validRoutingRule: CaseRoutingRule
    activitySelected: Activity
    setFormIsValid: () => void
    setFormIsInvalid: () => void
    setLoadingQualification: boolean
    addContact: boolean
    failedADG: boolean
    setFormsyIsValid: () => void
    setFormsyIsInvalid: () => void
    setAddContactToTrue: () => void
    setAddContactToFalse: () => void
    initMaxwellProcess: () => void
    setHasCallTransfer: (value: boolean) => void
    setIsRecentCasesListDisplayed: (value) => void
    matchingCase
    setMatchingCase
    setCaseMotifLoading
    qualifWasGivenInThePayload
    boucleADG: boolean
    ADGDoneByBoucleADG: boolean
    isMatchingCaseModalDisplayed: boolean
    incidentSelected: GenericIncident
    ticketCreationProcess: TicketCreationState
    maxwellCaseCreationProcess: MaxwellProcess
    uploadedFiles: File[]
    beginCreatingMaxwellCase: () => void
    creatingMaxwellCaseOk: () => void
    creatingMaxwellCaseKO: () => void
    fetchRecentCases: (idClient: string, idService: string) => void
    openMaxwellModal: () => void
    theme: CasesQualificationSettings
    isQualificationSelected: boolean
    authorizations
    currentCase
    fetchAndStoreAuthorizations: (sessionId: string) => {}
    fetchAndStoreUserActivity: (sessionId: string) => void
    processing: boolean
    storeCase
    setDisplayCancelButton
    antiChurnSetting
    retentionSetting
    retentionRefusSetting
    disRcAdgMotif: CaseQualification
    idActDisRC: string
    setDisplayGridADGForDISRC
    setCurrentContactId: (value) => void
    setUpdateModeToTrue: () => void
    currentContactId: string
    getOrFetchContact: (contactId: string, alreadyLoadedContacts: Map<string, ContactWrapper>, callback?) => void
    alreadyLoadedContacts: Map<string, ContactWrapper>
    fetchActivationFlags: () => void
    activationFlags
    fetchAndStoreApplicationInitialStateV2: () => void
    applicationInitialState: ApplicationInitialState
    setAutoAssignButtonDisabledTrue
    setAutoAssignButtonDisabledFalse
    isCurrUserObligedToReQualifyImmediateCase
}

interface State {
    force: boolean
    withError: boolean
    sessionId?
    showModalForMaxwellProcess: boolean
    maxwellModalCanBeClose: boolean
    currentPayload
    redirect?: JSX.Element
}

// tslint:disable-next-line:no-any
class CreateCasePage extends FastrPayloadPage<CreateCaseProps & PropType, State, Payload, void> {

    // tslint:disable-next-line:no-any
    private refToFormsy?: React.RefObject<any> = React.createRef()
    private caseService: CaseService = new CaseService(true)
    private EditRetentionCard = lazy(() => import("../../Acts/Retention/EditRetentionCard"));
    private AntiChurnCard = lazy(() => import("../../Acts/AntiChurn/AntiChurnCard"));
    private Media = lazy(() => import("../Components/Contacts/Media"));


    constructor(props: CreateCaseProps & PropType) {
        super(props)

        this.state = {
            force: false,
            withError: false,
            sessionId: undefined,
            showModalForMaxwellProcess: false,
            maxwellModalCanBeClose: false,
            // this.props.payload is set -> DISRC
            currentPayload: this.props.payload ? this.props.payload : this.payload
        }
    }

    public async componentWillMount() {
        let currentSessionId = SessionService.getSession();
        if (currentSessionId === undefined) {
            currentSessionId = ""
        }
        this.setState({sessionId: currentSessionId})
        this.props.setCurrentContactId(this.state.currentPayload.idContact);
        if (!this.props.activationFlags || !this.props.activationFlags.length) {
            await this.props.fetchActivationFlags()
        }
        await this.props.fetchAndStoreAuthorizations(currentSessionId)
        await this.props.fetchAndStoreUserActivity(currentSessionId)
        const {idClient, idService} = this.state.currentPayload;
        await this.props.fetchAndStoreClient(idClient, idService, DataLoad.ALL_SERVICES)
        await this.props.fetchRecentCases(idClient, idService);
    }

    public componentDidMount = async () => {

        await this.props.getOrFetchContact(this.state.currentPayload.idContact, this.props.alreadyLoadedContacts, () => {
            const targetContact = this.props.alreadyLoadedContacts.get(this.state.currentPayload.idContact);
            if (targetContact?.isContactComplete) {
                this.props.setAddContactToFalse()
            } else {
                this.props.setAddContactToTrue()
            }
        });
        if (!this.state.currentPayload?.idClient) {
            return
        }

        const {idClient, idService, motif, activite} = this.state.currentPayload

        await this.props.fetchRecentCases(idClient, idService);

        this.setState({force: this.props.location.search.includes("force")})
        await this.props.fetchAndStoreClient(idClient, idService, DataLoad.ALL_SERVICES);
        let rightMotif = motif

        if (!rightMotif) {
            rightMotif = this.props.disRcAdgMotif
        }

        if (rightMotif && rightMotif.code) {
            this.props.setCaseMotif(rightMotif)
            this.props.setCaseMotifLoading(false)
            try {
                await this.caseService.atLeastOneThemeContainRoutingRule(rightMotif.code, this.props.client.service!.serviceType) ?
                    this.props.setScalingEligibilityTrue() : this.props.setScalingEligibilityFalse()
            } catch (error) {
                NotificationManager.error(<FormattedMessage id="cases.create.scaling.get.themes.error"/>);
            }

            const caseQualification: CasesQualificationSettings = await this.caseService.getCaseQualifSettings(rightMotif.code);

            // update additionnal data of qualification
            if (caseQualification.data && caseQualification.data.length > 0) {
                caseQualification.data.forEach((dataElement: CaseDataProperty) => {
                    dataElement.category = "MOTIF"
                })
                this.props.setAdditionalData(caseQualification.data);
            }
            this.props.setCaseQualification(caseQualification)
            // store on State  Activity of case creator from payload
            if (activite && activite.code) {
                const activitySelected: Activity = {
                    code: activite.code,
                    label: activite.label
                }
                this.props.setActivitySelected(activitySelected)
            }
        }

        if (!this.state.currentPayload.fromQA && !this.state.currentPayload.fromdisrc && !this.props.applicationInitialState.clientRequestSetting) {
            this.props.fetchAndStoreApplicationInitialStateV2()
        }
    }

    public componentDidUpdate(prevProps, prevState: Readonly<State>, snapshot?: any) {
        if (this.props.payload.fromdisrc && prevProps.payload !== this.props.payload) { // should only affect DISRC, others use the this.payload (except QA...)
            this.setState({ // update the idCase
                currentPayload: this.props.payload
            })
        }
    }

    private handleDISRCVariables = () => {
        // used only for disrc grid adg
        this.props.setDisplayGridADGForDISRC(true)
        this.props.setIsRecentCasesListDisplayed(true);
        if (this.props.idActDisRC) {
            this.props.toggleBlockingUI();
        }
    }

    public getValuesFromFields = () => this.refToFormsy!.current.getModel()

    public actInError = () => this.setState({withError: true})

    public submit = async (formsyCase) => {
        // Quand on est dans le cas de la boucle ADG (càd qu'on a rajouté un ADG dans le dossier), Il faut bypasser l'enregistrement du dossier, on laisse le Formsy dans CardForADGInsideCase s'occuper de l'enregistrement
        // L'enregistrement de l'ADG doit se faire en amont de l'enregistrement du dossier. On récupère ensuite son id pour le mettre dans les ressources du dossier
        if (this.props.boucleADG) {
            return
        }
        if (!this.props.isAutoAssignButtonDisabled){
            this.props.setAutoAssignButtonDisabledTrue();
        }

        // ADG Already Created
        if (this.props.ADGDoneByBoucleADG) {
            this.setState({withError: false})
            // We don't need toggle with The Modal
            if (!isMaxwellCase(formsyCase)) {
                this.props.toggleBlockingUI();
            }
            formsyCase.qualification = {...this.props.motif}
            if (formsyCase.category !== CaseCategory.SCALED) {
                const {themeQualification} = formsyCase;
                const {validRoutingRule} = this.props;
                if (themeQualification && themeQualification.code !== '' && !!validRoutingRule.receiverSite
                    && validRoutingRule.receiverSite.code !== '') {
                    formsyCase.themeQualification = themeQualification
                    formsyCase.category = CaseCategory.SCALED
                    _.set(formsyCase, "caseOwner.activity", validRoutingRule.receiverActivity);
                    _.set(formsyCase, "caseOwner.site", validRoutingRule.receiverSite);
                    if (!!validRoutingRule.estimatedResolutionDateOfCase) {
                        formsyCase.estimatedResolutionDate = moment(validRoutingRule.estimatedResolutionDateOfCase).toDate()
                    }

                } else {
                    formsyCase.category = CaseCategory.IMMEDIATE
                }
            }

            const caseRequestDTO = await formatCase(formsyCase, {
                ...this.state.currentPayload,
                idContact: this.props.currentContactId
            }, this.props, this.actInError, undefined);

            caseRequestDTO.actBodys = []
            // retention act data
            const retentionActBody: FASTRAct<Act> | undefined = formatDataForRetentionChange(formsyCase, this.props.retentionSetting, this.props.retentionRefusSetting, this.state.currentPayload)
            if (retentionActBody) {
                caseRequestDTO.actBodys.push(retentionActBody)
            }            // antiChurn act data
            const antiChurnActBody: FASTRAct<Act> | undefined = formatDataForAntiChurnChange(formsyCase, this.props.antiChurnSetting, this.state.currentPayload)
            if (antiChurnActBody) {
                caseRequestDTO.actBodys.push(antiChurnActBody)
            }

            if (isMaxwellCase(formsyCase)) {
                this.initMaxwellProcesses()

                // TICKET CREATION
                const res: TroubleTicketResponse = await this.createTroubleTicket(formsyCase);

                if (this.props.ticketCreationProcess && isProcessOK(this.props.ticketCreationProcess.state)) {
                    this.handleProcessesAfterTicketCreationAndAdg(formsyCase, res)
                } else if (this.props.ticketCreationProcess && isProcessKO(this.props.ticketCreationProcess.state)) {
                    this.allowMaxwellModalClosing()
                }
            } else {
                try {
                    caseRequestDTO.processing = this.props.currentCase.processing
                    let createdCase: Case
                    if (this.props.qualifWasGivenInThePayload) {
                        createdCase = await this.caseService.createCaseLastStep(caseRequestDTO);
                    } else {
                        createdCase = await this.caseService.finalizeCase(caseRequestDTO, caseRequestDTO.caseId);
                    }
                    this.postingSubmitMessageAndContact(createdCase.contacts, createdCase.caseId, this.props.isWithAutoAssign)
                    handleNotificationSuccessMessage(createdCase);
                    this.handleCaseNotification(createdCase);
                    this.handleDISRCVariables();
                    this.props.toggleBlockingUI();
                } catch (error) {
                    this.props.toggleBlockingUI();// only toggle block if error, the case page closes normally on success
                    // TODO SOME REFACTO NEEDED TO HANDLE CORRECTLY ERRORS
                    return error.then((element: ErrorModel) => {
                        NotificationManager.error(element.message, "");
                    });
                }
            }

        } else {
            // TODO prévoir le cas où on "crée" le dossier alors qu'il existe déjà de par le fait qu'un ADG à été executé

            if (isMaxwellCase(formsyCase)) {
                this.initMaxwellProcesses()

                // TICKET CREATION
                const res: TroubleTicketResponse = await this.createTroubleTicket(formsyCase);

                if (this.props.ticketCreationProcess && isProcessOK(this.props.ticketCreationProcess.state)) {
                    this.handleProcessesAfterTicketCreation(formsyCase, res)
                } else if (this.props.ticketCreationProcess && isProcessKO(this.props.ticketCreationProcess.state)) {
                    this.allowMaxwellModalClosing()
                }
            } else {

                try {
                    this.props.toggleBlockingUI();
                    formsyCase.qualification = {...this.props.motif}
                    const caseRequestDTO = await formatCase(formsyCase, {
                        ...this.state.currentPayload,
                        idContact: this.props.currentContactId
                    }, this.props, this.actInError, this.props.idActDisRC);
                    caseRequestDTO.actBodys = []
                    // retention act data
                    const retentionActBody: FASTRAct<Act> | undefined = formatDataForRetentionChange(formsyCase, this.props.retentionSetting, this.props.retentionRefusSetting, this.state.currentPayload)
                    if (retentionActBody) {
                        caseRequestDTO.actBodys.push(retentionActBody)
                    }            // antiChurn act data
                    const antiChurnActBody: FASTRAct<Act> | undefined = formatDataForAntiChurnChange(formsyCase, this.props.antiChurnSetting, this.state.currentPayload)
                    if (antiChurnActBody) {
                        caseRequestDTO.actBodys.push(antiChurnActBody)
                    }
                    let createdCase: Case
                    // Case Creation
                    if (this.props.qualifWasGivenInThePayload || this.props.idActDisRC) {
                        createdCase = await this.caseService.createCase(caseRequestDTO);
                    } else {
                        createdCase = await this.caseService.finalizeCase(caseRequestDTO, caseRequestDTO.caseId)
                    }

                    let isActInvalid: boolean = false
                    let executedAct: CaseResource | undefined
                    if (this.state.currentPayload.idAct) {
                        executedAct = CaseUtils.retrieveLastAdg(createdCase)
                        isActInvalid = executedAct ? !executedAct.valid : true

                        this.setState({withError: isActInvalid})
                    }

                    if (this.props.isScalingMode && formsyCase.receiverActivity) {
                        NotificationManager.success(`Dossier escaladé vers ${formsyCase.receiverActivity.label}`)
                    }
                    this.postingSubmitMessageAndContact(createdCase.contacts, createdCase.caseId, this.props.isWithAutoAssign);

                    if (isActInvalid) {
                        this.handleFailedAdgNotification(executedAct ? executedAct.failureReason : "")
                    } else {
                        NotificationManager.success(translate.formatMessage({id: "global.create.case.success"}))
                    }


                    // Has act failed after create ?
                    this.handleCaseNotification(createdCase)
                    this.props.setHasCallTransfer(false);
                    this.handleDISRCVariables();
                    this.props.toggleBlockingUI();
                } catch (error) {
                    // TODO le comportement en cas d'erreur
                    console.error(error);
                    this.props.toggleBlockingUI();// only toggle block if error
                    return error.then((element: ErrorModel) => {
                        NotificationManager.error(element.message, "");
                        // Handle scenarios  for case Error (TODO Handle in a unique a way)
                        this.props.setIsWithAutoAssignFalse()

                        // TODO: Pourquoi avoir viré ça ? Ca gère les erreurs de validation .... UPDATE: parce qu'on veut quand même créé un case en cas d'erreur
                        //  UPDATEBIS : Ouais mais là, ça plante aussi si le case est pas créé, et si l'acte passe pas, on renvoi null au dessus, donc on créé pas le dossier
                        if (element.status === 400) {/*
                         const submissionErrors: any = {};
                         element.fieldsErrors.forEach((validationError: any) => {
                             NotificationManager.error(validationError.message);
                             submissionErrors[validationError.field] = validationError.message;
                         });*/

                            // invalidateForm(submissionErrors);
                        }
                    });
                }
            }
        }
    }

    public handleCaseNotification = (createdCase: Case) => {
        if (createdCase.category === "SCALED") {
            this.handleGigngerNotification(createdCase)
        }
    }

    public handleFailedAdgNotification = (failureReason: string) => {
        if (!!failureReason) {
            this.props.setAdgFailureReason(failureReason);
        }
        NotificationManager.error(translate.formatMessage({id: "adg.failed"}))
    };


    public handleGigngerNotification = (createdCase: Case) => {
        if (createdCase.resources.length > 0) {
            for (const caseResource of createdCase.resources) {
                if (caseResource.resourceType === "ACT_GINGER" && caseResource.description === "ADG_COMM_AUTO") {
                    NotificationManager.success(translate.formatMessage({id: "ginger.send.notification.success"}));
                }
            }
        }
    }


    public postingSubmitMessageAndContact = (contacts: Contact[], caseId: string, shouldntClose?: boolean) => {
        FastService.postSubmitMessage({
            contact: buildFastrContactCreation(contacts, this.state.currentPayload),
            idCase: caseId,
            error: this.state.withError,
            serviceId: this.state.currentPayload.idService,
            shouldntClose
        });
        this.props.setUpdateModeToTrue();
        this.props.setAutoAssignButtonDisabledFalse();
        if (shouldntClose) {
            this.props.setIsWithAutoAssignFalse();
            this.setState({
                redirect: <Redirect push to={{
                    pathname: "/cases/" + caseId + "/view",
                    search: this.props.location.search + "&edit"
                }}/>
            });
        }
    }


    // ______________________________   MAXWELL  ________________________________________

    public createTroubleTicket = async (formsyCase) => {
        try {
            return this.props.createTroubleTicket(buildTroubleTicketDto(formsyCase, this.state.currentPayload, this.props, this.props.motif));
        } catch (e) {
            NotificationManager.warning(<FormattedMessage
                id="cases.maxwell.error.ticket.creation.msg"/>);
            return getKoTroubleTicketResponse()
        }
    }

    public handleProcessesAfterTicketCreationAndAdg = async (formsyCase, res: TroubleTicketResponse) => {
        this.props.beginCreatingMaxwellCase()
        formsyCase.qualification = {...this.props.motif}
        const caseRequestDTO = await formatCase(formsyCase, this.state.currentPayload, this.props, this.actInError, undefined);
        caseRequestDTO.actBodys = []
        // retention act data
        const retentionActBody: FASTRAct<Act> | undefined = formatDataForRetentionChange(formsyCase, this.props.retentionSetting, this.props.retentionRefusSetting, this.state.currentPayload)
        if (retentionActBody) {
            caseRequestDTO.actBodys.push(retentionActBody)
        }            // antiChurn act data
        const antiChurnActBody: FASTRAct<Act> | undefined = formatDataForAntiChurnChange(formsyCase, this.props.antiChurnSetting, this.state.currentPayload)
        if (antiChurnActBody) {
            caseRequestDTO.actBodys.push(antiChurnActBody)
        }
        caseRequestDTO.incident = buildInitalCaseIncident(res)
        // MAXWELL CASE CREATION
        caseRequestDTO.processing = this.props.currentCase.processing
        const createdCase: Case = await this.caseService.createCaseLastStep(caseRequestDTO);
        if (createdCase && createdCase.incident.ticketId) {
            await this.props.creatingMaxwellCaseOk()
        } else {
            await this.props.creatingMaxwellCaseKO()
        }
        if (isProcessOK(this.props.maxwellCaseCreationProcess)) {
            if (this.props.uploadedFiles) {
                // FILES UPLOAD
                await this.props.uploadMaxwellFiles(this.props.uploadedFiles, createdCase.caseId, this.props.ticketCreationProcess.idTicket, this.props.ticketCreationProcess.attachementDirectory);
            }
            this.postingSubmitMessageAndContact(createdCase.contacts, createdCase.caseId)
        } else if (isProcessKO(this.props.maxwellCaseCreationProcess)) {
            this.allowMaxwellModalClosing()
        }
    }


    public handleProcessesAfterTicketCreation = async (formsyCase, res: TroubleTicketResponse) => {
        this.props.beginCreatingMaxwellCase()
        formsyCase.qualification = {...this.props.motif}
        const caseRequestDTO = await formatCase(formsyCase, this.state.currentPayload, this.props, this.actInError, undefined);
        caseRequestDTO.actBodys = []
        // retention act data
        const retentionActBody: FASTRAct<Act> | undefined = formatDataForRetentionChange(formsyCase, this.props.retentionSetting, this.props.retentionRefusSetting, this.state.currentPayload)
        if (retentionActBody) {
            caseRequestDTO.actBodys.push(retentionActBody)
        }            // antiChurn act data
        const antiChurnActBody: FASTRAct<Act> | undefined = formatDataForAntiChurnChange(formsyCase, this.props.antiChurnSetting, this.state.currentPayload)
        if (antiChurnActBody) {
            caseRequestDTO.actBodys.push(antiChurnActBody)
        }
        caseRequestDTO.incident = buildInitalCaseIncident(res)
        // MAXWELL CASE CREATION
        const createdCase: Case = await this.caseService.finalizeCase(caseRequestDTO, caseRequestDTO.caseId);
        if (createdCase && createdCase.incident.ticketId) {
            await this.props.creatingMaxwellCaseOk()
        } else {
            await this.props.creatingMaxwellCaseKO()
        }
        if (isProcessOK(this.props.maxwellCaseCreationProcess)) {
            if (this.props.uploadedFiles) {
                // FILES UPLOAD
                await this.props.uploadMaxwellFiles(this.props.uploadedFiles, createdCase.caseId, this.props.ticketCreationProcess.idTicket, this.props.ticketCreationProcess.attachementDirectory);
            }
            this.postingSubmitMessageAndContact(createdCase.contacts, createdCase.caseId)
        } else if (isProcessKO(this.props.maxwellCaseCreationProcess)) {
            this.allowMaxwellModalClosing()
        }
    }
    public allowMaxwellModalClosing = () => {
        this.setState({
            maxwellModalCanBeClose: true
        })
    }
    public initMaxwellProcesses = () => {
        this.props.initMaxwellProcess()
        this.props.openMaxwellModal()
        this.setState({showModalForMaxwellProcess: true})
    }

    public onFormsyValid = () => {
        if (!this.props.isFormsyValid) {
            this.props.setFormsyIsValid()
        }
    }

    public onFormsyInValid = () => {
        if (this.props.isFormsyValid) {
            this.props.setFormsyIsInvalid()
        }
    }

    public onAdditionalDataChange = (formChanges) => {
        this.props.setAdditionalData(formChanges.data)
    }

    public onMessage(caseFromKafka) {
        const eventArraySortedByDate = caseFromKafka.events.sort((a, b) => {
            a = new Date(a.date).getTime();
            b = new Date(b.date).getTime();
            return a > b ? -1 : a < b ? 1 : 0;
        });
        caseFromKafka.events = eventArraySortedByDate
        if (caseFromKafka.events[0].type === "ADD_ADG") {
            this.props.setDisplayCancelButton(false)
        }
    }

    public retrieveActResources = () => {
        if (this.props.currentCase) {
            const {resources} = this.props.currentCase;
            return resources.filter(resource => CaseUtils.isAct(resource));
        }
    };

    public renderRetentionSection = () => {
        if (!this.props.client || !this.props.client.service || !this.props.authorizations.includes(ACT_ID.ADG_RETENTION)) {
            return <React.Fragment/>
        }
        return (
            <React.Suspense fallback={<Loading/>}>
                <this.EditRetentionCard/>
            </React.Suspense>
        )
    }

    public renderAntiChurnSection = () => {
        if (!this.props.client || !this.props.client.service || !this.props.authorizations.includes(ACT_ID.ADG_ANTICHURN)) {
            return <React.Fragment/>
        }
        return (
            <React.Suspense fallback={<Loading/>}>
                <this.AntiChurnCard/>
            </React.Suspense>
        )
    }

    public render() {

        if (!this.state.currentPayload?.idClient) {
            return <React.Fragment/>
        }

        if (this.state.redirect) {
            return this.state.redirect;
        }

        const {idCase, fastTabId, idAct} = this.state.currentPayload

        let rightIdAct = idAct
        if (!rightIdAct) {
            rightIdAct = this.props.idActDisRC
        }
        return (
            <React.Fragment>
                <SockJsClient url={process.env.REACT_APP_FASTR_API_URL + "/fastr-cases/subscribe-dossier/"}
                              topics={["/topic/subscribeDossier-" + idCase]}
                              onMessage={this.onMessage}/>
                <Container className="h-100" fluid>
                    <Formsy onValid={this.onFormsyValid} onInvalid={this.onFormsyInValid} onSubmit={this.submit}
                            ref={this.refToFormsy}>

                        {this.state.showModalForMaxwellProcess &&
                        <ModalMaxwell payload={this.state.currentPayload}
                                      canBeClosed={this.state.maxwellModalCanBeClose}/>
                        }

                        {this.props.isMatchingCaseModalDisplayed &&
                        <ModalMatchingCase fastTabId={fastTabId} authorizations={this.props.authorizations}/>
                        }

                        <CreateCaseNavBar
                            caseNumber={idCase}
                            sessionId={this.state.sessionId}
                            idService={this.state.currentPayload.idService}
                            idClient={this.state.currentPayload.idClient}
                            currentContactId={this.props.currentContactId}
                        />
                        {this.props.client.data &&
                        <QualificationScalingSelection context="CreateCasePage" idAct={rightIdAct}
                                                       shouldStartWithRequalif={this.props.isCurrUserObligedToReQualifyImmediateCase}
                                                       getValuesFromFields={this.getValuesFromFields}
                        />
                        }
                        <CaseDescription idAct={rightIdAct} getValuesFromFields={this.getValuesFromFields}/>

                        {this.renderRetentionSection()}

                        {this.renderAntiChurnSection()}

                        {rightIdAct ?
                            <ADGWrapper getValuesFromFields={this.getValuesFromFields}
                                        payload={this.state.currentPayload}/>
                            : this.props.motif ? this.props.motif.code && this.props.authorizations.indexOf("isADGIntoDir") !== -1 && !this.state.currentPayload.idAct ?
                                <CardForADGInsideCase payload={this.state.currentPayload}
                                                      getValuesFromFields={this.getValuesFromFields}
                                                      context="CreateCasePage"/> : <React.Fragment/> :
                                <React.Fragment/>}

                        <GenericCardToggle title={"cases.create.contact"} icon={"icon-user"}>
                            <this.Media payload={this.state.currentPayload}
                                        onNewContact={this.updateCurrentContactId}
                                        idAct={this.state.currentPayload.idAct}
                                        currentContactId={this.props.currentContactId}
                                        shouldDisplayTransfer={true}/>
                        </GenericCardToggle>

                        {!this.props.isScalingMode &&
                        <CreateCaseConclusion idAct={rightIdAct}/>
                        }

                        {this.props.additionDataOfQualifsAndTheme.length > 0 &&
                        <CaseData data={this.props.additionDataOfQualifsAndTheme}
                                  onChange={this.onAdditionalDataChange}/>
                        }

                        {this.props.currentCase &&
                        <CaseHistory/>
                        }
                    </Formsy>
                </Container>
            </React.Fragment>

        )
    }

    private updateCurrentContactId = async () => {
        this.props.setCurrentContactId(await this.caseService.getNextContactSequence());
    }
}

const mapStateToProps = (state: AppState) => ({
    qualification: state.casePage.qualification,
    motif: state.casePage.motif,
    theme: state.casePage.theme,
    isFormsyValid: state.casePage.isFormsyValid,
    isLoadingQualification: state.casePage.isLoadingQualification,
    isLoadingMotif: state.casePage.isLoadingMotif,
    addContact: state.casePage.addContact,
    isScalingMode: state.casePage.isScalingMode,
    validRoutingRule: state.casePage.validRoutingRule,
    isWithAutoAssign: state.casePage.isWithAutoAssign,
    client: state.client,
    additionDataOfQualifsAndTheme: state.casePage.additionDataOfQualifsAndTheme,
    failedADG: state.casePage.failedADG,
    matchingCase: state.recentCases.matchingCaseFound,
    activitySelected: state.casePage.activitySelected,
    qualifWasGivenInThePayload: state.casePage.qualifWasGivenInThePayload,
    qualificationLeaf: state.casePage.qualificationLeaf,
    boucleADG: state.casePage.boucleADG,
    ADGDoneByBoucleADG: state.casePage.ADGDoneByBoucleADG,
    incidentSelected: state.casePage.incidentSelected,
    ticketCreationProcess: state.casePage.ticketCreationProcess,
    maxwellCaseCreationProcess: state.casePage.maxwellCaseCreationProcess,
    uploadedFiles: state.casePage.uploadedFiles,
    isQualificationSelected: state.casePage.isQualificationSelected,
    authorizations: state.authorization.authorizations,
    currentCase: state.case.currentCase,
    processing: state.case.processing,
    payload: state.payload.payload,
    retentionSetting: state.retention.retentionSetting,
    retentionRefusSetting: state.retention.retentionRefusSetting,
    antiChurnSetting: state.antiChurn.antiChurnSettings,
    disRcAdgMotif: state.casePage.disRcAdgMotif,
    idActDisRC: state.casePage.idActDisRC,
    currentContactId: state.casePage.currentContactId,
    alreadyLoadedContacts: state.casePage.alreadyLoadedContacts,
    activationFlags: state.activationFlag.activationFlags,
    isMatchingCaseModalDisplayed: state.recentCases.isMatchingCaseModalDisplayed,
    applicationInitialState: state.store.applicationInitialState,
    isAutoAssignButtonDisabled: state.casePage.isAutoAssignButtonDisabled,
    isCurrUserObligedToReQualifyImmediateCase:state.casePage.isCurrUserObligedToReQualifyImmediateCase
});

const mapDispatchToProps = {
    setCaseQualification,
    setDisplayCancelButton,
    storeCase,
    setCaseMotif,
    fetchAndStoreClient,
    setFormsyIsValid,
    setFormsyIsInvalid,
    setScalingEligibilityTrue,
    setScalingEligibilityFalse,
    setAdditionalData,
    setValidRoutingRule,
    setIsAutoAssign,
    setIsWithAutoAssignFalse,
    toggleBlockingUI,
    setAdgFailureReason,
    setActivitySelected,
    setAddContactToTrue,
    setAddContactToFalse,
    setMatchingCase,
    setCaseMotifLoading,
    setHasCallTransfer,
    createTroubleTicket,
    uploadMaxwellFiles,
    beginCreatingMaxwellCase,
    creatingMaxwellCaseOk,
    creatingMaxwellCaseKO,
    fetchRecentCases,
    openMaxwellModal,
    initMaxwellProcess,
    fetchAndStoreAuthorizations,
    fetchAndStoreUserActivity,
    setDisplayGridADGForDISRC,
    setCurrentContactId,
    getOrFetchContact,
    setIsRecentCasesListDisplayed,
    fetchActivationFlags,
    setUpdateModeToTrue,
    fetchAndStoreApplicationInitialStateV2,
    setAutoAssignButtonDisabledTrue,
    setAutoAssignButtonDisabledFalse
}

export default compose(
    withRouter, connect(mapStateToProps, mapDispatchToProps))(CreateCasePage);
