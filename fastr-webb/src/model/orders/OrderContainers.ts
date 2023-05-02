import {Address} from "../person";

export interface OrderContainers {
    containers?: coli[];
}

export interface coli {
    containerId?: string;
    deliveryAddress?: Address;
    deliveryAmount?: string;
    deliveryAmountStatus?: string;
    deliveryAmountStatusDate?: string;
    deliveryDate?: string;
    deliveryExpirationDate?: string;
    deliveryMode?: string;
    deliveryPointId?: string;
    deliveryPrice?: string;
    deliveryZone?: OrderDeliveryZone;
    exchangeDate?: string;
    items: Item[];
    logisticAction?: string;
    logisticStatus?: string;
    logisticStatusDate?: string;
    logisticStatusLabel?: string;
    olNumber?: string;
    plannedDeliveryDate?: string;
    returnAdress?: string;
    returnDate?: string;
    returnPrice?: string;
    trackingId?: string;
    trackingUrl?: string;
}

export interface OrderDeliveryZone {
    name: string;
    openingHours: string;
    type: string;
}

export interface Item {
    codeSap?: string;
    itemPrice?: string;
    label?: string;
    logisticItemId?: string;
    logisticStatus?: string;
    logisticStatusDate?: string;
    logisticStatusLabel?: string;
    smallPic?: string;
}
