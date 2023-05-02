import Act from "../Act";
import {AntiChurnData} from "./AntiChurnData";

export  interface AntiChurnActRequestDTO extends Act {
    antiChurnData: AntiChurnData;
}