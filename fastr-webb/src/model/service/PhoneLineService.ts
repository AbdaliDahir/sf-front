import {Service} from './Service';

export interface PhoneLineService extends Service {

    ndi: string;

    offerCode: string;

    offerName: string;

    previousCarrier: string;

    technology: string;

}
