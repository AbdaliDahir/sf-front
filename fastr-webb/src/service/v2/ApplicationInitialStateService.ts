import AbstractService from "../AbstractService";
import {ApplicationInitialState} from "../../model/ApplicationInitialState";
import {HistoRapideSetting} from "../../model/HistoRapideSetting";


export default class ApplicationInitialStateService extends AbstractService {



    public async getInitialState(): Promise<ApplicationInitialState> {
        return this.get<ApplicationInitialState>(`/fastr-auth/application/initialState`);
    }

    public async getHistoRapideSettings(codeActivite?:string): Promise<HistoRapideSetting[]> {
        return this.get<HistoRapideSetting[]>(`/fastr-cases/settings/historapide?codeActivite=${codeActivite}`);
    }


}
