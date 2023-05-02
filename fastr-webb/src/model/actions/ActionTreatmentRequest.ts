import {Activity} from "../Activity";
import {Site} from "../Site";
import {CaseStatus} from "../case/CaseStatus";
import {Media} from "../Media";
import {ActionRoutingRule} from "./ActionRoutingRule";
import {SpecificActDetails} from "./ActionRequestCLO";
import {OfferCategory} from "../OfferCategory";
import {ServiceType} from "../ServiceType";
import {ProgressStatus} from "./ProgressStatus";
import {ActionConclusion} from "./ActionConclusion";



export interface ActionTreatmentRequest {
    actionCode: string;
    actionId: string;
    activity: Activity;
    site:Site;
    contactId: string;
    comment?: string;
    additionalData?;
    progressStatus?: ProgressStatus
    status?:CaseStatus
    doNotResolveBeforeDate?:Date
    conclusion?:ActionConclusion;
    media?: Media;
    automaticMonitoring?: boolean

    // for specific actions
    actToCreate?: boolean
    actionRoutingRule?: ActionRoutingRule
    actDetails?: SpecificActDetails
    estimatedAssignmentDate?: Date
    caseId?: string
    offerCategory?:OfferCategory
    serviceType?: ServiceType
    clientId?: string
    serviceId?: string
}