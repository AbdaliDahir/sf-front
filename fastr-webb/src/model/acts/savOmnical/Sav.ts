import {User} from '../../User'

export interface Sav {
    productName?: string;
    productSerialNumber?: string;
    creationDate?: string;
    globalcareReference?: string;
    replacementProduct?: boolean;
    loanEquipment?: boolean;
    statusName?: string;
    statusDate?: string;
}

export interface actDetail {
    idSavSbe?: string;
    technicalSupportId?: string;
    comment?: string;
    advisor?: User;
    creationDate?: string;
}

export interface suiviSav {
    suiviSav?: actDetail
}

export interface SavAct {
    id?: string;
    actId?: string;
    actName?: string;
    actDetail?: suiviSav;
}

export interface CurrentStatus {
    statusDate?: string;
    statusName?: string;
    userName?: string;
}

export interface SavSummary {
    globalcareReference?: string;
    replacementProduct?: string;
    savActs?: SavAct[];
    statusHistory?: SavStatus[];
    currentStatus?: CurrentStatus;
}

export interface SavStatus {
    statusDate?: string;
    statusName?: string;
    userName?: string;
}


