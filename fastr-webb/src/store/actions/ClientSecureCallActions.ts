import {ClientSecureCallStateItem} from "../../views/v2/Client/ClientSecureCall/ClientSecureCall.interface";
import * as actionTypes from "./actionsTypes";

export function saveClientSecureCall(payload:ClientSecureCallStateItem[]){
    return {
        type: actionTypes.STORE_CLIENT_SECURED_CALLS,
        payload
    }
}