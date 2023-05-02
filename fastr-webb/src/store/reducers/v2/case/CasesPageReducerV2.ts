import * as actionsTypes from "../../../actions/v2/case/CaseActionsTypes";
import {Case} from "src/model/Case";
import {ContactWrapper} from "../../../../model/Contact";
import {Activity} from "../../../../model/Activity";
import {CaseQualification} from "../../../../model/CaseQualification";
import {ActionType} from "../../../actions/v2/common/ActionType";
import {CaseBooleans, CaseSection} from "../../../../model/CaseCLO";
import {CaseRoutingRule} from "../../../../model/CaseRoutingRule";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {ScaledConclusionSetting} from "../../../../model/ScaledConclusionSetting";
import {RefObject} from "react";
import {Button} from "reactstrap";
import {MaxwellIncidentState} from "../../../../model/maxwell/MaxwellIncidentState";
import {MaxwellProcess} from "../../../../model/enums/MaxwellProcess";
import {EMaxwellCallOrigin} from "../../../../model/maxwell/enums/EMaxwellCallOrigin";
import {CaseActionState} from "../../../../model/caseActions/CaseActionState";

export interface CaseState {
    caseId: string,
    currentCase: Case | undefined
    // currentCaseQualification: CasesQualificationSettings | undefined, // requalif
    hasCallTransfer: boolean,
    isCurrentCaseScaled: boolean,
    isCurrentCaseCancelScaling: boolean,
    isTreatmentEnd: boolean,
    scalingEligibility: boolean,
    motif?: CaseQualification,
    qualificationLeaf,
    additionalData: any,
    addContact: boolean,
    alreadyLoadedContacts: Map<string, ContactWrapper>,
    isCallTransferStatusOKV2: boolean,
    qualifWasGivenInThePayload: boolean,
    isQualificationSelected: boolean
    isThemeSelected: boolean
    idActDisRC: string,
    currentNote: string,
    currentDescription: string,
    isMatchingCaseModalDisplayed: boolean,
    isCurrentlyRequalifying: boolean,
    scaledCaseConclusionSettings: Map<string, ScaledConclusionSetting[]>,
    isUnjustifiedFieldMandatory:boolean,
    matchingCaseFound: Case | undefined,
    scalingConclusionRefV2,
    errors: string[],
    sections: CaseSection[],
    validRoutingRule?: CaseRoutingRule,
    themeSelected?: CasesQualificationSettings,
    cancelScalingButtonRef?: RefObject<Button>,
    caseBooleans?: CaseBooleans,
    isScalingResume?: boolean,
    // START Fields for ACTS
    boucleADG: boolean,
    displayCancelButton: boolean,
    isCTIFinished: boolean,
    disableCancelADG: boolean,
    isFormCompleted: boolean,
    isDateHereForADGCTI: boolean,
    activitySelected?: Activity,
    hasInProgressIncident: boolean,
    hasInProgressIncidentExceptWaiting: boolean,
    incidentsIdsWithWaitingStatus: Array<string>,
    maxwellIncident: MaxwellIncidentState,
    // END Fields for ACTS
    caseAction: CaseActionState,
    hasInVerifiedGdprComments: boolean
}

export const EMPTY_CASE: CaseState = {
    caseId: "",
    // currentCaseQualification: undefined, // requalif
    currentCase: undefined,
    hasCallTransfer: false,
    isCurrentCaseScaled: false,
    isCurrentCaseCancelScaling: false,
    isTreatmentEnd: false,
    scalingEligibility: false,
    qualificationLeaf: undefined,
    additionalData: [],
    addContact: true,
    alreadyLoadedContacts: new Map(),
    isCallTransferStatusOKV2: true,
    qualifWasGivenInThePayload: false,
    isQualificationSelected: false,
    isThemeSelected: false,
    idActDisRC: "",
    currentNote: "",
    currentDescription: "",
    isMatchingCaseModalDisplayed: false,
    isCurrentlyRequalifying: false,
    scaledCaseConclusionSettings: new Map(),
    isUnjustifiedFieldMandatory:false,
    matchingCaseFound: undefined,
    scalingConclusionRefV2: undefined,
    errors: [],
    sections: [],
    validRoutingRule: undefined,
    themeSelected: undefined,
    cancelScalingButtonRef: undefined,
    caseBooleans: undefined,
    isScalingResume: undefined,
    // START Fields for ACTS
    boucleADG: false,
    displayCancelButton: true,
    isCTIFinished: true,
    disableCancelADG: false,
    isFormCompleted: true,
    isDateHereForADGCTI: false,
    activitySelected: undefined,
    motif: undefined,
    hasInProgressIncident: false,
    hasInProgressIncidentExceptWaiting: false,
    hasInVerifiedGdprComments:false,
    incidentsIdsWithWaitingStatus: [],
    maxwellIncident: {
        isFormMaxwellCompleted: false,
        incidentsMaxwell: [],
        uploadedFilesMaxwell: [],
        selectedIncidentMaxwell: undefined,
        troubleTicketResponse: undefined,
        additionalData: [],
        incidentTitle: "",
        troubleTicketProcess: MaxwellProcess.PROCESS_TO_VALIDATE,
        createOrUpdateADGProcess: MaxwellProcess.PROCESS_TO_VALIDATE,
        UploadFilesProcess: MaxwellProcess.PROCESS_TO_VALIDATE,
        callOrigin: EMaxwellCallOrigin.UNDEFINED,
        canOpenMaxwellModal: false,
        canBeClosedMaxwellModal: false,
        actIdToFinalize: undefined,
        lastSavedMaxwellActId: undefined,
        isMaxwellDropZoneEmpty: false,
        isMaxwellFormLastStep: false,
    },
    caseAction: {
        actionValidRoutingRule: undefined,
        actionThemeSelected: undefined,
        isActionThemeSelected: false,
        actionAdditionalData: [],
        actionComment: "",
        actionsList: [],
        actionProgressStatus: undefined,

        actionStatus: "",
        actionConclusion: undefined,
        doNotResolveActionBeforeDate: "",
        actionBlockingError: false,
        actionDisableValidation: false,
        specificActionRoutingRule: undefined,
        actionLabel: "",
        lastArbeoDiagDetails: undefined,
    }
    // END Fields for ACTS
};

export const EMPTY_MAXWELL_INCIDENT: MaxwellIncidentState = {
    isFormMaxwellCompleted: false,
    incidentsMaxwell: [],
    uploadedFilesMaxwell: [],
    selectedIncidentMaxwell: undefined,
    troubleTicketResponse: undefined,
    additionalData: [],
    incidentTitle: "",
    troubleTicketProcess: MaxwellProcess.PROCESS_TO_VALIDATE,
    createOrUpdateADGProcess: MaxwellProcess.PROCESS_TO_VALIDATE,
    UploadFilesProcess: MaxwellProcess.PROCESS_TO_VALIDATE,
    callOrigin: EMaxwellCallOrigin.UNDEFINED,
    canOpenMaxwellModal: false,
    canBeClosedMaxwellModal: false,
    actIdToFinalize: undefined,
    lastSavedMaxwellActId: undefined,
    isMaxwellDropZoneEmpty: false,
    isMaxwellFormLastStep: false,
}

export interface CasesPageState {
    loading: boolean
    casesList: any,
    errors: string[]
    processing?: boolean,
    adgQuickAccessPayload: any,
    infoToRefresh: boolean,
    selectedHistoRapide: any
}


const initialState: CasesPageState = {
    loading: false,
    processing: false,
    casesList: {}, // equivalent of a Map<caseId , CaseState>
    errors: [],
    adgQuickAccessPayload:{},
    infoToRefresh: false,
    selectedHistoRapide: {}
};

export function getCaseById(caseId, casesList) {
    return casesList.find(c => c.caseId === caseId)
}

export function CasesPageReducerV2(
    state = initialState,
    action: ActionType
): CasesPageState {
    let newCasesList;
    switch (action.type) {
        case actionsTypes.INIT_EMPTY_CASE_V2:
            const emptyCase: CaseState = {
                ...{...EMPTY_CASE},
                caseId: action.payload.caseId
            };
            newCasesList = {...state.casesList};
            newCasesList[action.payload.caseId] = emptyCase
            return {
                ...state,
                loading: false,
                casesList: newCasesList
            };
        case actionsTypes.STORE_CASE_V2:

            const aCase: CaseState = {
                ...EMPTY_CASE,
                ...state.casesList[action.payload.aCase.caseId],
                currentCase: action.payload.aCase,
                caseId: action.payload.aCase.caseId
            };
            newCasesList = {...state.casesList};
            newCasesList[action.payload.aCase.caseId] = aCase
            return {
                ...state,
                loading: false,
                casesList: newCasesList
            };
        case actionsTypes.CLEAR_CASE_FROM_CASES_LIST_V2:
            newCasesList = {...state.casesList};
            delete newCasesList[action.payload.caseId];
            return {
                ...state,
                loading: false,
                casesList: newCasesList
            };
        case actionsTypes.STORE_CASE_BOOLEANS_V2:
            state.casesList[action.payload.caseId].caseBooleans = action.payload.value;
            return {...state};
        case actionsTypes.SET_MUST_REQUALIFY_V2:
            state.casesList[action.payload.caseId].caseBooleans.mustCCReQualifyCurrentCase = action.payload.mustRequalif;
            return {...state};
        case actionsTypes.SET_HAS_CALL_TRANSFER_V2:
            state.casesList[action.payload.caseId].hasCallTransfer = action.payload.value;
            return {...state};
        case actionsTypes.SET_IS_CURRENTLY_REQUALIFYING_V2:
            state.casesList[action.payload.caseId].isCurrentlyRequalifying = action.payload.value;
            return {...state};
        case actionsTypes.SET_CANCEL_SCALING_BUTTON_REF_V2:
            state.casesList[action.payload.caseId].cancelScalingButtonRef = action.payload.value;
            return {...state};
        case actionsTypes.SET_IS_CURRENT_CASE_SCALED_V2:
            state.casesList[action.payload.caseId].isCurrentCaseScaled = action.payload.value;
            return {...state};
        case actionsTypes.SET_IS_CURRENT_CASE_CANCEL_SCALING_V2:
            state.casesList[action.payload.caseId].isCurrentCaseCancelScaling = action.payload.value;
            return {...state};
        case actionsTypes.SET_SCALING_CONCLUSION_REF_V2:
            state.casesList[action.payload.caseId].scalingConclusionRefV2 = action.payload.value;
            return {...state};
        case actionsTypes.SET_IS_TREATMENT_END_V2:
            state.casesList[action.payload.caseId].isTreatmentEnd = action.payload.value;
            return {...state};
        case actionsTypes.SET_CAN_CURRENT_CASE_BE_SCALED_V2:
            state.casesList[action.payload.caseId].scalingEligibility = action.payload.value;
            return {...state};
        case actionsTypes.SET_CURRENT_NOTE_V2:
            state.casesList[action.payload.caseId].currentNote = action.payload.value;
            return {...state};
        case actionsTypes.SET_CURRENT_DESCRIPTION_V2:
            state.casesList[action.payload.caseId].currentDescription = action.payload.value;
            return {...state};
        case actionsTypes.SET_QUALIFICATION_LEAF_V2:
            state.casesList[action.payload.caseId].qualificationLeaf = action.payload.qualificationLeaf;
            return {...state};
        case actionsTypes.SET_CALL_TRANSFER_STATUS_OK_V2:
            state.casesList[action.payload.caseId].isCallTransferStatusOKV2 = action.payload.value;
            return {...state};
        case actionsTypes.STORE_SCALED_CONCLUSION_SETTINGS_V2:
            state.casesList[action.payload.caseId].scaledCaseConclusionSettings = action.payload.value;
            return {...state};
        case actionsTypes.STORE_IS_UNJUSTIFIED_FIELD_MANDATORY_V2:
            state.casesList[action.payload.caseId].isUnjustifiedFieldMandatory = action.payload.value;
            return {...state};
        case actionsTypes.SET_ADD_CONTACT_V2:
            state.casesList[action.payload.caseId].addContact = action.payload.value;
            return {...state};
        case actionsTypes.SET_QUALIFICATION_SELECTED_TRUE_V2:
            state.casesList[action.payload.caseId].isQualificationSelected = true;
            return {...state};
        case actionsTypes.SET_QUALIFICATION_SELECTED_FALSE_V2:
            state.casesList[action.payload.caseId].isQualificationSelected = false;
            return {...state};
        case actionsTypes.SET_THEME_SELECTED_TRUE_V2:
            state.casesList[action.payload.caseId].isThemeSelected = true;
            return {...state};
        case actionsTypes.SET_THEME_SELECTED_FALSE_V2:
            state.casesList[action.payload.caseId].isThemeSelected = false;
            return {...state};
        case actionsTypes.SET_CASE_MOTIF_V2:
            state.casesList[action.payload.caseId].motif = action.payload.motif;
            return {...state};
        case actionsTypes.SET_VALID_ROUTING_RULE_V2:
            state.casesList[action.payload.caseId].validRoutingRule = action.payload.rule;
            return {...state};
        case actionsTypes.SET_ADDITIONAL_DATA_V2:
            state.casesList[action.payload.caseId].additionalData = action.payload.additionalData;
            return {...state};
        case actionsTypes.SET_IS_MATCHING_CASE_MODAL_DISPLAYED_V2:
            state.casesList[action.payload.caseId].isMatchingCaseModalDisplayed = action.payload.isDisplayed;
            return {...state};
        case actionsTypes.SET_THEME_SELECTED_V2:
            state.casesList[action.payload.caseId].themeSelected = action.payload.theme ? [action.payload.theme] : [];
            return {...state};

        case actionsTypes.SET_IS_SCALING_RESUME:
            state.casesList[action.payload.caseId].isScalingResume = action.payload.value;
            return {...state};

        case actionsTypes.SET_MATCHING_CASE_V2:
            state.casesList[action.payload.caseId].matchingCaseFound = action.payload.caseFound;
            return {...state};
        case actionsTypes.SET_QUALIFICATION_WAS_GIVEN_IN_THE_PAYLOAD_V2:
            state.casesList[action.payload.caseId].qualifWasGivenInThePayload = action.payload.value;
            return {...state};
        case actionsTypes.ADD_NOTE_CASE_SUCCESS_V2:
            state.casesList[action.payload.caseId].currentCase = action.payload.retrievedCase;
            return {...state};
        case actionsTypes.ADD_FETCHED_CONTACT_V2:
           if (action.payload) {
              const tempMap = new Map(state.casesList[action.payload.caseId].alreadyLoadedContacts);
              tempMap.set(action.payload.contactWrapper.contactId, action.payload.contactWrapper.value);
               state.casesList[action.payload.caseId].alreadyLoadedContacts = tempMap;
          }
          return {...state};
        case actionsTypes.SET_DISPLAY_CANCEL_BUTTON_V2 :
            state.casesList[action.payload.caseId].displayCancelButton = action.payload;
            return {...state};

        case actionsTypes.SET_BOUCLE_ADG_V2 :
            state.casesList[action.payload.caseId].boucleADG = action.payload.value;
            return {...state};

        case actionsTypes.CTI_FINISHED_V2 :
            state.casesList[action.payload.caseId].isCTIFinished = true;
            return {...state};

        case actionsTypes.CTI_ONGOING_V2 :
            state.casesList[action.payload.caseId].isCTIFinished = false;
            return {...state};

        case actionsTypes.FORM_INCOMPLETE_V2 :
            state.casesList[action.payload.caseId].isFormCompleted = false;
            return {...state};

        case actionsTypes.FORM_COMPLETE_V2 :
            state.casesList[action.payload.caseId].isFormCompleted = true;
            return {...state};

        case actionsTypes.SET_DISABLE_CANCEL_ADG_V2 :
            state.casesList[action.payload.caseId].disableCancelADG = action.payload.value;
            return {...state};

        case actionsTypes.SET_IS_DATE_HERE_FOR_ADG_CTI_V2 :
            state.casesList[action.payload.caseId].isDateHereForADGCTI = action.payload.value;
            return {...state};

        case actionsTypes.UPDATE_SECTIONS_V2 :
            state.casesList[action.payload.caseId].sections = action.payload.sections;
            return {...state};

        case actionsTypes.SET_MAXWELL_V2_DROPZONE_EMPTY:
            state.casesList[action.payload.caseId].maxwellIncident.isMaxwellDropZoneEmpty = true;
            return {...state};

        case actionsTypes.SET_MAXWELL_V2_DROPZONE_NOT_EMPTY:
            state.casesList[action.payload.caseId].maxwellIncident.isMaxwellDropZoneEmpty = false;
            return {...state};

        case actionsTypes.SET_MAXWELL_V2_FORM_LAST_STEP:
            state.casesList[action.payload.caseId].maxwellIncident.isMaxwellFormLastStep = true;
            return {...state};

        case actionsTypes.SET_MAXWELL_V2_FORM_NOT_LAST_STEP:
            state.casesList[action.payload.caseId].maxwellIncident.isMaxwellFormLastStep = false;
            return {...state};

        case actionsTypes.FORM_INCOMPLETE_MAXWELL_V2:
            state.casesList[action.payload.caseId].maxwellIncident.isFormMaxwellCompleted = false;
            return {...state};

        case actionsTypes.FORM_COMPLETE_MAXWELL_V2:
            state.casesList[action.payload.caseId].maxwellIncident.isFormMaxwellCompleted = true;
            return {...state};

        case actionsTypes.SET_INCIDENTS_OF_THEME_V2:
            state.casesList[action.payload.caseId].maxwellIncident.incidentsMaxwell = action.payload.incidents;
            return {...state};

        case actionsTypes.SET_UPLOADED_FILES_MAXWELL_V2:
            state.casesList[action.payload.caseId].maxwellIncident.uploadedFilesMaxwell = action.payload.uploadedFiles;
            return {...state};

        case actionsTypes.SET_INCIDENT_SELECTED_V2:
            state.casesList[action.payload.caseId].maxwellIncident.selectedIncidentMaxwell = action.payload.incident;
            return {...state};

        case actionsTypes.SET_ADDITIONAL_DATA_MAXWELL:
            state.casesList[action.payload.caseId].maxwellIncident.additionalData = action.payload.additionalData;
            return {...state};

        case actionsTypes.SET_MAXWELL_TROUBLE_TICKET_RESPONSE:
            state.casesList[action.payload.caseId].maxwellIncident.troubleTicketResponse = action.payload.troubleTicketResponse;
            return {...state};

        case actionsTypes.MAXWELL_INCIDENT_TITLE_V2:
            state.casesList[action.payload.caseId].maxwellIncident.incidentTitle = action.payload.incidentTitle;
            return {...state};

        case actionsTypes.MAXWELL_CALL_ORIGIN:
            state.casesList[action.payload.caseId].maxwellIncident.callOrigin = action.payload.callOrigin;
            return {...state};

        case actionsTypes.CAN_NOT_OPEN_MAXWELL_MODAL:
            state.casesList[action.payload.caseId].maxwellIncident.canOpenMaxwellModal = false;
            return {...state};

        case actionsTypes.CAN_OPEN_MAXWELL_MODAL:
            state.casesList[action.payload.caseId].maxwellIncident.canOpenMaxwellModal = true;
            return {...state};

        case actionsTypes.CAN_BE_CLOSED_MAXWELL_MODAL:
            state.casesList[action.payload.caseId].maxwellIncident.canBeClosedMaxwellModal = true;
            return {...state};

        case actionsTypes.TROUBLE_TICKET_PROCESS_LOADING:
            state.casesList[action.payload.caseId].maxwellIncident.troubleTicketProcess = MaxwellProcess.PROCESS_LOADING;
            return {...state};

        case actionsTypes.TROUBLE_TICKET_PROCESS_OK:
            state.casesList[action.payload.caseId].maxwellIncident.troubleTicketProcess = MaxwellProcess.PROCESS_OK;
            return {...state};

        case actionsTypes.TROUBLE_TICKET_PROCESS_KO:
            state.casesList[action.payload.caseId].maxwellIncident.troubleTicketProcess = MaxwellProcess.PROCESS_KO;
            return {...state};

        case actionsTypes.ADG_MAXWELL_PROCESS_LOADING:
            state.casesList[action.payload.caseId].maxwellIncident.createOrUpdateADGProcess = MaxwellProcess.PROCESS_LOADING;
            return {...state};

        case actionsTypes.ADG_MAXWELL_PROCESS_OK:
            state.casesList[action.payload.caseId].maxwellIncident.createOrUpdateADGProcess = MaxwellProcess.PROCESS_OK;
            return {...state};

        case actionsTypes.ADG_MAXWELL_PROCESS_KO:
            state.casesList[action.payload.caseId].maxwellIncident.createOrUpdateADGProcess = MaxwellProcess.PROCESS_KO;
            return {...state};

        case actionsTypes.ADG_MAXWELL_PROCESS_IGNORED:
            state.casesList[action.payload.caseId].maxwellIncident.createOrUpdateADGProcess = MaxwellProcess.PROCESS_IGNORED;
            return {...state};

        case actionsTypes.UPLOAD_FILES_PROCESS_LOADING:
            state.casesList[action.payload.caseId].maxwellIncident.UploadFilesProcess = MaxwellProcess.PROCESS_LOADING;
            return {...state};

        case actionsTypes.UPLOAD_FILES_PROCESS_OK:
            state.casesList[action.payload.caseId].maxwellIncident.UploadFilesProcess = MaxwellProcess.PROCESS_OK;
            return {...state};

        case actionsTypes.UPLOAD_FILES_PROCESS_KO:
            state.casesList[action.payload.caseId].maxwellIncident.UploadFilesProcess = MaxwellProcess.PROCESS_KO;
            return {...state};

        case actionsTypes.UPLOAD_FILES_PROCESS_IGNORED:
            state.casesList[action.payload.caseId].maxwellIncident.UploadFilesProcess = MaxwellProcess.PROCESS_IGNORED;
            return {...state};

        case actionsTypes.SET_MAXWELL_INCIDENTS_LIST_CLOSED:
            state.casesList[action.payload.caseId].maxwellIncident.isMaxwellIncidentList = false;
            return {...state};

        case actionsTypes.SET_MAXWELL_INCIDENTS_LIST_OPENED:
            state.casesList[action.payload.caseId].maxwellIncident.isMaxwellIncidentList = true;
            return {...state};

        case actionsTypes.MAXWELL_ACT_ID_TO_FINALIZE:
            state.casesList[action.payload.caseId].maxwellIncident.actIdToFinalize = action.payload.actId;
            return {...state};

        case actionsTypes.CASE_HAS_IN_PROGRESS_INCIDENT:
            state.casesList[action.payload.caseId].hasInProgressIncident = true;
            return {...state};

        case actionsTypes.CASE_HAS_NOT_IN_PROGRESS_INCIDENT:
            state.casesList[action.payload.caseId].hasInProgressIncident = false;
            return {...state};

        case actionsTypes.INIT_MAXWELL_INCIDENT:
            const addData = state.casesList[action.payload.caseId].maxwellIncident?.additionalData;
            newCasesList = {...state.casesList};
            newCasesList[action.payload.caseId].maxwellIncident = {...EMPTY_MAXWELL_INCIDENT}
            newCasesList[action.payload.caseId].maxwellIncident.additionalData = addData
            return {
                ...state,
                loading: false,
                casesList: newCasesList
            };

        case actionsTypes.CANCEL_MAXWELL_INCIDENT:
            newCasesList = {...state.casesList};
            newCasesList[action.payload.caseId].maxwellIncident = {...EMPTY_MAXWELL_INCIDENT}
            return {
                ...state,
                loading: false,
                casesList: newCasesList
            };

        case actionsTypes.SET_INCIDENT_IDS_WITH_WAITING_STATUS:
            state.casesList[action.payload.caseId].incidentsIdsWithWaitingStatus = action.payload.incidentsIds;
            return {...state};

        case actionsTypes.SET_SAVED_MAXWELL_ACT_ID:
            state.casesList[action.payload.caseId].maxwellIncident.lastSavedMaxwellActId = action.payload.actId;
            return {...state};

        case actionsTypes.CASE_HAS_IN_PROGRESS_INCIDENT_EXCEPT_WAITING:
            state.casesList[action.payload.caseId].hasInProgressIncidentExceptWaiting = true;
            return {...state};

        case actionsTypes.CASE_HAS_NOT_IN_PROGRESS_INCIDENT_EXCEPT_WAITING:
            state.casesList[action.payload.caseId].hasInProgressIncidentExceptWaiting = false;
            return {...state};

        case actionsTypes.SET_ACTION_THEME_SELECTED:
            state.casesList[action.payload.caseId].caseAction.actionThemeSelected = action.payload.actionTheme ? [action.payload.actionTheme] : [];
            return {...state};

        case actionsTypes.SET_ACTION_THEME_SELECTED_FALSE:
            state.casesList[action.payload.caseId].caseAction.isActionThemeSelected = false;
            return {...state};

        case actionsTypes.SET_ACTION_THEME_SELECTED_TRUE:
            state.casesList[action.payload.caseId].caseAction.isActionThemeSelected = true;
            return {...state};

        case actionsTypes.SET_ACTION_VALID_ROUTING_RULE:
            state.casesList[action.payload.caseId].caseAction.actionValidRoutingRule = action.payload.rule;
            return {...state};

        case actionsTypes.SET_ACTION_ADDITIONAL_DATA:
            state.casesList[action.payload.caseId].caseAction.actionAdditionalData = action.payload.actionAdditionalData;
            return {...state};

        case actionsTypes.SET_ACTION_COMMENT:
            state.casesList[action.payload.caseId].caseAction.actionComment = action.payload.value;
            return {...state};

        case actionsTypes.SET_ACTION_LIST:
            state.casesList[action.payload.caseId].caseAction.actionsList = action.payload.actionsList;
            return {...state};

        case actionsTypes.UPDATE_ACTION_PROGRESS_STATUS:
            state.casesList[action.payload.caseId].caseAction.actionProgressStatus = action.payload.actionProgressStatus;
            return {...state};

        case actionsTypes.SET_DO_NOT_RESOLVED_ACTION_BEFORE_DATE:
            state.casesList[action.payload.caseId].caseAction.doNotResolveActionBeforeDate = action.payload.value;
            return {...state};

        case actionsTypes.SET_ACTION_STATUS:
            state.casesList[action.payload.caseId].caseAction.actionStatus = action.payload.actionStatus;
            return {...state};

        case actionsTypes.SET_ACTION_CONCLUSION:
            state.casesList[action.payload.caseId].caseAction.actionConclusion = action.payload.actionConclusion;
            return {...state};

        case actionsTypes.SET_ACTION_CODE:
            state.casesList[action.payload.caseId].caseAction.codeAction = action.payload.value;
            return {...state};

        case actionsTypes.SET_ACTION_LABEL:
            state.casesList[action.payload.caseId].caseAction.actionLabel = action.payload.value;
            return {...state};

        case actionsTypes.SET_ACTION_BLOCKING_ERROR:
            state.casesList[action.payload.caseId].caseAction.actionBlockingError = action.payload.value;
            return {...state};

        case actionsTypes.SET_ACTION_DISABLE_VALIDATION:
            state.casesList[action.payload.caseId].caseAction.actionDisableValidation = action.payload.value;
            return {...state};

        case actionsTypes.SET_SPECIFIC_ACTION_ROUTING_RULE:
            state.casesList[action.payload.caseId].caseAction.specificActionRoutingRule = action.payload.value;
            return {...state};

        case actionsTypes.SET_LAST_ARBEO_DIAG_DETAILS:
            state.casesList[action.payload.caseId].caseAction.lastArbeoDiagDetails = action.payload.value;
            return {...state};

        case actionsTypes.SET_PAYLOAD_FROM_LIST_ADG_NOBEB:
            state.adgQuickAccessPayload = action.payload.payload
            return {...state};
        
        case actionsTypes.SET_SELECTED_HISTO_RAPIDE:
            state.selectedHistoRapide = action.payload.payload
            return {...state};
        
        case actionsTypes.CLEAR_QUICK_ADG_ACCESS_PAYLOAD:
            state.adgQuickAccessPayload = {};
            return { ...state };

        case actionsTypes.CASE_HAS_IN_VERIFIED_GDPR_COMMENTS:
            state.casesList[action.payload.caseId].hasInVerifiedGdprComments = true;
            return {...state};

        case actionsTypes.CASE_HAS_NOT_IN_VERIFIED_GDPR_COMMENTS:
            state.casesList[action.payload.caseId].hasInVerifiedGdprComments = false;
            return {...state};

        case actionsTypes.INFO_NEED_TO_BE_REFRESH:
            state.infoToRefresh = true;
            return { ...state };
        default:
            return state;
    }
}