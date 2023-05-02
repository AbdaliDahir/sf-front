import {ActType} from "./ActType";

export interface AntiChurnClientProposal {
    code: string;
    label: string;
    actType: Array<ActType>;
}