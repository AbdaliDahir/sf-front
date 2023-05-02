import * as actionsTypes from "../../../actions/v2/applicationInitalState/ApplicationInitalStateActionsTypes";
import {ActionType} from "../../../actions/v2/common/ActionType";
import {ApplicationInitialState} from "../../../../model/ApplicationInitialState";

const initialState: ApplicationInitialState = {

    user: undefined,
    sessionId: "",
    sessionIsFrom: "",
    activationFlags: [],
    authorizations: [],
    histoRapideSettings: [],
    clientRequestSetting: undefined,
    userPassword: "",
    retentionSettings: undefined,
    antichurnSetting: undefined,
    targetCaseId: "",
    forceBackendHost: "",
    integratedViewMode: false
};

export function ApplicationInitialStateReducerV2(
    state = initialState,
    action: ActionType
): ApplicationInitialState {
    switch (action.type) {

        case actionsTypes.STORE_APPLICATION_INITIAL_STATE_V2:
            return {
                ...state,
                ...action.payload
            };
        case actionsTypes.STORE_HISTO_RAPIDE_SETTINGS_V2:
            return {
                ...state,
                histoRapideSettings: action.payload
            };
        case actionsTypes.STORE_USER_PASSWORD_V2:
            return {
                ...state,
                userPassword: action.payload
            };
        case actionsTypes.APPLICATION_INITIAL_STATE_UPDATE_USER:
            return {
                ...state,
                ...action.payload
            };
        case actionsTypes.APPLICATION_INITIAL_STATE_RESET:
            return {
                ...initialState
            };
        case actionsTypes.SET_TARGET_CASE_ID_V2:
            return {
                ...state,
                targetCaseId: action.payload
            };
        case actionsTypes.TOGGLE_FORCE_STORE_V2:
            const forceStoreV2 = state.activationFlags?.find((f) => f.label === "forceAccessStoreV2");
            if (forceStoreV2) {
                forceStoreV2.activated = !forceStoreV2.activated;
            } else {
                state.activationFlags.push({label: "forceAccessStoreV2", activated: true});
            }
            return {
                ...state,
                activationFlags: [...state.activationFlags]
            }
        case actionsTypes.SET_FORCE_BACKENDHOST:
            return {
                ...state,
                forceBackendHost: action.payload
            }
        case actionsTypes.SWITCH_INTEGRATED_VIEW_MODE:
            return {
                ...state,
                integratedViewMode: action.payload
            }
        case actionsTypes.CONVERT_SESSION_MODE:
            return {
                ...state,
                sessionIsFrom: action.payload
            }
        default:
            return state;
    }
}
