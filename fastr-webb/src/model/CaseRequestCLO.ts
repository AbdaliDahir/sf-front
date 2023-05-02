import { CaseStatus } from "./case/CaseStatus";
import { CasesQualificationSettings } from "./CasesQualificationSettings";

export interface ScalingObjectRequestCLO {
    progressStatus?: string
    doNotResolveBeforeDate?: string
    caseThemeQualification?: CasesQualificationSettings
    scalingAdditionalData?
}

export interface CaseRequestCLO {
    caseId?: string
    clientId: string
    serviceId: string
    qualification?
    additionalData?
    clientRequest?: string
    contact: { id, media?: { type, direction } }
    transfer?
    description?: string
    status?: CaseStatus
    conclusion?: string
    scaling?: ScalingObjectRequestCLO
    incidentsIdsToCancel?: Array<string>;
    activityCode?: string;
    serviceType?: string;
}
