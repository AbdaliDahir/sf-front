export interface Consumption {
    beyondPlan: EventHistory;
    inPlan: EventHistory;
    outPlan: EventHistory;
}

export interface EventHistory {
    consumptionEvents: ConsumptionEvent[]
    planType: PlanType
}

export interface ConsumptionEvent {
    consumptions: ConsumptionElement[]
    eventTypeCode: string;
    eventTypeLabel: string;
    eventType: EventTypeEnum;
    microPayement: boolean;
    formattedLabel: string;
    totalConsumed: number;
    totalConsumedUnity: MesureUnit;
    totalAmount: number;
    isUnlimited: boolean;
}

export interface ConsumptionElement {
    amount: number;
    startDate: string;
    event: ConsumptionEvent;
    billedQuantity: number;
    realQuantity: number;
    description: string;
    callNumber: string;
    billQuantityUnit: MesureUnit;
    realQuantityUnit: MesureUnit;
    detailledInvoice: boolean;
}

export type PlanType = "HORS" | "DANS" | "AUDELA"
export type EventTypeEnum = "DATA" | "VOIX" | "MMS" | "FRAIS" | "TELECHARGEMENT" | "RECHARGEMENT" | "SURCOUT";
export type MesureUnit = "S" | "M" | "EURO" | "KO" | "H" | "MO" | "GO" | "NB" | "SMS" | "MMS" | "NA";
