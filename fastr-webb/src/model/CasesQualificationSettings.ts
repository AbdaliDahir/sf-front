import {CaseConclusion} from "./CaseConclusion";
import {CaseDataProperty} from "./CaseDataProperty";
import { CaseRoutingRule } from "./CaseRoutingRule";
import {Incident} from "./Incident";

export interface CasesQualificationSettings {
    id: string;
    label: string;
    icon: string;
    isLeaf: boolean;
    selected: boolean;
    level: number;
    ancestors: CasesQualificationSettings[]
    type: string;
    description: string;
    code: string;
    inactivityDelay: number;
    conclusions: [CaseConclusion];
    data: CaseDataProperty[];
    activities: string[];
    habilitedActivities: string[];
    estimatedResolutionDays?: number;
    estimatedResolutionDateOfCase?: string;
    estimatedAssignmentDelay?: string;
    incident: Incident;
    routingRules?: CaseRoutingRule[];
    codeAncestor?: string;
}
