import * as actionsTypes from "../../../actions/v2/case/RecentCasesActionsTypes";
import {Case} from "../../../../model/Case";

export interface RecentCaseState {
    casesList: Array<Case>
    loading: boolean
    isRecentCasesListDisplayed: boolean
    isMatchingCaseModalDisplayed: boolean,
    selectedCase: string
}

const initialState: RecentCaseState = {
    casesList: [],
    loading: false,
    isRecentCasesListDisplayed: true,
    isMatchingCaseModalDisplayed: false,
    selectedCase: ""
};

interface UIActionsType {
    type: string
    // tslint:disable-next-line:no-any
    payload: any
}

export function RecentCasesReducerV2(state = initialState, action: UIActionsType): RecentCaseState {
    switch (action.type) {
        case actionsTypes.SET_RECENT_CASES_V2:
            return {...state, casesList: action.payload}

        case actionsTypes.PUSH_CASE_TO_RECENT_CASES_V2:
            const updatedCase: Case = action.payload;
            const updatedList = [...state.casesList];
            const indexOfModifiedCase = state.casesList.map((casee)=>casee.caseId).indexOf(updatedCase.caseId);
            if(indexOfModifiedCase !== -1){
                updatedList[indexOfModifiedCase] = updatedCase;
            } else {
                updatedList[0] = updatedCase;
            }
            // order by date ?
            return {...state,casesList:updatedList}

        case actionsTypes.SET_LOADING_RECENT_CASES_V2:
            return {...state, loading: action.payload}

        case actionsTypes.SET_IS_LIST_DISPLAYED_V2:
            return {...state, isRecentCasesListDisplayed: action.payload}

        default:
            return state;
    }
}
