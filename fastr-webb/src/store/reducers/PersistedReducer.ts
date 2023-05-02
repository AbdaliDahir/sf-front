import * as actionTypes from "../actions/actionsTypes";

export interface UIState {
    showGCO: boolean
    showSOCO: boolean
    showREGUL: boolean
}

const initialState: UIState = {
    showGCO: true,
    showSOCO: false,
    showREGUL: true
};

interface UIActionsType{
    type: string
}

export function PersistedReducer(state = initialState, action: UIActionsType): UIState {
    switch (action.type) {

        case actionTypes.SHOW_GCO:
            return {...state, showGCO: true}

        case actionTypes.HIDE_GCO:
            return {...state, showGCO: false}

        case actionTypes.SHOW_SOCO:
            return {...state, showSOCO: true}

        case actionTypes.HIDE_SOCO:
            return {...state, showSOCO: false}

        case actionTypes.SHOW_REGUL:
            return {...state, showREGUL: true}

        case actionTypes.HIDE_REGUL:
            return {...state, showREGUL: false}

        default:
            return state;
    }
}
