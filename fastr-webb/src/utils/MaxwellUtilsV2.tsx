import {CaseState} from "../store/reducers/v2/case/CasesPageReducerV2";
import {TroubleTicketRequest} from "../model/TroubleTicketRequest";
import {Incident} from "../model/Incident";
import {IncidentsListItem} from "../model/IncidentsList";
import {EMaxwellIncidentStatus} from "../model/maxwell/enums/EMaxwellIncidentStatus";
import {FormattedMessage} from "react-intl";
import React from "react";

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

export const buildTroubleTicketDto = (currentCase: CaseState): TroubleTicketRequest => {
    const caseDetail                = currentCase.currentCase;
    const selectedIncidentMaxwell   = currentCase.maxwellIncident.selectedIncidentMaxwell;
    const selectedTheme             = currentCase.themeSelected
    return {
            idCase: currentCase.caseId,
            idClient: caseDetail ? caseDetail.clientId : "",
            idService: caseDetail ? caseDetail.serviceId : "",
            refCTT: selectedIncidentMaxwell ? selectedIncidentMaxwell.refCTT : "",
            themes: caseDetail? caseDetail.themeQualification.tags : [],
            motifs: currentCase.motif ? currentCase.motif.tags : [],
            comment:  currentCase.maxwellIncident.incidentTitle,
            data: currentCase.maxwellIncident.additionalData,
            incidentTitle: currentCase.maxwellIncident.incidentTitle,
            incident: selectedTheme ? selectedTheme[0].incident : buildEmtyIncident(),
            fileNames: buildAdaptedFilesNames(currentCase.maxwellIncident.uploadedFilesMaxwell)
        }
}

export const buildTroubleTicketDtoFromQA = (currentCase: CaseState, tags : string[]): TroubleTicketRequest => {
    const caseDetail                = currentCase.currentCase;
    const selectedIncidentMaxwell   = currentCase.maxwellIncident.selectedIncidentMaxwell;
    const selectedTheme             = currentCase.themeSelected
    return {
        idCase: currentCase.caseId,
        idClient: caseDetail ? caseDetail.clientId : "",
        idService: caseDetail ? caseDetail.serviceId : "",
        refCTT: selectedIncidentMaxwell ? selectedIncidentMaxwell.refCTT : "",
        themes: tags ? tags : [],
        motifs: currentCase.motif ? currentCase.motif.tags : [],
        comment:  currentCase.maxwellIncident.incidentTitle,
        data: currentCase.maxwellIncident.additionalData,
        incidentTitle: "Ciblage/" + currentCase.maxwellIncident.incidentTitle,
        incident: selectedTheme ? selectedTheme[0].incident : buildEmtyIncident(),
        fileNames: buildAdaptedFilesNames(currentCase.maxwellIncident.uploadedFilesMaxwell),
        ciblage: true
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

export const getOKTroubleTicketResponse = () => {
    return {
        status: "OK",
        refCtt: "123456789",
        attachementDirectory: "FAST123-123-123",
        ticketTitle: "ticketTitle_FAST123-123-123",
        parentTicketId: "parentTicketId_FAST123-123-123",
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

export const buildEmtyIncident = (): Incident  => {
    return {
        priority: "",
        segment: "",
        domain: "",
        subDomain: "",
        application: ""
    }
}


export const isInProgressIncidentExceptWaiting = (incident : IncidentsListItem) => {
    return isInProgressIncident(incident) && !isWaitingIncident(incident) ;
}

export const isInProgressIncident = (incident : IncidentsListItem) => {
    return incident.status && incident.status !== "RESOLVED"
        && incident.status !== "Fermé"
        && incident.status !== "CANCELED"
        && incident.status !== "CLOSED" ;
}

export const isWaitingIncident = (incident : IncidentsListItem) => {
    return incident.status && incident.status === "WAITING";
}

export const getBadgeBgColor = (timeSpentLastUpdate, status) => {
    const time = parseInt(timeSpentLastUpdate, 10)
    let badgeBgColor;
    if (status !== 'WAITING') {
        if (time <= 5) {
            badgeBgColor = 'badge-primary'
        } else if (5 < time && time <= 10) {
            badgeBgColor = 'badge-warning'
        } else {
            badgeBgColor = 'badge-primary'
        }
    } else {
        badgeBgColor = 'badge-dark'
    }
    return badgeBgColor;
}

export const formattedStatus = (incident) => {
    if (Object.values(EMaxwellIncidentStatus).includes(incident.status.toUpperCase())) {
        return <FormattedMessage id={"maxwellV2.incident.list.status." + incident.status.toUpperCase()}/>;
    }
    return incident.status;
}
