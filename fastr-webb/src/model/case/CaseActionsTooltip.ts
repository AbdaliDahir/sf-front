import {CaseStatus} from "./CaseStatus";

export interface CaseActionsTooltip{
    actionId?: string
    actionLabel?: string
    status?:CaseStatus
    updateDate: string
}