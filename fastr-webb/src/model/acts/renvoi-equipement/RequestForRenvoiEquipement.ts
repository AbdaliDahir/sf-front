import { DynamicDataResponse } from "src/model/aramis/DynamicDataResponse";
import Act from "../Act";

export interface RequestForRenvoiEquipement extends Act {
    login: string
    positionCode: string
    positionLabel: string
    accountId: string
    transport: string
    pointProximiteId: string
    pointProximiteLib: string
    pointProximiteAdr: string
    conditionExpedition: string
    returnedEquipments: DynamicDataResponse[]
}