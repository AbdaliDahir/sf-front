import * as actionTypes from "../actions/actionsTypes";

export interface ADGState {
    modifiedServiceIds: Array<string>
}

const initialState: ADGState = {
    modifiedServiceIds: []
};

interface ADGActionsType {
    type: string,
    payload: string
}

export function ADGReducer(state = initialState, action: ADGActionsType): ADGState {
    switch (action.type) {
        case actionTypes.ADD_MODIFIED_SERVICE_ID:
            return {...state, modifiedServiceIds: [...state.modifiedServiceIds, action.payload]}

        case actionTypes.REMOVE_MODIFIED_SERVICE_ID:
            return {...state, modifiedServiceIds: state.modifiedServiceIds.filter((modifiedServiceId => modifiedServiceId !== action.payload))}

        default:
            return state;
    }
}
