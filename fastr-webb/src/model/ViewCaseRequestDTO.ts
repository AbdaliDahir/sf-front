import {Case} from './Case';

export interface ViewCaseRequestDTO {

    currentCase: Case;

    canCCUpdateCurrentCase: boolean;

    canCCAutoAssignCurrentCase: boolean;
    canCCAddNoteToCurrentCase: boolean;
    canCCReQualifyCurrentCase: boolean;
    mustCCReQualifyCurrentCase: boolean;
    canCCUpdateMandatoryADGForCurrentCase: boolean;

}