import {MediaDirection} from "../../MediaDirection";
import {MediaKind} from "../../MediaKind";
import {Phonenumber} from "../../Phonenumber";

export default interface FormFromContact {
    caseStatus: string
    clientRequest: string
    contact: {
        email: string
        media: {
            direction: MediaDirection
            type: MediaKind
        }
        phone?: Phonenumber
        cellphone?: Phonenumber
        fax?: Phonenumber
        other?: Phonenumber
    }
    description: string
    newNote: string
    notificationInformation: {
        favoriteContactDay: string
        favoriteContactHour: string
    }
    processingConclusion: string
    corporation: boolean
}