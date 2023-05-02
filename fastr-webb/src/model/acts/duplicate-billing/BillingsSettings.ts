import BillType from "./BillType";

export interface BillingsSettings {
    duplicateBillingPrice: number
    billTypes: BillType[]
}