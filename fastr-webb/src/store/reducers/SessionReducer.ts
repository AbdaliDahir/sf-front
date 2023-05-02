import {ActionsType, SET_SESSION_USER_ACTIVITY, STORE_SESSION} from "../actions/actionsTypes";
import {Activity} from "../../model/Activity";

export interface SessionState {
    session: string,
    userActivity?: Activity
}

const initialState: SessionState = {
    session: ""
};

export function SessionReducer(state = initialState, action: ActionsType): SessionState {
    switch (action.type) {
        case STORE_SESSION:
            return {
                ...state,
                session: action.payload
            };
        case SET_SESSION_USER_ACTIVITY:
            return {
                ...state,
                userActivity: action.payload
            }
        default:
            return state;
    }
}
