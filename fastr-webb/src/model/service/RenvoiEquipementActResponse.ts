export interface RenvoiEquipementActResponse {
    header?: RenvoiEquipementActDetailHeader;
    actDetails?: RenvoiEquipmentActDetail[];
}

export interface RenvoiEquipmentActDetail {
    label: string;
    serialNumber?: string;
    sendDate?: string;
    deliveryDate?: string;
    returnDate?: string;
    status: string;
    deliveryNumber?: string;
    deliveryMessage?: string;
}

export interface RenvoiEquipementActDetailHeader {
    adgName?: string;
    adgNumber?: string;
    status?: string;
    creationDate?: string;
    endDate?: string;
    deliveryAddress?: string;
    deliveryCode?: string;
}