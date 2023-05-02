import {Case} from "src/model/Case";
import {Activity} from "src/model/Activity";
import {Pagination} from "./Pagination"
import {CaseAmountIndicators} from "../../model/Tray/CaseAmountIndicators";
import {TrayHeaderFilterEnum} from "../../model/Tray/TrayHeaderFilterEnum";
import {LastTrayFetchDone} from "../../model/Tray/LastTrayFetchDone";
import {Action} from "../../model/actions/Action";
import {ActionAmountIndicators} from "../../model/Tray/ActionAmountIndicators";
import {ActionMonitoringAmountIndicators} from "../../model/Tray/ActionMonitoringAmountIndicators";
import {Site} from "../../model/Site";

export interface TrayState {
    loading: boolean
    exporting: boolean
    activities: Activity[]
    cases: Case[]
    actions?: Action[]
    stock: number
    lastTrayFetchDone?: LastTrayFetchDone
    trayHeaderFilter: TrayHeaderFilterEnum
    caseAmount?: number
    actionsAmount?: number
    pagination: Pagination
    sort?: string
    errors: string[]
    themeSelection: string[]
    caseAmountIndicators: CaseAmountIndicators
    actionAmountIndicators: ActionAmountIndicators
    actionMonitoringsIndicators: ActionMonitoringAmountIndicators
    site?: Site
}