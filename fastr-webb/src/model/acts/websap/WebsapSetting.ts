import {WebsapADGSetting} from "./WebsapADGSetting";

export  interface WebsapSetting {
    websapADGSettings: Array<WebsapADGSetting>;
    websapADGFailedSettings: WebsapADGSetting;
}