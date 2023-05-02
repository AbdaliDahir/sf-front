import moment from "moment"
import Payload from "src/model/Payload"
import FASTRAct from "src/model/acts/FASTRAct"
import { RequestForRenvoiEquipement } from "src/model/acts/renvoi-equipement/RequestForRenvoiEquipement"

export const formatDataForRenvoiEquipement = async (form: any, payload: Payload) => {
    const request: FASTRAct<RequestForRenvoiEquipement> = {
        "act": {
            login: form.login,
            positionCode: form.positionCode,
            positionLabel: form.positionLabel,
            accountId: form.accountId,
            transport: form.transport,
            pointProximiteId: form.pointProximiteId,
            pointProximiteLib: form.pointProximiteLib,
            pointProximiteAdr: form.pointProximiteAdr,
            conditionExpedition: form.conditionExpedition,
            returnedEquipments: form.returnedEquipments
        },
        dueDate: moment().toDate(),
        notification: true,
        "personId": payload.idClient,
        "caseId": payload.idCase,
        "serviceId": payload.idService,
    }
    return request
}