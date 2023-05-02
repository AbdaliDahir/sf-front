import {ParamIncidentDTO} from "./ParamIncidentDTO";
import {AttachmentDTO} from "./AttachmentDTO";
import {CaseDataProperty} from "../CaseDataProperty";
import {MaxwellStepDTO} from "./MaxwellStepDTO";
import {IncidentTicketDTO} from "./IncidentTicketDTO";

export interface MaxwellAct {
    paramIncident: ParamIncidentDTO
    incident?: IncidentTicketDTO
    attachments: Array<AttachmentDTO>
    data?: Array<CaseDataProperty>
    stepsDetail : Array<MaxwellStepDTO>
}

export interface MaxwellActResponse {
    actId: string,
    actFunctionalId: string,
    actName: string,
    maxwellAct: MaxwellAct,
}