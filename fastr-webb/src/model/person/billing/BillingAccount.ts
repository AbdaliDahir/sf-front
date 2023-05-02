import {CreditCardMethod} from './CreditCardMethod';

import {SEPAMethod} from './SEPAMethod';

import {OtherMethod} from './OtherMethod';
import {Person} from "../Person";

export interface BillingAccount {

    id: string;

    payer: Person;

    status: BillingAccountStatus;

    creationDate: string;

    divergent: boolean;

    billingAddressSameAsOwner: boolean;

    businessName: string;

    contentious: boolean;

    haveUnPaid: boolean;

    billingMethod: string;

    creditCardMethod: CreditCardMethod;

    sepaMethod: SEPAMethod;

    otherMethod: OtherMethod;

    billingDay: number;
    
    cutOffDay: number;

    nextCutOffDate: string;

    serviceCategory: string;

    groupedBills: boolean
}

export type BillingAccountStatus = "ACTIVE" | "BEING_BLOCKED" | "BLOCKED";

export type BillingAccountMethod = "CREDIT_CARD" | "SEPA" | "OTHER" | "NONE";
