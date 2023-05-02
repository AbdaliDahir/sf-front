import {ClientSecureCallStateItem} from "../../views/v2/Client/ClientSecureCall/ClientSecureCall.interface";
import {ActionsType, STORE_CLIENT_SECURED_CALLS} from "../actions/actionsTypes";

export interface ClientSecureCallState{
    securedClients:ClientSecureCallStateItem[]
}
const initialState:ClientSecureCallState = {
    securedClients:[]
};

export function ClientSecureCallStateReducer(state = initialState, action: ActionsType):ClientSecureCallState{
    switch (action.type) {
        case STORE_CLIENT_SECURED_CALLS:
            return {
                ...state,
                securedClients: action.payload
            };
        default:
            return state;
    }
}