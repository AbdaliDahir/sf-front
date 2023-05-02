import Bill from "../../service/billing/Bill";

export interface BillingInformation {

    balance: number;
    currency: string;
    lastBillAmount: number;
    bankingMovements: BankingMovement[]
}

export interface BankingMovement {
    name: string
    billingReference: string
    reference: string
    amount: number
    bill: Bill
    date: string
    dueDate: string
    litigious: boolean
    rejectionReason: string
    unpaidAmount: number
}