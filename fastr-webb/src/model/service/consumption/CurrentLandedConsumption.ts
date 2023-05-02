import {ConsumptionPeriodLanded} from "./ConsumptionPeriodLanded";

export interface DetailedLandedConsumptionData {
    id?: string
    dateCommunication?: string
    typeUsage?: string
    juridiction?: string
    numeroAppele?: string
    dureeCommunication?: number
    montantTTC?: string
    numeroAppelant?: string
}

export interface DetailedLandedConsumption {
    juridictionOptions : Array<string>
    typeUsageOptions: Array<string>
    infoConsoItemList: DetailedLandedConsumptionData[]
}

export interface CurrentLandedConsumption {
    startDate?: string
    endDate?: string
    updateDate?: string
    amount?: string
    lemaireFlag?: boolean
    consumptionPeriods: ConsumptionPeriodLanded[]
}

