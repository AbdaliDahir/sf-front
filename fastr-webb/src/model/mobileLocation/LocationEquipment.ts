import {Penalty} from "./Penalty";

export interface LocationEquipment {
    label: string;
    type: string;
    imei: string;
    status: string;
    subscriptionDate: string;
    restitutionDate: string;
    locationOrderNumber: string;
    restitutionOrderNumber: string;
    penaltyType: string;
    penaltyAmount: number;
    currentLocationPenalties: Penalty[];
    insurance: string;
    locationContractId: string;
}