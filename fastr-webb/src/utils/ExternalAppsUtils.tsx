import {ExternalAppsSettings} from "../model/disrcExternalApps/ExternalAppsSettings";

export default class ExternalAppsUtils {

    public static isExternalAppAuthorized = (externalAppsList: any, externalAppsSettings: ExternalAppsSettings[]) : boolean => {
        let allowedExternalApps : ExternalAppsSettings[] = [];
        if(externalAppsList && externalAppsSettings) {
            allowedExternalApps = externalAppsSettings?.filter(el => externalAppsList?.indexOf(el.appCode) !== -1);
        }
        return allowedExternalApps?.length > 0
    }
}