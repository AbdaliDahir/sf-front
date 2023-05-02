import {RetentionSetting} from "../../model/acts/retention/RetentionSetting";
import * as actionTypes from "../actions/actionsTypes";
import {ActionsType} from "../actions/actionsTypes";
import {RetentionIneligibilityCausesSetting} from "../../model/acts/retention/RetentionIneligibilityCausesSetting";

export interface RetentionState {
    retentionSetting: RetentionSetting | undefined,
    retentionRefusSetting: RetentionSetting | undefined,
    retentionIneligibilityCausesSetting: RetentionIneligibilityCausesSetting | undefined,
    errors: string[]
}

const initialState: RetentionState = {
    retentionSetting: undefined,
    retentionRefusSetting: undefined,
    retentionIneligibilityCausesSetting:undefined,
    errors: []
};


// TODO SEE IF WE HANDLE IN GLOBAL REDUCER WITH OTHER SETTINGS (FAST-BO)
export function RetentionReducer(state = initialState, action: ActionsType): RetentionState {
    switch (action.type) {

        case actionTypes.FETCH_RETENTION_SETTING:
            return {
                ...state
            };
        case actionTypes.STORE_RETENTION_SETTING:
            return {
                ...state,
                retentionSetting: action.payload
            };
        case actionTypes.STORE_RETENTION_REFUS_SETTING:
            return {
                ...state,
                retentionRefusSetting: action.payload
            };
        case actionTypes.STORE_RETENTION_INELIGIBILITY_CAUSES_SETTING:
            return {
                ...state,
                retentionIneligibilityCausesSetting: action.payload
            };
        case actionTypes.ERROR_FETCHING_RETENTION_SETTING:
            return {
                ...state,
                errors: [...state.errors, action.payload]
            }
        default:
            return state;
    }
}