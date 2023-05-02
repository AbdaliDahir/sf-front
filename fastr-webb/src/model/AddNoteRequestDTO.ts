import {Activity} from "./Activity";
import {CaseCategory} from "./CaseCategory";
import {CaseThemeQualification} from "./CaseThemeQualification";
import {NoteType} from './NoteType';

import {ContactDTO} from './ContactDTO';
import {Site} from "./Site";
import {Status} from "./Status";
import {CallTransfer} from "./CallTransfer";
import FormRetentionChange from "./acts/retention/FormRetentionChange";
import {FormAntiChurnChange} from "./acts/antichurn/FormAntiChurnChange";

export interface AddNoteRequestDTO {

    caseId: string;

    type: NoteType;

    contact: ContactDTO;

    description: string;

    processingConclusion: string;

    actTransactionIds: string[];

    status: Status;

    callTransfer?: CallTransfer;

    /* SCALE*/
    category: CaseCategory;

    themeQualification?: CaseThemeQualification;

    receiverSite?: Site;

    receiverActivity?: Activity;

    /* DATES*/
    provisionalResolutionDate?: string;

    // tslint:disable-next-line:no-any
    doNotResolveBeforeDate?: any

    /* Finishing Treatment*/

    unresolutionCause?: string;
    clientForwarned?: string;
    treatmentType?: string;
    clientConfirmation?: string;
    dysfuntionCause?: string;
    resolutionAction?: string;
    informingWay?: string;
    isUnjustified?: string;
    unjustificationCause?: string;

    retentionDataForm?: FormRetentionChange;
    antiChurnDataForm?: FormAntiChurnChange;


}
