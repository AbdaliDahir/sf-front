import moment from "moment";
import Act from "../../../../model/acts/Act";
import FASTRAct from "src/model/acts/FASTRAct";

interface RequestForDischargeCode extends Act {
    status: string
    ndi: string
    serviceType: string
    dischargeCode: string
}

export const formatDataForDischargeCodeEdit = (form: any, payload: any) => {
    const request: FASTRAct<RequestForDischargeCode> = {
        "act": {
            status: form.statusList.find(status => status.key == form.status).value,
            ndi: form.ndi,
            serviceType: form.serviceType,
            dischargeCode: form.code,
        },
        dueDate: moment().toDate(),
        notification: true,
        "personId": payload.idClient,
        "caseId": payload.idCase,
        "serviceId": payload.idService,
    }
    return request
}