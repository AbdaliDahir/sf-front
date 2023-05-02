import {CaseStatus} from "../case/CaseStatus";
import {ActionProgressStatus} from "./ActionProgressStatus";

export interface ActionProcessCurrentState {
    status?: CaseStatus
    progressStatus?: ActionProgressStatus
}