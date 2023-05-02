import AbstractService from "./AbstractService";
import {ExternalAppContextValue} from "../model/ExternalAppContextValue";
import {ExternalApplication} from "../model/disrcExternalApps/ExternalApplication";

export default class DisrcExternalApplicationService extends AbstractService {

    constructor() {
        super(true);
    }

    public async getExternalApps() {
        return this.get(`/fastr-auth/applications/user/`);
    }

    public async getExternalAppAction(appCode, serviceId: string, params: Map<ExternalAppContextValue, string>): Promise<ExternalApplication>{
        const objParams =  {};
        params.forEach((value, key) => {
            objParams[key] = value;
        });
        const urlParams = Object.keys(objParams).map(key => `${key}=${objParams[key]}`).join("&");
        return this.get<ExternalApplication>(`/fastr-auth/applications/code/${appCode}/calculate?${urlParams}&refSiebel=${serviceId}`);
    }
}