import {Address} from "../../person";
import {MediaDirection} from "../../MediaDirection";
import {MediaKind} from "../../MediaKind";

export default interface FormFromAddressChange {
    address: Address
    caseStatus: string
    clientRequest: string
    contact:{
        direction: MediaDirection
        type: MediaKind
    }
    description: string
    newNote: string
    processingConclusion: string
}