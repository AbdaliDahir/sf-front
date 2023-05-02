import {CaseStatus} from "../case/CaseStatus";
import {Contact} from "../Contact";
import {User} from "../User";
import {CaseResource} from "../CaseResource";
import {CaseThemeQualification} from "../CaseThemeQualification";
import {CaseDataProperty} from "../CaseDataProperty";
import {ActionProgressStatus} from "./ActionProgressStatus";
import {ActionConclusion} from "./ActionConclusion";


export interface Action {
    actionId?: string
    actionCode?: string
    actionLabel?: string
    clientId: string
    serviceId: string
    caseId: string
    offerCategory: string
    serviceType: string
    creationAuthor: User
    creationDate: string
    timeElapsedSinceCreationDate: string
    timeElapsedSinceUpdateDate: string
    updateAuthor: User
    updateDate: string
    diagArbeoId: string
    resources: Array<CaseResource>
    themeQualification: CaseThemeQualification
    processCurrentState?: ActionProcessCurrentState
    monitoringCurrentState: ActionMonitoringCurrentState
    processHistory?: ActionProcessHistory[]
    specificAction: boolean
    diagArbeo: DiagArbeo
    monitoringHasJustBeenUpdated: boolean
    initialRequest: string
}

export interface DiagArbeo {
    actId: string,
    diagId: string
}

export interface ActionProcessCurrentState {
    updateDate: string
    updateAuthor: User
    contact: Contact
    comment: string
    assignee: User
    status: CaseStatus
    progressStatus?: ActionProgressStatus
    estimatedAssignmentDate?: string
    data: Array<CaseDataProperty>
    assignmentContext?: string
    assignmentSupervisor?: string
    conclusion?: ActionConclusion
    realAssignmentDate?: string
    doNotResolveBeforeDate?: string
    automaticMonitoringActivity?: string
    automaticMonitoringSite?: string
    automaticMonitoringEligibleCriteria?: Array<string>
    monitoringCurrentState: ActionMonitoringCurrentState
}

export interface ActionMonitoringCurrentState {
    updateDate: string
    assignee: User
    startDate: string
    endDate: string
    endContext: string
    context: ActionMonitoringContext
}

export interface ActionMonitoringContext {
    criteria: string,
    assignmentContext: string,
    supervisor: string
}

export interface ActionProgressStatusObj {
    code: string,
    label: string
}

export interface ActionProcessHistory {
    updateDate: string
    updateAuthor: User
    contact: Contact
    comment: string
    assignee: User
    status: CaseStatus
    progressStatus?: ActionProgressStatusObj
    estimatedAssignmentDate?: string
    data: Array<CaseDataProperty>
    assignmentContext?: string
    assignmentSupervisor?: string
    conclusion?: ActionConclusion
    realAssignmentDate?: string
    doNotResolveBeforeDate?: string
    processCurrentState: ActionProcessCurrentState
}