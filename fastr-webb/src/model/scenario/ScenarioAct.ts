
import {ScenarioActDTO} from "./ScenarioActDTO";
import Act from "../acts/Act";


export interface ScenarioAct extends Act {
    actId: string;
    actName: string;
    actDetail: ScenarioActDTO;
}
