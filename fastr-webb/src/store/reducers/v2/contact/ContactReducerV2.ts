import * as actionTypes from "../../../actions/v2/contact/ContactActionsTypes";
import {ActionType} from "../../../actions/v2/common/ActionType";
import {Contact} from "../../../../model/Contact";
import {Channel} from "../../../../model/Channel";

export interface ContactState {
    currentContact: Contact | undefined,
    contactChannel :Channel| undefined,
    errors: string[]
}

const initialState: ContactState = {
    currentContact: undefined,
    contactChannel: undefined,
    errors: []
};

export function ContactReducerV2(state = initialState, action: ActionType): ContactState {
    switch (action.type) {

        case actionTypes.STORE_NEW_CONTACT_V2:
            return {
                ...state , currentContact : action.payload
            };
        case actionTypes.STORE_CONTACT_CHANNEL_V2:
            return {
                ...state , contactChannel : action.payload
            };
        case actionTypes.STORE_MEDIA_CURRENT_CONTACT:
            if(state.currentContact) {
                state.currentContact.media = {
                    type: action.payload.type,
                    direction: action.payload.direction
                }
            }
            return {...state};
        case actionTypes.CONTACT_MEDIA_CHANGED:
                if(state.currentContact) {
                    state.currentContact.mediaChanged = action.payload.contactStatus
                }
                return {...state };
        default:
            return state;
    }
}
