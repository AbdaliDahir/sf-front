import {MediaDirection} from "../../MediaDirection";
import {MediaKind} from "../../MediaKind";
import {Phonenumber} from "../../Phonenumber";

export default interface RequestForContact {
    newValues: {
        email: string
        media: {
            direction: MediaDirection
            type: MediaKind
        }
        phone?: Phonenumber
        cellphone?: Phonenumber
        fax?: Phonenumber
        other?: Phonenumber
        favoriteContactDay: string | undefined
        favoriteContactHour: string | undefined
    }
}