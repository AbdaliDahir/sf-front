import {Address} from "../person";

export interface OrderDeliveryDetails {
    address?: Address;
    name?: string;
    openingHours?: string;
    type?: string;
    deliveryPointId?: string;
    trackingId?: string;
    trackingUrl?: string;
    deliveryExpirationDate?: string;
}
