import * as actionTypes from "../actions/actionsTypes";
import {ActionsType} from "../actions/actionsTypes";
import {BillingsSettings} from "../../model/acts/duplicate-billing/BillingsSettings";

export interface BillingState {
    billingsSettings: BillingsSettings | undefined,
    errors: string[]
}

const initialState: BillingState = {
    billingsSettings: undefined,
    errors: []
};


export function BillingReducer(state = initialState, action: ActionsType): BillingState {
    switch (action.type) {

        case actionTypes.FETCH_BILLINGS_SETTING:
            return {
                ...state
            };
        case actionTypes.STORE_BILLINGS_SETTING:
            return {
                ...state,
                billingsSettings: action.payload
            };
        case actionTypes.ERROR_FETCHING_BILLINGS_SETTING:
            return {
                ...state,
                errors: [...state.errors, action.payload]
            }
        default:
            return state;
    }
}