import * as moment from "moment";
import EditServiceUserRequest from "../../../../model/acts/edit-user/EditServiceUserRequest";
import FASTRAct from "../../../../model/acts/FASTRAct";
import {CaseQualification} from "../../../../model/CaseQualification";
import {Civility} from "../../../../model/Civility";
import {MediaDirection} from "../../../../model/MediaDirection";
import {MediaKind} from "../../../../model/MediaKind";
import Payload from "../../../../model/Payload";
import DateUtils from "../../../../utils/DateUtils";

export default interface FormFromServiceUser {
    act: {
        civility: Civility
        // tslint:disable-next-line:no-any
        birthDate: any
        firstName: string
        lastName: string
    }
    actTransactionIds: [string]
    caseId: string
    caseStatus: string
    clientId: string
    clientRequest: string
    comment: string
    contact: {
        channel: string
        contactId: string
        media: {
            type: MediaKind,
            direction: MediaDirection
        }
        startDate: string
    }
    offerCategory: string
    personId: string
    processing: boolean
    processingConclusion: string
    qualification: CaseQualification
    serviceId: string

}

export const formatDataForServiceUser = (form: FormFromServiceUser, payload: Payload, caseId: string) => {
    form.serviceId = payload.idService;
    form.personId = payload.idClient;

    form.act.civility = form.act.civility ? form.act.civility : 'MR'
    form.act.birthDate = DateUtils.toGMT0ISOString(form.act.birthDate)
    const request: FASTRAct<EditServiceUserRequest> = {
        act: form.act,
        notification: true,
        dueDate: moment().toDate(),
        personId: payload.idClient,
        serviceId: payload.idService,
        caseId
    }

    return request

};
