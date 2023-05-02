import {Case} from "./Case";
import {ContactDTO} from "./ContactDTO";
import {CaseNote} from "./CaseNote";

export interface ManageCaseRequestDTO {

    retrievedCase: Case;

    note: CaseNote;

    contact: ContactDTO;

    dunningTrigger?: string;

    addContact: boolean;

    managementContext: ManagementContext;
}

export enum ManagementContext {
    RESOLUTION_DUNNING,
    DEFAULT
}
