import * as actionsType from "./actionsTypes";
import ActService from "../../service/ActService";
import {WebsapSetting} from "../../model/acts/websap/WebsapSetting";
import {Setting} from "../../model/acts/Setting";

const actService = new ActService(true);
export const fetchAndStoreWebsapSettings = () => {
    return async dispatch => {
        dispatch(fetchingWebsapSetting())
        try {
            const websapSettings: Setting<WebsapSetting> = await actService.getWebsapSettings();
            dispatch(storeWebsapSettings(websapSettings.settingDetail))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingWebsapSetting(error.message))
            throw e
        }
    }
}




const fetchingWebsapSetting = () => (
    {
        type: actionsType.FETCH_WEBSAP_SETTINGS,
    }
)

const storeWebsapSettings = (websapSetting: WebsapSetting) => (
    {
        type: actionsType.STORE_WEBSAP_SETTINGS,
        payload: websapSetting
    }
)

const errorFetchingWebsapSetting = (err) => (
    {
        type: actionsType.ERROR_FETCHING_WEBSAP_SETTING,
        payload: err
    }

)

export const fetchAndStoreWebsapAccess = (sapPassword: string) => {
    return async dispatch => {
        dispatch(fetchingWebsapAccess())
        try {
            const websapAccess: any = await actService.getWebsapAccess(sapPassword);
            dispatch(storeWebsapAccess(websapAccess))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingWebsapAccess(error.message))
            throw e
        }
    }
}

const fetchingWebsapAccess = () => (
    {
        type: actionsType.FETCH_WEBSAP_ACCESS,
    }
)

const storeWebsapAccess = (websapAccess: string) => (
    {
        type: actionsType.STORE_WEBSAP_ACCESS,
        payload: websapAccess
    }
)

const errorFetchingWebsapAccess = (err) => (
    {
        type: actionsType.ERROR_FETCHING_WEBSAP_ACCESS,
        payload: err
    }

)