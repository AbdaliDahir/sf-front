import moment from "moment";
import FASTRAct from "src/model/acts/FASTRAct";
import { RequestForVegasCouriers } from "../../../../model/externalEvent/RequestForVegasCouriers";

export const formatDataForVegasCouriers = async (form: any, payload: any) => {
    const request: FASTRAct<RequestForVegasCouriers> = {
        "act": {
            data: form.externalEventChanges,
        },
        dueDate: moment().toDate(),
        notification: true,
        "personId": payload.idClient,
        "caseId": payload.idCase,
        "serviceId": payload.idService,
    }
    return request
}