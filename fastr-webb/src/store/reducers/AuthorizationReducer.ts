import * as actionTypes from "../actions/actionsTypes";

export interface AuthorizationState {
    loading: boolean
    authorizations: Array<string>,
    errors: Array<string>
}

const initialState: AuthorizationState = {
    loading:false,
    authorizations: [],
    errors: []
};

interface AuthorizationActionsType {
    type: string,
    payload: Array<string>
}

export function AuthorizationReducer(state = initialState, action: AuthorizationActionsType): AuthorizationState {
    switch (action.type) {
        case actionTypes.STORE_AUTHORIZATION:
            return {...state, authorizations: action.payload, loading: false}

        case actionTypes.FETCH_AUTHORIZATION:
            return { ...state,
                loading: true}

        case actionTypes.ERROR_FETCHING_AUTHORIZATIONS:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, ""+action.payload]
            }

        default:
            return state;
    }
}
