import {Activity} from "./Activity";

export interface CallTransfer {
    transferOk: boolean;
    active: boolean;
    failureReason: string;
    initialContactId: string;
    receiverActivity: Activity;
}