import {CaseQualification} from "../CaseQualification";
import {MediaKind} from "../MediaKind";
import {Channel} from "../Channel";
import {MediaDirection} from "../MediaDirection";
import {Activity} from "../Activity";
import {FastrConclusion} from "../FastrConclusion";

export interface Payload {
    idClient: string
    idService: string
    idCase: string
    idContact: string
    idAct?: string
    iccId: string
    motif: CaseQualification
    theme: CaseQualification
    offerCode: string
    contactCreatedByFast: boolean
    contactMediaType: MediaKind
    contactChannel: Channel
    contactMediaDirection: MediaDirection
    contactStartDate: string
    activite?: Activity
    fastTabId: string
    fromdisrc: boolean
    results: [FastrConclusion]
    fromQA?: boolean
    refCTT?: string;
    histoCode?:string;
}