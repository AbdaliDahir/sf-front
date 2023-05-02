export interface ConsumptionPeriod {
    unityType: string
    meterLabel: string
    invoicingStartDate: Date
    invoicingEndDate: Date
    consumptionValue: number
    consumptionLimit: number
    remainingConsumption: number
    consumptionValueLabel: string
    consumptionLimitLabel: string
    remainingConsumptionLabel: string
    consumptionUnit: string
    currentUnitToolTip: string
}
