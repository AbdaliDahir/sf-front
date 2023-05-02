import * as actionTypes from "../../../actions/v2/media/MediaActionsTypes";
import {ActionType} from "../../../actions/v2/common/ActionType";
import {MediaSetting} from "../../../../model/media/MediaSetting";

export interface MediaState {
    mediaSetting: MediaSetting | undefined,
    errors: string[]
}

const initialState: MediaState = {
    mediaSetting: undefined,
    errors: []
};

export function MediaReducerV2(state = initialState, action: ActionType): MediaState {
    switch (action.type) {

        case actionTypes.FETCH_MEDIA_SETTINGS_V2:
            return {
                ...state
            };
        case actionTypes.STORE_MEDIA_SETTINGS_V2:
            return {
                ...state,
                mediaSetting: action.payload
            };

        case actionTypes.ERROR_FETCHING_MEDIA_SETTING_V2:
            return {
                ...state,
                errors: [...state.errors, action.payload]
            }
        default:
            return state;
    }
}