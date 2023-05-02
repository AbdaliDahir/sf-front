import * as actionTypes from "../actions/actionsTypes";

export interface ModalState {
    showCaseResolutionDunningComponents: boolean
    successModalMessageId: string | boolean
    errorModalMessageId: string| boolean
    showModalForCaseManagerState: boolean
    isModalFormsyValid: boolean
    addContactForModal: boolean
}

const initialModalState: ModalState = {
    successModalMessageId: "default",
    errorModalMessageId: "default",
    showCaseResolutionDunningComponents: false,
    showModalForCaseManagerState: false,
    isModalFormsyValid: false,
    addContactForModal: true,
};

export function ModalReducer(
    state = initialModalState,
    action: actionTypes.ActionsType
): ModalState {
    switch (action.type) {
        case actionTypes.SET_CASE_RESOLUTION_DUNNING_TRUE:
            return {
                ...state,
                showCaseResolutionDunningComponents: true
            };
        case actionTypes.SET_CASE_RESOLUTION_DUNNING_FALSE:
            return {
                ...state,
                showCaseResolutionDunningComponents: false,
            };

        case actionTypes.SHOW_MODAL_CASE_MANAGER:
            return {
                ...state,
                showModalForCaseManagerState: true,
            };

        case actionTypes.HIDE_MODAL_CASE_MANAGER:
            return {
                ...state,
                showModalForCaseManagerState: false,
            };

        case actionTypes.TOGGLE_MODAL_CASE_MANAGER:
            return {...state, showModalForCaseManagerState: !state.showModalForCaseManagerState};

            case actionTypes.MODAL_FORMSY_VALID:
            return {...state, isModalFormsyValid: true};
            break

        case actionTypes.MODAL_FORMSY_INVALID:
            return {...state, isModalFormsyValid: false};
            break

        case actionTypes.SET_SUCCESS_MODAL_MESSAGE_ID :
            return {...state, successModalMessageId: action.payload};
            break

        case actionTypes.SET_ADD_CONTACT_FOR_MODAL :
            return {...state, addContactForModal: action.payload};
            break

        case actionTypes.SET_ERROR_MODAL_MESSAGE_ID :
            return {...state, errorModalMessageId: action.payload};
            break


        default:
            return state;
    }
}
