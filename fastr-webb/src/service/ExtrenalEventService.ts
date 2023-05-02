import { ExternalEvent } from "src/model/externalEvent/ExternalEvent";
import AbstractService from "./AbstractService";

export default class ExternalEventService extends AbstractService {

    public async getFixeExternalEvents(siebelId: string, objectSource: string): Promise<ExternalEvent[]> {
        return this.get<ExternalEvent[]>(`/fastr-cases/external-event/refAccount/${siebelId}/source/${objectSource}`);
    }

    public async getMobileExternalEvents(serviceId: string, objectSource: string): Promise<ExternalEvent[]> {
        return this.get<ExternalEvent[]>(`/fastr-cases/external-event/service/${serviceId}/source/${objectSource}`);
    }
}