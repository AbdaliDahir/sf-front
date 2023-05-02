import Act from "../Act";
import {AntiChurnData} from "./AntiChurnData";

export interface AntiChurnActResponseDTO extends Act {
    actId: string;
    actFunctionalId: string
    actName: string;
    antiChurnData: AntiChurnData;
}