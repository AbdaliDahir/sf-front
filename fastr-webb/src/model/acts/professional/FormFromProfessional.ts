import {MediaDirection} from "../../MediaDirection";
import {MediaKind} from "../../MediaKind";

export default interface FormFromProfessional {
    caseStatus: string
    clientRequest: string
    contact: {
        media: {
            direction: MediaDirection
            type: MediaKind
        }
    }
    description: string
    newNote: string
    ownerCorporation: {
        chorusFlag: boolean
        chorusLegalEngagement?: string | undefined
        chorusServiceCode?:  string | undefined
        legalCategory?: string
        creditLimit?: number
        treasurer?: string
        name?: string

    }
    processingConclusion: string
    siret: string
    treasurer: string
}