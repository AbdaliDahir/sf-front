import {CasesQualificationSettings} from "../CasesQualificationSettings";
import {CaseRoutingRule} from "../CaseRoutingRule";
import {Action} from "../actions/Action";
import {SpecificActionRoutingRule} from "../SpecificActionRoutingRule";
import {ProgressStatus} from "../actions/ProgressStatus";
import {ActionConclusion} from "../actions/ActionConclusion";

export interface CaseActionState {
    actionValidRoutingRule?: CaseRoutingRule,
    actionThemeSelected?: CasesQualificationSettings,
    isActionThemeSelected: boolean,
    actionAdditionalData: any,
    actionComment: string,
    actionsList: Array<Action>,
    actionProgressStatus?: ProgressStatus,
    actionStatus: string,
    actionConclusion?: ActionConclusion
    doNotResolveActionBeforeDate: string
    actionBlockingError: boolean
    actionDisableValidation: boolean
    actionLabel: string,
    specificActionRoutingRule?: SpecificActionRoutingRule
    lastArbeoDiagDetails?: LastArbeoDiagDetails
}

interface LastArbeoDiagDetails {
    arbeoDiagId : string
    actId: string
}