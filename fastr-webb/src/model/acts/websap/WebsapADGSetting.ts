import {CaseDataProperty} from "../../CaseDataProperty";
import {WebsapGelDurationSetting} from "./WebsapGelDurationSetting";

export interface WebsapADGSetting {
    adgCode: string,
    applicationCode: string,
    applicationAction: string,
    formElements:[CaseDataProperty],
    durations:[WebsapGelDurationSetting],
    defaultDuration: string,

}