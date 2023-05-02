import {OptionBilling} from "./OptionBilling";

export interface MobileOption {
    id: string;
    offerId: string;
    name: string;
    description: string
    scheduledActivationDate : string;
    activationDate : string;
    nextBillingDeadline : string;
    creationDate : string;
    endDate : string;
    scheduledEndDate : string;
    status: OptionStatus;
    contractId: string[];
    billing : OptionBilling ;
    logoUrl:  string
    networkType?: string
    debit?: string
    unit?: string
}

export type OptionStatus  = "ACTIVE" |  "SCHEDULED" | "TERMINATED" | "CANCELED";