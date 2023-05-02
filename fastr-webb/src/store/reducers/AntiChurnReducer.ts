import * as actionTypes from "../actions/actionsTypes";
import {ActionsType} from "../actions/actionsTypes";
import {AntiChurnClientProposal} from "../../model/acts/antichurn/AntiChurnClientProposal";

export interface AntichurnSettings {
    settingMongo: Array<AntiChurnClientProposal>,
    settingAsKeyValue: Map<string, string>
}

export interface AntiChurnState {
    antiChurnSettings: AntichurnSettings | undefined,
    errors: string[]
}

const initialState: AntiChurnState = {
    antiChurnSettings: undefined,
    errors: []
};


export function AntiChurnReducer(state = initialState, action: ActionsType): AntiChurnState {
    switch (action.type) {

        case actionTypes.FETCH_ANTICHURN_SETTING:
            return {
                ...state
            };
        case actionTypes.STORE_ANTICHURN_SETTING:
            return {
                ...state,
                antiChurnSettings: action.payload
            };
        case actionTypes.ERROR_FETCHING_ANTICHURN_SETTING:
            return {
                ...state,
                errors: [...state.errors, action.payload]
            }
        default:
            return state;
    }
}