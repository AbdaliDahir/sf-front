export default interface BillingElement {
    id: string;
    label: string;
    vat: number;
    amountTaxesExcluded: number;
    amount: number;
    rate: number;
}
