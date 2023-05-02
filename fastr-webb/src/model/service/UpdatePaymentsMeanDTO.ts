import {AccountBillingMeans} from './AccountBillingMeans';

    import {OtherBillingMeans} from './OtherBillingMeans';

export interface UpdatePaymentsMeanDTO {

    billingAccountID?:string;
    
    effectDate: string;

    accountBillingMeans?: AccountBillingMeans;

    otherBillingMeans?: OtherBillingMeans;

}
