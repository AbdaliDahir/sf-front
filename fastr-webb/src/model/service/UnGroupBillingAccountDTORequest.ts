import {AccountBillingMeans} from './AccountBillingMeans';

    import {OtherBillingMeans} from './OtherBillingMeans';

export interface UnGroupBillingAccountDTORequest {

    effectDate: string;

    accountBillingMeans?: AccountBillingMeans;

    otherBillingMeans: OtherBillingMeans;

    withPreviousIban?: boolean;

}
