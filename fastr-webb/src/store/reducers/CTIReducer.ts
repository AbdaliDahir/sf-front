import * as actionTypes from "../actions/actionsTypes";

export interface CTIState {
    isCTIFinished: boolean
}

const initialState: CTIState = {
    isCTIFinished: true
};

interface CTIActionsType {
    type: string
}

export function CTIReducer(state = initialState, action: CTIActionsType): CTIState {
    switch (action.type) {

        case actionTypes.CTI_FINISHED:
            return {...state, isCTIFinished: true}

        case actionTypes.CTI_ONGOING:
            return {...state, isCTIFinished: false}

        default:
            return state;
    }
}