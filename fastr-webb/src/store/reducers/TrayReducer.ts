import { Case } from "../../model/Case";
import * as actionTypes from "../actions/actionsTypes";
import { TrayState } from '../types/TrayStore'
import { TrayHeaderFilterEnum } from "../../model/Tray/TrayHeaderFilterEnum";
import { Action } from "../../model/actions/Action";

const initialState: TrayState = {
    loading: false,
    exporting: false,
    activities: [],
    cases: [],
    actions: [],
    stock: 0,
    errors: [],
    lastTrayFetchDone: undefined,
    pagination: { page: 1, sizePerPage: 50 },
    themeSelection: ["Tous"],
    trayHeaderFilter: TrayHeaderFilterEnum.NONE,
    caseAmountIndicators: {
        onGoingCases: 0,
        reopenedCases: 0,
        qualifiedCases: 0
    },
    actionAmountIndicators: {
        onGoingActions: 0,
        qualifiedActions: 0,
        assignmentExceed: 0,
        notBeforeExceed: 0,
        notUpdatedInLastFiveDays: 0
    },
    actionMonitoringsIndicators: {
        toMonitorActions: 0,
        monitoredActions: 0,
        monitoringToFinalizeActions: 0
    },
    site: undefined
};

export function TrayReducer(
    state = initialState,
    action: actionTypes.ActionsType
): TrayState {
    switch (action.type) {
        case actionTypes.SYNTHETIC_TRAY_FETCH_CASES_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.TRAY_FETCH_CASES_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.TRAY_FETCH_CASES_SUCCESS:
            return {
                ...state,
                loading: false,
                cases: action.payload
            };
        case actionTypes.TRAY_FETCH_CASES_FAIL:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.TRAY_FETCH_ACTIVITIES_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.TRAY_FETCH_ACTIVITIES_SUCCESS:
            return {
                ...state,
                loading: false,
                activities: action.payload
            };
        case actionTypes.TRAY_FETCH_ACTIVITIES_FAIL:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.TRAY_AMOUNT_INDICATORS_FETCH_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.TRAY_AMOUNT_INDICATORS_FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                caseAmountIndicators: action.payload
            };
        case actionTypes.TRAY_ACTION_AMOUNT_INDICATORS_FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                actionAmountIndicators: action.payload
            };
        case actionTypes.TRAY_ACTION_MONITORING_AMOUNT_INDICATORS_FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                actionMonitoringsIndicators: action.payload
            };
        case actionTypes.TRAY_AMOUNT_INDICATORS_FETCH_FAIL:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.TRAY_FETCH_CASE_AMOUNT_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.TRAY_FETCH_CASE_AMOUNT_SUCCESS:
            return {
                ...state,
                loading: false,
                caseAmount: action.payload
            };
        case actionTypes.TRAY_FETCH_ACTIONS_AMOUNT_SUCCESS:
            return {
                ...state,
                loading: false,
                actionsAmount: action.payload
            };
        case actionTypes.TRAY_FETCH_CASE_AMOUNT_FAIL:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.TRAY_ASSIGN_CASE_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.TRAY_ASSIGN_CASE_SUCCESS:
            return {
                ...state,
                loading: false,
                cases: [...state.cases, action.payload],
                stock: state.stock - 1
            };
        case actionTypes.TRAY_ASSIGN_ACTION_SUCCESS:
            const previous = state.actions ? state.actions : [];
            return {
                ...state,
                loading: false,
                actions: [...previous, action.payload],
                stock: state.stock - 1
            };
        case actionTypes.TRAY_ASSIGN_CASE_FAIL:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.TRAY_ASSIGN_ACTION_FAIL:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.TRAY_ASSIGN_MULTIPLE_CASES_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.TRAY_ASSIGN_MULTIPLE_CASES_SUCCESS:
            // Update array with updated Cases and update the stock number
            const { updatedTrayCases, newStock } = updateTrayAndStock(state, action);
            return {
                ...state,
                loading: false,
                cases: updatedTrayCases,
                stock: newStock
            };
        case actionTypes.TRAY_ASSIGN_MULTIPLE_ACTIONS_SUCCESS:
            // Update array with updated Cases and update the stock number
            const { updatedTrayActions, newStockActions } = updateActionTrayAndStock(state, action);
            return {
                ...state,
                loading: false,
                actions: updatedTrayActions,
                stock: newStockActions
            };
        case actionTypes.ERROR_ADD_NOTE_CASE:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            };
        case actionTypes.TRAY_FETCH_SUPERVISOR_CASES_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.TRAY_FETCH_SUPERVISOR_CASES_SUCCESS:
            return {
                ...state,
                loading: false,
                cases: action.payload
            };
        case actionTypes.TRAY_FETCH_SUPERVISOR_CASES_FAIL:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            }

        case actionTypes.TRAY_FETCH_ACTIONS_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.TRAY_FETCH_ACTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                actions: action.payload
            };
        case actionTypes.TRAY_FETCH_ACTIONS_FAIL:
            return {
                ...state,
                loading: false,
                errors: [...state.errors, action.payload]
            }
        case actionTypes.TRAY_EXPORT_ACTIONS_TOGGLE:
            return {
                ...state,
                exporting: action.payload
            };
        case actionTypes.TRAY_UPDATE_PAGINATION:
            return {
                ...state,
                pagination: action.payload
            }
        case actionTypes.STORE_THEMES_SELECTION:
            return {
                ...state,
                loading: false,
                themeSelection: action.payload
            };
        case actionTypes.SET_TRAY_HEADER_FILTER:
            return {
                ...state,
                trayHeaderFilter: action.payload
            };

        case actionTypes.SET_LAST_TRAY_FETCH_DONE:
            return {
                ...state,
                lastTrayFetchDone: action.payload
            }
        case actionTypes.TRAY_UPDATE_SITE:
            return {
                ...state,
                site: action.payload
            }

        default:
            return state;
    }
}

const updateTrayAndStock = (state, action) => {
    const updatedTrayCases: Case[] = [...state.cases]
    const updatedCases: Case[] = action.payload
    let newStock: number = state.stock
    updatedTrayCases.forEach(aCase => {
        const indexInUpdatedCases = updatedCases.findIndex(bCase => bCase.caseId === aCase.caseId);
        if (indexInUpdatedCases !== -1) {
            if (aCase.status === "QUALIFIED") {
                newStock--
            }
            updatedTrayCases[updatedTrayCases.indexOf(aCase)] = updatedCases[indexInUpdatedCases];
        }
    })
    return { updatedTrayCases, newStock };
}

const updateActionTrayAndStock = (state, action) => {
    const updatedTrayActions: Action[] = [...state.actions]
    const updatedActions: Action[] = action.payload
    let newStockActions: number = state.stock
    updatedTrayActions.forEach(aAction => {
        const indexInUpdatedCases = updatedActions.findIndex(bAction => bAction.actionId === aAction.actionId);
        if (indexInUpdatedCases !== -1) {
            if (aAction.processCurrentState?.status === "QUALIFIED") {
                newStockActions--
            }
            updatedTrayActions[updatedTrayActions.indexOf(aAction)] = updatedActions[indexInUpdatedCases];
        }
    })
    return { updatedTrayActions, newStockActions };
}

