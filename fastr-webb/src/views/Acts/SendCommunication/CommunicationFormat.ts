import FASTRAct from "../../../model/acts/FASTRAct"
import {SendCommunicationRequestDTO} from "../../../model/acts/send-communication/SendCommunicationRequestDTO"
import Payload from "../../../model/Payload"
import {SendCommState} from "./SendCommunication"

// tslint:disable-next-line:no-any
export const formatDataCommunication = (form: any, payload: Payload) => {

	const unFormattedAct: SendCommState = form.adgCommManuel

	const caseId = payload.idCase || payload.caseId
	const act = formatAct(unFormattedAct, caseId)

	const request: FASTRAct<{ parameterMessageRequestDTO: SendCommunicationRequestDTO }> = {
		personId: payload.idClient,
		caseId,
		act: {
			parameterMessageRequestDTO: act
		},
		serviceId: payload.idService
	}

    return request
}

const formatAct = (form: SendCommState, caseId): SendCommunicationRequestDTO => {
    const templateMedia = form.recipientMedia && form.recipientMedia.media && form.recipientMedia.media.toString()
    const messageParameters = form.validForm && form.validForm.filter(param => param.value !== undefined)
    const templateName = form.selected && form.selected.name
    const adresse = form.recipientMedia && form.recipientMedia.recipientByMediaMap && form.recipientMedia.recipientByMediaMap[templateMedia ? templateMedia : "SMS"]
    const yourRef = `${caseId}_COMM_CLIENT_${new Date().getTime()}`
    return {
        templateName,
        messageParameters,
        templateMedia,
        adresse,
        yourRef
    }
}
