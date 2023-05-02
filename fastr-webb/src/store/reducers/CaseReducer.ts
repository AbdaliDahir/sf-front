import * as actionTypes from "../actions/actionsTypes";
import {Case} from "src/model/Case";
import {CasesQualificationSettings} from "src/model/CasesQualificationSettings";

export interface CaseState {
    loading: boolean
    currentCase: Case | undefined
    currentCaseQualification: CasesQualificationSettings | undefined
    errors: string[]
    processing?: boolean
}

const initialState: CaseState = {
    loading: false,
    currentCase: undefined,
    currentCaseQualification: undefined,
    processing: false,
    errors: []
};

export function CaseReducer(
    state = initialState,
    action: actionTypes.ActionsType
): CaseState {
    switch (action.type) {
        case actionTypes.SET_PROCESSING:
            if (state.currentCase) {
                return {
                    ...state,
                    currentCase: {...state.currentCase!, processing: action.payload}
                }
            } else {
                return {
                    ...state, processing: action.payload
                }
            }
        case actionTypes.FETCH_CURRENT_CASE:
            return {
                ...state,
                loading: true
            };
        case actionTypes.STORE_CASE:
            return {
                ...state,
                loading: false,
                currentCase: action.payload
            };
        case actionTypes.ERROR_FETCHING_CASE:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.FETCH_CURRENT_CASE_QUALIFICATION:
            return {
                ...state,
                loading: true
            };
        case actionTypes.STORE_CASE_QUALIFICATION:
            return {
                ...state,
                loading: false,
                currentCaseQualification: action.payload
            };
        case actionTypes.ERROR_FETCHING_CASE_QUALIFICATION:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.UPDATE_CASE_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.UPDATE_CASE_SUCCESS:
            return {
                ...state,
                loading: false,
                currentCase: action.payload
            };
        case actionTypes.ERROR_UPDATE_CASE:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.ADD_NOTE_CASE_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.ADD_NOTE_CASE_SUCCESS:
            return {
                ...state,
                loading: false,
                currentCase: action.payload
            };
        case actionTypes.ERROR_ADD_NOTE_CASE:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            };
        case actionTypes.UPDATE_CASE_PROGRESS_STATUS:
            (state.currentCase as Case).progressStatus = action.payload
            return {
                ...state
            };
        default:
            return state;
    }
}
