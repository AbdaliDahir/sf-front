import { Page } from "../../model/utils/Page"

import FastService, { FastMessage } from "../../service/FastService";
import { Pagination } from "../types/Pagination"
import * as actionsType from "./actionsTypes"

import CaseService from "../../service/CaseService";
import { Case } from "src/model/Case";
import { Activity } from "src/model/Activity";
import { CaseAmountIndicators } from "../../model/Tray/CaseAmountIndicators";
import { TrayHeaderFilterEnum } from "../../model/Tray/TrayHeaderFilterEnum";
import { Action } from "../../model/actions/Action";
import { ActionAmountIndicators } from "../../model/Tray/ActionAmountIndicators";
import { ActionMonitoringAmountIndicators } from "../../model/Tray/ActionMonitoringAmountIndicators";
import {Site} from "../../model/Site";

const caseService = new CaseService(true);

export const fetchAndStoreSyntheticTrayCases = (activityCodeSelected: string, isSupervisor: boolean, isCCMaxwell: boolean) => {
    return async dispatch => {
        dispatch(fetchSyntheticTrayCases())
        try {
            const retrievedCase: Case[] = await caseService.getSyntheticTrayCases(activityCodeSelected, isSupervisor, isCCMaxwell)
            dispatch(storeTrayCases(retrievedCase))
            dispatch(saveLastTrayFetchDone("fetchAndStoreTrayCases", activityCodeSelected, isSupervisor))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingTrayCases(error.message))
            throw error
        }
    }
}

const saveLastTrayFetchDone = (functionUsedToFetch: string, activityCodeSelected: string = "", isSupervisor: boolean = false) => (
    {
        type: actionsType.SET_LAST_TRAY_FETCH_DONE,
        payload: {
            functionUsedToFetch,
            activityCodeSelected,
            isSupervisor
        }
    }
)



const fetchSyntheticTrayCases = () => (
    {
        type: actionsType.SYNTHETIC_TRAY_FETCH_CASES_START,
    }
)

const storeTrayCases = (retrievedCases: Case[]) => (
    {
        type: actionsType.TRAY_FETCH_CASES_SUCCESS,
        payload: retrievedCases
    }
)

const errorFetchingTrayCases = (err) => (
    {
        type: actionsType.TRAY_FETCH_CASES_FAIL,
        payload: err
    }
)


export const fetchAndStoreTrayCases = (activityCodeSelected: string, pagination: Pagination, site?: string, isAgent?:boolean) => {
    return async dispatch => {
        isAgent ?
            dispatch(fetchTrayCases()):
            dispatch(fetchSVTrayCases())
        try {
            const retrievedCasesPage: Page<Case> = await caseService.getTrayCases(activityCodeSelected, pagination, site)
            dispatch(storeSVTrayCases(retrievedCasesPage.content))
            dispatch(storeCaseAmount(retrievedCasesPage.totalElements))
            dispatch(saveLastTrayFetchDone("fetchAndStoreTrayCases", activityCodeSelected, isAgent?false:true))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingSVTrayCases(error.message))
            throw error
        }
    }
}

export const fetchAndStoreTrayActions = (activityCodeSelected: string, pagination: Pagination, site?: string) => {
    return async dispatch => {
        dispatch(fetchTrayActions())
        try {
            const retrievedActionPage: Page<Action> = await caseService.getTrayActions(activityCodeSelected, pagination, site)
            dispatch(storeTrayActions(retrievedActionPage.content))
            dispatch(storeActionsAmount(retrievedActionPage.totalElements))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingTrayActions(error.message))
            throw error
        }
    }
}

export const fetchAndStoreAgentTrayActions = (activityCodeSelected: string, themeSelected: string) => {
    return async dispatch => {
        dispatch(fetchTrayActions())
        try {
            const retrievedActionPage: Action[] = await caseService.getAgentTrayActions(activityCodeSelected, themeSelected)
            dispatch(storeTrayActions(retrievedActionPage))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingTrayActions(error.message))
            throw error
        }
    }
}



export const fetchAndExportSVTrayActions = (activityCodeSelected: string) => {
    return async dispatch => {
        dispatch(toggleExporting(true));
        try {
            const data = await caseService.exportSupervisorTrayActions(activityCodeSelected);
            downloadFile(data, `Actions-${activityCodeSelected}.csv`);
            dispatch(toggleExporting(false));
        } catch (e) {
            dispatch(toggleExporting(false));
            const error = await e
            dispatch(errorFetchingTrayActions(error.message))
            throw error
        }
    }
}

export const fetchAndExportAgentTrayActions = (activityCodeSelected: string) => {
    return async dispatch => {
        dispatch(toggleExporting(true));
        try {
            const data = await caseService.exportAgentTrayActions(activityCodeSelected);
            downloadFile(data, `Actions-${activityCodeSelected}.csv`);
            dispatch(toggleExporting(false));
        } catch (e) {
            dispatch(toggleExporting(false));
            const error = await e
            dispatch(errorFetchingTrayActions(error.message))
            throw error
        }
    }
}

export const fetchAndStoreSVTrayActionMonitorings = (activityCodeSelected: string, pagination: Pagination, site?: string) => {
    return async dispatch => {
        dispatch(fetchTrayActions())
        try {
            pagination.filters?.map(filter => {
                if (filter.filterValue) {
                    filter.filterValue = filter.filterValue.replace('(', '\\(');
                    filter.filterValue = filter.filterValue.replace(')', '\\)');
                }
            })
            const retrievedActionPage: Page<Action> = await caseService.getTrayActionMonitorings(activityCodeSelected, pagination, site)
            dispatch(storeTrayActions(retrievedActionPage.content))
            dispatch(storeActionsAmount(retrievedActionPage.totalElements))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingTrayActions(error.message))
            throw error
        }
    }
}

export const fetchAndExportSVTrayActionsMonitoring = (activityCodeSelected: string) => {
    return async dispatch => {
        dispatch(toggleExporting(true));
        try {
            const data = await caseService.exportSupervisorTrayActionsMonitoring(activityCodeSelected);
            downloadFile(data, `Actions-Monitoring-${activityCodeSelected}.csv`);
            dispatch(toggleExporting(false));
        } catch (e) {
            dispatch(toggleExporting(false));
            const error = await e
            dispatch(errorFetchingTrayActions(error.message))
            throw error
        }
    }
}

export const fetchAndExportAgentTrayActionsMonitoring = (activityCodeSelected: string) => {
    return async dispatch => {
        dispatch(toggleExporting(true));
        try {
            const data = await caseService.exportAgentTrayActionsMonitoring(activityCodeSelected);
            downloadFile(data, `Actions-Monitoring-${activityCodeSelected}.csv`);
            dispatch(toggleExporting(false));
        } catch (e) {
            dispatch(toggleExporting(false));
            const error = await e
            dispatch(errorFetchingTrayActions(error.message))
            throw error
        }
    }
}

const downloadFile = (data: Blob, fileName: string) => {
    const a = document.createElement("a");
    document.body.appendChild(a);
    const blob = new Blob([data], { type: "octet/stream" }),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

const fetchSVTrayCases = () => (
    {
        type: actionsType.TRAY_FETCH_SUPERVISOR_CASES_START,
    }
)
const fetchTrayCases = () => (
    {
        type: actionsType.TRAY_FETCH_CASES_START,
    }
)

const storeSVTrayCases = (retrievedCases: Case[]) => (
    {
        type: actionsType.TRAY_FETCH_SUPERVISOR_CASES_SUCCESS,
        payload: retrievedCases
    }
)

const errorFetchingSVTrayCases = (err) => (
    {
        type: actionsType.TRAY_FETCH_SUPERVISOR_CASES_FAIL,
        payload: err
    }
)

const fetchTrayActions = () => (
    {
        type: actionsType.TRAY_FETCH_ACTIONS_START,
    }
)

const toggleExporting = (isExporting: boolean) => (
    {
        type: actionsType.TRAY_EXPORT_ACTIONS_TOGGLE,
        payload: isExporting
    }
)

const storeTrayActions = (retrievedActions: Action[]) => (
    {
        type: actionsType.TRAY_FETCH_ACTIONS_SUCCESS,
        payload: retrievedActions
    }
)

const errorFetchingTrayActions = (err) => (
    {
        type: actionsType.TRAY_FETCH_ACTIONS_FAIL,
        payload: err
    }
)

export const dispatchAndStoreThemesSelection = (themeSeletion: string[]) => {
    return async dispatch => {
        dispatch(storeThemesSelection(themeSeletion))
    }
}

const storeThemesSelection = (themeSeletion: string[]) => (
    {
        type: actionsType.STORE_THEMES_SELECTION,
        payload: themeSeletion
    }
)


export const fetchAndStoreTrayActivities = () => {
    return async dispatch => {
        dispatch(fetchTrayActivities())
        try {
            const backOfficeActivities: Activity[] = await caseService.getActivities()
            dispatch(storeTrayActivities(backOfficeActivities))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingTrayActivities(error.message))
            throw error
        }
    }
}

const fetchTrayActivities = () => (
    {
        type: actionsType.TRAY_FETCH_ACTIVITIES_START,
    }
)

const storeTrayActivities = (backOfficeActivities: Activity[]) => (
    {
        type: actionsType.TRAY_FETCH_ACTIVITIES_SUCCESS,
        payload: backOfficeActivities
    }
)

const errorFetchingTrayActivities = (err) => (
    {
        type: actionsType.TRAY_FETCH_ACTIVITIES_FAIL,
        payload: err
    }
)

const storeCaseAmount = (stock: number) => (
    {
        type: actionsType.TRAY_FETCH_CASE_AMOUNT_SUCCESS,
        payload: stock
    }
)

const storeActionsAmount = (stock: number) => (
    {
        type: actionsType.TRAY_FETCH_ACTIONS_AMOUNT_SUCCESS,
        payload: stock
    }
)

export const fetchAndStoreTrayCaseAmountIndicators = (activityCodeSelected: string, themeSelection: string, isSupervisor: boolean, isCCMaxwell: boolean, site?: string) => {
    return async dispatch => {
        dispatch(fetchTrayAmountIndicators());
        try {
            const caseAmountIndicators: CaseAmountIndicators = await caseService.getCaseAmountIndicators(activityCodeSelected, themeSelection, isSupervisor, isCCMaxwell, site);
            dispatch(storeTrayAmountIndicators(caseAmountIndicators))
        } catch (e) {
            const error = await e;
            dispatch(errorFetchingTrayAmountIndicators(error.message));
            throw error
        }
    }
};

export const fetchAndStoreTrayActionAmountIndicators = (activityCodeSelected: string, themeSelection: string, isSupervisor: boolean, site?: string) => {
    return async dispatch => {
        dispatch(fetchTrayAmountIndicators());
        try {
            const actionAmountIndicators: ActionAmountIndicators = await caseService.getActionAmountIndicators(activityCodeSelected, themeSelection, isSupervisor, site);
            dispatch(storeTrayActionsAmountIndicators(actionAmountIndicators))
        } catch (e) {
            const error = await e;
            dispatch(errorFetchingTrayAmountIndicators(error.message));
            throw error
        }
    }
};

export const fetchAndStoreTrayActionMonitoringAmountIndicators = (activityCodeSelected: string, themeSelection: string, isSupervisor: boolean, site?: string) => {
    return async dispatch => {
        dispatch(fetchTrayAmountIndicators());
        try {
            const actionAmountIndicators: ActionMonitoringAmountIndicators = await caseService.getActionMonitoringAmountIndicators(activityCodeSelected, themeSelection, isSupervisor, site);
            dispatch(storeTrayActionMonitoringAmountIndicators(actionAmountIndicators))
        } catch (e) {
            const error = await e;
            dispatch(errorFetchingTrayAmountIndicators(error.message));
            throw error
        }
    }
};

const fetchTrayAmountIndicators = () => (
    {
        type: actionsType.TRAY_AMOUNT_INDICATORS_FETCH_START,
    }
);

const storeTrayAmountIndicators = (caseAmountIndicators: CaseAmountIndicators) => (
    {
        type: actionsType.TRAY_AMOUNT_INDICATORS_FETCH_SUCCESS,
        payload: caseAmountIndicators
    }
);

const storeTrayActionsAmountIndicators = (actionAmountIndicators: ActionAmountIndicators) => (
    {
        type: actionsType.TRAY_ACTION_AMOUNT_INDICATORS_FETCH_SUCCESS,
        payload: actionAmountIndicators
    }
);

const storeTrayActionMonitoringAmountIndicators = (actionAmountIndicators: ActionMonitoringAmountIndicators) => (
    {
        type: actionsType.TRAY_ACTION_MONITORING_AMOUNT_INDICATORS_FETCH_SUCCESS,
        payload: actionAmountIndicators
    }
);

const errorFetchingTrayAmountIndicators = (err) => (
    {
        type: actionsType.TRAY_AMOUNT_INDICATORS_FETCH_FAIL,
        payload: err
    }
);

export const assignAndStoreCaseToTray = (activityCodeSelected: string, themeSelection: string, isCCMaxwell: boolean) => {
    return async dispatch => {
        dispatch(assignCase())
        try {
            const caseToAssign: Case = await caseService.assignCase(activityCodeSelected, themeSelection, isCCMaxwell)
            dispatch(storeCaseToTray(caseToAssign))
            const jsonMessage: FastMessage = {
                event: "clickOnAssignedCase",
                error: false,
                idCase: caseToAssign.caseId,
                serviceId: caseToAssign.serviceId
            }
            FastService.postRedirectMessage(jsonMessage)
        } catch (e) {
            const error = await e
            dispatch(errorAssigningCase(error.message))
            throw error
        }
    }
}


export const assignAction = (activityCodeSelected: string, themeSelection: string) => {
    return async dispatch => {
        dispatch(assignActionStart())
        try {
            const actionToAssign: Action = await caseService.assignAction(activityCodeSelected, themeSelection)
            dispatch(storeActionToTray(actionToAssign))
            localStorage.setItem("INFOS_FOCUS_TREATMENT_ACTION_FROM_TRAY", JSON.stringify({caseId : actionToAssign.caseId, actionId: actionToAssign.actionId}))
            const jsonMessage: FastMessage = {
                event: "clickOnAssignedCase",
                error: false,
                idCase: actionToAssign.caseId,
                serviceId: actionToAssign.serviceId
            }
            FastService.postRedirectMessage(jsonMessage)
        } catch (e) {
            const error = await e
            dispatch(errorAssigningAction(error.message))
            throw error
        }
    }
}

export const assignActionMonitoring = (activityCodeSelected: string, themeSelection: string) => {
    return async dispatch => {
        dispatch(assignActionStart())
        try {
            const actionToAssign: Action = await caseService.assignActionMonitoring(activityCodeSelected, themeSelection)
            dispatch(storeActionToTray(actionToAssign))
            const jsonMessage: FastMessage = {
                event: "clickOnAssignedCase",
                error: false,
                idCase: actionToAssign.caseId,
                serviceId: actionToAssign.serviceId
            }
            FastService.postRedirectMessage(jsonMessage)
        } catch (e) {
            const error = await e
            dispatch(errorAssigningAction(error.message))
            throw error
        }
    }
}

const assignCase = () => (
    {
        type: actionsType.TRAY_ASSIGN_CASE_START,
    }
)

const assignActionStart = () => (
    {
        type: actionsType.TRAY_ASSIGN_CASE_START,
    }
)

const storeCaseToTray = (assignedCase: Case) => (
    {
        type: actionsType.TRAY_ASSIGN_CASE_SUCCESS,
        payload: assignedCase
    }
)

const storeActionToTray = (assignedAction: Action) => (
    {
        type: actionsType.TRAY_ASSIGN_ACTION_SUCCESS,
        payload: assignedAction
    }
)

const errorAssigningCase = (err) => (
    {
        type: actionsType.TRAY_ASSIGN_CASE_FAIL,
        payload: err
    }
)
const errorAssigningAction = (err) => (
    {
        type: actionsType.TRAY_ASSIGN_ACTION_FAIL,
        payload: err
    }
)

export const assignMultipleCasesToTray = (activitySelected: Activity, caseIds: string[], login: string) => {
    return async dispatch => {
        dispatch(assignMultipleCases())
        try {
            const caseToAssign: Case[] = await caseService.assignCasesByLogin(activitySelected, caseIds, login)
            dispatch(storeCasesToTray(caseToAssign))

        } catch (e) {
            const error = await e
            dispatch(errorAssigningMultipleCases(error.message))
            throw error
        }
    }
}

export const assignMultipleActionsByLogin = (activitySelected: Activity, actionIds: string[], login: string) => {
    return async dispatch => {
        dispatch(assignMultipleCases())
        try {
            const actionToAssign: Action[] = await caseService.assignActionByLogin(activitySelected, actionIds, login)
            dispatch(storeActionsToTray(actionToAssign))

        } catch (e) {
            const error = await e
            dispatch(errorAssigningMultipleCases(error.message))
            throw error
        }
    }
}

export const assignMultipleActionMonitoringsByLogin = (activitySelected: Activity, caseIds: string[], login: string) => {
    return async dispatch => {
        dispatch(assignMultipleCases())
        try {
            const actionToAssign: Action[] = await caseService.assignActionMonitoringByLogin(activitySelected, caseIds, login)
            dispatch(storeActionsToTray(actionToAssign))

        } catch (e) {
            const error = await e
            dispatch(errorAssigningMultipleCases(error.message))
            throw error
        }
    }
}

const assignMultipleCases = () => (
    {
        type: actionsType.TRAY_ASSIGN_MULTIPLE_CASES_START,
    }
)

const storeCasesToTray = (updatedCases: Case[]) => (
    {
        type: actionsType.TRAY_ASSIGN_MULTIPLE_CASES_SUCCESS,
        payload: updatedCases
    }
)

const storeActionsToTray = (updatedActions: Action[]) => (
    {
        type: actionsType.TRAY_ASSIGN_MULTIPLE_ACTIONS_SUCCESS,
        payload: updatedActions
    }
)

const errorAssigningMultipleCases = (err) => (
    {
        type: actionsType.TRAY_ASSIGN_MULTIPLE_CASES_FAIL,
        payload: err
    }
)


export const updatePagination = (pagination: Pagination) => (
    {
        type: actionsType.TRAY_UPDATE_PAGINATION,
        payload: pagination
    }
)

export const setTrayHeaderFilter = (filter: TrayHeaderFilterEnum) => (
    {
        type: actionsType.SET_TRAY_HEADER_FILTER,
        payload: filter
    }
)

export const updateSite = (site: Site) => (
    {
        type: actionsType.TRAY_UPDATE_SITE,
        payload: site
    }
)

