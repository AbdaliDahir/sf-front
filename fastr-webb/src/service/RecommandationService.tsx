import AbstractService from "./AbstractService";
import {Recommandation} from "../model/recommandations/Recommandation";

export default class RecommandationService extends AbstractService {
    constructor() {
        super(true);
    }

    public async getRecommandations(csuCode: string | undefined) : Promise<Array<Recommandation>> {
        return this.get<Array<Recommandation>>(`/fastr-acts/acts/nba/${csuCode}`);
    }
}