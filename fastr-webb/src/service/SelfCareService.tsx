// Components
import AbstractService from "./AbstractService";

import {GesteCommercialBios} from "../model/TimeLine/GesteCommercialBios";

export default class SelfCareService extends AbstractService {

    constructor() {
        super(false);
    }

    public async retrieveDiscounts(csuCode: string, csuNumeroIntra: string): Promise<Array<GesteCommercialBios>> {
        return this.get<Array<GesteCommercialBios>>(`/fastr-selfcare/selfcare/consultParc/${csuCode}/${csuNumeroIntra}`);
    }

    // tslint:disable-next-line:no-any
    public async retrieveSOCOMobile(id: string, range: string): Promise<any> {
        // tslint:disable-next-line:no-any
        return this.get<any>(`/fastr-selfcare/selfcare/mobile/communication/${id}/${range}`);
    }

    // tslint:disable-next-line:no-any
    public async retrieveSOCOFixe(id: string, range: string): Promise<any> {
        // tslint:disable-next-line:no-any
        return this.get<any>(`/fastr-selfcare/selfcare/landline/communication/${id}/${range}`);
    }

    public async retrieveSOCOSMS(id: string, range: string): Promise<any> {
        // tslint:disable-next-line:no-any
        return this.get<any>(`/fastr-selfcare/selfcare/solicitation/${id}/${range}`);
    }

    public async eclientNotificationForGdpr(caseId: string) {
        const today = new Date();
        const notificationBody = {
          idDossier: caseId,
          statusValue: "COMPLETED",
          closingDate: today.getTime(),
        };
        return this.postWithCustomHeader(`/fastr-selfcare/selfcare/gdpr/status`, notificationBody,[]);
    }
}

