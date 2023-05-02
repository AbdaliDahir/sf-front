import {BillingMethods} from "../../BillingMethods";
import Act from "../Act";

export interface EditBillingMethodActRequestDTO extends Act {

    oldBillingMethods: BillingMethods;

    newBillingMethods: BillingMethods;

}
