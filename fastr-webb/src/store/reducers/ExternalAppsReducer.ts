import * as actionTypes from "../actions/actionsTypes";
import {ActionsType} from "../actions/actionsTypes";

export interface ExternalAppsState {
    appsList: string[] | undefined,
    fioriActOpenedInExternalApps : boolean | undefined,
    errors: string[]
}

const initialState: ExternalAppsState = {
    appsList : undefined,
    fioriActOpenedInExternalApps : undefined,
    errors: []
};

export function ExternalAppsReducer(state = initialState, action: ActionsType): ExternalAppsState {
    switch (action.type) {
        case actionTypes.FETCH_EXTERNAL_APPS:
            return {
                ...state
            };
        case actionTypes.STORE_EXTERNAL_APPS:
            return {
                ...state,
                appsList: action.payload
            };
        case actionTypes.ERROR_FETCHING_EXTERNAL_APPS:
            return {
                ...state,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.FIORI_ACT_OPENED_IN_EXTERNAL_APPS:
            return {
                ...state,
                fioriActOpenedInExternalApps: action.payload
            };
        default:
            return state;
    }
}

