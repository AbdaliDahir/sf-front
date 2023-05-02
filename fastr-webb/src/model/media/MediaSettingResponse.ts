import {Setting} from "../acts/Setting";
import {MediaSetting} from "./MediaSetting";

export  interface MediaSettingResponse {
    currentActivity:string;
    mediaSetting:Setting<MediaSetting[]>
}