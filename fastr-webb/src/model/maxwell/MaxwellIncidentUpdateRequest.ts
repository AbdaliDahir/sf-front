export interface MaxwellIncidentUpdateRequest {
     actId: string,
     ticketId?: string | null,
     contactId: string,
     parentTicketId?: string | null,
     parentTicketIntitule?: string,
     parentTicketDescription?: string | null,
     parentTicketDiscoursClient?: string | null,
     parentTicketActions?: string | null,
     technicalResult?: string[]
}