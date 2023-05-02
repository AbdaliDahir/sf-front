import * as actionsType from "./actionsTypes";


const isCasesolutionDunningTrue = () => (
    {
        type: actionsType.SET_CASE_RESOLUTION_DUNNING_TRUE,
    }
)
const isCasesolutionReminderFalse = () => (
    {
        type: actionsType.SET_CASE_RESOLUTION_DUNNING_FALSE,
    }
)
export function setModalFormsyIsValid() {
    return {type: actionsType.FORMSY_VALID}
}
export function setModalFormsyIsInvalid() {
    return {type: actionsType.FORMSY_INVALID}
}

export function showModalForCaseManager() {
    return {type: actionsType.SHOW_MODAL_CASE_MANAGER}
}


export function hideModalForCaseManager() {
    return {type: actionsType.HIDE_MODAL_CASE_MANAGER}
}
export function toggleModalForCaseManager() {
    return {type: actionsType.TOGGLE_MODAL_CASE_MANAGER}
}

export function setSuccessModalMessageId(parameterValue: string | boolean) {
    return {type: actionsType.SET_SUCCESS_MODAL_MESSAGE_ID, payload:parameterValue}
}

export function setErrorModalMessageId(parameterValue: string | boolean) {
    return {type: actionsType.SET_ERROR_MODAL_MESSAGE_ID, payload:parameterValue}
}

export function setAddContactForModal(addContactForModal:boolean) {
    return {type: actionsType.SET_ADD_CONTACT_FOR_MODAL, payload:addContactForModal}
}

export const setModalParameters = (parameterName: string, parameterValue: string | boolean) => {
    return async dispatch => {

        if (parameterName === "CASE_RESOLUTION_DUNNING") {
            if (parameterValue === true) {
                dispatch(isCasesolutionDunningTrue())
            } else {
                dispatch(isCasesolutionReminderFalse())
            }
        }

        if (parameterName === "SET_SUCCESS_MODAL_MESSAGE_ID") {
                dispatch(setSuccessModalMessageId(parameterValue))
        }

        if (parameterName === "SET_ERROR_MODAL_MESSAGE_ID") {
                dispatch(setErrorModalMessageId(parameterValue))
        }

    }
}