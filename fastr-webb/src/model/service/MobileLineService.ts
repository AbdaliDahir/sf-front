import {Service} from './Service';
import {MobileTerminal} from "./MobileTerminal";
import {SimCard} from "./SimCard";
import {MobileOption, OptionStatus} from "./MobileOption";


export interface Renewal {
    lastRenewal: string;
    nextRenewal: string;
    dateFinOptionMobile: string
    remainingMonths: number;
}

export interface MobileLineService extends Service {
    msisdn: string;
    offerCode: string;
    offerName: string;
    offerDescription: string;
    previousCarrier: string;
    chatelEligible: boolean

    imsi: string;
    simCard: SimCard;
    usageTerminal: MobileTerminal;
    contractualTerminal: MobileTerminal;
    renewal: Renewal;
    options: MobileOption[];
    mobileDiscount: MobileDiscounts;
    plans: MobilePlan[];
    engagements: MobileEngagement[]
    rio: string
    paymentFacility: MobilePaymentFacility
}

export interface MobilePlan {
    offerName: string
    offerId: string
    offerPrice: number
    state: string
    startDate: string
    endDate: string
    networkType?: string
    debit?: string
    unit?: string
}

export interface MobileEngagement {
    name: string
    startEngagement: string
    endEngagement: string
    totalMonthsEngagement: number
    remainingMonthsEngagement: number
    fees: number
    status: string
}

export interface MobileDiscounts {
    discounts: MobileDiscount[]
    totalAmount: number
}

export interface MobileDiscount {
    family: string;
    familyLabel: string;
    label: string;
    status: OptionStatus;
    startDate: string;
    effectiveEndDate: string;
    scheduledEndDate: string;
    amount: number;
    billingType: string;
    endDate: string;
    durationInMonths: number;
}

export interface MobilePaymentFacility {
    offerCode: string;
    engagementEndDate: string;
    anticipatedPurchaseDate: string;
    totalDurationInMonths: number;
    remainingPaymentMonths: number;
    remainingPaymentDays: number;
    anticipatedPurchaseEligibility: boolean;
    totalAmountTTC: number;
    monthlyPaiementAmountTTC: number;
    remainingAmountTTC: number;
}