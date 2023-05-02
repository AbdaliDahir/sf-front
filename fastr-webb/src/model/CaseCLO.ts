import {Case} from "./Case";


export interface CaseSection {
    code: string,
    editable: boolean,
    expanded: boolean,
    expandable: boolean
}

export interface CaseCLO {
    currentCase: Case
    sections: CaseSection[]
    canCCUpdateCurrentCase: boolean;
    canCCUpdateMandatoryADGForCurrentCase: boolean;
    canCCAutoAssignCurrentCase: boolean;
    canCCReQualifyCurrentCase: boolean;
    canCCAddNoteToCurrentCase: boolean;
    mustCCReQualifyCurrentCase: boolean;
    canDisplayPrendreEnChargeBtn: boolean;
}

export interface CaseBooleans {
    canCCUpdateCurrentCase: boolean;
    canCCUpdateMandatoryADGForCurrentCase: boolean;
    canCCAutoAssignCurrentCase: boolean;
    canCCReQualifyCurrentCase: boolean;
    mustCCReQualifyCurrentCase: boolean;
    canCCAddNoteToCurrentCase: boolean;
    canDisplayPrendreEnChargeBtn: boolean;
}
