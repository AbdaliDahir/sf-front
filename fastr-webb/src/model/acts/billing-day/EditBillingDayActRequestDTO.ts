import Act from "../Act";

export interface EditBillingDayActRequestDTO extends Act {

    currentPaymentDay: string;

    initialPaymentDay: string;

    newPaymentDay: string;

    billingAccount: string;

}
