import { DynamicDataResponse } from "src/model/aramis/DynamicDataResponse";
import AbstractService from "./AbstractService";

export default class AramisService extends AbstractService {

    public async getDynamicData(accountId: string): Promise<DynamicDataResponse[]> {
        return this.get<DynamicDataResponse[]>(`/fastr-acts/renvoi-equipement/get-dynamic-data?accountId=${accountId}`);
    }
}