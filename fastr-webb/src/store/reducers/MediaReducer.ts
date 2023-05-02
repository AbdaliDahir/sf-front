import * as actionTypes from "../actions/actionsTypes";
import {ActionsType} from "../actions/actionsTypes";
import {MediaSetting} from "../../model/media/MediaSetting";

export interface MediaState {
    mediaSetting: MediaSetting | undefined,
    errors: string[]
}

const initialState: MediaState = {
    mediaSetting: undefined,
    errors: []
};

export function MediaReducer(state = initialState, action: ActionsType): MediaState {
    switch (action.type) {

        case actionTypes.FETCH_MEDIA_SETTINGS:
            return {
                ...state
            };
        case actionTypes.STORE_MEDIA_SETTINGS:
            return {
                ...state,
                mediaSetting: action.payload
            };

        case actionTypes.ERROR_FETCHING_MEDIA_SETTING:
            return {
                ...state,
                errors: [...state.errors, action.payload]
            }
        default:
            return state;
    }
}