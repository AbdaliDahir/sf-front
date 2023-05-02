import {Case} from "../../model/Case";
import * as actionTypes from "../actions/actionsTypes";

export interface RecentCaseState {
    casesList?: Array<Case>
    loading: boolean
    matchingCaseFound: Case | undefined
    isRecentCasesListDisplayed: boolean
    isMatchingCaseModalDisplayed: boolean
}

const initialState: RecentCaseState = {
    casesList: [],
    loading: false,
    matchingCaseFound: undefined,
    isRecentCasesListDisplayed: true,
    isMatchingCaseModalDisplayed: false
};

interface UIActionsType {
    type: string
    // tslint:disable-next-line:no-any
    payload: any
}

export function RecentCasesReducer(state = initialState, action: UIActionsType): RecentCaseState {
    switch (action.type) {
        case actionTypes.SET_RECENT_CASES:
            return {...state, casesList: action.payload}

        case actionTypes.SET_LOADING_RECENT_CASES:
            return {...state, loading: action.payload}

        case actionTypes.SET_MATCHING_CASE:
            return {...state, matchingCaseFound: action.payload}

        case actionTypes.SET_IS_LIST_DISPLAYED:
            return {...state, isRecentCasesListDisplayed: action.payload}

        case actionTypes.SET_IS_MATCHING_CASE_MODAL_DISPLAYED:
            return {...state, isMatchingCaseModalDisplayed: action.payload}

        default:
            return state;
    }
}
