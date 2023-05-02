import { TimeLineRegularisationItem } from "src/model/TimeLine/Regularisation"
import { ActionsType, SET_TIME_LINE_REGULARISATION } from "../actions/actionsTypes"

export interface TimeLineState {
    regularisations?: TimeLineRegularisationItem[]
}
const initialState: TimeLineState = {
    regularisations: []
}

export const TimeLineReducer = (state = initialState, action: ActionsType) => {
    switch (action.type) {

        case SET_TIME_LINE_REGULARISATION:
            return {
                ...state,
                regularisations: action.payload
            };

        default:
            return state
    }
}
