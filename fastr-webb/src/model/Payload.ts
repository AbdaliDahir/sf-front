import {Activity} from "./Activity"
import {MediaDirection} from "./MediaDirection";
import {MediaKind} from "./MediaKind";
import {FastCaseQualification} from "./FastCaseQualification";

export default interface Payload {
    caseId: string
    codeSCS: string
    contactChannel: string
    contactCreatedByFast: boolean
    contactMediaDirection: MediaDirection
    contactMediaType: MediaKind
    contactStartDate: string
    fastTabId: string
    idAct: string
    idCase: string
    idClient: string
    idContact: string
    idService: string
    motif: FastCaseQualification
    offerCode: string
    theme: null,
    activite: Activity
}