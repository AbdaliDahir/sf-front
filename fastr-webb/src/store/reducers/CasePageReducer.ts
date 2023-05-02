import {CaseQualification} from "../../model/CaseQualification";
import {CaseRoutingRule} from "../../model/CaseRoutingRule";
import {CasesQualificationSettings} from "../../model/CasesQualificationSettings";
import {MaxwellProcess} from "../../model/enums/MaxwellProcess";
import {TicketCreationState} from "../../model/TicketCreationState";
import * as actionTypes from "../actions/actionsTypes";
import {Activity} from "../../model/Activity";
import {GenericIncident} from "../../model/GenericIncident";
import {ContactWrapper} from "../../model/Contact";
import {IncidentsListItem} from "../../model/IncidentsList";

export interface CasePageState {
    updateMode: boolean
    isUpdateEnabled: boolean
    isScalingMode: boolean
    isCurrUserEliToUpdateScaledCase: boolean
    scalingEligibility: boolean
    validRoutingRule?: CaseRoutingRule
    revertScalingCaseMode: boolean
    isWithAutoAssign: boolean
    isFromAutoAssign: boolean
    isFormCompleted: boolean
    isFormMaxellCompleted: boolean
    isFormsyValid: boolean
    finishingTreatment: boolean
    isCurrentOwner: boolean
    showModal: boolean
    isOnlyNote: boolean
    forceNote: boolean
    addContactForNote: boolean
    blockAdgAfterSending: boolean
    adgFailureReason: string
    qualification?
    addContact: boolean
    motif?: CaseQualification
    theme?: CasesQualificationSettings
    isLoadingQualification: boolean
    isLoadingMotif: boolean
    additionDataOfQualifsAndTheme: any
    isAutoAssignEnabled: boolean
    isCurrentUserEliToAutoAssign: boolean
    isCurrUserEliToUpdateImmediateCase: boolean
    isCurrUserEliToAddNoteToCase: boolean
    isCurrUserEliToReQualifyImmediateCase: boolean
    isCurrUserObligedToReQualifyImmediateCase: boolean
    isCurrUserEliToUpdateMandatoryADGForCurrentCase: boolean
    failedADG: boolean
    isQualificationSelected: boolean
    isLoadingScalingEligibility: boolean
    qualificationLeaf
    activitySelected?: Activity
    hasCallTransfer: boolean
    isCallTransferStatusOK: boolean
    qualifWasGivenInThePayload: boolean
    boucleADG: boolean
    ADGDoneByBoucleADG: boolean
    incidentSelected?: GenericIncident
    incidents?: Array<GenericIncident>
    uploadedFiles?: Array<File>
    ticketCreationProcess: TicketCreationState
    uploadingFilesProcess: MaxwellProcess
    maxwellCaseCreationProcess: MaxwellProcess
    maxwellModalOpen: boolean,
    showModalForMaxwellProcess: boolean
    maxwellModalCanBeClose: boolean
    isDateHereForADGCTI: boolean
    resetRetentionForm: boolean
    resetAntiChurnForm: boolean
    displayCancelButton: boolean
    disRCShowUpdateCase: boolean
    isAutoAssignButtonDisabled: boolean
    disRcAdgMotif: CaseQualification
    idActDisRC: string
    displayGridADGForDISRC: boolean
    disableCancelADG: boolean
    userActivity: string
    currentContactId: string
    alreadyLoadedContacts: Map<string, ContactWrapper>
    isForceAutoAssign: boolean
    scalingConclusionRef: HTMLDivElement | null;
    incidentsList: Array<IncidentsListItem>
}

const initialState: CasePageState = {
    updateMode: false,
    isUpdateEnabled: false,
    isScalingMode: false,
    displayCancelButton: true,
    disableCancelADG: false,
    isCurrUserEliToUpdateScaledCase: false,
    scalingEligibility: false,
    validRoutingRule: undefined,
    revertScalingCaseMode: false,
    isWithAutoAssign: false,
    isFromAutoAssign: false,
    isAutoAssignButtonDisabled: false,
    isForceAutoAssign: false,
    isFormCompleted: true,
    isFormsyValid: false,
    finishingTreatment: false,
    isCurrentOwner: false,
    addContact: true,
    showModal: false,
    isOnlyNote: false,
    forceNote: false,
    addContactForNote: false,
    adgFailureReason: "",
    qualification: undefined,
    motif: undefined,
    theme: undefined,
    isLoadingQualification: true,
    isLoadingMotif: true,
    additionDataOfQualifsAndTheme: [],
    isAutoAssignEnabled: false,
    isCurrentUserEliToAutoAssign: false,
    isCurrUserEliToUpdateImmediateCase: false,
    isCurrUserEliToAddNoteToCase: false,
    isCurrUserEliToReQualifyImmediateCase: false,
    isCurrUserObligedToReQualifyImmediateCase: false,
    isCurrUserEliToUpdateMandatoryADGForCurrentCase : false,
    failedADG: false,
    hasCallTransfer: false,
    isCallTransferStatusOK: true,
    isQualificationSelected: false,
    isLoadingScalingEligibility: false,
    qualificationLeaf: undefined,
    activitySelected: undefined,
    qualifWasGivenInThePayload: false,
    boucleADG: false,
    ADGDoneByBoucleADG: false,
    incidentSelected: undefined,
    blockAdgAfterSending: false,
    incidents: [],
    ticketCreationProcess: {
        idTicket: "",
        state: MaxwellProcess.PROCESS_LOADING,
        attachementDirectory: ""
    },
    maxwellCaseCreationProcess: MaxwellProcess.PROCESS_LOADING,
    uploadingFilesProcess: MaxwellProcess.PROCESS_LOADING,
    uploadedFiles: [],
    maxwellModalOpen: true,
    showModalForMaxwellProcess: false,
    maxwellModalCanBeClose: false,
    isFormMaxellCompleted: true,
    isDateHereForADGCTI: false,
    resetRetentionForm: false,
    resetAntiChurnForm: false,
    disRCShowUpdateCase: false,
    disRcAdgMotif: {
        code: "",
        caseType: "",
        tags: [],
        inactivityDelay: 0
    },
    idActDisRC: "",
    displayGridADGForDISRC: true,
    userActivity: "",
    currentContactId: "",
    alreadyLoadedContacts: new Map(),
    scalingConclusionRef: null,
    incidentsList: []
}

interface CasePageType {
    type: string,
    // tslint:disable-next-line:no-any
    payload: any,
}

export function CasePageReducer(state = initialState, action: CasePageType): CasePageState {
    switch (action.type) {
        case actionTypes.SET_UPDATE_MODE_TRUE:
            return {...state, updateMode: true};
        case actionTypes.SET_UPDATE_MODE_FALSE:
            return {...state, updateMode: false};
        case actionTypes.SCALING_MODE_ON:
            return {...state, isScalingMode: true};
        case actionTypes.SCALING_MODE_OFF:
            return {
                ...state, isScalingMode: false,
                additionDataOfQualifsAndTheme: [...state.additionDataOfQualifsAndTheme.filter(ad => ad.category === "MOTIF")]
            };
        case actionTypes.SET_SCALING_CONCLUSION_REF:
            return {...state, scalingConclusionRef: action.payload};
        case actionTypes.SET_BOUCLE_ADG:
            return {...state, boucleADG: action.payload};
        case actionTypes.SET_ADG_DONE_BY_BOUCLE_ADG:
            return {...state, ADGDoneByBoucleADG: action.payload};
        case actionTypes.SCALED_ELIGIBILITY_TO_MODIFY_ON:
            return {...state, isCurrUserEliToUpdateScaledCase: true};
        case actionTypes.SCALED_ELIGIBILITY_TO_MODIFY_OFF:
            return {...state, isCurrUserEliToUpdateScaledCase: false};
        case actionTypes.SCALING_ELIGIBILITY_TRUE:
            return {...state, scalingEligibility: true};
        case actionTypes.SCALING_ELIGIBILITY_FALSE:
            return {...state, scalingEligibility: false};
        case actionTypes.REVERT_SCALING_TRUE:
            return {...state, revertScalingCaseMode: true};
        case actionTypes.REVERT_SCALING_FALSE:
            return {...state, revertScalingCaseMode: false};
        case actionTypes.FORMSY_VALID:
            return {...state, isFormsyValid: true};
        case actionTypes.FORMSY_INVALID:
            return {...state, isFormsyValid: false};
        case actionTypes.FINISHING_TREATMENT_TRUE:
            return {...state, finishingTreatment: true};
        case actionTypes.FINISHING_TREATMENT_FALSE:
            return {...state, finishingTreatment: false};
        case actionTypes.SET_IS_CURRENT_OWNER:
            return {...state, isCurrentOwner: action.payload};
        case actionTypes.SET_IS_DATE_HERE_FOR_ADG_CTI:
            return {...state, isDateHereForADGCTI: action.payload};
        case actionTypes.SHOW_MODAL_VIEW_CASE:
            return {...state, showModal: true};
        case actionTypes.HIDE_MODAL_VIEW_CASE:
            return {...state, showModal: false};
        case actionTypes.TOGGLE_MODAL_VIEW_CASE:
            return {...state, showModal: !state.showModal};
        case actionTypes.SET_IS_ONLY_NOTE_TO_TRUE:
            return {...state, isOnlyNote: true};
        case actionTypes.SET_IS_ONLY_NOTE_TO_FALSE:
            return {...state, isOnlyNote: false};
        case actionTypes.SET_FORCE_NOTE_TO_TRUE:
            return {...state, forceNote: true};
        case actionTypes.SET_FORCE_NOTE_TO_FALSE:
            return {...state, forceNote: false};
        case actionTypes.SET_IS_UPDATE_ENABLED_TO_TRUE:
            return {...state, isUpdateEnabled: true};
        case actionTypes.SET_IS_UPDATE_ENABLED_TO_FALSE:
            return {...state, isUpdateEnabled: false};
        case actionTypes.SET_ADD_CONTACT_FOR_NOTE_TO_TRUE:
            return {...state, addContactForNote: true};
        case actionTypes.SET_ADD_CONTACT_FOR_NOTE_TO_FALSE:
            return {...state, addContactForNote: false};
        case actionTypes.SET_ADG_FAILURE_REASON:
            return {...state, adgFailureReason: action.payload};
        case actionTypes.FORM_COMPLETE:
            return {...state, isFormCompleted: true};
        case actionTypes.FORM_INCOMPLETE:
            return {...state, isFormCompleted: false};
        case actionTypes.FORM_COMPLETE_MAXELL:
            return {...state, isFormMaxellCompleted: true};
        case actionTypes.FORM_INCOMPLETE_MAXELL:
            return {...state, isFormMaxellCompleted: false};
        case actionTypes.IS_WITH_AUTO_ASSIGN_TRUE:
            return {...state, isWithAutoAssign: true};
        case actionTypes.IS_WITH_AUTO_ASSIGN_FALSE:
            return {...state, isWithAutoAssign: false};
        case actionTypes.IS_FROM_AUTO_ASSIGN_TRUE:
            return {...state, isFromAutoAssign: true};
        case actionTypes.IS_AUTO_ASSIGN_BUTTON_DISABLED_TRUE:
            return {...state, isAutoAssignButtonDisabled: true};
        case actionTypes.IS_AUTO_ASSIGN_BUTTON_DISABLED_FALSE:
            return {...state, isAutoAssignButtonDisabled: false};
        case actionTypes.IS_FORCE_AUTO_ASSIGN_TRUE:
            return {...state, isForceAutoAssign: true};
        case actionTypes.IS_FORCE_AUTO_ASSIGN_FALSE:
            return {...state, isForceAutoAssign: false};
        case actionTypes.SET_IS_AUTO_ASSIGN:
            return {...state, isAutoAssignEnabled: action.payload};
        case actionTypes.SET_CASE_QUALIFICATION:
            return {...state, qualification: action.payload, isLoadingQualification: false};
        case actionTypes.SET_CASE_MOTIF:
            return {...state, motif: action.payload, isLoadingMotif: false};
        case actionTypes.SET_ADDITIONAL_DATA:
            return {...state, additionDataOfQualifsAndTheme: action.payload};
        case actionTypes.SET_VALID_ROUTING_RULE:
            return {...state, validRoutingRule: action.payload};
        case actionTypes.SET_THEME_SELECTED:
            return {...state, theme: action.payload};
        case actionTypes.SET_ADG_FAILED:
            return {...state, failedADG: action.payload};
        case actionTypes.SET_ACTIVITY_SELECTED:
            return {...state, activitySelected: action.payload};
        case actionTypes.IS_CURRENT_USER_ELI_TO_AUTOASSIGN:
            return {...state, isCurrentUserEliToAutoAssign: action.payload};
        case actionTypes.IS_CURRENT_USER_ELI_TO_UPDATE_CASE:
            return {...state, isCurrUserEliToUpdateImmediateCase: action.payload};
        case actionTypes.IS_CURRENT_USER_ELI_TO_RE_QUALIFY_CASE:
            return {...state, isCurrUserEliToReQualifyImmediateCase: action.payload};
        case actionTypes.IS_CURRENT_USER_OBLIGED_TO_RE_QUALIFY_CASE:
            return {...state, isCurrUserObligedToReQualifyImmediateCase: action.payload};
        case actionTypes.IS_CURRENT_USER_ELI_TO_UPDATE_MANDATORY_ADG_FOR_CASE:
            return {...state, isCurrUserEliToUpdateMandatoryADGForCurrentCase: action.payload};
        case actionTypes.IS_CURRENT_USER_ELI_TO_ADD_NOTE_TO_CASE:
            return {...state, isCurrUserEliToAddNoteToCase: action.payload};
        case actionTypes.SET_HAS_CALL_TRANSFER:
            return {...state, hasCallTransfer: action.payload, isCallTransferStatusOK: true};
            break;
        case actionTypes.SET_CALL_TRANSFER_STATUS_OK:
            return {...state, isCallTransferStatusOK: action.payload};
            break;
        case actionTypes.STORE_DIS_RC_ADG_MOTIF:
            return {...state, disRcAdgMotif: action.payload};
        case actionTypes.STORE_DIS_RC_ID_ACT:
            return {...state, idActDisRC: action.payload};
        case actionTypes.ADD_CONTACT_TRUE:
            return {...state, addContact: true};
        case actionTypes.ADD_CONTACT_FALSE:
            return {...state, addContact: false};
        case actionTypes.SET_BLOCK_ADG_AFTER_SENDING:
            return {...state, blockAdgAfterSending: action.payload};
        case actionTypes.SET_CASE_MOTIF_LOADING:
            return {...state, isLoadingMotif: action.payload};
        case actionTypes.SET_QUALIFICATION_SELECTED_TRUE:
            return {...state, isQualificationSelected: true};
        case actionTypes.SET_QUALIFICATION_SELECTED_FALSE:
            return {...state, isQualificationSelected: false};
        case actionTypes.SCALING_ELIGIBILITY_LOADING_TRUE:
            return {...state, isLoadingScalingEligibility: true};
        case actionTypes.SET_DISABLE_CANCEL_ADG:
            return {...state, disableCancelADG: action.payload};
        case actionTypes.SCALING_ELIGIBILITY_LOADING_FALSE:
            return {...state, isLoadingScalingEligibility: false};
        case actionTypes.SCALING_ELIGIBILITY:
            return {...state, scalingEligibility: action.payload};
        case actionTypes.SET_QUALIFICATION_LEAF:
            return {...state, qualificationLeaf: action.payload};
        case actionTypes.SET_DISPLAY_CANCEL_BUTTON:
            return {...state, displayCancelButton: action.payload};
        case actionTypes.SET_QUALIFICATION_WAS_GIVEN_IN_THE_PAYLOAD:
            return {...state, qualifWasGivenInThePayload: action.payload};
        case actionTypes.SET_INCIDENT_SELECTED:
            return {...state, incidentSelected: action.payload};
        case actionTypes.SET_INCIDENTS_OF_THEME:
            return {...state, incidents: action.payload};
        case actionTypes.SET_UPLOADED_FILES_MAXWELL:
            return {...state, uploadedFiles: action.payload};
        case actionTypes.SET_DISRC_SHOW_UPDATE_CASE:
            return {...state, disRCShowUpdateCase: action.payload};
        case actionTypes.TICKET_CREATING:
            return {
                ...state, ticketCreationProcess: {
                    idTicket: "",
                    state: MaxwellProcess.PROCESS_LOADING,
                    attachementDirectory: ""
                }
            };
        case actionTypes.TICKET_OK:
            return {
                ...state, ticketCreationProcess: {
                    idTicket: action.payload.refCtt,
                    state: MaxwellProcess.PROCESS_OK,
                    attachementDirectory: action.payload.attachementDirectory
                }
            };
        case actionTypes.TICKET_KO:
            return {
                ...state,
                ticketCreationProcess: {idTicket: "", state: MaxwellProcess.PROCESS_KO, attachementDirectory: ""},
                uploadingFilesProcess: MaxwellProcess.PROCESS_KO,
                maxwellCaseCreationProcess: MaxwellProcess.PROCESS_KO
            };
        case actionTypes.BEGIN_CREATING_MAXWELL:
            return {...state, maxwellCaseCreationProcess: MaxwellProcess.PROCESS_LOADING};
        case actionTypes.BEGIN_CREATING_OK:
            return {...state, maxwellCaseCreationProcess: MaxwellProcess.PROCESS_OK};
        case actionTypes.BEGIN_CREATING_KO:
            return {...state, maxwellCaseCreationProcess: MaxwellProcess.PROCESS_KO};

        case actionTypes.FILES_UPLOADING:
            return {...state, uploadingFilesProcess: MaxwellProcess.PROCESS_LOADING};
        case actionTypes.FILES_UPLOADING_OK:
            return {...state, uploadingFilesProcess: MaxwellProcess.PROCESS_OK};
        case actionTypes.FILES_UPLOADING_KO:
            return {...state, uploadingFilesProcess: MaxwellProcess.PROCESS_KO};
        case actionTypes.OPEN_MAXWELL_MODAL:
            return {...state, maxwellModalOpen: true};
        case actionTypes.CLOSE_MAXWELL_MODAL:
            return {...state, maxwellModalOpen: false};
        case actionTypes.SHOW_MODAL_MAXWELL_PROCESS:
            return {...state, showModalForMaxwellProcess: true};
        case actionTypes.HIDE_MODAL_MAXWELL_PROCESS:
            return {...state, showModalForMaxwellProcess: false};
        case actionTypes.ALLOW_MAXWELL_MODAL_CLOSING:
            return {...state, maxwellModalCanBeClose: true};
        case actionTypes.DONT_ALLOW_MAXWELL_MODAL_CLOSING:
            return {...state, maxwellModalCanBeClose: false};
        case actionTypes.RESET_RETENTION_FORM:
            return {...state, resetRetentionForm: action.payload};
        case actionTypes.SET_DISPLAY_GRID_ADG_FOR_DISRC:
            return {...state, displayGridADGForDISRC: action.payload};
        case actionTypes.SET_DISABLE_CANCEL_ADG:
            return {...state, disableCancelADG: action.payload};

        case actionTypes.SET_USER_ACTIVITY:
            return {...state, userActivity: action.payload};

        case actionTypes.SET_CURRENT_CONTACT_ID:
            return {...state, currentContactId: action.payload};
        case actionTypes.ADD_FETCHED_CONTACT:
            if (action.payload) {
                const tempMap = new Map(state.alreadyLoadedContacts);
                tempMap.set(action.payload.contactId, action.payload.value);
                return {...state, alreadyLoadedContacts: tempMap};
            } else {
                return {...state};
            }

        case actionTypes.SET_INCIDENTS_LIST:
            return {...state, incidentsList: action.payload};

        default:
            return state

    }
}
