import { Status } from "../Status"

export interface ExternalEvent {
    caseExternalEventDTOS: Array<ExternalEventCase>
    clientId: string
    creationDate: Date
    eventDetail: EventDetail
    externalEventId: string
    idOffreAramis: string
    objectId: string
    objectSource: string
    otherServiceIds: Array<string>
    serviceId: ServiceId
    updateDate: string
}

export interface ExternalEventCase {
    caseId: string
    clientId: string
    creationDate: Date
    qualification: string
    serviceId: string
    status: Status
    updateDate: Date
}

export interface ServiceId {
    codeSI: string
    codeSiIdParc: string
    idParc: string
}

export interface EventDetail {
    cartLabel: string
    category: string
    creationRequestDate: Date
    objectType: ExternalEventObjectType
    origin: string
    scanDate: Date
}

export enum ExternalEventObjectType {
    COURRIER = "COURRIER",
    EMAIL = "EMAIL"
}