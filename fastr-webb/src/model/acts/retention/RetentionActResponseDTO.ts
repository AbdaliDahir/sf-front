import Act from "../Act";
import {RetentionData} from "./RetentionData";

export interface RetentionActResponseDTO extends Act {
    actId: string;
    actFunctionalId: string
    actName: string;
    retentionData: RetentionData;
}

