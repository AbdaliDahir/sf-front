import {Contact} from "../Contact";
import {CaseNote} from "../CaseNote";

export interface GroupedCaseNotes {

    notes: CaseNote[],
    contact?: Contact
}