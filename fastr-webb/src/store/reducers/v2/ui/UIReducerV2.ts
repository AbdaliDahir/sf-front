import * as actionsTypes from "../../../actions/v2/ui/UIActionsTypes";
import {ActionType} from "../../../actions/v2/common/ActionType";

export interface UIState {
    blockingUI: boolean
}

const initialState: UIState = {
    blockingUI: false
};

export function UIReducerV2(
    state = initialState,
    action: ActionType
): UIState {
    switch (action.type) {
        case actionsTypes.SET_BLOCKING_UI_V2:

            return {
                ...state, blockingUI: action.payload
            };
        default:
            return state;
    }
}
