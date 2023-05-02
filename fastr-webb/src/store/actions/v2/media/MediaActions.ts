import * as actionsTypes from "./MediaActionsTypes"
import MediaService from "../../../../service/MediaService";
import {MediaSettingResponse} from "../../../../model/media/MediaSettingResponse";
import {Setting} from "../../../../model/acts/Setting";
import {MediaSetting} from "../../../../model/media/MediaSetting";


const mediaService = new MediaService(true);
export const fetchAndStoreMediaSettingsV2 = () => {
    return async dispatch => {
        dispatch(fetchingMediaSettingV2())
        try {
            const mediaSettingResponse:MediaSettingResponse = await mediaService.getMediaSettings();
            const mediaSetting: Setting<MediaSetting[]> = mediaSettingResponse.mediaSetting;
            const correspondingMediaSetting:MediaSetting|undefined = mediaSetting.settingDetail.
            find((mediaSetting)=>mediaSetting.associatedActivity.indexOf(mediaSettingResponse.currentActivity)!= -1);
            dispatch(storeMediaSettingsV2(correspondingMediaSetting))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingMediaSettingV2(error.message))
            throw e
        }
    }
}

const fetchingMediaSettingV2 = () => (
    {
        type: actionsTypes.FETCH_MEDIA_SETTINGS_V2,
    }
)

const storeMediaSettingsV2 = (mediaSetting: MediaSetting | undefined) => (
    {
        type: actionsTypes.STORE_MEDIA_SETTINGS_V2,
        payload: mediaSetting
    }
)

const errorFetchingMediaSettingV2 = (err) => (
    {
        type: actionsTypes.ERROR_FETCHING_MEDIA_SETTING_V2,
        payload: err
    }

)