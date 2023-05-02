
import {CaseDataProperty} from "./CaseDataProperty";
import {Incident} from "./Incident";


export interface TroubleTicketRequest {

    idCase: string;

    idClient: string;

    idService: string;

    refCTT: string;

    comment: string;

    themes: string[];


    motifs: string[];

    incidentTitle: string;

    data: Array<CaseDataProperty>;

    fileNames : string [];

    incident: Incident

    ciblage? : boolean

}

