import React, { useEffect, useRef, useState } from "react";
import 'react-block-ui/style.css';
import 'react-notifications/lib/notifications.css';
import SockJsClient from 'react-stomp';
import CaseHeaderV2 from "./Components/CaseHeaderV2";
import CaseSectionV2 from "./Components/Sections/CaseSectionV2";
import { useDispatch, useSelector } from "react-redux";
import Formsy from "formsy-react";
import { AppState } from "../../../store";
import { setBlockingUIV2 } from "../../../store/actions/v2/ui/UIActions";
import { useTypedSelector } from "../../../components/Store/useTypedSelector";
import { CaseRequestCLO } from "../../../model/CaseRequestCLO";
import { CaseState } from "../../../store/reducers/v2/case/CasesPageReducerV2";
import CaseService from "../../../service/CaseService";
import { translate } from "../../../components/Intl/IntlGlobalProvider";
import { NotificationManager } from "react-notifications";
import { CaseCLO } from "../../../model/CaseCLO";
import ModalMatchingCaseV2 from "./Components/ModalMatchingCaseV2";
import {
    pushCaseToRecentCasesClientV2,
    storeClientV2
} from "../../../store/actions/v2/client/ClientActions";
import { Case } from "../../../model/Case";
import { ClientContextSliceState } from "../../../store/ClientContextSlice";
import { CasesQualificationSettings } from "../../../model/CasesQualificationSettings";
import {
    clearPayloadFromQuickAccessV2,
    createOrUpdateADGMaxwell, createTroubleTicketMaxwellV2FromQAMaxwell,
    handleTreatmentEndChangedV2,
    initMaxwellAttachments,
    notifyThemeSelectionActionV2,
    setActionAdditionalDataV2,
    setActionBlockingError,
    setActionCode,
    setActionLabel,
    setAdditionalDataV2, setADGMaxwellProcessIgnored, setADGMaxwellProcessLoading,
    setBoucleADGV2,
    setCanBeClosedMaxwellModal,
    setCanCurrentCaseBeScaledV2,
    setCanNotOpenMaxwellModal,
    setCanOpenMaxwellModal,
    setCaseHasInProgressIncident,
    setCaseHasInProgressIncidentExceptWaiting,
    setCaseHasNotInProgressIncident,
    setCaseMotifV2,
    setFormMaxwellIncompleteV2,
    setIncidentsIdsWithWaitingStatus,
    setIsCurrentCaseScaledV2,
    setIsThemeSelectedV2,
    setLastArbeoDiagDetails, setQualificationLeafV2,
    setQualificationSelectedV2, setTroubleTicketProcessKO, setUploadFilesProcessKO,
    storeCaseBooleansV2,
    storeCaseV2,
    updateSectionsV2,
} from "../../../store/actions/v2/case/CaseActions";
import ActService from "../../../service/ActService";
import DateUtils from "../../../utils/DateUtils";
import { CaseCategory } from "../../../model/CaseCategory";
import { CaseRoutingRule } from "../../../model/CaseRoutingRule";
import { Contact } from "../../../model/Contact";
import FastService from "../../../service/FastService";
import FormHiddenInput from "../../../components/Form/FormHiddenInput";
import { CaseProgressStatus } from "../../../model/CaseProgressStatus";
import { RetentionData } from "../../../model/acts/retention/RetentionData";
import { formatRetentionMotif } from "../../Acts/Retention/RetentionFormat";
import { findActDetailObjectV2, findActTypeObjectV2 } from "../../../model/acts/antichurn/AntiChurnFormat";
import { fetchRecentCasesV2, selectCaseV2 } from "../../../store/actions/v2/case/RecentCasesActions";
import { setTargetCaseIdV2 } from "../../../store/actions/v2/applicationInitalState/ApplicationInitalStateActions";
import { CaseResource } from "../../../model/CaseResource";
import { IncidentsListItem } from "../../../model/IncidentsList";
import { autoAssignCaseToCurrentUser, autoAssignCaseToSystem } from "../../../store/actions/CaseActions";
import { isInProgressIncident, isInProgressIncidentExceptWaiting, isWaitingIncident } from "../../../utils/MaxwellUtilsV2";
import { MaxwellDataFormatForInit } from "../Acts/Maxwell/MaxwellDataFormat";
import { ViewCaseRequestDTO } from "../../../model/ViewCaseRequestDTO";
import { ACT_ID } from "../../../model/actId";
import ModalMaxwellV2 from "../Acts/Maxwell/ModalMaxwellV2";
import moment from "moment";
import { DiagAnalysisRequestCLO } from "../../../model/DiagAnalysisRequestCLO";
import { DiagAnalysisCLO } from "../../../model/DiagAnalysisCLO";
import { Placement } from "./Components/Sections/SectionsComponentsMapping";
import { FormattedMessage } from "react-intl";
import { Payload } from "../../../model/case/CaseActPayload";
import { ApplicationMode } from "../../../model/ApplicationMode";
import { GenericIncident } from "../../../model/GenericIncident";
import { CaseQualification } from "../../../model/CaseQualification";
import SelfCareService from "src/service/SelfCareService";

interface Props {
    caseId?
    onClosePage?: (aCase: Case | undefined) => void
    handleCaseSelected?: (caseId: string) => void
    clientContext?: ClientContextSliceState
    currentNoteValue?: string;
    histoRapidIsScaled?: boolean;
    isHistoRapid?: boolean;
    currentDescription?: string;
}

const CasePageV2 = (props: Props) => {

    const dispatch = useDispatch();
    const { caseId, onClosePage, handleCaseSelected, clientContext } = props;
    const refToFormsy: React.RefObject<Formsy> = useRef(null);
    const [isFormsyValid, setIsFormsyValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState<any[]>([]);
    const [handleCancelModalMatchingCase, setHandleCancelModalMatchingCase] = useState();
    const payload = useSelector((state: AppState) => state.payload.payload)
    const client = clientContext ? clientContext : useTypedSelector((state: AppState) => state.store.client.currentClient)!
    const authorizations = useTypedSelector((state: AppState) => state.store.applicationInitialState.authorizations)
    const histoRapideSettings = useTypedSelector((state: AppState) => state.store.applicationInitialState.histoRapideSettings)
    const retentionSetting = useTypedSelector((state: AppState) => state.store.applicationInitialState.retentionSettings?.retentionSetting)
    const retentionRefusSetting = useTypedSelector((state: AppState) => state.store.applicationInitialState.retentionSettings?.retentionRefusSetting)
    const antichurnSetting = useTypedSelector((state: AppState) => state.store.applicationInitialState.antichurnSetting)
    const currentUser = useTypedSelector((state: AppState) => state.store.applicationInitialState.user)
    const currentActivity = useTypedSelector((state: AppState) => state.store.applicationInitialState.user?.activity)
    const sessionIsFrom = useTypedSelector((state: AppState) => state.store.applicationInitialState.sessionIsFrom)
    const currentContact = useTypedSelector((state: AppState) => state.store.contact.currentContact)
    const currentCases: CaseState[] = useTypedSelector((state: AppState) => state.store.cases.casesList)
    const caseService: CaseService = new CaseService(true)
    const currentCaseStateModalDisplayed: boolean = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.isMatchingCaseModalDisplayed)
    const currentCaseStateSections = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.sections)
    const currentCaseStateIsQualifSelected = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.isQualificationSelected)
    const currentCaseStateIsAdgOpen = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.boucleADG)
    const blockingUIV2 = useTypedSelector((state => state.store.ui.blockingUI))
    const retourArbeoResource = useTypedSelector((state) => state.store.cases.casesList[caseId]?.currentCase?.resources?.sort((res1, res2) => DateUtils.compareStringDates(res1.creationDate, res2.creationDate)).reverse()
        .find((res) => res.description === "RETOUR_ARBEO" && res.valid))
    const [caseAlreadyLoaded, setCaseAlreadyLoaded] = useState(false);
    const [arbeoActDetail, setArbeoActDetail] = useState();
    const actService = new ActService(true);
    const previousCaseId = useRef(caseId);
    const [ignoreMaxwellTreatment, setIgnoreMaxwellTreatment] = useState(false)
    const [caseIdBeforeRedirect, setCaseIdBeforeRedirect] = useState(caseId);
    const previousCaseAlreadyLoaded = useRef(caseAlreadyLoaded);
    const caseHasInProgressIncident: boolean = useSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.hasInProgressIncident)
    const isMaxwellFormCompleted: boolean = useSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.maxwellIncident?.isFormMaxwellCompleted)
    const isMaxwellFormLastStep: boolean = useSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.maxwellIncident?.isMaxwellFormLastStep)
    const canOpenMaxwellModal: boolean = useSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.maxwellIncident?.canOpenMaxwellModal)
    const currentCase: CaseState = useSelector((state: AppState) => state.store.cases.casesList[props.caseId])
    const uploadedFilesMaxwell: File[] = useSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.maxwellIncident?.uploadedFilesMaxwell)
    const themeSelected: CasesQualificationSettings[] = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.themeSelected)
    const incidentsIdsWithWaitingStatus: Array<string> = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.incidentsIdsWithWaitingStatus)
    const isCurrentCancelScaling: boolean = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.isCurrentCaseCancelScaling)
    const isCurrentCaseScaled: boolean = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.isCurrentCaseScaled)
    const siebelAccount = useTypedSelector((state: AppState) => state.store.client?.currentClient?.service?.siebelAccount)
    const billingAccountId = useTypedSelector((state: AppState) => state.store.client?.currentClient?.service?.billingAccount.id)
    const isCaseHasInProgressIncidentExceptWaiting = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.hasInProgressIncidentExceptWaiting)
    const isFromQuickAccessAct = useTypedSelector((state: AppState) => state.store.cases.adgQuickAccessPayload?.idAct && state.store.cases.adgQuickAccessPayload?.fromQA)
    const adgQuickAccessPayload: Payload = useTypedSelector((state: AppState) => state.store.cases.adgQuickAccessPayload)
    const descriptionFromQuickAcess = isFromQuickAccessAct && !props?.isHistoRapid ? translate.formatMessage({ id: "create.act.client.request" }).concat(translate.formatMessage({ id: "act.title." + adgQuickAccessPayload.idAct }).toLowerCase()) : props.currentDescription;
    const currentNoteValue = isFromQuickAccessAct && !props?.isHistoRapid ? translate.formatMessage({ id: "create.act.client.request" }).concat(translate.formatMessage({ id: "act.title." + adgQuickAccessPayload.idAct }).toLowerCase()) : props.currentNoteValue;
    const tagsFromAlerte: string[] = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.qualificationLeaf?.tags)

    const selfCareService = new SelfCareService();
    useEffect(() => {
        if (!isFromQuickAccessAct || !payload?.refCTT) {
            fetchCaseForFast()
        }
    }, [])

    useEffect(() => {
        if (caseId !== previousCaseId.current) {
            previousCaseAlreadyLoaded.current = true
            setCaseAlreadyLoaded(false);
            setCaseIdBeforeRedirect(previousCaseId.current);
            previousCaseId.current = caseId
        }
    }, [caseId])

    useEffect(() => {
        if (caseAlreadyLoaded !== previousCaseAlreadyLoaded.current && !caseAlreadyLoaded) {
            fetchCaseForFast()
        }
    }, [caseAlreadyLoaded])

    useEffect(() => {
        saveBtnShowErrorsOnHover()
    }, [isMaxwellFormCompleted, isMaxwellFormLastStep])

    useEffect(() => {
        if (isFromQuickAccessAct) {
            fillAndCreateCaseForActQuickAccess()
        }
        if (payload?.refCTT) {
            fillAndCreateCaseFromAlerte()
        }
    }, [])

    const formatCodeTheme = (codeList: string) => {
        return codeList.split(';')[0];
    }

    const fillAndCreateCaseFromAlerte = async () => {
        let incident: GenericIncident;
        try {
            incident = await caseService.getIncidentByRefCTT(payload?.refCTT)
            const motif: CaseQualification = {
                code: "MAXWELL_ISSUE",
                caseType: "Commercial",
                tags: ['Incident unitaire fixe ou mobile'],
                inactivityDelay: 1
            }
            const caseRequestCLO: CaseRequestCLO = {
                caseId: payload.idCase,
                clientId: payload.idClient,
                serviceId: payload.idService,
                contact: { id: payload.idContact },
                qualification: motif
            }
            await caseService.createOrUpdateCaseV2(caseRequestCLO);
        } catch (e) {
            console.error("[ERROR] ", e)
        } finally {
            // @ts-ignore
            fetchCaseForFast(false, incident)
        }
    }

    // TODO: to remove when finishing migration case BEB
    const fillAndCreateCaseForActQuickAccess = async () => {
        const caseRequestCLO: CaseRequestCLO = {
            caseId: adgQuickAccessPayload.idCase,
            clientId: adgQuickAccessPayload.idClient,
            serviceId: adgQuickAccessPayload.idService,
            contact: { id: adgQuickAccessPayload.idContact },
            qualification: adgQuickAccessPayload.motif
        }
        try {
            await caseService.createOrUpdateCaseV2(caseRequestCLO);
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log("case already created for quick access")
        } finally {
            fetchCaseForFast()
        }
    }

    const fetchCaseForFast = (forceReload?: boolean, incident?: GenericIncident | undefined) => {
        if (isInIframe() || isFromGoFastr() || isFromDisrc()) { // FAST
            const getOrNewCase = async () => {
                // load recentCases
                if (client && client.clientData?.id && client?.serviceId) {
                    dispatch(fetchRecentCasesV2(client.clientData?.id, client?.serviceId, false))
                }
                // get case
                const caseCLO: CaseCLO = await caseService.getOrNewCaseCLO(caseId);
                dispatch(storeCaseV2(caseCLO.currentCase))
                dispatch(storeCaseBooleansV2(caseId, {
                    canCCUpdateCurrentCase: caseCLO.canCCUpdateCurrentCase,
                    canCCAddNoteToCurrentCase: caseCLO.canCCAddNoteToCurrentCase,
                    canCCAutoAssignCurrentCase: caseCLO.canCCAutoAssignCurrentCase,
                    canCCReQualifyCurrentCase: caseCLO.canCCReQualifyCurrentCase,
                    canCCUpdateMandatoryADGForCurrentCase: caseCLO.canCCUpdateMandatoryADGForCurrentCase,
                    mustCCReQualifyCurrentCase: caseCLO.mustCCReQualifyCurrentCase,
                    canDisplayPrendreEnChargeBtn: caseCLO.canDisplayPrendreEnChargeBtn,
                }));
                dispatch(setCaseMotifV2(caseId, caseCLO.currentCase.qualification))
                if (caseCLO.currentCase.qualification) {// case was present, get
                    try {
                        let caseQualification: CasesQualificationSettings;
                        if (payload?.refCTT && incident) {
                            caseQualification = await caseService.getCaseQualifSettings(formatCodeTheme(incident!.codesThemesAssocies));
                            if (caseQualification.incident) {
                                dispatch(setCaseHasInProgressIncident(caseId))
                            }
                        } else {
                            caseQualification = await caseService.getCaseQualifSettings(caseCLO.currentCase.qualification.code);
                            if (props.isHistoRapid) {
                                const additionnalDataMotif = caseQualification.data.map(caseDataProp => ({
                                    ...caseDataProp,
                                    category: "MOTIF"
                                }));
                                if (additionnalDataMotif.length > 0) {
                                    dispatch(setAdditionalDataV2(caseId, additionnalDataMotif));
                                }
                            }
                            dispatch(setQualificationLeafV2(caseId, caseQualification))
                        }
                    } catch (e) {
                        console.log('qualif n\'existe plus');
                    } finally {
                        if (payload?.refCTT && incident) {
                            dispatch(setIsThemeSelectedV2(caseId))
                        }
                        dispatch(setQualificationSelectedV2(caseId))
                    }
                }
                if (props?.histoRapidIsScaled! || payload?.refCTT) {
                    (caseCLO.sections.find((s) => s.code === "SCALING") || { editable: false }).editable = false;
                    if (incident) {
                        (caseCLO.sections.find((s) => s.code === "ADDITIONAL_DATA") || { expanded: false }).expanded = false;
                    }
                    dispatch(updateSectionsV2(caseId, caseCLO.sections));
                } else {
                    const selectedHisto = histoRapideSettings.filter(a => a.code === adgQuickAccessPayload.histoCode);
                    if (props.isHistoRapid && selectedHisto.length > 0) {
                        // disable block adg if is histoRapid with setting hasAdg false
                        histoRapideSettings.filter(a => a.code === adgQuickAccessPayload.histoCode)[0].hasADG;
                        const newSections = caseCLO.sections.filter(item => !(item.code === 'ADG' && !selectedHisto[0].hasADG));
                        if (selectedHisto[0].hasADG) {
                            (newSections.find((s) => s.code === "ADG") || { expanded: false }).expanded = true;
                        }
                        dispatch(updateSectionsV2(caseId, [...newSections]))
                    } else {
                        dispatch(updateSectionsV2(caseId, caseCLO.sections));
                    }
                }
                if (caseCLO.currentCase.data) {
                    dispatch(setAdditionalDataV2(caseId, caseCLO.currentCase.data))
                }
                if (caseCLO.currentCase.qualification?.code && client?.service) {
                    const scalingEligibility = (caseCLO.currentCase.qualification.code === "MAXWELL_ISSUE") ? true : await caseService.atLeastOneThemeContainRoutingRule(caseCLO.currentCase.qualification.code,
                        client.service!.serviceType)
                    dispatch(setCanCurrentCaseBeScaledV2(caseId, scalingEligibility));
                    const isCaseCurrentlyScaled = caseCLO.currentCase.category === CaseCategory.SCALED || props?.histoRapidIsScaled! || incident !== undefined;
                    dispatch(setIsCurrentCaseScaledV2(caseId, isCaseCurrentlyScaled));
                    if ((caseCLO.currentCase.themeQualification && isCaseCurrentlyScaled) || incident) {
                        dispatch(setIsThemeSelectedV2(caseId));
                        let rule: CaseRoutingRule;

                        rule = incident ?
                            await caseService.getReceiverSiteFromleafTheme(formatCodeTheme(incident.codesThemesAssocies), client.service!.serviceType)
                            :
                            {
                                estimatedResolutionDateOfCase: caseCLO.currentCase.estimatedResolutionDate?.toString(),
                                receiverActivity: caseCLO.currentCase.caseOwner.activity,
                                receiverSite: caseCLO.currentCase.caseOwner.site,
                                routingMode: "",
                                transmitterActivity: caseCLO.currentCase.caseOwner.activity,
                                transmitterSite: caseCLO.currentCase.caseOwner.site
                            }
                        let setting: CasesQualificationSettings | undefined;
                        try {
                            setting = incident
                                ? await caseService.getCaseQualifSettings(formatCodeTheme(incident!.codesThemesAssocies))
                                : await caseService.getCaseQualifSettings(caseCLO.currentCase.themeQualification.code);
                        } catch (e) {
                            console.log('qualif n\'existe plus');
                        } finally {
                            dispatch(notifyThemeSelectionActionV2(caseId, setting, rule))
                            dispatch(handleTreatmentEndChangedV2(caseId, caseCLO.currentCase.progressStatus === CaseProgressStatus.TREATMENT_END,
                                currentActivity?.code, caseCLO.currentCase.serviceType, caseCLO.currentCase.qualification.caseType))
                        }
                    }
                }

                if (caseCLO?.currentCase?.category === CaseCategory.SCALED) {
                    await loadCaseIncidentsList();
                }

                dispatch(setCanNotOpenMaxwellModal(caseId))

                previousCaseAlreadyLoaded.current = false
                setCaseAlreadyLoaded(true);
            }
            if ((!caseAlreadyLoaded || forceReload)) {
                dispatch(autoAssignCaseToCurrentUser(caseId, currentContact?.contactId, getOrNewCase))
            }
        }
    }

    useEffect(() => {
        if (clientContext) {
            dispatch(storeClientV2(clientContext));
        }
    }, [clientContext])

    useEffect(() => {
        // get Act
        if (retourArbeoResource) {
            actService.getActById(retourArbeoResource.id).then((actCollection) => {
                setArbeoActDetail(actCollection.actDetail);
            });
        }

    }, [retourArbeoResource]);

    useEffect(() => {
        if (currentCase && currentCase.currentCase) {
            checkIfMandatoryActOrActionsOnCaseLoading(currentCase.currentCase)
        }

    }, [currentCase?.currentCase]);

    const handleCaseSelectedSelf = (targetCaseId: string) => {
        dispatch(setTargetCaseIdV2(targetCaseId));
    }

    const loadCaseIncidentsList = async () => {
        try {
            const incidentsArr: IncidentsListItem[] = await caseService.getIncidentsList(caseId)
            if (incidentsArr && incidentsArr.length > 0 && incidentsArr.find(incident => isInProgressIncident(incident))) {
                dispatch(setCaseHasInProgressIncident(caseId));
            }

            // les statuts en cours hors waiting
            if (incidentsArr && incidentsArr.length > 0 && incidentsArr.find(incident => isInProgressIncidentExceptWaiting(incident))) {
                dispatch(setCaseHasInProgressIncidentExceptWaiting(caseId));
            }

            const ids: Array<string> = incidentsArr.filter(incident => isWaitingIncident(incident)).map(incident => incident.actId);
            dispatch(setIncidentsIdsWithWaitingStatus(caseId, ids));
        } catch (e) {
            dispatch(setCaseHasNotInProgressIncident(caseId));
            const error = await e;
            console.error(error)
        }
    }

    const currentCaseState = () => {
        return currentCases[caseId];
    }

    const onFormsyValid = () => {
        setIsFormsyValid(true)
        saveBtnShowErrorsOnHover()
    }

    const onFormsyInValid = () => {
        setIsFormsyValid(false);
        saveBtnShowErrorsOnHover()
    }

    const executeMaxwellProcess = async () => {
        dispatch(setCanOpenMaxwellModal(caseId))
        // execute act
        const changes: any = getFromChangesFromInitialState();
        let act;
        // Ciblage
        if (payload?.refCTT) {
            act = MaxwellDataFormatForInit(currentCase.maxwellIncident, currentCase, currentContact?.contactId, tagsFromAlerte, true)
        } else {
            act = MaxwellDataFormatForInit(currentCase.maxwellIncident, currentCase, currentContact?.contactId, changes.scaling?.caseThemeQualification.tags)
        }
        await dispatch(createOrUpdateADGMaxwell(caseId, act))

        // upload attachments
        const retrievedCase: ViewCaseRequestDTO = await caseService.getCase(caseId);
        const maxwellResource: CaseResource | undefined = retrievedCase.currentCase?.resources?.find(resource => resource.description === ACT_ID.ADG_MAXWELL);
        if (maxwellResource !== undefined) {
            await dispatch(initMaxwellAttachments(uploadedFilesMaxwell, caseId, maxwellResource.id, currentContact ? currentContact.contactId : ""))
        }
        dispatch(setCanBeClosedMaxwellModal(caseId))
        dispatch(setFormMaxwellIncompleteV2(caseId))
        if (isFromGoFastr() && onClosePage) {
            resetSelectedCase();
            onClosePage(undefined);
        }
    }

    function isFirstCreation() {
        return isMaxwellFormCompleted
            && isCurrentCaseScaled
            && (incidentsIdsWithWaitingStatus === undefined || incidentsIdsWithWaitingStatus.length === 0)
            && (isCaseHasInProgressIncidentExceptWaiting === undefined || isCaseHasInProgressIncidentExceptWaiting === false);
    }

    function isCreationAfterCancelScaling() {
        return isMaxwellFormCompleted && isCurrentCancelScaling && isCurrentCaseScaled;
    }

    async function handleMaxwellTreatment() {
        // for creation case with incident
        if (isCreationAfterCancelScaling() || isFirstCreation() || payload?.refCTT) {
            await executeMaxwellProcess();
        } else {
            //
            if (isFromGoFastr() && onClosePage) {
                resetSelectedCase();
                onClosePage(undefined);
            }
        }
    }

    /**
     * ResetScaledSectionAvancement
     * For scaled case, reset the scaled section form especially "Avancement"
     * And make sure the "Conclusion" disappear from screen
     */
    const resetScaledSectionAvancement = async () => {
        const currCase: Case = await caseService.getCase(caseId).then(foundCase => {
            return foundCase.currentCase;
        })
        formsyRef().current!.setValue("scaling.progressStatus", undefined)
        dispatch(handleTreatmentEndChangedV2(caseId, false, currentActivity, currCase.serviceType, currCase.qualification.caseType));
    }

    /**
     * OnSubmit
     * Function called on case's form submit
     */
    const onSubmit = async () => { // /!\ is triggered by the ADG sub-form validation, careful with the checks
        if (isFormsyValid && !currentCaseStateIsAdgOpen) {
            setIsFormsyValid(false);
            const cc = await caseService.getAllCaseCounters(caseId)
                .then(counters => {
                    return counters
                })
            if (!currentCase.isCurrentCaseScaled) { // IMMEDIAT
                if (cc.ongoingActionsCounter > 0 && formsyRef().current?.getModel().status === "RESOLVED") {
                    NotificationManager.error(ongoingActionErrorMessageFormatter(currentCase.isCurrentCaseScaled), null, 0);
                    document.getElementById('unresolved')!.click();
                } else {
                    await updateCase();
                    // await handleMaxwellTreatment();
                }
            } else { // ESCALADE
                if (cc.ongoingActionsCounter > 0 && formsyRef().current?.getModel().scaling.progressStatus === "TREATMENT_END") {
                    NotificationManager.error(ongoingActionErrorMessageFormatter(currentCase.isCurrentCaseScaled), null, 0);
                    await resetScaledSectionAvancement();
                } else {
                    const scaledDetails = currentCase.currentCase?.scaleDetails;
                    if (payload?.refCTT) {
                        if (currentCase?.validRoutingRule) {
                            try {
                                if (!ignoreMaxwellTreatment) {
                                    await handleMaxwellTreatment();
                                } else {
                                    dispatch(setCanOpenMaxwellModal(caseId))
                                    dispatch(setADGMaxwellProcessLoading(caseId));
                                }
                                dispatch(createTroubleTicketMaxwellV2FromQAMaxwell(currentCase, currentContact, tagsFromAlerte, updateCase, setIgnoreMaxwellTreatment))
                            } catch (e) {
                                setUploadFilesProcessKO(caseId);
                                setADGMaxwellProcessIgnored(caseId);
                                setTroubleTicketProcessKO(caseId);
                            }
                        } else {
                            NotificationManager.error("Impossible de faire l'enregistrement du dossier Maxwell");
                        }
                    } else if (scaledDetails && scaledDetails.length > 0 && scaledDetails[0].context === 'GDPR' && currentCase.isTreatmentEnd) { // verifie gdpr eclient
                        try {
                            await caseService.updateCaseProgressStatus(currentCase.caseId,CaseProgressStatus.TREATMENT_END);
                            await selfCareService.eclientNotificationForGdpr(currentCase.caseId);
                            await updateCase();
                            await handleMaxwellTreatment();
                        } catch (error) {
                            NotificationManager.error("Une erreur est survenue lors de l'enregistrement du dossier.");
                        }
                    } else {
                        await updateCase();
                        await handleMaxwellTreatment();
                    }
                }
            }
            setTimeout(() => setIsFormsyValid(true), 10000);
        }
    }

    const getFromChangesFromInitialState = () => {
        const current = refToFormsy.current?.getCurrentValues()
        const firstValues = refToFormsy.current?.getPristineValues()

        const diff = {};
        Object.keys(current).forEach((key) => {
            // this values should always be sent
            if (key === 'scaling.doNotResolveBeforeDate' && !payload?.refCTT) {
                diff[key] = current[key]
            }
            // at least one not falsy & value differs
            if (typeof current[key] === "object" || typeof firstValues[key] === "object") {
                if (current[key]?.toString() !== firstValues[key]?.toString()) {
                    diff[key] = current[key];
                }
            } else {
                if (current[key] !== firstValues[key]) {
                    diff[key] = current[key];
                }
            }
        })
        if (current['externalEventChanges']?.length > 0) diff['externalEventChanges'] = current['externalEventChanges']
        return unflatten(diff);
    }

    const unflatten = (data) => {
        let result: any = {}
        for (const flatKey in data) {
            const keys = flatKey.split('.')
            keys.reduce((tempResult, currentValue, currentIndex) => {
                // if res[key] exists, stop (lazy check)
                return tempResult[currentValue] ||
                    // else is the next key not a number?
                    (tempResult[currentValue] = isNaN(Number(keys[currentIndex + 1])) ?
                        // next key is not a number, is it the last one of the chain? -> put value, else put an object
                        (keys.length - 1 === currentIndex ? data[flatKey] : {})
                        // next key is a number, -> array (ex: myArr.0.toto=value)
                        : [])
            }, result)
        }
        const selectedThemes = currentCases[caseId].themeSelected as any;
        const theme = selectedThemes ? selectedThemes[0] : null;
        if ((props.histoRapidIsScaled || payload?.refCTT) && theme != null && !result.scaling) {
            const scaling = { caseThemeQualification: { code: theme.code, id: theme.id, caseType: '', tags: [] } };
            result = { ...result, scaling };
        }
        return result;
    }

    const formatChangesForMandatoryADG = (changes): any => {
        let result = {};
        if (changes.retentionData) {
            const updatedChanges: RetentionData = {
                eliRetention: false,
                intentionByClient: false,
                outOfPerim: changes.retentionData.outOfPerim
            };
            updatedChanges.intentionByClient = changes.retentionData.intentionByClient === "YES";
            updatedChanges.eliRetention = changes.retentionData.eliRetention === "YES";
            updatedChanges.adressResil = changes.retentionData.adressResil === "YES";
            if (changes.retentionData.proposalWithoutCommitment) {
                updatedChanges.proposalWithoutCommitment = {
                    code: changes.retentionData.proposalWithoutCommitment,
                    label: translate.formatMessage({ id: `retention.${changes.retentionData.proposalWithoutCommitment}` })
                }
            }
            const formattedMotif = formatRetentionMotif(retentionSetting!.settingDetail, changes.retentionDataForm?.motifAppel, changes.retentionDataForm?.sousMotifAppel);
            const formattedMotifRefus = formatRetentionMotif(retentionRefusSetting!.settingDetail, changes.retentionDataForm?.motifRefus, changes.retentionDataForm?.sousMotifRefus, true);

            result = {
                ...result,
                retentionData: {
                    ...changes.retentionData,
                    ...updatedChanges,
                    ...formattedMotif,
                    ...formattedMotifRefus
                }
            }
        }
        if (changes.antiChurnData) {
            const updatedChanges: any = {};

            updatedChanges.clientTerminationIntention = {
                code: changes.antiChurnData.clientTerminationIntention !== "NO",
                label: changes.antiChurnData.clientTerminationIntention !== "NO" ? "Oui" : "Non"
            };
            updatedChanges.actType = findActTypeObjectV2(antichurnSetting, changes.antiChurnData.actType, changes.antiChurnData.clientProposal);
            updatedChanges.actDetail = findActDetailObjectV2(antichurnSetting, changes.antiChurnData.actDetail, changes.antiChurnData.actType, changes.antiChurnData.clientProposal)
            if (changes.antiChurnData.proposalWithoutCommitment) {
                updatedChanges.proposalWithoutCommitment = {
                    code: changes.antiChurnData.proposalWithoutCommitment,
                    label: translate.formatMessage({ id: changes.antiChurnData.proposalWithoutCommitment })
                }
            }

            result = {
                ...result,
                antiChurnData: {
                    ...changes.antiChurnData,
                    ...updatedChanges
                }
            }
        }

        if (changes.externalEventChanges) {
            const current = refToFormsy.current?.getCurrentValues()
            if (!current.mandatoryAdgIsValid) throw new Error("Au moins courrier/email doit être associé au dossier");
            result = { externalEventChanges: { data: changes.externalEventChanges } }
        }

        return result;
    }

    const updateCase = async () => {
        try {
            const baseCaseRequest: CaseRequestCLO = {
                caseId: props.caseId,
                clientId: client.clientData!.id,
                serviceId: client.serviceId!,
                contact: { id: currentContact?.contactId },
                additionalData: currentCaseState().additionalData.filter((d) => d.category === "MOTIF"),
                incidentsIdsToCancel: isCurrentCancelScaling ? incidentsIdsWithWaitingStatus : undefined
            };
            const changes = getFromChangesFromInitialState();

            const caseRequestCLO = {
                ...baseCaseRequest,
                ...changes,
                contact: {
                    ...baseCaseRequest['contact'],
                    ...changes['contact']
                },
                ...formatChangesForMandatoryADG(changes)
            };
            const themeAdditionalData = currentCaseState().additionalData.filter((d) => d.category === "THEME");
            if (themeAdditionalData.length > 0 && currentCaseStateSections?.find(s => s.code === "SCALING")?.editable) {
                caseRequestCLO.scaling = {
                    ...changes['scaling'],
                    scalingAdditionalData: themeAdditionalData
                }
            }
            if (payload?.refCTT && caseRequestCLO.scaling.caseThemeQualification) {
                caseRequestCLO.scaling.caseThemeQualification.tags = tagsFromAlerte
            }
            dispatch(setBlockingUIV2(true));
            let updatedCaseCLO: CaseCLO;
            updatedCaseCLO = await caseService.createOrUpdateCaseV2(caseRequestCLO);
            postingSubmitMessageAndContact(currentContact!, caseIdBeforeRedirect);
            NotificationManager.success(translate.formatMessage({ id: "case.save.success" }))
            dispatch(clearPayloadFromQuickAccessV2());
            if (payload?.refCTT && currentCase.validRoutingRule) {
                await dispatch(autoAssignCaseToSystem(caseId, currentCase.validRoutingRule?.receiverSite, currentCase.validRoutingRule?.receiverActivity))
            }
            if (onClosePage) {
                // pour goFastr on ferme pas automatiquement le dossier et QA Maxwell
                if (!isFromGoFastr()) {
                    onClosePage(updatedCaseCLO.currentCase);
                } else {
                    resetSelectedCase();
                    dispatch(pushCaseToRecentCasesClientV2(updatedCaseCLO.currentCase));
                    onClosePage(updatedCaseCLO.currentCase);
                }
            }
        } catch (error) {
            const errorA = await error;
            NotificationManager.error(errorA.message, "");
        } finally {
            dispatch(setBlockingUIV2(false));
        }
    };

    const ongoingActionErrorMessageFormatter = (isMaxwell: boolean) => {
        if (isMaxwell) {
            return (<div>
                <FormattedMessage id={"dossiers.actifs.v2.save.maxwell.error"} />
            </div>)
        } else {
            return (<div>
                <FormattedMessage id={"dossiers.actifs.v2.save.case.error"} />
            </div>)
        }
    }

    const buildFastrContact = (contactFastr: Contact) => {
        return {
            idContact: contactFastr ? contactFastr.contactId : "",
            mediaType: contactFastr && contactFastr.media ? contactFastr.media.type : "",
            mediaDirection: contactFastr && contactFastr.media ? contactFastr.media.direction : "",
            contactStartDate: contactFastr ? contactFastr.startDate : "",
            contactCreationDate: contactFastr ? contactFastr.createdDate : "",
            shouldBeCreatedInFast: !payload && contactFastr
        }
    }

    const postingSubmitMessageAndContact = (contact: Contact, idCase: string) => {
        FastService.postSubmitMessage({
            contact: buildFastrContact(contact),
            idCase,
            error: false,
            serviceId: client.serviceId!
        });
    }

    const getValuesFromFields = () => refToFormsy!.current!.getModel()
    const formsyRef = () => refToFormsy
    const getDiffFromPristine = () => getFromChangesFromInitialState()

    const isInIframe = () => {
        return sessionIsFrom === ApplicationMode.FAST
    }

    const isFromGoFastr = () => {
        return sessionIsFrom === ApplicationMode.GOFASTR
    }

    const isFromDisrc = () => {
        return sessionIsFrom === ApplicationMode.DISRC
    }

    const resetSelectedCase = () : void => {
        if (currentCase.currentCase?.clientId && currentCase.currentCase?.serviceId) {
            dispatch(selectCaseV2("", currentCase.currentCase?.clientId, currentCase.currentCase?.serviceId))
        }
    }

    const onCancel = () => {
        if (onClosePage) {
            resetSelectedCase();
            onClosePage(undefined);
        }
        FastService.postAbortMessage({
            idCase: caseIdBeforeRedirect,
            serviceId: client.serviceId!
        })
    }
    const actionsProps = {
        onCancel,
        onSubmit,
        isValid: isFormsyValid && currentCaseStateIsQualifSelected,
        disabled: blockingUIV2 || currentCaseStateIsAdgOpen || (validationErrors.length > 0 && props.histoRapidIsScaled),
        validationErrors: isFormsyValid && currentCaseStateIsQualifSelected ? [] : validationErrors
    }


    const saveBtnShowErrorsOnHover = () => {
        const formsyInputs = refToFormsy!.current!.inputs
        const errorsFromFormsy: any[] = []
        const emptyUploadedMaxwellFilesError: any[] = [];
        const incompleteMaxwellForm = {
            "label": "Incident",
            "name": "incident",
            "isValid": false,
            "error": "Incident saisi incomplet"
        }
        const emptyUploadedFilesMaxwell = {
            "label": "Fichier",
            "name": "incident.dropzone",
            "isValid": false,
            "error": "Aucun fichier n'est attaché à ce dossier"
        }

        formsyInputs.forEach(input => {
            if (!input.state.isValid) {
                errorsFromFormsy.push({
                    "label": input.props.label,
                    "name": input.props.name,
                    "isValid": input.state.isValid,
                    "error": input.state.validationError[0]
                })
            }
        })
        const errorFormsyWithIncidentTitle = errorsFromFormsy.filter(error => error.name === "incidenttitle")
        const isValidMaxwellIncident = isMaxwellFormCompleted && isMaxwellFormLastStep && errorFormsyWithIncidentTitle?.length === 0 && uploadedFilesMaxwell?.length > 0
        if (caseHasInProgressIncident && !isValidMaxwellIncident) {
            if (!uploadedFilesMaxwell.length && isMaxwellFormLastStep) {
                emptyUploadedMaxwellFilesError.push(emptyUploadedFilesMaxwell)
            }
            const enrichedErrors = [...errorsFromFormsy, ...emptyUploadedMaxwellFilesError, incompleteMaxwellForm]
            setValidationErrors(enrichedErrors)
        } else {
            const cleanFormsyErrors = [...errorsFromFormsy]
            setValidationErrors(cleanFormsyErrors)
        }
    }

    const blockActionValidation = (bool) => {
        dispatch(setActionBlockingError(props.caseId, bool));
    }

    const checkIfMandatoryActOrActionsOnCaseLoading = (caseFromKafka: Case) => {
        const resourcesFromKafka: CaseResource[] | undefined = caseFromKafka.resources
        if (!resourcesFromKafka) {
            return;
        }
        const arbeoDiags = resourcesFromKafka.filter(res => res.description === "RETOUR_ARBEO" && res.valid)

        if (arbeoDiags && arbeoDiags.length > 0) {
            const arbeoDiagsSortedByCreationDate = DateUtils.sortByDate(arbeoDiags, "creationDate")
            const lastArbeoDiag = arbeoDiagsSortedByCreationDate[0];
            const today = moment().format('DD/MM/YYYY')
            const isDiagMadeToday = moment(lastArbeoDiag.creationDate).utc(true).format('DD/MM/YYYY') === today;
            const isDiagMadeByLoggedUser = lastArbeoDiag.creator?.login?.toLowerCase() === currentUser?.login?.toLowerCase()

            if (lastArbeoDiag && isDiagMadeToday && isDiagMadeByLoggedUser) {
                launchDiagAnalysis(lastArbeoDiag)
            }
        } else {
            return;
        }
    }

    const launchDiagAnalysis = async (lastArbeoDiag) => {
        try {
            const request: DiagAnalysisRequestCLO = {
                caseId,
                loginCC: currentUser?.login,
                siebelCode: siebelAccount,
                billingAccountId,
                serviceId: client.serviceId!
            }

            const diagAnalysis: DiagAnalysisCLO = await caseService.getDiagArbeoAnalysis(request)

            if (diagAnalysis) {
                if (diagAnalysis.success) {
                    if (diagAnalysis.data?.additionalData?.length > 0) {

                        const lastArbeoDiagDetails = {
                            actId: lastArbeoDiag.id ? lastArbeoDiag.id : "",
                            arbeoDiagId: diagAnalysis.data?.arbeoDiagId ? diagAnalysis.data?.arbeoDiagId : ""
                        }
                        dispatch(setLastArbeoDiagDetails(caseId, lastArbeoDiagDetails));
                        dispatch(setActionCode(caseId, diagAnalysis.actCode));
                        dispatch(setActionLabel(caseId, diagAnalysis.actionLabel));
                        dispatch(setActionAdditionalDataV2(caseId, diagAnalysis.data?.additionalData));
                        dispatch(setBoucleADGV2(caseId, true));
                    }
                } else {
                    const diagAnalysisErrors = diagAnalysis.errors ? Object.keys(diagAnalysis.errors) : []
                    const diagAnalysisErrorLabel = diagAnalysisErrors[0]
                    NotificationManager.error(translate.formatMessage({ id: diagAnalysisErrorLabel }), null, 0, () => blockActionValidation(true));
                }
            }
        } catch (e) {
            const error = await e;
            console.error(error.message)
            NotificationManager.error(translate.formatMessage({ id: "regul.fixe.data.analyse.error" }), null, 200000)
        }
    }

    const notifyIfInvalidArbeo = (caseFromKafka: Case) => {
        const resourcesFromKafka: CaseResource[] | undefined = caseFromKafka.resources
        if (!resourcesFromKafka) {
            return;
        }
        const lastCaseUpdateTime = new Date(currentCaseState().currentCase!.updateDate).getTime()
        const invalidArbeo: CaseResource[] = resourcesFromKafka.filter(
            res => new Date(res.creationDate).getTime() > lastCaseUpdateTime && res.description === "RETOUR_ARBEO" && !res.valid)
        if (invalidArbeo.length) {
            NotificationManager.error(translate.formatMessage({ id: "arbeo.act.failed" }), null, 200000)
        }
    }

    const onMessage = (caseFromKafka) => {
        const eventArraySortedByDate = caseFromKafka.events.sort((a, b) => {
            a = new Date(a.date).getTime();
            b = new Date(b.date).getTime();
            return a > b ? -1 : a < b ? 1 : 0;
        });
        caseFromKafka.events = eventArraySortedByDate
        dispatch(storeCaseV2(caseFromKafka));
        if (currentCaseState().currentCase) {
            notifyIfInvalidArbeo(caseFromKafka)
        }
    }

    const canOpenModalMaxwell = (force?: boolean) => {
        if (force) {
            return force;
        }
        return themeSelected && themeSelected.length > 0 && themeSelected[0].incident && canOpenMaxwellModal;
    }

    return (
        <div>
            <SockJsClient url={process.env.REACT_APP_FASTR_API_URL + "/fastr-cases/subscribe-dossier/"}
                topics={["/topic/subscribeDossier-" + caseId]}
                onMessage={onMessage} />
            <Formsy onValid={onFormsyValid} onInvalid={onFormsyInValid} onSubmit={onSubmit}
                ref={refToFormsy}>
                <CaseHeaderV2 fromDisrc={sessionIsFrom === ApplicationMode.DISRC} onClick={getFromChangesFromInitialState}
                    formsyRef={formsyRef}
                    caseId={caseId}
                    actDetail={arbeoActDetail}
                    actCreator={retourArbeoResource?.creator}
                    actionsProps={actionsProps}
                    clientContext={client} />
                {currentCaseStateModalDisplayed &&
                    <ModalMatchingCaseV2 authorizations={authorizations}
                        caseId={caseId}
                        handleCaseSelected={handleCaseSelected ? handleCaseSelected : handleCaseSelectedSelf}
                        handleModalCanceled={handleCancelModalMatchingCase}
                    />
                }
                {canOpenModalMaxwell() && <ModalMaxwellV2 caseId={caseId} updateCase={onSubmit} cancelCase={onCancel} enableBtn={!ignoreMaxwellTreatment} />
                }

                <div className={"ml-auto d-flex"}>
                    <div className={"col-8 px-1 scroll-wrapper"}>
                        {
                            currentCaseStateSections?.map(section => CaseSectionV2({
                                ...section,
                                props: {
                                    caseId,
                                    currentNoteValue,
                                    descriptionFromQuickAcess,
                                    payload,
                                    getValuesFromFields,
                                    formsyRef,
                                    getDiffFromPristine,
                                    setHandleCancelModalMatchingCase,
                                    refreshCase: fetchCaseForFast,
                                    onCancel: actionsProps.onCancel
                                },
                            },
                                Placement.MAIN))
                        }
                    </div>
                    <div className={"col-4 px-1 scroll-wrapper bg-gradient-primary"}>
                        {
                            currentCaseStateSections?.map(section => CaseSectionV2({
                                ...section,
                                props: {
                                    caseId,
                                    currentNoteValue,
                                    descriptionFromQuickAcess,
                                    payload,
                                    getValuesFromFields,
                                    formsyRef,
                                    getDiffFromPristine,
                                    setHandleCancelModalMatchingCase,
                                    refreshCase: fetchCaseForFast,
                                    onCancel: actionsProps.onCancel
                                }
                            },
                                Placement.SECONDARY))
                        }
                    </div>
                </div>


                {// scaling.remove is changed when cancelling a scaling from an already saved scaled case
                    <FormHiddenInput
                        name="scaling.removed"
                        value={false}
                    />}

            </Formsy>
        </div>
    )
}

export default CasePageV2