
export interface ScenarioActDTO {

    templateId?: string;
    label?: string;
    instantiatedId?: string;
    status?: boolean;
    targetPhone?: string;
    steps?: ScenarioStep[]
}


export interface ScenarioStep {
    label?: string
    date?: string
    type?: string
    status?: string
    failureReason?: boolean
}