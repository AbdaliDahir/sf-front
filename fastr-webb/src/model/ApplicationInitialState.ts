import {User} from "./User";
import {HistoRapideSetting} from "./HistoRapideSetting";
import {Setting} from "./acts/Setting";
import {ClientRequestSetting} from "./ClientRequestSetting";
import {RetentionSetting} from "./acts/retention/RetentionSetting";
import {RetentionIneligibilityCausesSetting} from "./acts/retention/RetentionIneligibilityCausesSetting";
import {AntiChurnClientProposal} from "./acts/antichurn/AntiChurnClientProposal";
import {IncidentPriority} from "./maxwell/IncidentPriority";

export interface ApplicationInitialState {
    user: User | undefined
    sessionId: string
    sessionIsFrom: string
    activationFlags: any[]
    authorizations: string[]
    histoRapideSettings: HistoRapideSetting[]
    clientRequestSetting: Setting<Array<ClientRequestSetting>> | undefined
    userPassword: string
    retentionSettings?: {
        retentionSetting: Setting<RetentionSetting>,
        retentionIneligibilitySetting: Setting<RetentionIneligibilityCausesSetting>,
        retentionRefusSetting: Setting<any>
    },
    antichurnSetting?: Setting<Array<AntiChurnClientProposal>>
    duplicateCaseQualificationLevelSetting? : Setting<number>
    targetCaseId: string
    incidentPrioritySetting?: Setting<Array<IncidentPriority>>,
    forceBackendHost: string,
    integratedViewMode: boolean
}
