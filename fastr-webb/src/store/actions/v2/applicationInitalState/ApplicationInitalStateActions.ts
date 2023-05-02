import * as actionsTypes from "./ApplicationInitalStateActionsTypes"
import ApplicationInitialStateService from "../../../../service/v2/ApplicationInitialStateService";
import {ApplicationInitialState} from "../../../../model/ApplicationInitialState";
import {HistoRapideSetting} from "../../../../model/HistoRapideSetting";
import {User} from "../../../../model/User";
import SessionService from "../../../../service/SessionService";
import {ApplicationMode} from "../../../../model/ApplicationMode";

const applicationInitialStateService = new ApplicationInitialStateService(true);

export const fetchAndStoreApplicationInitialStateV2 = () => {
    return async dispatch => {
        try {
            const applicationInitialState: ApplicationInitialState = await applicationInitialStateService.getInitialState();
            dispatch(storeApplicationInitialStateV2(applicationInitialState))
            dispatch(fetchAndStoreHistoRapideSettingsV2(applicationInitialState.user?.activity.code));
        } catch (e) {
            SessionService.clearSession();
        }
    }
}

export const fetchAndStoreHistoRapideSettingsV2 = (activityCode?: string) => {
    return async dispatch => {
        const hrs: HistoRapideSetting[] = await applicationInitialStateService.getHistoRapideSettings(activityCode);
        dispatch(storeHistoRapideSettingsV2(hrs))
    }
}

export const updateUser = (user: User) => (
    {
        type: actionsTypes.APPLICATION_INITIAL_STATE_UPDATE_USER,
        payload: user
    }
)

export const resetApplicationInitialState = () => (
    {
        type: actionsTypes.APPLICATION_INITIAL_STATE_RESET
    }
)

const storeApplicationInitialStateV2 = (applicationInitialState: ApplicationInitialState | undefined) => (
    {
        type: actionsTypes.STORE_APPLICATION_INITIAL_STATE_V2,
        payload: applicationInitialState

    }
)

const storeHistoRapideSettingsV2 = (hrs: HistoRapideSetting[] | undefined) => (
    {
        type: actionsTypes.STORE_HISTO_RAPIDE_SETTINGS_V2,
        payload: hrs

    }
)

export const storeUserPasswordV2 = (pass: string) => (
    {
        type: actionsTypes.STORE_USER_PASSWORD_V2,
        payload: pass

    }
)

export const setTargetCaseIdV2 = (id: string) => (
    {
        type: actionsTypes.SET_TARGET_CASE_ID_V2,
        payload: id

    }
)

export const toggleForceStoreV2 = () => (
    {
        type: actionsTypes.TOGGLE_FORCE_STORE_V2
    }
)

export const setForceBackendHost = (host: string) => (
    {
        type: actionsTypes.SET_FORCE_BACKENDHOST,
        payload: host
    }
)

export const switchToIntegratedViewMode = (active) => (
    {
        type: actionsTypes.SWITCH_INTEGRATED_VIEW_MODE,
        payload:  active
    }
)

export const convertSessionMode = (mode: ApplicationMode) => (
    {
        type: actionsTypes.CONVERT_SESSION_MODE,
        payload:  mode
    }
)