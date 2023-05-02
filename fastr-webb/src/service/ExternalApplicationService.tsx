import {ExternalApplication} from "../model/externalApplications/ExternalApplication";
import AbstractService from "./AbstractService";
import {ExternalApplicationRequest} from "../model/externalApplications/ExternalApplicationRequest";


export default class ExternalApplicationsService extends AbstractService {


    public async getExternalApplication(applicationCode: string ): Promise<ExternalApplication> {
        let externalApplicationRequest: ExternalApplicationRequest = {applicationCode};
        return this.post<ExternalApplicationRequest,ExternalApplication>(`/fastr-acts/externalApps`,externalApplicationRequest );
    }

    public async getExternalApplicationAction(applicationCode: string , actionCode): Promise<ExternalApplication> {
        let externalApplicationRequest: ExternalApplicationRequest = {applicationCode, actionCode};
        return this.post<ExternalApplicationRequest,ExternalApplication>(`/fastr-acts/externalApps`, externalApplicationRequest);
    }

}
