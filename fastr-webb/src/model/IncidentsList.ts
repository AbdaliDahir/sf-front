export interface IncidentsListItem {

    actId: string;

    ticketId: string;

    creationDate: string;

    updateDate: string;

    timeSpentLastUpdate: string;

    status: string;

    comment: Array<string>;

    parentTicketId?: string,

    parentTicketIntitule?: string,

    parentTicketActions?: string,

    parentTicketDiscoursClient?: string,

    description?: string
}