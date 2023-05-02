import Act from "../Act";
import {RetentionData} from "./RetentionData";

export  interface RetentionActRequestDTO extends Act {
    retentionData: RetentionData;
}