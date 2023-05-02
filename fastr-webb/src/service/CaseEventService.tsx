// Components
import AbstractService from "./AbstractService";
import {ViewCaseEvent} from "../model/ViewCaseEvent";

export default class CaseEventService extends AbstractService {

    public async getCaseEventsHistory(caseId: string): Promise<ViewCaseEvent[]> {
        return this.get<ViewCaseEvent[]>(`/fastr-cases/cases/${caseId}/events/history`);
    }
}
