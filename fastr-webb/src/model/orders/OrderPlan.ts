import {OfferCategory} from "../OfferCategory";

export default interface OrderPlan {
    offerCode: string;
    offerName: string;
    offerDetails: string;
    commitmentMonths: number;
    category: OfferCategory;
    brand: string;
    portabilityDate: string;
    portabilityHour: string;
    portabilityMsisdn: string;
}
