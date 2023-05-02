import { OptionBilling } from "./OptionBilling";

import { Service } from "./Service";


export interface LandedLineService extends Service {

    technology: string
    siebelAccount: string
    landedPlan: LandedPlan

    options: LandedOption[]

    optionsTv: LandedOption[]

    discounts: LandedOption[]

    engagements: LandedEngagement[]

    groupingData: GroupingData

    servicePictos: string[]
}


export interface GroupingData {
    totalUngroupment: boolean
    partialUngroupment: boolean
    zoneUngrouped: boolean
    zoneNotUngrouped: boolean
}

export interface LandedPlan {
    offerName: string
    offerPrice: number
    startDate: string
}

export interface LandedEngagement {
    name: string
    startEngagement: string
    endEngagement: string
    totalMonthsEngagement: number
    remainingMonthsEngagement: number
    status: string
    type: string

}


export interface LandedOption {
    id: string
    code?: string
    name: string
    type?: string
    activationDate: string
    terminationDate: string
    lastUpdateDate?: string
    parameters: KeyValue
    status: string
    billing: OptionBilling
}

export interface KeyValue {
    [key: string]: string;
}