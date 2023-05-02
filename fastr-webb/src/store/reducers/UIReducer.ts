import * as actionTypes from "../actions/actionsTypes";
import {TabCategory} from "../../model/utils/TabCategory";

export interface UIState {
    blockingUI: boolean
    showGCO: boolean
    showSOCO: boolean
    activeTab: string
}

const initialState: UIState = {
    blockingUI: false,
    showGCO: true,
    showSOCO: false,
    activeTab: TabCategory.ADMINISTRATIVE
};

interface UIActionsType{
    type: string
}

export function UIReducer(state = initialState, action: UIActionsType): UIState {
    switch (action.type) {
        case actionTypes.TOGGLE_BLOCKING_UI:
            return {...state, blockingUI: !state.blockingUI}

        case actionTypes.SHOW_GCO:
            return {...state, showGCO: true}

        case actionTypes.HIDE_GCO:
            return {...state, showGCO: false}

        case actionTypes.SHOW_SOCO:
            return {...state, showSOCO: true}

        case actionTypes.HIDE_SOCO:
            return {...state, showSOCO: false}

        default:
            return state;
    }
}
