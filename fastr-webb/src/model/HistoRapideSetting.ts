import { Status } from "./Status";

export interface HistoRapideSetting {
    code: string;
    name: string;
    icon: string;
    qualificationCode: string;
    clientRequest: string;
    description: string;
    status: Status;
    processingConclusion: string;
    hasADG: boolean;
    associatedActivity: Set<string>;
    codeADGorAction: string;
    themeCode: string;
}
