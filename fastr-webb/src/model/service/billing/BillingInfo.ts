import Bill from "./Bill";
import {BillingInformation} from "../../person/billing/BillingInformation";

export default interface BillingInfo {
    bills: Bill[];
    balance: BillingInformation;
}