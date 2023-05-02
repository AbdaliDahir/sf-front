// Components
import AbstractService from "./AbstractService";
import {MediaSettingResponse} from "../model/media/MediaSettingResponse";

export default class MediaService extends AbstractService {

    public async getMediaSettings(): Promise<MediaSettingResponse> {
        return this.get<MediaSettingResponse>(`/fastr-cases/cases/user/media-configuration`);
    }
}
