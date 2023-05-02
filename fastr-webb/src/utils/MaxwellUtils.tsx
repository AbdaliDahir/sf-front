import {Case} from "../model/Case";
import {CaseQualification} from "../model/CaseQualification";

import {Contact} from "../model/Contact";
import {MaxwellProcess} from "../model/enums/MaxwellProcess";
import {TroubleTicketResponse} from "../model/TroubleTicketResponse";
import {CasePageState} from "../store/reducers/CasePageReducer";
import {CreateCaseProps, Payload} from "../views/Cases/Create/CreateCasePage";

import {Payload as PayloadView} from "../views/Cases/View/ViewCasePage";
import {CaseCategory} from "../model/CaseCategory";
import moment from "moment";
import {IncidentsListItem} from "../model/IncidentsList";
import {isInProgressIncident} from "./MaxwellUtilsV2";


export const buildTroubleTicketUpdateDto = (currentCase: Case, formsyCase, payload: PayloadView, props: CasePageState, motif: CaseQualification | undefined) => {

    const commentAndClientRequest = formsyCase.clientRequest.concat(formsyCase.description);
    const themeQualif = formsyCase.themeQualification
    const title = formsyCase.incidenttitle
    return {
        idCase: currentCase.caseId,
        idClient: currentCase.clientId,
        idService: currentCase.serviceId,
        refCTT: props.incidentSelected ? props.incidentSelected.refCTT : "",
        themes: themeQualif.tags,
        motifs: motif ? motif.tags : [],
        comment: commentAndClientRequest,
        data: props.additionDataOfQualifsAndTheme,
        incidentTitle: title,
        incident: props.theme ? props.theme.incident : {
            priority: "",
            segment: "",
            domain: "",
            subDomain: "",
            application: ""
        },
        fileNames: props.uploadedFiles ? buildAdaptedFilesNames(props.uploadedFiles) : []
    }
}


export const isMaxwelCase = (currentCase: Case): boolean => {
    return currentCase && currentCase.incident != null && currentCase.incident.ticketId !== ""
}

export const isCaseHasInProgressMaxwellV2Incident = (incidents: Array<IncidentsListItem>): boolean => {
    return incidents?.length > 0 && incidents.find(incident => isInProgressIncident(incident)) !== undefined
}

export const isMaxwellAndScaledCase = (currentCase: Case): boolean => {
    return isMaxwelCase(currentCase) && currentCase.category === CaseCategory.SCALED
}

export const buildTroubleTicketDto = (formsyCase, payload: Payload, props: CreateCaseProps, motif: CaseQualification | undefined) => {

    const commentAndClientRequest = formsyCase.clientRequest.concat(formsyCase.comment);
    const themeQualif = formsyCase.themeQualification
    const title = formsyCase.incidenttitle
    return {
        idCase: payload.idCase,
        idClient: payload.idClient,
        idService: payload.idService,
        refCTT: props.incidentSelected.refCTT,
        themes: themeQualif.tags,
        motifs: motif ? motif.tags : [],
        comment: commentAndClientRequest,
        data: props.additionDataOfQualifsAndTheme,
        incidentTitle: title,
        incident: props.theme.incident,
        fileNames: buildAdaptedFilesNames(props.uploadedFiles)
    }
}

const buildAdaptedFilesNames = (files: File[]) => {
    const newNames: string[] = [];
    let counter = 1;
    files.map((file, i) => {
        const extension = file.name.split('.').pop();
        const newName = "PJ" + counter + "." + extension;
        newNames.push(newName)
        counter++
    })
    return newNames
}

export const buildAdaptedRenamedFiles = (files: File[]) => {
    const newFiles: File[] = [];
    let counter = 1;
    files.map((file, i) => {
        const extension = file.name.split('.').pop();
        const fileType = file.type;
        const newName = "PJ" + counter + "." + extension;
        const renamedFile = new File([file], newName, {type: fileType});
        newFiles.push(renamedFile)
        counter++
    })
    return newFiles
}


export const isProcessOK = (maxwellProcess: MaxwellProcess) => {
    return maxwellProcess === MaxwellProcess.PROCESS_OK
}


export const isProcessKO = (maxwellProcess: MaxwellProcess) => {
    return maxwellProcess === MaxwellProcess.PROCESS_KO
}


export const isMaxwellCase = (formsyCase) => {
    return formsyCase.hasOwnProperty("MaxwellData");
}


export const buildFastrContactCreation = (contacts: Contact[], payload: Payload) => {
    let shouldContactbeCreatedInFast = false;

    if (!payload.contactCreatedByFast && contacts && contacts.length) {
        shouldContactbeCreatedInFast = true;
    }
    const contactFastr = contacts[0];

    return {
        idContact: contactFastr === undefined ? "" : contactFastr.contactId,
        mediaType: contactFastr === undefined || contactFastr.media === undefined ? "" : contactFastr.media.type,
        mediaDirection: contactFastr === undefined || contactFastr.media === undefined ? "" : contactFastr.media.direction,
        contactStartDate: contactFastr === undefined ? "" : contactFastr.startDate,
        contactCreationDate: contactFastr === undefined ? "" : contactFastr.createdDate,
        shouldBeCreatedInFast: shouldContactbeCreatedInFast
    }
}

export const getKoTroubleTicketResponse = () => {
    return {
        status: "KO",
        refCtt: "",
        attachementDirectory: "",
        ticketTitle: "",
        parentTicketId: ""
    }
}


export const buildInitalCaseIncident = (res: TroubleTicketResponse) => {
    return {
        technicalResult: "",
        ticketId: res.refCtt,
        estimatedResolutionDate: "",
        resolutionDate: "",
        creationDate: moment().utc(true).toDate(),
        status: "",
        updateDate:undefined
    }

}