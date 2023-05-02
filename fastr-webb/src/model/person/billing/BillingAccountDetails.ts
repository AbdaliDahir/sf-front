import {BillingAccount} from './BillingAccount';
import {Service} from "../../service/Service";

export interface BillingAccountDetails {

    idService?: string;

    billingAccountDataFromPayer?: BillingAccount;

    billingAccountDataFromOwner?: BillingAccount;

    corporation?: boolean;

    servicesByBillingAccount?: Service[];

}
