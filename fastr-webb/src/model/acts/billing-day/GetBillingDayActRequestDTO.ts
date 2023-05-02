export default interface GetBillingDayActRequestDTO {
    currentPaymentDay: number;
    initialPaymentDay: number;
    billingDayList: BillingDay[];
    error: string;
}

export interface BillingDay {
    billingDay: number;
    effectiveDate: Date;
}