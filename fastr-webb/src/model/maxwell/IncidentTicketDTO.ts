export interface IncidentTicketDTO {
    caseModel: string,
    ticketId: string,
    ticketTitle: string,
    parentTicketId: string,
    description?: string,
    parentTicketIntitule?: string,
    parentTicketActions?: string,
    parentTicketDiscoursClient?: string,
    technicalResult?: Array<string>,
    resolutionDate?: Date;
    updateDate: Date;
    creationDate: Date
    status: string
    ciblage?: boolean
}