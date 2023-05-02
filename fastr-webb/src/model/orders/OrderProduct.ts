export default interface OrderProduct {
    sapCode?: string;
    label?: string;
    type?: ProductType;
    price?: number;
    pictureUrl?: string;
    description?: string;
    loanPrice?: number;
    immediatePrice?: number;
    smallPic?: string;
    itemPrice?: string;
    logisticStatusLabel?: string;
    logisticStatusDate?: string;
}

export type ProductType =
    "MOBILE" |
    "TABLET" |
    "LAPTOP" |
    "MODEM" |
    "TV_DECODER" |
    "KEY" |
    "SIM_CARD" |
    "ACCESSORY" |
    "UNKNOWN"
