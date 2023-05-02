import {MediaDirection} from "../../MediaDirection";
import {MediaKind} from "../../MediaKind";

export default interface FormFromAdministrativeData {
    caseStatus: string
    clientRequest: string
    contact:{
        media: {
            direction: MediaDirection
            type: MediaKind
        }
    }
    description: string
    newNote: string
    ownerPerson: {
        birthCounty: string
        // tslint:disable-next-line:no-any TODO: A typer
        birthDate: any
        civility: string
        firstName: string
        lastName: string
        siret: string
    }
    processingConclusion: string
    siret: boolean
}