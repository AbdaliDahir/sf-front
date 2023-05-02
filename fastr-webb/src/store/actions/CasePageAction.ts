import {Dispatch} from "redux";
import {CaseQualification} from "../../model/CaseQualification";
import {CaseRoutingRule} from "../../model/CaseRoutingRule";
import {CasesQualificationSettings} from "../../model/CasesQualificationSettings";
import {TroubleTicketRequest} from "../../model/TroubleTicketRequest";
import {TroubleTicketResponse} from "../../model/TroubleTicketResponse";
import CaseService from "../../service/CaseService";
import * as actionTypes from "./actionsTypes";
import {Activity} from "../../model/Activity";
import {GenericIncident} from "../../model/GenericIncident";
import {ContactWrapper} from "../../model/Contact";
import {IncidentsListItem} from "../../model/IncidentsList";


const caseService: CaseService = new CaseService(true);

export function setFormComplete() {
    return {type: actionTypes.FORM_COMPLETE}
}

export function setFormIncomplete() {
    return {type: actionTypes.FORM_INCOMPLETE}
}

export function setFormMaxellComplete() {
    return {type: actionTypes.FORM_COMPLETE_MAXELL}
}

export function setFormMaxellIncomplete() {
    return {type: actionTypes.FORM_INCOMPLETE_MAXELL}
}

export function setAddContactToTrue() {
    return {type: actionTypes.ADD_CONTACT_TRUE}
}

export function setDisRCShowUpdateCase(bol) {
    return {type: actionTypes.SET_DISRC_SHOW_UPDATE_CASE, payload: bol}
}

export function setAddContactToFalse() {
    return {type: actionTypes.ADD_CONTACT_FALSE}
}

export function setBlockAdgAfterSending(shouldBlockAdg: boolean) {
    return {type: actionTypes.SET_BLOCK_ADG_AFTER_SENDING, payload: shouldBlockAdg}
}

export function setScalingToTrue() {
    return {type: actionTypes.SCALING_MODE_ON}
}

export function setScalingToFalse() {
    return {type: actionTypes.SCALING_MODE_OFF}
}

export function setAutoAssignButtonDisabledTrue() {
    return {type: actionTypes.IS_AUTO_ASSIGN_BUTTON_DISABLED_TRUE}
}

export function setAutoAssignButtonDisabledFalse() {
    return {type: actionTypes.IS_AUTO_ASSIGN_BUTTON_DISABLED_FALSE}
}


export function setIsWithAutoAssignTrue() {
    return {type: actionTypes.IS_WITH_AUTO_ASSIGN_TRUE}
}

export function setIsWithAutoAssignFalse() {
    return {type: actionTypes.IS_WITH_AUTO_ASSIGN_FALSE}
}

export function setIsFromAutoAssignTrue() {
    return {type: actionTypes.IS_FROM_AUTO_ASSIGN_TRUE}
}

export function setForceAutoAssignTrue() {
    return {type: actionTypes.IS_FORCE_AUTO_ASSIGN_TRUE}
}

export function setForceAutoAssignFalse() {
    return {type: actionTypes.IS_FORCE_AUTO_ASSIGN_FALSE}
}

export function setIsAutoAssign(isAutoAssign: boolean) {
    return {type: actionTypes.SET_IS_AUTO_ASSIGN, payload: isAutoAssign}
}

export function setScalingConclusionRef(scalingConclusionRef: HTMLDivElement | null) {
    return {type: actionTypes.SET_SCALING_CONCLUSION_REF, payload: scalingConclusionRef}
}

export function setADGDoneByBoucleADG(boole: boolean) {
    return {type: actionTypes.SET_ADG_DONE_BY_BOUCLE_ADG, payload: boole}
}

export function setCaseQualification(qualification) {
    return {type: actionTypes.SET_CASE_QUALIFICATION, payload: qualification}
}

export function setCaseMotif(motif: CaseQualification) {
    return {type: actionTypes.SET_CASE_MOTIF, payload: motif}
}

export function setScalingEligibilityTrue() {
    return {type: actionTypes.SCALING_ELIGIBILITY_TRUE}
}

export function setScalingEligibilityFalse() {
    return {type: actionTypes.SCALING_ELIGIBILITY_FALSE}
}

export function setCaseMotifLoading(bol: boolean) {
    return {type: actionTypes.SET_CASE_MOTIF_LOADING, payload: bol}
}

// tslint:disable-next-line:no-any
export function setAdditionalData(additionalData: any) {
    return {type: actionTypes.SET_ADDITIONAL_DATA, payload: additionalData}
}

export function setIncidentsList(incidents: Array<IncidentsListItem>) {
    return {type: actionTypes.SET_INCIDENTS_LIST, payload: incidents}
}

export function setValidRoutingRule(routingRule?: CaseRoutingRule) {
    return {type: actionTypes.SET_VALID_ROUTING_RULE, payload: routingRule}
}

export function setDisableCancelADG(value: boolean) {
    return {type: actionTypes.SET_DISABLE_CANCEL_ADG, payload: value}
}

export function setAdgFailed(value: boolean) {
    return {type: actionTypes.SET_ADG_FAILED, payload: value}
}

export function setIsDateHereForADGCTI(value) {
    return {type: actionTypes.SET_IS_DATE_HERE_FOR_ADG_CTI, payload: value}
}

export function setUpdateModeToTrue() {
    return {type: actionTypes.SET_UPDATE_MODE_TRUE}
}

export function setUpdateModeToFalse() {
    return {type: actionTypes.SET_UPDATE_MODE_FALSE}
}

export function setScaledCaseIsEligibleToModification() {
    return {type: actionTypes.SCALED_ELIGIBILITY_TO_MODIFY_ON}
}

export function setScaledCaseIsNotEligibleToModification() {
    return {type: actionTypes.SCALED_ELIGIBILITY_TO_MODIFY_OFF}
}

export function setRevertScalingTrue() {
    return {type: actionTypes.REVERT_SCALING_TRUE}
}

export function setRevertScalingFalse() {
    return {type: actionTypes.REVERT_SCALING_FALSE}
}

export function setFormsyIsValid() {
    return {type: actionTypes.FORMSY_VALID}
}

export function setFormsyIsInvalid() {
    return {type: actionTypes.FORMSY_INVALID}
}

export function setFinishingTreatmentToTrue() {
    return {type: actionTypes.FINISHING_TREATMENT_TRUE}
}

export function setFinishingTreatmentToFalse() {
    return {type: actionTypes.FINISHING_TREATMENT_FALSE}
}

export function setIsCurrentOwner(value: boolean) {
    return {type: actionTypes.SET_IS_CURRENT_OWNER, payload: value}
}

export function showModal() {
    return {type: actionTypes.SHOW_MODAL_VIEW_CASE}
}

export function hideModal() {
    return {type: actionTypes.HIDE_MODAL_VIEW_CASE}
}

export function toggleModal() {
    return {type: actionTypes.TOGGLE_MODAL_VIEW_CASE}
}

export function setOnlyNoteToTrue() {
    return {type: actionTypes.SET_IS_ONLY_NOTE_TO_TRUE}
}

export function setOnlyNoteToFalse() {
    return {type: actionTypes.SET_IS_ONLY_NOTE_TO_FALSE}
}

export function setForceNoteToTrue() {
    return {type: actionTypes.SET_FORCE_NOTE_TO_TRUE}
}

export function setForceNoteToFalse() {
    return {type: actionTypes.SET_FORCE_NOTE_TO_FALSE}
}

export function setIsUpdateModeEnabledToTrue() {
    return {type: actionTypes.SET_IS_UPDATE_ENABLED_TO_TRUE}
}

export function setIsUpdateModeEnabledToFalse() {
    return {type: actionTypes.SET_IS_UPDATE_ENABLED_TO_FALSE}
}

export function setAddContactForNoteToTrue() {
    return {type: actionTypes.SET_ADD_CONTACT_FOR_NOTE_TO_TRUE}
}

export function setAddContactForNoteToFalses() {
    return {type: actionTypes.SET_ADD_CONTACT_FOR_NOTE_TO_FALSE}
}

export function setAdgFailureReason(errorMessage: string) {
    return {type: actionTypes.SET_ADG_FAILURE_REASON, payload: errorMessage}
}

export function setHasCallTransfer(value: boolean) {
    return {type: actionTypes.SET_HAS_CALL_TRANSFER, payload: value}
}

export function setCallTransferStatusOK(value: boolean) {
    return {type: actionTypes.SET_CALL_TRANSFER_STATUS_OK, payload: value}
}

export function setCurrentContactId(value: string) {
    return {type: actionTypes.SET_CURRENT_CONTACT_ID, payload: value}
}

function setThemeSelected(theme?: CasesQualificationSettings) {
    return {type: actionTypes.SET_THEME_SELECTED, payload: theme}
}

function scalingEligibilityLoadingTrue() {
    return {type: actionTypes.SCALING_ELIGIBILITY_LOADING_TRUE}
}

function scalingEligibilityLoadingFalse() {
    return {type: actionTypes.SCALING_ELIGIBILITY_LOADING_FALSE}
}

function fetchRoutingRuleAtLeastOne(value: boolean) {
    return {type: actionTypes.SCALING_ELIGIBILITY, payload: value}
}

export function setQualificationIsNotSelected() {
    return {type: actionTypes.SET_QUALIFICATION_SELECTED_FALSE}
}

export function setQualificationSelected() {
    return {type: actionTypes.SET_QUALIFICATION_SELECTED_TRUE}
}

export function setQualificationLeaf(qualificationLeaf) {
    return {type: actionTypes.SET_QUALIFICATION_LEAF, payload: qualificationLeaf}
}

export function setDisplayCancelButton(value) {
    return {type: actionTypes.SET_DISPLAY_CANCEL_BUTTON, payload: value}
}

export function setQualifWasGivenInThePayload(bol: boolean) {
    return {type: actionTypes.SET_QUALIFICATION_WAS_GIVEN_IN_THE_PAYLOAD, payload: bol}
}

export const setQualificationIsSelected = (qualificationCode, serviceType: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setQualificationSelected())
        dispatch(scalingEligibilityLoadingTrue());
        dispatch(fetchRoutingRuleAtLeastOne(await caseService.atLeastOneThemeContainRoutingRule(qualificationCode, serviceType)))
        dispatch(scalingEligibilityLoadingFalse());
    }
};

export const notifyThemeSelectionAction = (themeSelection?: CasesQualificationSettings, rule?: CaseRoutingRule) => {
    return dispatch => {
        // dispatch   theme object selected or unselected
        themeSelection ? dispatch(setThemeSelected(themeSelection)) : dispatch(setThemeSelected());
        // dispatch valid routing rule
        rule ? dispatch(setValidRoutingRule(rule)) : dispatch(setValidRoutingRule());
        // dispatch auto assign for nav bar
        rule ? dispatch(setIsAutoAssign(!!(rule.autoAssign))) : dispatch(setIsAutoAssign(false));
    }

}

export const setBoucleADG = (value: boolean) => {
    return {type: actionTypes.SET_BOUCLE_ADG, payload: value}
}

export function setActivitySelected(activity: Activity) {
    return {type: actionTypes.SET_ACTIVITY_SELECTED, payload: activity}
}

export function setIsCurrentUserEliToAutoAssign(isAutoAssign: boolean) {
    return {type: actionTypes.IS_CURRENT_USER_ELI_TO_AUTOASSIGN, payload: isAutoAssign}
}

export function setIsCurrentUserEliToUpdateImmediateCase(isEliToUpdate: boolean) {
    return {type: actionTypes.IS_CURRENT_USER_ELI_TO_UPDATE_CASE, payload: isEliToUpdate}
}

export function setIsCurrentUserEliToReQualifyImmediateCase(isEliToUpdate: boolean) {
    return {type: actionTypes.IS_CURRENT_USER_ELI_TO_RE_QUALIFY_CASE, payload: isEliToUpdate}
}

export function setIsCurrentUserObligedToReQualifyImmediateCase(isEliToUpdate: boolean) {
    return {type: actionTypes.IS_CURRENT_USER_OBLIGED_TO_RE_QUALIFY_CASE, payload: isEliToUpdate}
}

export function setIsCurrentUserEliToAddNoteToCase(isEliToUpdate: boolean) {
    return {type: actionTypes.IS_CURRENT_USER_ELI_TO_ADD_NOTE_TO_CASE, payload: isEliToUpdate}
}

export function setIsCurrentUserEliToUpdateMandatoryADGForCase(isEliToUpdate: boolean) {
    return {type: actionTypes.IS_CURRENT_USER_ELI_TO_UPDATE_MANDATORY_ADG_FOR_CASE, payload: isEliToUpdate}
}

function setGenericIncidentsByTheme(incidents: Array<GenericIncident>) {
    return {type: actionTypes.SET_INCIDENTS_OF_THEME, payload: incidents}
}

export const fetchAndStoreIncidents = (codeTheme: string) => {
    const shortid = require('shortid');
    return async (dispatch: Dispatch) => {
        const incidentsList: Array<GenericIncident> = await caseService.getIncidentsByTheme(codeTheme);
        incidentsList.forEach(incident => {
            incident.incidentID = shortid.generate();
        })
        dispatch(setGenericIncidentsByTheme(incidentsList))
    }
}

export function setGenericIncidentSelected(incident: GenericIncident) {
    return {type: actionTypes.SET_INCIDENT_SELECTED, payload: incident}
}


export const openMaxwellModal = () => {
    return async dispatch => {
        dispatch(openingMaxwellModal())
    }
}

const openingMaxwellModal = () => (
    {
        type: actionTypes.OPEN_MAXWELL_MODAL,
    }
)
export const closeMaxwellModal = () => {
    return async dispatch => {
        dispatch(closingMaxwellModal())
    }
}

const closingMaxwellModal = () => (
    {
        type: actionTypes.CLOSE_MAXWELL_MODAL,
    }
)


export const beginCreatingMaxwellCase = () => {
    return async dispatch => {
        dispatch(eventCreatingMaxwell())
    }
}

export const creatingMaxwellCaseOk = () => {
    return async dispatch => {
        dispatch(creatingMaxwellOk())
    }
}

export const creatingMaxwellCaseKO = () => {
    return async dispatch => {
        dispatch(creatingMaxwellKo())
    }
}

export const uploadMaxwellFiles = (files: File[], caseId: string, ticketId: string, attachementDir: string) => {
    return async dispatch => {
        dispatch(filesUploading())
        try {
            const res: string = await caseService.uploadFiles(files, caseId, ticketId, attachementDir);

            if (res) {
                dispatch(filesUploadOk())

            } else {
                dispatch(filesUploadKo())
            }
        } catch (e) {
            dispatch(filesUploadKo())
        }
    }
}


export const initMaxwellProcess = () => {
    return async dispatch => {
        dispatch(filesUploading())
        dispatch(eventCreatingMaxwell())
    }
}


export const createTroubleTicket = (req: TroubleTicketRequest) => {
    const res: Partial<TroubleTicketResponse> = {
        refCtt: "",
        attachementDirectory: ""
    }

    return async dispatch => {
        dispatch(ticketCreating());
        try {
            const response: TroubleTicketResponse = await caseService.createTroubleTicket(req);
            if (response.status === "OK") {
                dispatch(ticketOk(response));
                return response;
            }
        } catch (e) {
            dispatch(ticketKo());
            return res
        }
        return res
    }
}


export const showMaxwellModalProcesses = () => {
    return async dispatch => {
        dispatch(showingMaxwellModalProcesses())
    }
}

const showingMaxwellModalProcesses = () => (
    {
        type: actionTypes.SHOW_MODAL_MAXWELL_PROCESS,
    }
)
export const hideMaxwellModalProcesses = () => {
    return async dispatch => {
        dispatch(hidingMaxwellModalProcesses())
    }
}

export const storeMotifDisRCAdg = (motifAdgDisRC: CaseQualification) => (dispatch: Dispatch) => {
    dispatch({type: actionTypes.STORE_DIS_RC_ADG_MOTIF, payload: motifAdgDisRC});
};

export const storeIdActDisRC = (idActDisRC: string) => (dispatch: Dispatch) => {
    dispatch({type: actionTypes.STORE_DIS_RC_ID_ACT, payload: idActDisRC});
};


const hidingMaxwellModalProcesses = () => (
    {
        type: actionTypes.HIDE_MODAL_MAXWELL_PROCESS,
    }
)

export const allowMaxwellModalClosing = () => {
    return async dispatch => {
        dispatch(allowingMaxwellModalClosing())
    }
}

const allowingMaxwellModalClosing = () => (
    {
        type: actionTypes.ALLOW_MAXWELL_MODAL_CLOSING,
    }
)

export const dontAllowMaxwellModalClosing = () => {
    return async dispatch => {
        dispatch(dontAllowingMaxwellModalClosing())
    }
}

const dontAllowingMaxwellModalClosing = () => (
    {
        type: actionTypes.DONT_ALLOW_MAXWELL_MODAL_CLOSING,
    }
)


export function setUploadedFilesMaxwell(uploadedFiles: Array<File>) {
    return {type: actionTypes.SET_UPLOADED_FILES_MAXWELL, payload: uploadedFiles}
}

const ticketCreating = () => (
    {
        type: actionTypes.TICKET_CREATING,
    }
)

const ticketOk = (resClarify: TroubleTicketResponse) => (
    {
        type: actionTypes.TICKET_OK,
        payload: resClarify
    }
)


const ticketKo = () => (
    {
        type: actionTypes.TICKET_KO,
    }
)

const filesUploading = () => (
    {
        type: actionTypes.FILES_UPLOADING,
    }
)

const filesUploadOk = () => (
    {
        type: actionTypes.FILES_UPLOADING_OK,
    }
)


const filesUploadKo = () => (
    {
        type: actionTypes.FILES_UPLOADING_KO,
    }
)


const eventCreatingMaxwell = () => (
    {
        type: actionTypes.BEGIN_CREATING_MAXWELL,
    }
)
const creatingMaxwellOk = () => (
    {
        type: actionTypes.BEGIN_CREATING_OK,
    }
)
const creatingMaxwellKo = () => (
    {
        type: actionTypes.BEGIN_CREATING_KO,
    }
)

export function resetRetentionForm(value: boolean) {
    return {type: actionTypes.RESET_RETENTION_FORM, payload: value}
}

export function setDisplayGridADGForDISRC(value: boolean) {
    return {type: actionTypes.SET_DISPLAY_GRID_ADG_FOR_DISRC, payload: value}
}


function setUserActivity(activity: string) {
    return {type: actionTypes.SET_USER_ACTIVITY, payload: activity}
}

function addContact(contactWrapper) {
    return {type: actionTypes.ADD_FETCHED_CONTACT, payload: contactWrapper}
}

// TODO REMOVE AND USE INSTEAD fetchAndStoreSessionUserActivity (SessionActions.ts)
// this one only stores activity code, the other one an Activity object
export const fetchAndStoreUserActivity = (sessionId: string) => {
    return async (dispatch: Dispatch) => {
        const userActivity: string = await caseService.getUserActivitieFromSession(sessionId);
        dispatch(setUserActivity(userActivity))
    }
}

export const getOrFetchContact = (contactId: string, alreadyLoadedContacts: Map<string, ContactWrapper>,callback?) => {
    return async (dispatch: Dispatch) => {
        const targetContact = alreadyLoadedContacts.get(contactId);
        if (contactId && !targetContact || (targetContact && !targetContact.isContactComplete)) {
            try{
                const contact = await caseService.getContact(contactId)
                dispatch(addContact({
                    contactId,
                    value: {
                        contact,
                        isContactComplete: contact.media !== null && contact.media !== undefined
                    }
                }));
            } catch (error) {
                dispatch(addContact({
                    contactId,
                    value: {
                        contact: null,
                        isContactComplete: false
                    }
                }));
            }
        }
        if(callback){
            return await callback();
        }
    }
}



