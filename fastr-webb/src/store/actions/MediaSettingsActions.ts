import * as actionsType from "./actionsTypes";
import {MediaSetting} from "../../model/media/MediaSetting";
import MediaService from "../../service/MediaService";
import {Setting} from "../../model/acts/Setting";
import {MediaSettingResponse} from "../../model/media/MediaSettingResponse";

const mediaService = new MediaService(true);
export const fetchAndStoreMediaSettings = () => {
    return async dispatch => {
        dispatch(fetchingMediaSetting())
        try {
            const mediaSettingResponse:MediaSettingResponse = await mediaService.getMediaSettings();
            const mediaSetting: Setting<MediaSetting[]> = mediaSettingResponse.mediaSetting;
            const correspondingMediaSetting:MediaSetting|undefined = mediaSetting.settingDetail.
            find((mediaSetting)=>mediaSetting.associatedActivity.indexOf(mediaSettingResponse.currentActivity)!= -1);
            dispatch(storeMediaSettings(correspondingMediaSetting))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingMediaSetting(error.message))
            throw e
        }
    }
}

const fetchingMediaSetting = () => (
    {
        type: actionsType.FETCH_MEDIA_SETTINGS,
    }
)

const storeMediaSettings = (MediaSetting: MediaSetting | undefined) => (
    {
        type: actionsType.STORE_MEDIA_SETTINGS,
        payload: MediaSetting
    }
)

const errorFetchingMediaSetting = (err) => (
    {
        type: actionsType.ERROR_FETCHING_MEDIA_SETTING,
        payload: err
    }

)