import {CaseCategory} from "./CaseCategory";
import {CaseProgressStatus} from "./CaseProgressStatus";
import {CaseScalingConclusion} from "./CaseScalingConclusion";
import {CaseThemeQualification} from "./CaseThemeQualification";
import {OfferCategory} from './OfferCategory';

import {Activity} from './Activity';


import {User} from './User';

import {CaseQualification} from './CaseQualification';

import {Status} from './Status';

import {ClarifyTTInfo} from './ClarifyTTInfo';

import {CaseResource} from './CaseResource';

import {CaseNote} from './CaseNote';

import {CaseDataProperty} from './CaseDataProperty';

import {CaseEvent} from './CaseEvent';

import {Contact} from './Contact';
import {ServiceType} from "./ServiceType";
import {ScaleDetail} from "./ScaleDetail.ts";
import {ActCollection} from "./service/ActCollection";

export interface Case {

    caseTechnicalId: string;

    creationDate: string;

    updateDate: string;

    caseId: string;

    clientId: string;

    serviceId: string;

    offerCategory: OfferCategory;

    creationActivity: Activity;

    currentActivity: Activity;

    caseCreator: User;

    closureDate: string;

    reopeningCounter: number;

    caseOwner: User;

    qualification: CaseQualification;

    themeQualification: CaseThemeQualification;

    category: CaseCategory;

    status: Status;

    estimatedResolutionDate: Date | string;

    progressStatus?: CaseProgressStatus;

    doNotResolveBeforeDate?: Date | any;

    processing: boolean;

    incident: ClarifyTTInfo;

    resources: Array<CaseResource>;

    notes: Array<CaseNote>;

    data: Array<CaseDataProperty>;

    events: Array<CaseEvent>;

    externalEventIds: Array<string>;

    clientRequest: string;

    processingConclusion: string;

    contacts: Array<Contact>;

    finishingTreatmentConclusion?: CaseScalingConclusion

    description?: string

    serviceType: ServiceType

    siebelAccount?: string

    scaleDetails?: ScaleDetail[]

    lastOngoingIncident ?:ActCollection;

    themeCode?: string;

    code?: string;
}
