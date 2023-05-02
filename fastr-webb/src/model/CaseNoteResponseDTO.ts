import {CaseNoteDTO} from './CaseNoteDTO';

export interface CaseNoteResponseDTO {

    caseId: string;

    noteList: Array<CaseNoteDTO>;

}
