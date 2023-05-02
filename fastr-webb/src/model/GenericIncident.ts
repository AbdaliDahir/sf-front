export interface GenericIncident {

    incidentID:string
    refCTT: string;
    intitule: string;
    description: string;
    actions?: string;
    discoursClient?: string;
    techno: string;
    ssa: string;
    traitement?: string;
    codesThemesAssocies: string;
    priorite: number;
    creationIng: boolean;
    fastAlerte: boolean;
    fastFiltre: boolean;
    unknown: boolean
    parentTicketIdToSet: boolean
    parentTicketId?: string
}