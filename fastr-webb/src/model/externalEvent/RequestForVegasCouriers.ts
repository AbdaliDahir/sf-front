import Act from "src/model/acts/Act";
import { ExternalEventObjectType } from "src/model/externalEvent/ExternalEvent";

export interface RequestForVegasCouriers extends Act {
    data: ExternalEventChange[]
}

export interface ExternalEventChange {
    type: string
    externalEventId: string
    externalEventObjectId: string
    externalEventObjectType: ExternalEventObjectType
    externalEventCreationRequestDate: Date
    externalEventScanDate: Date
}