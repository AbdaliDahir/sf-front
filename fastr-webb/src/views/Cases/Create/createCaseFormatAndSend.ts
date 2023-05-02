import * as moment from "moment"
import {NotificationManager} from "react-notifications"
import {CaseCategory} from "../../../model/CaseCategory"
import {CaseRequestDTO} from "../../../model/CaseRequestDTO"
import ADGDataDispatcher from "../../../service/ADGDataDispatcher"
import {Payload} from "./CreateCasePage"
import DateUtils from "../../../utils/DateUtils";


export const formatCase = async (caseDTO: CaseRequestDTO, payload: Payload, props, actInError, idActDisRC): Promise<CaseRequestDTO> => {
    if (payload.idAct || idActDisRC) {
        const transactionService = new ADGDataDispatcher();
        try {
            const idTransaction = await transactionService.startWorking(caseDTO, payload, payload.idAct ? payload.idAct : idActDisRC, props.client, payload.idCase);
            caseDTO.actTransactionIds = [];
            caseDTO.actTransactionIds.push(idTransaction.idTransaction)
        } catch (error) {
            console.error(error)
            caseDTO.processingConclusion = "Echec de l'ADG";
            caseDTO.status = "CREATED";
            NotificationManager.warn("L'execution de l'acte de gestion a échouée")
            actInError()
        }
    }
    if (props.isScalingMode) {
        caseDTO.category = CaseCategory.SCALED
        caseDTO.receiverActivity = props.validRoutingRule.receiverActivity
        caseDTO.receiverSite = props.validRoutingRule.receiverSite
        caseDTO.estimatedResolutionDate = moment(props.validRoutingRule.estimatedResolutionDateOfCase).toDate()
        caseDTO.autoAssign = props.isWithAutoAssign
        if (props.isWithAutoAssign) {
            caseDTO.status = "ONGOING";
        } else {
            caseDTO.status = "QUALIFIED";
        }

    } else {
        caseDTO.category = CaseCategory.IMMEDIATE
    }
    if (caseDTO.doNotResolveBeforeDate) {
        caseDTO.doNotResolveBeforeDate = DateUtils.toGMT0ISOString(moment(caseDTO.doNotResolveBeforeDate));
    } else {
        caseDTO.doNotResolveBeforeDate = null;
    }
    caseDTO.caseId = payload.idCase;
    caseDTO.clientId = payload.idClient;
    caseDTO.serviceId = payload.idService;
    caseDTO.offerCategory = props.client!.service!.category;
    caseDTO.serviceType = props.client!.service!.serviceType ? props.client!.service!.serviceType : "UNKNOWN";
    caseDTO.siebelAccount = props.client!.service!.siebelAccount;
    caseDTO.processing = props.processing;
    caseDTO.comment = caseDTO.description;
    if (props.qualificationLeaf && props.qualificationLeaf.type) {
        caseDTO.qualification.caseType = props.qualificationLeaf.type;
    }

    // _____________________Contact Handling __________________

    if (!props.addContact) {
        caseDTO.contact = buildEmptyContact(payload)
    } else {
        caseDTO.contact.contactId = payload.idContact
        caseDTO.contact.startDate = payload.contactStartDate
        caseDTO.contact.channel = payload.contactChannel
    }


    // get Activity of case creator from payload
    if (props.activitySelected) {
        caseDTO.activitySelected = props.activitySelected
    }

    // set AdditionalData from the redux store
    if (props.additionDataOfQualifsAndTheme) {
        caseDTO.data = props.additionDataOfQualifsAndTheme
    }

    return caseDTO
}

export const buildFastrContactByPayload = (payload: Payload) => {
    return {
        contactId: payload.idContact,
        clientId: payload.idClient,
        serviceId: payload.idService,
        channel: payload.contactChannel,
        media: {type: payload.contactMediaType, direction: payload.contactMediaDirection},
        startDate: payload.contactStartDate
    }
}


export const buildEmptyContact = (payload:Payload) => {
    return {
        contactId: payload.idContact,
        clientId: payload.idClient,
        serviceId: payload.idService,
        channel: payload.contactChannel,
        media: {type: "SANS_CONTACT", direction: "SANS_CONTACT"},
        startDate: payload.contactStartDate
    }
}
