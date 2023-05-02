import {CasesQualificationSettings} from "../CasesQualificationSettings";
import {User} from "../User";
import {Activity} from "../Activity";
import {ActionRoutingRule} from "./ActionRoutingRule";
import {DiagArbeo} from "./DiagArbeo";

export interface ActionRequestCLO {
    actionCode: string;
    actionLabel: string;
    actionCreator?: User;
    actionOwner?: User;
    creationDate?: string
    updateDate?: string
    caseId: string
    offerCategory: string
    serviceType: string
    clientId: string
    serviceId: string
    siebelAccount?: string
    themeQualification: CasesQualificationSettings
    comment: string
    selectedActivity?: Activity
    additionalData?
    contactId?: string
    estimatedAssignmentDate?: Date
    actionRoutingRule: ActionRoutingRule
    actToCreate?: boolean
    diagArbeo?: DiagArbeo
    actDetails?: SpecificActDetails
}

export interface SpecificActDetails {
    refSiebel?: string
    login?: string
    positionLibelle?: string
    positionCode?: string
    modeCalcul?: string
    categorie?: string
    motif?: string
    debutPeriode?: Date
    finPeriode?: Date
    items?: any[]
    montantTtc?: number
    tva?: string
    balanceEchue?: number
    statutFact?: string
    regul1MontantTtc?: number
    regul1ModeRegul?: string
    regul2MontantTtc?: number
    regul2ModeRegul?: string
}
