import {ActDetailHeader} from "./ActDetailHeader";

export interface RetourEquipementActDetail {
    header?: ActDetailHeader;
    equipmentActDetailList?: EquipmentActDetail[];
}



export interface EquipmentActDetail {
    type?: string;
    serialNumber?: string;
    status?: string;
    penaltyAmount?: string;
    securityDeposit?: string;
    feesStatus?: string;
    name?: string;
}