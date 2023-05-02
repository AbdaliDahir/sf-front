import * as actionsType from "./actionsTypes"

import CaseService from "../../service/CaseService";
import {Case} from "src/model/Case";
import {CasesQualificationSettings} from "../../model/CasesQualificationSettings";
import {CaseUpdateDTO} from "src/model/CaseUpdateDTO";
import {AddNoteRequestDTO} from "src/model/AddNoteRequestDTO";
import {ViewCaseRequestDTO} from "../../model/ViewCaseRequestDTO";
import {
    setAdditionalData,
    setIsCurrentUserEliToAddNoteToCase,
    setIsCurrentUserEliToAutoAssign,
    setIsCurrentUserEliToReQualifyImmediateCase,
    setIsCurrentUserEliToUpdateImmediateCase,
    setIsCurrentUserEliToUpdateMandatoryADGForCase,
    setIsCurrentUserObligedToReQualifyImmediateCase,
    setScaledCaseIsEligibleToModification,
    setScaledCaseIsNotEligibleToModification
} from "./CasePageAction";
import {Site} from "../../model/Site";
import {Activity} from "../../model/Activity";

const caseService = new CaseService(true);


export const fetchAndStoreCase = (id: string) => {
    return async dispatch => {
        dispatch(fetchingCase())
        try {
            const retrievedCase: ViewCaseRequestDTO = await caseService.getCase(id);
            dispatch(storeCase(retrievedCase.currentCase));
            dispatch(setIsCurrentUserEliToAutoAssign(retrievedCase.canCCAutoAssignCurrentCase));
            dispatch(setIsCurrentUserEliToUpdateImmediateCase(retrievedCase.canCCUpdateCurrentCase))
            dispatch(setIsCurrentUserEliToReQualifyImmediateCase(retrievedCase.canCCReQualifyCurrentCase))
            dispatch(setIsCurrentUserObligedToReQualifyImmediateCase(retrievedCase.mustCCReQualifyCurrentCase))
            dispatch(retrievedCase.canCCUpdateCurrentCase ? setScaledCaseIsEligibleToModification() : setScaledCaseIsNotEligibleToModification())
            dispatch(setIsCurrentUserEliToAddNoteToCase(retrievedCase.canCCAddNoteToCurrentCase));
            dispatch(setIsCurrentUserEliToUpdateMandatoryADGForCase(retrievedCase.canCCUpdateMandatoryADGForCurrentCase));
        } catch (e) {
            const error = await e
            dispatch(errorFetchingCase(error.message))
            throw e
        }
    }
}

const fetchingCase = () => (
    {
        type: actionsType.FETCH_CURRENT_CASE,
    }
)

export const storingAditionalData = (currentCase: Case) => {
    return async dispatch => {
        dispatch(setAdditionalData(currentCase?.data))
    }
}

export const storeCase = (retrievedCase: Case) => (
    {
        type: actionsType.STORE_CASE,
        payload: retrievedCase
    }
)
export const setProcessing = (processing: boolean) => (
    {
        type: actionsType.SET_PROCESSING,
        payload: processing
    }
)

const errorFetchingCase = (err) => (
    {
        type: actionsType.ERROR_FETCHING_CASE,
        payload: err
    }
)

export const updateCase = (caseUpdated: CaseUpdateDTO, id: string) => {
    return async dispatch => {
        dispatch(updateCaseStart())
        try {
            const updatedCase: Case = await caseService.updateCase(caseUpdated, id);
            dispatch(updateCaseSuccess(updatedCase))
        } catch (e) {
            const error = await e
            dispatch(errorUpdateCase(error.message))
            throw e
        }
    }
}

const updateCaseStart = () => (
    {
        type: actionsType.UPDATE_CASE_START,
    }
)

const updateCaseSuccess = (retrievedCase: Case) => (
    {
        type: actionsType.UPDATE_CASE_SUCCESS,
        payload: retrievedCase
    }
)

export const updateCaseProgressStatus = (newProgressStatus: string) => (
    {
        type: actionsType.UPDATE_CASE_PROGRESS_STATUS,
        payload: newProgressStatus
    }
)

const errorUpdateCase = (err) => (
    {
        type: actionsType.ERROR_UPDATE_CASE,
        payload: err
    }
)

export const addNoteCase = (note: AddNoteRequestDTO, id: string) => {
    return async dispatch => {
        dispatch(addNoteStart())
        try {
            const updatedCase: Case = await caseService.addNote(id, note)
            dispatch(addNoteSuccess(updatedCase))
        } catch (e) {
            const error = await e
            dispatch(errorAddNote(error.message))
            throw e
        }
    }
}


export const addNewContact = (note: AddNoteRequestDTO, id: string) => {
    return async dispatch => {
        dispatch(addNoteStart())
        try {
            const updatedCase: Case = await caseService.newContact(id, note)
            dispatch(addNoteSuccess(updatedCase))
        } catch (e) {
            const error = await e
            dispatch(errorAddNote(error.message))
            throw e
        }
    }
}

const addNoteStart = () => (
    {
        type: actionsType.ADD_NOTE_CASE_START,
    }
)

const addNoteSuccess = (retrievedCase: Case) => (
    {
        type: actionsType.ADD_NOTE_CASE_SUCCESS,
        payload: retrievedCase
    }
)

const errorAddNote = (err) => (
    {
        type: actionsType.ERROR_ADD_NOTE_CASE,
        payload: err
    }
)

export const fetchAndStoreCaseQualification = (code: string) => {
    return async dispatch => {
        dispatch(fetchingCaseQualification())
        try {
            const caseQualification = await caseService.getCaseQualifSettings(code);
            dispatch(storeCaseQualification(caseQualification))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingCaseQualification(error.message))
            throw e
        }
    }
}

const fetchingCaseQualification = () => (
    {
        type: actionsType.FETCH_CURRENT_CASE_QUALIFICATION,
    }
)

const storeCaseQualification = (caseQualification: CasesQualificationSettings) => (
    {
        type: actionsType.STORE_CASE_QUALIFICATION,
        payload: caseQualification
    }
)

const errorFetchingCaseQualification = (err) => (
    {
        type: actionsType.ERROR_FETCHING_CASE_QUALIFICATION,
        payload: err
    }
)


export const autoAssignCaseToCurrentUser = (id: string, currentContactId?: string, callback?) => {
    return async dispatch => {
        dispatch(updateCaseStart())
        try {
            const updatedCase: Case = await caseService.autoAssignCaseToCurrentUser(id, false, currentContactId);
            dispatch(updateCaseSuccess(updatedCase))
            if(callback) {
                callback();
            }
        } catch (e) {
            const error = await e
            dispatch(errorUpdateCase(error.message))
            if(callback) {
                callback();
            }
        }
    }
}

export const autoAssignCaseToSystem = (id : string, site : Site, activity : Activity) => {
    return async dispatch => {
        dispatch(updateCaseStart())
        try {
            const updatedCase: Case = await caseService.autoAssignCaseToSystem(id, site, activity);
            dispatch(updateCaseSuccess(updatedCase))
        } catch (e) {
            const error = await e
            dispatch(errorUpdateCase(error.message))
        }
    }
}

export const forceAutoAssignCaseToCurrentUser = (id: string, currentContactId: string, callback?) => {
    return async dispatch => {
        dispatch(updateCaseStart())
        try {
            const updatedCase: Case = await caseService.autoAssignCaseToCurrentUser(id, true, currentContactId);
            dispatch(updateCaseSuccess(updatedCase))
            if(callback) {
                callback();
            }
        } catch (e) {
            const error = await e
            dispatch(errorUpdateCase(error.message))
            if(callback) {
                callback();
            }
        }
    }
}




