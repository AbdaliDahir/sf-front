import {MaxwellIncidentState} from "../../../../model/maxwell/MaxwellIncidentState";
import {CaseState} from "../../../../store/reducers/v2/case/CasesPageReducerV2";
import FASTRAct from "../../../../model/acts/FASTRAct";
import {MaxwellAct} from "../../../../model/maxwell/MaxwellAct";
import moment from "moment";
import {ParamIncidentDTO} from "../../../../model/maxwell/ParamIncidentDTO";
import {EAttachmentType} from "../../../../model/maxwell/enums/EAttachmentType";
import {AttachmentDTO} from "../../../../model/maxwell/AttachmentDTO";
import {MaxwellStepDTO} from "../../../../model/maxwell/MaxwellStepDTO";
import {EStepDetailName} from "../../../../model/maxwell/enums/EStepDetailName";
import {IncidentTicketDTO} from "../../../../model/maxwell/IncidentTicketDTO";
import {buildEmtyIncident} from "../../../../utils/MaxwellUtilsV2";
import {MaxwellProcess} from "../../../../model/enums/MaxwellProcess";
import {Contact} from "../../../../model/Contact";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";

const ADG_MAXWELL = "ADG_MAXWELL";
const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
export const MaxwellDataFormat = (maxwellIncident: MaxwellIncidentState, currentCase: CaseState, currentContact: Contact | undefined, ciblage?: boolean) => {
    const request: FASTRAct<MaxwellAct> = {
        "act": {
            paramIncident   : formatParamIncident(currentCase),
            incident        : ciblage ? formatIncidentTicket(maxwellIncident, ciblage) : formatIncidentTicket(maxwellIncident),
            attachments     : formatAttachments(maxwellIncident),
            data            : maxwellIncident.additionalData,
            stepsDetail     : formatStepsDetail(maxwellIncident, currentContact?.contactId)
        },
        caseId: currentCase.caseId,
        actName: ADG_MAXWELL,
        notification: true,
        dueDate: moment().utc(true).toDate(),
        personId: currentCase.currentCase ? currentCase.currentCase.clientId : "",
        serviceId: currentCase.currentCase ? currentCase.currentCase?.serviceId : "",
        contactId: currentContact ? currentContact.contactId : ""
    }
    return request;
};

export const MaxwellDataFormatForInit = (maxwellIncident: MaxwellIncidentState, currentCase: CaseState, contactId: string | undefined, tags: string[], ciblage?: boolean) => {
    const request: FASTRAct<MaxwellAct> = {
        "act": {
            paramIncident   : formatParamIncident(currentCase, tags),
            incident        : formatIncidentTicketForInit(maxwellIncident, ciblage),
            attachments     : [],
            data            : maxwellIncident.additionalData,
            stepsDetail     : formatStepsDetailForInit(contactId)
        },
        caseId: currentCase.caseId,
        actName: ADG_MAXWELL,
        notification: true,
        dueDate: moment().utc(true).toDate(),
        personId: currentCase.currentCase ? currentCase.currentCase.clientId : "",
        serviceId: currentCase.currentCase ? currentCase.currentCase?.serviceId : "",
        contactId: contactId ? contactId : ""
    }
    return request;
};


const formatIncidentTicket = (maxwellIncident: MaxwellIncidentState, ciblage?: boolean) : IncidentTicketDTO => {
    const now: Date = moment().utc(true).toDate();
    return {
        caseModel: "V2",
        ticketId: maxwellIncident.troubleTicketResponse ? maxwellIncident.troubleTicketResponse.refCtt : "",
        ticketTitle: maxwellIncident.troubleTicketResponse ? maxwellIncident.troubleTicketResponse.ticketTitle : "",
        parentTicketId: maxwellIncident.troubleTicketResponse ? maxwellIncident.troubleTicketResponse.parentTicketId : "",
        description: maxwellIncident.selectedIncidentMaxwell?.description,
        parentTicketIntitule: maxwellIncident.selectedIncidentMaxwell?.parentTicketIdToSet === true ? translate.formatMessage({id: "act.ADG_MAXWELL.finalize.associateParentTicketManually"}) : maxwellIncident.selectedIncidentMaxwell?.intitule,
        parentTicketActions: maxwellIncident.selectedIncidentMaxwell?.actions,
        parentTicketDiscoursClient: maxwellIncident.selectedIncidentMaxwell?.discoursClient,
        updateDate: now,
        technicalResult: maxwellIncident.troubleTicketResponse ? [moment.utc(now).format(DATETIME_FORMAT) + " - Ticket créé et affecté dans l'outil de ticketing"] : [],
        creationDate: now,
        status: "CREATED",
        ciblage: ciblage ? ciblage : false
    };
}

const formatIncidentTicketForInit = (maxwellIncident: MaxwellIncidentState, ciblage?: boolean) : IncidentTicketDTO => {
    const now: Date = moment().utc(true).toDate();
    return {
        caseModel: "V2",
        ticketId: "",
        ticketTitle: maxwellIncident.incidentTitle ? maxwellIncident.incidentTitle : "",
        parentTicketId: maxwellIncident.selectedIncidentMaxwell?.refCTT ? maxwellIncident.selectedIncidentMaxwell?.refCTT : "",
        description: maxwellIncident.selectedIncidentMaxwell?.description,
        parentTicketIntitule: maxwellIncident.selectedIncidentMaxwell?.intitule,
        parentTicketActions: maxwellIncident.selectedIncidentMaxwell?.actions,
        parentTicketDiscoursClient: maxwellIncident.selectedIncidentMaxwell?.discoursClient,
        technicalResult: ciblage && maxwellIncident.troubleTicketResponse ? [moment.utc(now).format(DATETIME_FORMAT) + " - Ticket créé et affecté dans l'outil de ticketing"] : [],
        updateDate: now,
        creationDate: now,
        status: ciblage ? "CLOSED" : "WAITING",
        ciblage: ciblage ? ciblage : false
    };
}

const formatParamIncident = (currentCase: CaseState | undefined, tags: string[] = []): ParamIncidentDTO => {

    return {

            code: currentCase?.themeSelected ? currentCase.themeSelected[0]?.code : "",
            tags:  currentCase?.currentCase?.themeQualification?.tags.length ? currentCase?.currentCase?.themeQualification.tags : tags,
            incident: currentCase?.themeSelected ? currentCase.themeSelected[0]?.incident : buildEmtyIncident()
        }
}

const formatAttachments = (maxwellIncident: MaxwellIncidentState): Array<AttachmentDTO> => {
   const path: string = maxwellIncident.troubleTicketResponse ? maxwellIncident.troubleTicketResponse.attachementDirectory : ""
    return maxwellIncident.uploadedFilesMaxwell.map((file, i) => {
        return {
            name: file.name,
            fullPath: path,
            type: EAttachmentType.MINIO
        }
    })
}

function stepADGOK(currentContactId: string | undefined) {
    return {
        name: EStepDetailName.SAVE_ACT,
        date: moment().utc(true).toDate(),
        status: "OK",
        returnCode: "200",
        returnMessage: "",
        contactId: currentContactId
    };
}

export const buildStepDetailKO = (currentContactId: string | undefined, stepDetailName: EStepDetailName, errorCode: string, errorMessage: string): MaxwellStepDTO => {
    return {
        name: stepDetailName,
        date: moment().utc(true).toDate(),
        status: "KO",
        returnCode: errorCode,
        returnMessage: errorMessage,
        contactId: currentContactId
    }
}

export const buildStepDetailOK = (currentContactId: string | undefined, stepDetailName: EStepDetailName): MaxwellStepDTO => {
    return {
        name: stepDetailName,
        date: moment().utc(true).toDate(),
        status: "OK",
        returnCode: "200",
        returnMessage: "",
        contactId: currentContactId
    }
}


const formatStepsDetailForInit = (currentContactId: string | undefined): Array<MaxwellStepDTO> => {
    return [
        {
            name: EStepDetailName.CLFY_TT,
            date: moment().utc(true).toDate(),
            status: "WAITING",
            returnCode: "",
            returnMessage: "",
            contactId: currentContactId
        },
        stepADGOK(currentContactId)
    ]
}

const formatStepsDetail = (maxwellIncident: MaxwellIncidentState, currentContactId: string | undefined): Array<MaxwellStepDTO> => {
    return [
        {
            name: EStepDetailName.CLFY_TT,
            date: moment().utc(true).toDate(),
            status: maxwellIncident.troubleTicketResponse ? maxwellIncident.troubleTicketResponse?.status : "KO",
            returnCode: maxwellIncident.troubleTicketProcess === MaxwellProcess.PROCESS_OK ? "200" : "500",
            returnMessage: maxwellIncident.troubleTicketProcess,
            contactId: currentContactId
        },
        stepADGOK(currentContactId)
    ]
}