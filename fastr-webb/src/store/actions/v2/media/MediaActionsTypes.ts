export interface ActionsType {
    type: string
    // tslint:disable-next-line:no-any
    payload?: any
}

export const FETCH_MEDIA_SETTINGS_V2 = "FETCH_MEDIA_SETTINGS_V2"
export const STORE_MEDIA_SETTINGS_V2 = "STORE_MEDIA_SETTINGS_V2"
export const ERROR_FETCHING_MEDIA_SETTING_V2 = "ERROR_FETCHING_MEDIA_SETTING_V2"
