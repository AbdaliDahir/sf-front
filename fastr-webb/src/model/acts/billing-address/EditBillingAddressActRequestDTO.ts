import {BillingAccount} from "../../person/billing";
import Act from "../Act";
import {Service} from "../../service/Service";

export default interface EditBillingAddressActRequestDTO extends Act {
    billingAccount: Partial<BillingAccount>;
    standardizationState: StandardizationState;
    services: Service[];
    corporation:boolean;
    nextPayerStatus: "CORPORATION" | "PERSON"
}

export enum StandardizationState {
    STANDARDIZED= "STANDARDIZED",
    TO_STANDARDIZE="TO_STANDARDIZE",
    FORCE="FORCE"
}