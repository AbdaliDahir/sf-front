import {CreditCardMethod, SEPAMethod} from "./person/billing";


export interface BillingMethods {

    creditCard: CreditCardMethod;

    bankAccount: SEPAMethod;

}