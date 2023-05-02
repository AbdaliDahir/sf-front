import {Activity} from "./Activity";
import {CaseCategory} from "./CaseCategory";
import {CaseThemeQualification} from "./CaseThemeQualification";
import {OfferCategory} from './OfferCategory';

import {Status} from './Status';

import {CaseQualification} from './CaseQualification';

import {ClarifyTTInfo} from './ClarifyTTInfo';

import {CaseNoteDTO} from './CaseNoteDTO';


import {ContactDTO} from './ContactDTO';
import {Site} from "./Site";
import {EventNewValueKeys} from "./EventNewValueKeys";
import {CaseDataProperty} from "./CaseDataProperty";
import {CallTransfer} from "./CallTransfer";
import {GenericIncident} from "./GenericIncident";
import Act from "./acts/Act";
import FASTRAct from "./acts/FASTRAct";

export interface CaseRequestDTO {

    caseId: string;

    clientId: string;

    serviceId: string;

    offerCategory?: OfferCategory;

    serviceType?: string;

    comment: string;

    description: string;

    clientRequest: string;

    status: Status;

    processing: boolean;

    processingConclusion?: string;

    caseStatus?: string;

    unjustifInfo: string;

    incident: ClarifyTTInfo;

    note: CaseNoteDTO;

    newValues: Map<EventNewValueKeys, string>;

    contact: ContactDTO;

    data: Array<CaseDataProperty>;

    actTransactionIds: Array<string>;

    callTransfer: CallTransfer;

    /* IMMEDIATE*/
    qualification: CaseQualification;

    /* SCALE*/
    category: CaseCategory;

    themeQualification?: CaseThemeQualification;

    receiverSite?: Site;

    /* Activity to get from routing rule of leaf theme*/
    receiverActivity?: Activity;

    /* Activity Selected from FAST (Pass through payload)*/
    activitySelected?: Activity;

    /* DATES*/
    toBeProcessedAfter?: string;

    doNotResolveBeforeDate: Date | any;

    estimatedResolutionDate?: Date;

    autoAssign?: boolean;

    incidentGeneric?:GenericIncident;

    siebelAccount?: string;

    actBodys?: Array<FASTRAct<Act>>
}
