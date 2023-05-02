import {Client} from "../../person";
import {BankAccount} from "../../BankAccount";
import Act from "../Act";

export default interface EditOwnerRequestDTO extends Act {
    idClient?: string;
    newOwner?: Partial<Client>;
    bankAccount?: BankAccount;
    notEligible?: boolean
    ineligibilityReason?: string;
    eligibilityNotAvailable?: boolean
}