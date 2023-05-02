import AbstractService from "./AbstractService";
import {Alert,} from "../model/alert/Alert";


export default class AlertService extends AbstractService {

    constructor() {
        super(false);
    }

    public async getAlertsByClientId(clientId: string, serviceId: string, isMobileService: boolean): Promise<Array<Alert>> {
        return this.get<Array<Alert>>(`/fastr-clients/clients/alerts/?clientId=${clientId}&serviceId=${serviceId}&isMobileService=${isMobileService}`);
    }
}