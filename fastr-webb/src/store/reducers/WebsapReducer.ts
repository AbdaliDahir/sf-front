import * as actionTypes from "../actions/actionsTypes";
import {ActionsType} from "../actions/actionsTypes";
import {WebsapSetting} from "../../model/acts/websap/WebsapSetting";

export interface WebsapState {
    websapSetting: WebsapSetting | undefined,
    websapAccessData: any | undefined,
    errors: string[]
}

const initialState: WebsapState = {
    websapSetting: undefined,
    websapAccessData: undefined,
    errors: []
};

export function WebsapReducer(state = initialState, action: ActionsType): WebsapState {
    switch (action.type) {

        case actionTypes.FETCH_WEBSAP_SETTINGS:
            return {
                ...state
            };
        case actionTypes.FETCH_WEBSAP_ACCESS:
            return {
                ...state
            };
        case actionTypes.STORE_WEBSAP_SETTINGS:
            return {
                ...state,
                websapSetting: action.payload
            };
        case actionTypes.STORE_WEBSAP_ACCESS:
            return {
                ...state,
                websapAccessData: action.payload
            };
        case actionTypes.ERROR_FETCHING_WEBSAP_SETTING:
            return {
                ...state,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.ERROR_FETCHING_WEBSAP_ACCESS:
            return {
                ...state,
                errors: [...state.errors, action.payload]
            }
        default:
            return state;
    }
}