import * as actionsTypes from "./CaseActionsTypes"
import {Case} from "../../../../model/Case";
import {AddNoteRequestDTO} from "../../../../model/AddNoteRequestDTO";
import {Contact, ContactWrapper} from "../../../../model/Contact";
import {Dispatch} from "redux";
import CaseService from "../../../../service/CaseService";
import {CaseQualification} from "../../../../model/CaseQualification";
import {CaseBooleans, CaseSection} from "../../../../model/CaseCLO";
import {CaseRoutingRule} from "../../../../model/CaseRoutingRule";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {ScaledConclusionSetting} from "../../../../model/ScaledConclusionSetting";
import {RefObject} from "react";
import {Button} from "reactstrap";
import {GenericIncident} from "../../../../model/GenericIncident";
import {CaseDataProperty} from "../../../../model/CaseDataProperty";
import {CaseState} from "../../../reducers/v2/case/CasesPageReducerV2";
import {TroubleTicketResponse} from "../../../../model/TroubleTicketResponse";
import {TroubleTicketRequest} from "../../../../model/TroubleTicketRequest";
import {
    buildTroubleTicketDto,
    buildTroubleTicketDtoFromQA,
    getKoTroubleTicketResponse
} from "../../../../utils/MaxwellUtilsV2";
import {
    buildStepDetailKO,
    buildStepDetailOK,
    MaxwellDataFormat
} from "../../../../views/v2/Acts/Maxwell/MaxwellDataFormat";
import {EMaxwellCallOrigin} from "../../../../model/maxwell/enums/EMaxwellCallOrigin";
import FASTRAct from "../../../../model/acts/FASTRAct";
import {MaxwellAct} from "../../../../model/maxwell/MaxwellAct";
import {ActCollection} from "../../../../model/service/ActCollection";
import {NotificationManager} from "react-notifications";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {EStepDetailName} from "../../../../model/maxwell/enums/EStepDetailName";
import {MaxwellStepDTO} from "../../../../model/maxwell/MaxwellStepDTO";
import {Action} from "../../../../model/actions/Action";
import {ProgressStatus} from "../../../../model/actions/ProgressStatus";
import shortid from "shortid";
import {ActionConclusion} from "../../../../model/actions/ActionConclusion";
import ActService from "../../../../service/ActService";
import {MaxwellIncidentUpdateRequest} from "../../../../model/maxwell/MaxwellIncidentUpdateRequest";
import {Payload} from "../../../../model/case/CaseActPayload";
import moment from "moment";

const caseService: CaseService = new CaseService(true);
const actService: ActService = new ActService(true);

const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

export const initEmptyCaseV2 = (caseId: string) => (
    {
        type: actionsTypes.INIT_EMPTY_CASE_V2,
        payload: {caseId}
    }
)

export const updateSectionsV2 = (caseId: string, sections: CaseSection[]) => (
    {
        type: actionsTypes.UPDATE_SECTIONS_V2,
        payload: {caseId, sections}
    }
)

export const storeCaseV2 = (aCase: Case) => (
    {
        type: actionsTypes.STORE_CASE_V2,
        payload: {aCase}
    }
)

export const storeCaseBooleansV2 = (caseId: string, value: CaseBooleans) => (
    {
        type: actionsTypes.STORE_CASE_BOOLEANS_V2,
        payload: {caseId, value}
    }
)

export function setMustRequalifyV2(caseId: string, mustRequalif: boolean) {
    return {type: actionsTypes.SET_MUST_REQUALIFY_V2, payload: {caseId, mustRequalif}}
}

export const clearCaseFromCasesListV2 = (caseId: string) => (
    {
        type: actionsTypes.CLEAR_CASE_FROM_CASES_LIST_V2,
        payload: {caseId}
    }
)

export function setAddContactV2(caseId: string, value: boolean) {
    return {type: actionsTypes.SET_ADD_CONTACT_V2, payload: {caseId, value}}
}

export function setHasCallTransferV2(caseId: string, value: boolean) {
    return {type: actionsTypes.SET_HAS_CALL_TRANSFER_V2, payload: {caseId, value}}
}

export function setIsCurrentlyRequalifyingV2(caseId: string, value: boolean) {
    return {type: actionsTypes.SET_IS_CURRENTLY_REQUALIFYING_V2, payload: {caseId, value}}
}

export function setCancelScalingButtonRefV2(caseId: string, value: RefObject<Button>) {
    return {type: actionsTypes.SET_CANCEL_SCALING_BUTTON_REF_V2, payload: {caseId, value}}
}

export function setIsCurrentCaseScaledV2(caseId: string, value: boolean) {
    return {type: actionsTypes.SET_IS_CURRENT_CASE_SCALED_V2, payload: {caseId, value}}
}

export function setIsCurrentCaseCancelScalingV2(caseId: string, value: boolean) {
    return {type: actionsTypes.SET_IS_CURRENT_CASE_CANCEL_SCALING_V2, payload: {caseId, value}}
}

export function setScalingConclusionRefV2(caseId: string, value) {
    return {type: actionsTypes.SET_SCALING_CONCLUSION_REF_V2, payload: {caseId, value}}
}

export function setIsTreatmentEndV2(caseId: string, value: boolean) {
    return {type: actionsTypes.SET_IS_TREATMENT_END_V2, payload: {caseId, value}}
}

export function setCanCurrentCaseBeScaledV2(caseId: string, value: boolean) {
    return {type: actionsTypes.SET_CAN_CURRENT_CASE_BE_SCALED_V2, payload: {caseId, value}}
}

export function setCurrentNoteV2(caseId: string, value: string) {
    return {type: actionsTypes.SET_CURRENT_NOTE_V2, payload: {caseId, value}}
}

export function setCurrentDescriptionV2(caseId: string, value: string) {
    return {type: actionsTypes.SET_CURRENT_DESCRIPTION_V2, payload: {caseId, value}}
}

export function setCallTransferStatusOKV2(caseId: string, value: boolean) {
    return {type: actionsTypes.SET_CALL_TRANSFER_STATUS_OK_V2, payload: {caseId, value}}
}

export function setIsScalingResume(caseId: string, value: boolean) {
    return {type: actionsTypes.SET_IS_SCALING_RESUME, payload: {caseId, value}}
}

export const storeScaledConclusionSettingsV2 = (caseId: string, scs: Map<string, ScaledConclusionSetting[]> | undefined) => (
    {
        type: actionsTypes.STORE_SCALED_CONCLUSION_SETTINGS_V2,
        payload: {caseId, value: scs}
    }
)

export const storeIsUnjustifiedFieldMandatoryV2 = (caseId: string, res: boolean | undefined) => (
    {
        type: actionsTypes.STORE_IS_UNJUSTIFIED_FIELD_MANDATORY_V2,
        payload: {caseId, value: res}
    }
)

export const handleTreatmentEndChangedV2 = (caseId: string, value: boolean, activityCode?, serviceType?, caseType?) => {
    return async dispatch => {
        if (value) {
            const resScaledConclusion = await caseService.getScaledConclusionSettings(activityCode, serviceType, caseType);
            dispatch(storeScaledConclusionSettingsV2(caseId, resScaledConclusion));

            const resUnjustifiedField = await caseService.isUnjustifiedFieldMandatory(activityCode, serviceType);
            dispatch(storeIsUnjustifiedFieldMandatoryV2(caseId, resUnjustifiedField));
        }
        dispatch(setIsTreatmentEndV2(caseId, value));
    }
}

export const addNewContactV2 = (caseId: string, note: AddNoteRequestDTO) => {
    return async dispatch => {
        dispatch(addNoteStartV2(caseId))
        try {
            const updatedCase: Case = await caseService.newContact(caseId, note)
            dispatch(addNoteSuccessV2(caseId, updatedCase))
        } catch (e) {
            const error = await e
            dispatch(errorAddNoteV2(caseId, error.message))
            throw e
        }
    }
}

export const getOrFetchContactV2 = (caseId: string, contactId: string, alreadyLoadedContacts: Map<string, ContactWrapper>, callback?) => {
    return async (dispatch: Dispatch) => {
        const targetContact = alreadyLoadedContacts.get(contactId);
        if (contactId && !targetContact || (targetContact && !targetContact.isContactComplete)) {
            try {
                const contact = await caseService.getContact(contactId)
                dispatch(addContactV2(caseId, {
                    contactId,
                    value: {
                        contact,
                        isContactComplete: contact.media !== null && contact.media !== undefined
                    }
                }));
            } catch (error) {
                dispatch(addContactV2(caseId, {
                    contactId,
                    value: {
                        contact: null,
                        isContactComplete: false
                    }
                }));
            }
        }
        if (callback) {
            return callback();
        }
    }
}

function addContactV2(caseId: string, contactWrapper) {
    return {
        type: actionsTypes.ADD_FETCHED_CONTACT_V2,
        payload: {
            caseId,
            contactWrapper
        }
    }
}

export function setQualificationLeafV2(caseId: string, qualificationLeaf) {
    return {type: actionsTypes.SET_QUALIFICATION_LEAF_V2, payload: {caseId, qualificationLeaf}}
}

export function setThemeSelectedV2(caseId: string, theme?: CasesQualificationSettings) {
    return {type: actionsTypes.SET_THEME_SELECTED_V2, payload: {caseId, theme}}
}

export const notifyThemeSelectionActionV2 = (caseId: string, themeSelection?: CasesQualificationSettings, rule?: CaseRoutingRule) => {
    return dispatch => {
        // dispatch   theme object selected or unselected
        themeSelection ? dispatch(setThemeSelectedV2(caseId, themeSelection)) : dispatch(setThemeSelectedV2(caseId));
        // dispatch valid routing rule
        rule ? dispatch(setValidRoutingRuleV2(caseId, rule)) : dispatch(setValidRoutingRuleV2(caseId));
    }

}

const addNoteStartV2 = (caseId: string) => (
    {
        type: actionsTypes.ADD_NOTE_CASE_START_V2, payload: caseId
    }
)

const addNoteSuccessV2 = (caseId: string, retrievedCase: Case) => (
    {
        type: actionsTypes.ADD_NOTE_CASE_SUCCESS_V2,
        payload: {caseId, retrievedCase}
    }
)

const errorAddNoteV2 = (caseId: string, error) => (
    {
        type: actionsTypes.ERROR_ADD_NOTE_CASE_V2,
        payload: {caseId, error}
    }
)

// START ACTS
export function setDisplayCancelButtonV2(caseId: string, value) {
    return {type: actionsTypes.SET_DISPLAY_CANCEL_BUTTON_V2, payload: {caseId, value}}
}

export const setBoucleADGV2 = (caseId: string, value: boolean) => {
    return {type: actionsTypes.SET_BOUCLE_ADG_V2, payload: {caseId, value}}
}
export const setCTIToFinishedV2 = (caseId: string) => {
    return {type: actionsTypes.CTI_FINISHED_V2, payload: {caseId}}
}
export const setCTIToOngoingV2 = (caseId: string) => {
    return {type: actionsTypes.CTI_FINISHED_V2, payload: {caseId}}
}

export function setFormIncompleteV2(caseId: string) {
    return {type: actionsTypes.FORM_INCOMPLETE_V2, payload: {caseId}}
}

export function setFormCompleteV2(caseId: string) {
    return {type: actionsTypes.FORM_COMPLETE_V2, payload: {caseId}}
}

export function setFormMaxwellIncompleteV2(caseId: string) {
    return {type: actionsTypes.FORM_INCOMPLETE_MAXWELL_V2, payload: {caseId}}
}

export function setMaxwellDropZoneEmpty(caseId: string) {
    return {type: actionsTypes.SET_MAXWELL_V2_DROPZONE_EMPTY, payload: {caseId}}
}

export function setMaxwellDropZoneNotEmpty(caseId: string) {
    return {type: actionsTypes.SET_MAXWELL_V2_DROPZONE_NOT_EMPTY, payload: {caseId}}
}

export function setMaxwellFormLastStep(caseId: string) {
    return {type: actionsTypes.SET_MAXWELL_V2_FORM_LAST_STEP, payload: {caseId}}
}

export function setNotMaxwellFormLastStep(caseId: string) {
    return {type: actionsTypes.SET_MAXWELL_V2_FORM_NOT_LAST_STEP, payload: {caseId}}
}

export function setInitMaxwellIncident(caseId: string) {
    return {type: actionsTypes.INIT_MAXWELL_INCIDENT, payload: {caseId}}
}

export function cancelMaxwellIncident(caseId: string) {
    return {type: actionsTypes.CANCEL_MAXWELL_INCIDENT, payload: {caseId}}
}

export function setFormMaxwellCompleteV2(caseId: string) {
    return {type: actionsTypes.FORM_COMPLETE_MAXWELL_V2, payload: {caseId}}
}

export function setMaxwellIncidentTitleV2(caseId: string, incidentTitle: string) {
    return {type: actionsTypes.MAXWELL_INCIDENT_TITLE_V2, payload: {caseId, incidentTitle}}
}

export function setCanOpenMaxwellModal(caseId: string) {
    return {type: actionsTypes.CAN_OPEN_MAXWELL_MODAL, payload: {caseId}}
}

export function setCanBeClosedMaxwellModal(caseId: string) {
    return {type: actionsTypes.CAN_BE_CLOSED_MAXWELL_MODAL, payload: {caseId}}
}

export function setCanNotOpenMaxwellModal(caseId: string) {
    return {type: actionsTypes.CAN_NOT_OPEN_MAXWELL_MODAL, payload: {caseId}}
}

export function setUploadedFilesMaxwellV2(caseId: string, uploadedFiles: Array<File>) {
    return {type: actionsTypes.SET_UPLOADED_FILES_MAXWELL_V2, payload: {caseId, uploadedFiles}}
}

export function setGenericIncidentSelectedV2(caseId: string, incident: GenericIncident) {
    return {type: actionsTypes.SET_INCIDENT_SELECTED_V2, payload: {caseId, incident}}
}

export function setTroubleTicketProcessLoading(caseId: string) {
    return {type: actionsTypes.TROUBLE_TICKET_PROCESS_LOADING, payload: {caseId}}
}

export function setTroubleTicketProcessOK(caseId: string) {
    return {type: actionsTypes.TROUBLE_TICKET_PROCESS_OK, payload: {caseId}}
}

export function setTroubleTicketProcessKO(caseId: string) {
    return {type: actionsTypes.TROUBLE_TICKET_PROCESS_KO, payload: {caseId}}
}

export function setADGMaxwellProcessLoading(caseId: string) {
    return {type: actionsTypes.ADG_MAXWELL_PROCESS_LOADING, payload: {caseId}}
}

export function setADGMaxwellProcessOK(caseId: string) {
    return {type: actionsTypes.ADG_MAXWELL_PROCESS_OK, payload: {caseId}}
}

export function setSavedMaxwellActId(caseId: string, actId: string) {
    return {type: actionsTypes.SET_SAVED_MAXWELL_ACT_ID, payload: {caseId, actId}}
}

export function setADGMaxwellProcessKO(caseId: string) {
    return {type: actionsTypes.ADG_MAXWELL_PROCESS_KO, payload: {caseId}}
}

export function setADGMaxwellProcessIgnored(caseId: string) {
    return {type: actionsTypes.ADG_MAXWELL_PROCESS_IGNORED, payload: {caseId}}
}

export function setUploadFilesProcessLoading(caseId: string) {
    return {type: actionsTypes.UPLOAD_FILES_PROCESS_LOADING, payload: {caseId}}
}

export function setUploadFilesProcessOK(caseId: string) {
    return {type: actionsTypes.UPLOAD_FILES_PROCESS_OK, payload: {caseId}}
}

export function setUploadFilesProcessKO(caseId: string) {
    return {type: actionsTypes.UPLOAD_FILES_PROCESS_KO, payload: {caseId}}
}

export function setUploadFilesProcessIgnored(caseId: string) {
    return {type: actionsTypes.UPLOAD_FILES_PROCESS_IGNORED, payload: {caseId}}
}

export function setCallOriginMaxwell(caseId: string, callOrigin: EMaxwellCallOrigin) {
    return {type: actionsTypes.MAXWELL_CALL_ORIGIN, payload: {caseId, callOrigin}}
}

export function setMaxwellActIdToFinalize(caseId: string, actId: string) {
    return {type: actionsTypes.MAXWELL_ACT_ID_TO_FINALIZE, payload: {caseId, actId}}
}

export function setDisableCancelADGV2(caseId: string, value: boolean) {
    return {type: actionsTypes.SET_DISABLE_CANCEL_ADG_V2, payload: {caseId, value}}
}

export function setIsDateHereForADGCTIV2(caseId: string, value: boolean) {
    return {type: actionsTypes.SET_IS_DATE_HERE_FOR_ADG_CTI_V2, payload: {caseId, value}}
}

// END ACTS

export function setQualificationIsNotSelectedV2(caseId: string,) {
    return {type: actionsTypes.SET_QUALIFICATION_SELECTED_FALSE_V2, payload: {caseId}}
}

export function setQualificationSelectedV2(caseId: string) {
    return {type: actionsTypes.SET_QUALIFICATION_SELECTED_TRUE_V2, payload: {caseId}}
}

export function setIsThemeSelectedV2(caseId: string) {
    return {type: actionsTypes.SET_THEME_SELECTED_TRUE_V2, payload: {caseId}}
}

export function setIsThemeNotSelectedV2(caseId: string) {
    return {type: actionsTypes.SET_THEME_SELECTED_FALSE_V2, payload: {caseId}}
}

export function setCaseMotifV2(caseId: string, motif: CaseQualification) {
    return {type: actionsTypes.SET_CASE_MOTIF_V2, payload: {caseId, motif}}
}

export function setValidRoutingRuleV2(caseId: string, rule?: CaseRoutingRule) {
    return {type: actionsTypes.SET_VALID_ROUTING_RULE_V2, payload: {caseId, rule}}
}

export function setAdditionalDataV2(caseId, additionalData: any) {
    return {type: actionsTypes.SET_ADDITIONAL_DATA_V2, payload: {caseId, additionalData}}
}

export function setAdditionalDataMaxwell(caseId, additionalData: CaseDataProperty[]) {
    return {type: actionsTypes.SET_ADDITIONAL_DATA_MAXWELL, payload: {caseId, additionalData}}
}

export function setMaxwellTroubleTicketResponse(caseId, troubleTicketResponse: TroubleTicketResponse) {
    return {type: actionsTypes.SET_MAXWELL_TROUBLE_TICKET_RESPONSE, payload: {caseId, troubleTicketResponse}}
}

export const setIsMatchingCaseModalDisplayedV2 = (caseId, isDisplayed: boolean) => ({
    type: actionsTypes.SET_IS_MATCHING_CASE_MODAL_DISPLAYED_V2,
    payload: {caseId, isDisplayed}
})

export const setMatchingCaseV2 = (caseId, caseFound: Case) => ({
    type: actionsTypes.SET_MATCHING_CASE_V2,
    payload: {caseId, caseFound}
})

export const setGenericIncidentsByThemeV2 = (caseId: string, incidents: Array<GenericIncident>) => ({
    type: actionsTypes.SET_INCIDENTS_OF_THEME_V2,
    payload: {caseId, incidents}
})

export const fetchAndStoreIncidentsV2 = (callOrigin: EMaxwellCallOrigin, caseId: string, codeTheme: string, allowForcedId: boolean, actId?: string, refCTT? : string) => {
    return async (dispatch: Dispatch) => {
        if (EMaxwellCallOrigin.FROM_HISTORY === callOrigin && !(actId == null)) {
            const maxwellActResponse = await actService.getMaxwellAct(actId)
            const incident = maxwellActResponse.maxwellAct.incident
            if (!(incident == null)) {
                const genericIncidents: GenericIncident[] = [
                    {
                        refCTT: incident.parentTicketId ? incident.parentTicketId : "",
                        description: incident.description ? incident.description : "",
                        techno: "",
                        ssa: "",
                        traitement: undefined,
                        codesThemesAssocies: "",
                        priorite: 1,
                        creationIng: false,
                        fastAlerte: false,
                        fastFiltre: false,
                        unknown: false,
                        parentTicketIdToSet: false,
                        incidentID: maxwellActResponse.actId? maxwellActResponse.actId: shortid.generate(),
                        intitule: incident.parentTicketIntitule ? incident.parentTicketIntitule : "",
                        actions: incident.parentTicketActions,
                        discoursClient: incident.parentTicketDiscoursClient,
                        parentTicketId: incident.parentTicketId ? incident.parentTicketId : ""
                    }
                ]
                dispatch(setGenericIncidentsByThemeV2(caseId, genericIncidents))
            }
        } else {
            let incidentsList: Array<GenericIncident>;
            if (refCTT) {
                const incidentRetrieve : GenericIncident = await caseService.getIncidentByRefCTT(refCTT);
                incidentsList = new Array<GenericIncident>(incidentRetrieve)
            } else {
                incidentsList = await caseService.getIncidentsByTheme(codeTheme);
                incidentsList.forEach(incident => {
                    incident.incidentID = shortid.generate();
                })
            }


            if (!allowForcedId) {
                const filtredIncident = incidentsList.filter(incident => incident.refCTT !== "Format: CXXXXXXXX");
                dispatch(setGenericIncidentsByThemeV2(caseId, filtredIncident))
            } else {
                dispatch(setGenericIncidentsByThemeV2(caseId, incidentsList))
            }
        }
    }
}

export const createTroubleTicketMaxwellV2FromADG = (currentCase: CaseState, currentContact: Contact | undefined, actId: string) => {
    const uploadedFilesMaxwell: Array<File> = currentCase.maxwellIncident.uploadedFilesMaxwell
    const maxwellCallOrigin: EMaxwellCallOrigin = currentCase.maxwellIncident.callOrigin
    const caseId: string = currentCase.caseId
    const contactId: string = currentContact ? currentContact.contactId : "";
    return async dispatch => {
        if (maxwellCallOrigin === EMaxwellCallOrigin.FROM_ADG || maxwellCallOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST) {
            dispatch(setTroubleTicketProcessLoading(caseId));
            try {
                const troubleTicketDTO: TroubleTicketRequest = buildTroubleTicketDto(currentCase)
                let response: TroubleTicketResponse | undefined;
                try {
                    response = await caseService.createTroubleTicket(troubleTicketDTO);
                } catch (e) {
                    const error = await e
                    await handleKOTroubleTicketStep(contactId, actId, error.status, error.message)
                    response = getKoTroubleTicketResponse();
                }
                if (response.status === "OK") {
                    dispatch(setMaxwellTroubleTicketResponse(caseId, response))
                    dispatch(setTroubleTicketProcessOK(caseId))
                    const act = MaxwellDataFormat(currentCase.maxwellIncident, currentCase, currentContact)
                    dispatch(createOrUpdateADGMaxwell(caseId, act));
                    dispatch(uploadMaxwellFilesV2(uploadedFilesMaxwell, caseId, response.refCtt,
                        response.attachementDirectory, troubleTicketDTO.idCase, contactId, actId))
                } else {
                    dispatch(setTroubleTicketProcessKO(currentCase.caseId))
                    dispatch(setMaxwellTroubleTicketResponse(currentCase.caseId, response))
                    dispatch(setADGMaxwellProcessIgnored(currentCase.caseId));
                    dispatch(setUploadFilesProcessIgnored(currentCase.caseId));
                }
            } catch (e) {
                dispatch(setTroubleTicketProcessKO(currentCase.caseId))
                dispatch(setMaxwellTroubleTicketResponse(currentCase.caseId, getKoTroubleTicketResponse()))
                dispatch(setADGMaxwellProcessIgnored(currentCase.caseId));
                dispatch(setUploadFilesProcessIgnored(currentCase.caseId));
            }
        }
    }
}


export const createTroubleTicketMaxwellV2FromIncidentsList = (currentCase: CaseState,
                                                              actIdToFinalize: string,
                                                              currentContact: Contact | undefined,
                                                              actId: string) => {
    const uploadedFilesMaxwell: Array<File> = currentCase.maxwellIncident.uploadedFilesMaxwell
    const maxwellCallOrigin: EMaxwellCallOrigin = currentCase.maxwellIncident.callOrigin
    const caseId: string = currentCase.caseId
    const contactId: string = currentContact ? currentContact.contactId : ""
    return async dispatch => {
        if (maxwellCallOrigin === EMaxwellCallOrigin.FROM_ADG || maxwellCallOrigin === EMaxwellCallOrigin.FROM_INCIDENTS_LIST) {
            dispatch(setTroubleTicketProcessLoading(caseId));
            try {
                const troubleTicketDTO: TroubleTicketRequest = buildTroubleTicketDto(currentCase)
                let response: TroubleTicketResponse | undefined;
                try {
                    response = await caseService.createTroubleTicket(troubleTicketDTO);
                } catch (e) {
                    const error = await e
                    await handleKOTroubleTicketStep(contactId, actId, error.status, error.message)
                    response = getKoTroubleTicketResponse();
                }

                if (response && response.status === "OK") {
                    dispatch(setMaxwellTroubleTicketResponse(caseId, response))
                    dispatch(setTroubleTicketProcessOK(caseId))
                    dispatch(finalizeActWithIncident(caseId, actIdToFinalize, response.refCtt, currentContact ? currentContact.contactId : "", currentCase.maxwellIncident.selectedIncidentMaxwell));
                    dispatch(uploadMaxwellFilesV2(uploadedFilesMaxwell, caseId, response.refCtt, response.attachementDirectory
                        , troubleTicketDTO.idCase, contactId, actId))
                } else {
                    dispatch(setTroubleTicketProcessKO(currentCase.caseId))
                    dispatch(setMaxwellTroubleTicketResponse(currentCase.caseId, response))
                    dispatch(setADGMaxwellProcessIgnored(currentCase.caseId));
                    dispatch(setUploadFilesProcessIgnored(currentCase.caseId));
                }
            } catch (e) {
                dispatch(setTroubleTicketProcessKO(currentCase.caseId))
                dispatch(setMaxwellTroubleTicketResponse(currentCase.caseId, getKoTroubleTicketResponse()))
                dispatch(setADGMaxwellProcessIgnored(currentCase.caseId));
                dispatch(setUploadFilesProcessIgnored(currentCase.caseId));
            }
        }
    }
}

export const createTroubleTicketMaxwellV2FromQAMaxwell = (currentCase: CaseState,
                                                          currentContact: Contact | undefined,
                                                          themeQualifTags: string[],
                                                          updateCase: () => Promise<void>,
                                                          setIgnoreMaxwellTreatment: (value: (((prevState: boolean) => boolean) | boolean)) => void) => {
    const uploadedFilesMaxwell: Array<File> = currentCase.maxwellIncident.uploadedFilesMaxwell;
    const caseId: string = currentCase.caseId;
    const contactId: string = currentContact ? currentContact.contactId : "";
    const maxwellId : string | undefined = currentCase.maxwellIncident.lastSavedMaxwellActId
    return async dispatch => {
        dispatch(setTroubleTicketProcessLoading(caseId));
        try {
            const troubleTicketDTO: TroubleTicketRequest = buildTroubleTicketDtoFromQA(currentCase, themeQualifTags)
            let response: TroubleTicketResponse | undefined;
            try {
                response = await caseService.createTroubleTicket(troubleTicketDTO);
            } catch (e) {
                const error = await e
                await handleKOTroubleTicketStep(contactId, maxwellId!, error.status, error.message)
                response = getKoTroubleTicketResponse();
            }

            if (response && response.status === "OK") {
                dispatch(setMaxwellTroubleTicketResponse(caseId, response))
                dispatch(setTroubleTicketProcessOK(caseId))
                dispatch(uploadMaxwellFilesV2(uploadedFilesMaxwell, caseId, response.refCtt, response.attachementDirectory
                    , troubleTicketDTO.idCase, contactId, maxwellId!))
                dispatch(finalizeActWithIncidentQaMaxwell(caseId, maxwellId!, response.refCtt, currentContact ? currentContact.contactId : "", currentCase.maxwellIncident.selectedIncidentMaxwell))
                await updateCase()
            } else {
                dispatch(setTroubleTicketProcessKO(currentCase.caseId))
                dispatch(setMaxwellTroubleTicketResponse(currentCase.caseId, response))
                dispatch(setADGMaxwellProcessIgnored(currentCase.caseId));
                dispatch(setUploadFilesProcessIgnored(currentCase.caseId));
                setIgnoreMaxwellTreatment(true);
                NotificationManager.error(translate.formatMessage({id: "act.QA_ADG_MAXWELL.step.validation.error.noSave"}))
            }
        } catch (e) {
            console.log("Catch ", e, " [KO]")
            dispatch(setTroubleTicketProcessKO(currentCase.caseId))
            dispatch(setMaxwellTroubleTicketResponse(currentCase.caseId, getKoTroubleTicketResponse()))
            dispatch(setADGMaxwellProcessIgnored(currentCase.caseId));
            dispatch(setUploadFilesProcessIgnored(currentCase.caseId));
        }
    }
}


export const createOrUpdateADGMaxwell = (caseId: string, act: FASTRAct<MaxwellAct>) => {
    return async dispatch => {
        dispatch(setADGMaxwellProcessLoading(caseId));
        try {
            const savedCase: Case = await caseService.executeADG(act);
            dispatch(setADGMaxwellProcessOK(caseId));
            const reducer = (accumulator, currentValue) => {
                if (accumulator > currentValue.creationDate) {
                    return currentValue;
                }
            }
            const lastADG = savedCase.resources.reduce(reducer);
            dispatch(setSavedMaxwellActId(caseId, lastADG.id))
        } catch (e) {
            dispatch(setADGMaxwellProcessKO(caseId));
        }
    }
}

export const uploadMaxwellFilesV2 = (files: File[], caseId: string, ticketId: string, attachmentDirectory: string,
                                     troubleCaseId: string, contactId: string, actId: string) => {
    return async dispatch => {
        dispatch(setUploadFilesProcessLoading(caseId));
        try {
            const res: string = await caseService.uploadFilesV2(files, troubleCaseId, ticketId, attachmentDirectory);
            if (res) {
                dispatch(setUploadFilesProcessOK(caseId));
            } else {
                dispatch(setUploadFilesProcessKO(caseId));
                await handleKOMinioPJ(contactId, actId, "500", "ERROR while downloading MINIO PJ")
            }
        } catch (e) {
            const error = await e
            dispatch(setUploadFilesProcessKO(caseId));
            await handleKOMinioPJ(contactId, actId, error.status + "", error.message)
        }
    }
}

async function handleKOMinioPJ(currentContactId: string | undefined, actId: string, errorCode, errorMessage) {
    const stepDetailKo: MaxwellStepDTO = buildStepDetailKO(currentContactId, EStepDetailName.MINIO_PJ, errorCode, errorMessage)
    await handleStepsDetails(stepDetailKo, actId);
}

async function handleKOTroubleTicketStep(currentContactId: string | undefined, actId: string, errorCode, errorMessage) {
    const stepDetailKo: MaxwellStepDTO = buildStepDetailKO(currentContactId, EStepDetailName.CLFY_TT, errorCode, errorMessage)
    await handleStepsDetails(stepDetailKo, actId);
}

async function handleStepsDetails(stepDetails: MaxwellStepDTO, actId: string) {
    try {
        await caseService.addStepsDetailsToMaxwellAct([stepDetails], actId);
    } catch (e) {
        NotificationManager.error(translate.formatMessage({id: "act.ADG_MAXWELL.step.validation.error.withoutTicket.update.stepsDetails"}))
    }
}

export const initMaxwellAttachments = (files: File[], caseId: string, actId: string, contactId: string) => {
    return async dispatch => {
        dispatch(setUploadFilesProcessLoading(caseId));
        try {
            const res: ActCollection = await caseService.uploadMaxwellAttachments(files, caseId, actId, contactId);
            if (res) {
                dispatch(setUploadFilesProcessOK(caseId));
            } else {
                dispatch(setUploadFilesProcessKO(caseId));
            }
        } catch (e) {
            const error = await e
            dispatch(setUploadFilesProcessKO(caseId));
            const stepDetailKo: MaxwellStepDTO = buildStepDetailKO(contactId, EStepDetailName.MINIO_PJ, error.status, error.message)
            await handleStepsDetails(stepDetailKo, actId);
        }
    }
}

export const resolveActWithoutIncident = (currentCase: CaseState, caseId: string, actId: string, currentContactId: string) => {
    const uploadedFilesMaxwell: Array<File> = currentCase.maxwellIncident.uploadedFilesMaxwell
    return async dispatch => {
        dispatch(setADGMaxwellProcessLoading(caseId));
        try {
            const maxwellIncident = currentCase.maxwellIncident.selectedIncidentMaxwell
            const maxwellIncidentUpdateRequest: MaxwellIncidentUpdateRequest = {
                actId,
                ticketId: null,
                contactId: currentContactId,
                parentTicketId: maxwellIncident?.refCTT ? maxwellIncident?.refCTT : null,
                parentTicketIntitule: maxwellIncident?.parentTicketIdToSet === true ? translate.formatMessage({id: "act.ADG_MAXWELL.finalize.associateParentTicketManually"}) : maxwellIncident?.intitule,
                parentTicketDescription: maxwellIncident?.description ? maxwellIncident?.description : null,
                parentTicketDiscoursClient: maxwellIncident?.discoursClient ? maxwellIncident?.discoursClient : null,
                parentTicketActions: maxwellIncident?.actions ? maxwellIncident?.actions : null
            }
            await caseService.resolveMaxwellActWithoutIncident(maxwellIncidentUpdateRequest);
            dispatch(setADGMaxwellProcessOK(caseId));
            const stepDetail: MaxwellStepDTO = buildStepDetailOK(currentContactId, EStepDetailName.SAVE_ACT)
            await handleStepsDetails(stepDetail, actId);
            dispatch(setTroubleTicketProcessOK(caseId));
            dispatch(initMaxwellAttachments(uploadedFilesMaxwell, caseId, actId, currentContactId))
            NotificationManager.success(translate.formatMessage({id: "act.ADG_MAXWELL.step.validation.success.withoutTicket"}))
        } catch (e) {
            NotificationManager.error(translate.formatMessage({id: "act.ADG_MAXWELL.step.validation.error.withoutTicket"}))
            dispatch(setADGMaxwellProcessKO(caseId));
        }
    }
}


export const finalizeActWithIncident = (caseId: string, actId: string, ticketId: string, contactId: string, maxwellIncident?: GenericIncident) => {
    return async dispatch => {
        dispatch(setADGMaxwellProcessLoading(caseId));
        try {
            const maxwellFinalizeRequest: MaxwellIncidentUpdateRequest = {
                actId,
                ticketId,
                contactId,
                parentTicketId: maxwellIncident?.refCTT? maxwellIncident?.refCTT: null,
                parentTicketIntitule: maxwellIncident?.parentTicketIdToSet === true ? translate.formatMessage({id: "act.ADG_MAXWELL.finalize.associateParentTicketManually"}) : maxwellIncident?.intitule,
                parentTicketDescription: maxwellIncident?.description ? maxwellIncident?.description : null,
                parentTicketDiscoursClient: maxwellIncident?.discoursClient ? maxwellIncident?.discoursClient : null,
                parentTicketActions: maxwellIncident?.actions ? maxwellIncident?.actions : null
            }
            await caseService.finalizeMaxwellAct(maxwellFinalizeRequest);
            dispatch(setADGMaxwellProcessOK(caseId));
            const stepDetail: MaxwellStepDTO = buildStepDetailOK(contactId, EStepDetailName.SAVE_ACT)
            await handleStepsDetails(stepDetail, actId);
        } catch (e) {
            dispatch(setADGMaxwellProcessKO(caseId));
        }
    }
}

export const finalizeActWithIncidentQaMaxwell = (caseId: string, actId: string, ticketId: string, contactId: string, maxwellIncident?: GenericIncident) => {
    return async dispatch => {
        dispatch(setADGMaxwellProcessLoading(caseId));
        try {
            const now: Date = moment().utc(true).toDate();
            const maxwellFinalizeRequest: MaxwellIncidentUpdateRequest = {
                actId,
                ticketId,
                contactId,
                parentTicketId: maxwellIncident?.refCTT? maxwellIncident?.refCTT: null,
                parentTicketIntitule: maxwellIncident?.parentTicketIdToSet === true ? translate.formatMessage({id: "act.ADG_MAXWELL.finalize.associateParentTicketManually"}) : maxwellIncident?.intitule,
                technicalResult: [moment.utc(now).format(DATETIME_FORMAT) + " - Ticket créé et affecté dans l'outil de ticketing"],
            }
            await caseService.finalizeMaxwellAct(maxwellFinalizeRequest);
            dispatch(setADGMaxwellProcessOK(caseId));
            const stepDetail: MaxwellStepDTO = buildStepDetailOK(contactId, EStepDetailName.SAVE_ACT)
            await handleStepsDetails(stepDetail, actId);
        } catch (e) {
            dispatch(setADGMaxwellProcessKO(caseId));
        }
    }
}


export function setQualifWasGivenInThePayloadV2(caseId, value: boolean) {
    return {type: actionsTypes.SET_QUALIFICATION_WAS_GIVEN_IN_THE_PAYLOAD_V2, payload: {caseId, value}}
}

export function setMaxwellIncidentsListClosed(caseId: string) {
    return {type: actionsTypes.SET_MAXWELL_INCIDENTS_LIST_CLOSED, payload: {caseId}}
}

export function setCaseHasInProgressIncident(caseId: string) {
    return {type: actionsTypes.CASE_HAS_IN_PROGRESS_INCIDENT, payload: {caseId}}
}

export function setCaseHasInProgressIncidentExceptWaiting(caseId: string) {
    return {type: actionsTypes.CASE_HAS_IN_PROGRESS_INCIDENT_EXCEPT_WAITING, payload: {caseId}}
}

export function setCaseHasNotInProgressIncidentExceptWaiting(caseId: string) {
    return {type: actionsTypes.CASE_HAS_NOT_IN_PROGRESS_INCIDENT_EXCEPT_WAITING, payload: {caseId}}
}

export function setIncidentsIdsWithWaitingStatus(caseId: string, incidentsIds: Array<string>) {
    return {type: actionsTypes.SET_INCIDENT_IDS_WITH_WAITING_STATUS, payload: {caseId, incidentsIds}}
}

export function setCaseHasNotInProgressIncident(caseId: string) {
    return {type: actionsTypes.CASE_HAS_NOT_IN_PROGRESS_INCIDENT, payload: {caseId}}
}

export function setMaxwellIncidentsListOpened(caseId: string) {
    return {type: actionsTypes.SET_MAXWELL_INCIDENTS_LIST_OPENED, payload: {caseId}}
}

// SOCLE DES ACTIONS

export function setIsActionThemeNotSelected(caseId: string) {
    return {type: actionsTypes.SET_ACTION_THEME_SELECTED_FALSE, payload: {caseId}}
}

export function setIsActionThemeSelected(caseId: string) {
    return {type: actionsTypes.SET_ACTION_THEME_SELECTED_TRUE, payload: {caseId}}
}

function setActionThemeSelectedV2(caseId: string, actionTheme?: CasesQualificationSettings) {
    return {type: actionsTypes.SET_ACTION_THEME_SELECTED, payload: {caseId, actionTheme}}
}

export function setActionValidRoutingRule(caseId: string, rule?: CaseRoutingRule) {
    return {type: actionsTypes.SET_ACTION_VALID_ROUTING_RULE, payload: {caseId, rule}}
}

export const notifyActionThemeSelectionActionV2 = (caseId: string, actionThemeSelection?: CasesQualificationSettings, rule?: CaseRoutingRule) => {
    return dispatch => {
        // dispatch   action theme object selected or unselected
        actionThemeSelection ? dispatch(setActionThemeSelectedV2(caseId, actionThemeSelection)) : dispatch(setActionThemeSelectedV2(caseId));
        // dispatch action valid routing rule
        rule ? dispatch(setActionValidRoutingRule(caseId, rule)) : dispatch(setActionValidRoutingRule(caseId));
    }
}

export function setActionAdditionalDataV2(caseId, actionAdditionalData: any) {
    return {type: actionsTypes.SET_ACTION_ADDITIONAL_DATA, payload: {caseId, actionAdditionalData}}
}

export function setActionComment(caseId: string, value: string) {
    return {type: actionsTypes.SET_ACTION_COMMENT, payload: {caseId, value}}
}

export const setActionslist = (caseId: string, actionsList: Array<Action>) => ({
    type: actionsTypes.SET_ACTION_LIST,
    payload: {caseId, actionsList}
})

export function updateActionProgressStatus(caseId: string, actionProgressStatus?: ProgressStatus) {
    return {type: actionsTypes.UPDATE_ACTION_PROGRESS_STATUS, payload: {caseId, actionProgressStatus}}
}

export function setDoNotResolveActionBeforeDate(caseId: string, value: Date) {
    return {type: actionsTypes.SET_DO_NOT_RESOLVED_ACTION_BEFORE_DATE, payload: {caseId, value}}
}

export function setActionStatus(caseId: string, actionStatus: string) {
    return {type: actionsTypes.SET_ACTION_STATUS, payload: {caseId, actionStatus}}
}

export function setActionConclusion(caseId: string, actionConclusion: ActionConclusion) {
    return {type: actionsTypes.SET_ACTION_CONCLUSION, payload: {caseId, actionConclusion}}
}

export const setActionCode = (caseId: string, value: string) => {
    return {type: actionsTypes.SET_ACTION_CODE, payload: {caseId, value}}
}

export const setActionLabel = (caseId: string, value: string) => {
    return {type: actionsTypes.SET_ACTION_LABEL, payload: {caseId, value}}
}

export const setActionBlockingError = (caseId: string, value: boolean) => {
    return {type: actionsTypes.SET_ACTION_BLOCKING_ERROR, payload: {caseId, value}}
}

export const setActionDisableValidation = (caseId: string, value: boolean) => {
    return {type: actionsTypes.SET_ACTION_DISABLE_VALIDATION, payload: {caseId, value}}
}

export const setSpecificActionValidRoutingRule = (caseId: string, value: any) => {
    return {type: actionsTypes.SET_SPECIFIC_ACTION_ROUTING_RULE, payload: {caseId, value}}
}

export const setLastArbeoDiagDetails = (caseId: string, value: any) => {
    return {type: actionsTypes.SET_LAST_ARBEO_DIAG_DETAILS, payload: {caseId, value}}
}

export const setPayloadFromQuickAccessV2 = (payload: Payload) => {
    return {type: actionsTypes.SET_PAYLOAD_FROM_LIST_ADG_NOBEB, payload: {payload}}
}

export const setSelectedHistoRapide = (payload) => {
    return {type: actionsTypes.SET_SELECTED_HISTO_RAPIDE, payload: {payload}}
}

export const clearPayloadFromQuickAccessV2 = () => {
    return { type: actionsTypes.CLEAR_QUICK_ADG_ACCESS_PAYLOAD }
}

export function setCaseHasInVerifiedGdprComments(caseId: string) {
    return {type: actionsTypes.CASE_HAS_IN_VERIFIED_GDPR_COMMENTS, payload: {caseId}}
}
export function setCaseHasNotInVerifiedGdprComments(caseId: string) {
    return {type: actionsTypes.CASE_HAS_NOT_IN_VERIFIED_GDPR_COMMENTS, payload: {caseId}}
}

export const infoNeedToBeRefresh = () => {
    return {
        type: actionsTypes.INFO_NEED_TO_BE_REFRESH
    }
}