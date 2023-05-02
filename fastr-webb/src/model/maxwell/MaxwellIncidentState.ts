import {GenericIncident} from "../GenericIncident";
import {CaseDataProperty} from "../CaseDataProperty";
import {MaxwellProcess} from "../enums/MaxwellProcess";
import {TroubleTicketResponse} from "../TroubleTicketResponse";
import {EMaxwellCallOrigin} from "./enums/EMaxwellCallOrigin";

export interface MaxwellIncidentState {
    isFormMaxwellCompleted: boolean,
    isMaxwellDropZoneEmpty: boolean,
    isMaxwellFormLastStep: boolean,
    incidentsMaxwell: GenericIncident[],
    uploadedFilesMaxwell: Array<File>,
    selectedIncidentMaxwell?: GenericIncident,
    additionalData: CaseDataProperty[],
    troubleTicketResponse?: TroubleTicketResponse,
    incidentTitle: string,
    troubleTicketProcess: MaxwellProcess,
    createOrUpdateADGProcess: MaxwellProcess,
    UploadFilesProcess: MaxwellProcess,
    callOrigin: EMaxwellCallOrigin,
    canOpenMaxwellModal: boolean,
    canBeClosedMaxwellModal: boolean,
    actIdToFinalize?: string,
    lastSavedMaxwellActId?: string
}