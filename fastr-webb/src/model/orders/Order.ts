import {Address} from "../person";
import OrderPlan from "./OrderPlan";
import OrderUser from "./OrderUser";
import OrderStep from "./OrderStep";
import OrderProduct from "./OrderProduct";
import {OrderDeliveryDetails} from "./OrderDelivery";
import {BillingAccountMethod, CreditCardMethod, SEPAMethod} from "../person/billing";
import OrderDeferredPayment from "./OrderDeferredPayment";
import OrderCreditLong from "./OrderCreditLong";
import {OrderContainers} from "./OrderContainers";
import FdpLoan from "./FdpLoan";

export interface OrderBilling {
    punctualBilling: BillingAccountMethod;
    recurrentBilling: BillingAccountMethod;
    sepa: SEPAMethod;
    creditCard: CreditCardMethod;
}

export default interface Order {
    id: string;
    date: string;
    plan: OrderPlan;
    user: OrderUser;
    billingAddress: Address;
    steps: OrderStep[];
    currentStep: OrderStep;
    delivery: OrderDeliveryDetails;
    products: OrderProduct[];
    totalPrice: number;
    recurrentPrice: number;
    totalRawPrice: number;
    shippingPrice: number;
    currency: string;
    billingInformation: OrderBilling;
    deferredPayment: OrderDeferredPayment;
    deliveryContainer: OrderContainers;
    cclLoan?: OrderCreditLong;
    fdpLoan ?: FdpLoan[];
    buyBackRecord?: BuyBackRecord;
}

export interface BuyBackRecord {
    purchasedDeviceSapCode?: string;
    modelLabel?: string;
    brandLabel?: string;
    status?: string;
    evaluatedPriceIncludingTaxes?: number;
    bonusDeviceBrandLabel?: string;
    bonusStatus?: string;
    bonusPriceIncludingTaxes?: number;
    bonusCancellationReason?: string;
}
