import BillDocument from "./BillDocument";
import BillingElement from "./BillingElement";

export default interface Bill {
    id: string;
    date: string;
    type: string;
    documents: BillDocument[];
    total: number;
    currency: string;
    elements: BillingElement[];
}
