import {CallTransfer} from "../CallTransfer";
import {Contact} from "../Contact";
import {CaseQualification} from "../CaseQualification";
import {Status} from "../Status";

export interface FormForCase {
    callTransfer: CallTransfer,
    comment: string,
    clientRequest: string,
    contact: Contact,
    processingConclusion: string,
    qualification: CaseQualification,
    status: Status
}