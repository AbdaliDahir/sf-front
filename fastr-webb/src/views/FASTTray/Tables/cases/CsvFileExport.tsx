import * as React from 'react';
import {format} from "date-fns";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {CSVLink} from "react-csv";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import CaseService from "../../../../service/CaseService";
import {useEffect, useRef, useState} from "react";
import Button from "reactstrap/lib/Button";
import * as _ from "lodash";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {Spinner} from "reactstrap";

const CsvFileExport = (props) => {

    const [dataForCSV, setDataForCSV] = useState([[""]])

    const [isBlockButtonExport, setIsBlockButtonExport] = useState(false);

    // tslint:disable-next-line:no-any
    const authorizations = useTypedSelector(state => state.authorization.authorizations);
    const isMaxwellEligible : boolean = authorizations.indexOf("ADG_MAXWELL") > -1;
    const csvInstance = useRef<any | null>(null);

    useEffect(() => {
        if (dataForCSV && dataForCSV[0] && dataForCSV[0][0] && csvInstance && csvInstance.current && csvInstance.current.link) {
            setTimeout(() => {
                csvInstance.current.link.click();
                setDataForCSV([]);
            });
        }
    }, [dataForCSV]);

    const formatDataForTheCSV = (trays) => {
        const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm'
        const DATE_FORMAT = 'dd/MM/yyyy';
        const csvEntete = ["Créé le", "Ref. Dossier", "Statut", "Type de service", "ID service",
            "État d'avancement", "Modifié le", "Traité par", "Motif", "Thème", "NPTA" ,
            "Date d'escalade" , "Activité émettrice d'escalade", "Site logique escalade",
            "Site physique escalade" , "Contexte de prise en charge"
        ];
        const csvEnteteWithMaxwell = [
            "Créé le", "Ref. Dossier", "Statut", "Type de service", "ID service",
            "État d'avancement", "Modifié le", "Traité par", "Motif", "Thème", "NPTA" ,
            "Date d'escalade" , "Activité émettrice d'escalade", "Site logique escalade",
            "Site physique escalade" , "Contexte de prise en charge",
            "param de l'incident", "priorité maxwell associée",
            "actId", "ticket Id","parent Ticket Id", "statut incident", "date de création",
            "date de dernière MAJ", "dernière note"
        ];

        const csvData = [
            isMaxwellEligible ? csvEnteteWithMaxwell : csvEntete,
        ];
        if (trays) {
            let additionalDatas :Array<string> = [];
            let maxLength = 0;
            if(isMaxwellEligible){
                trays.forEach((item) => {
                    const additionnalDatas = item.lastOngoingIncident?.actDetail?.data;
                    if(additionnalDatas && additionnalDatas?.length > 0 && additionnalDatas?.length > maxLength){
                        maxLength = additionnalDatas?.length ;
                    }
                })
                // create as many column as data we have.
                for (let counter = 0;  counter < maxLength && counter <= 20; counter ++) {
                    additionalDatas = [...additionalDatas, "DA"+counter]
                }
                additionalDatas.forEach(value=>csvEnteteWithMaxwell.push(value));
            }

            trays.forEach((item) => {
                const tag = item.themeQualification && item.themeQualification.tags ? item.themeQualification.tags.join('/') : "";
                const qualification = item.qualification && item.qualification.tags ? item.qualification.tags[item.qualification.tags.length - 1] : "";
                let ownerLogin = "";
                let scalingSite = "";
                let scalingPhysicalSite = "";
                const {caseOwner} = item;
                if (caseOwner) {
                    ownerLogin = caseOwner.login;
                    if (caseOwner.site) {
                        scalingSite = caseOwner.site.label;
                    }
                    if (caseOwner.physicalSite) {
                        scalingPhysicalSite = caseOwner.physicalSite.label;
                    }
                }
                const creationDate = item.creationDate ? format(new Date(item.creationDate), DATETIME_FORMAT).toString() : "";
                const updateDate = item.updateDate ? format(new Date(item.updateDate), DATETIME_FORMAT).toString() : "";
                const nptaDate = item.doNotResolveBeforeDate ? format(new Date(item.doNotResolveBeforeDate), DATE_FORMAT).toString() : "";
                const status = item.status ? translate.formatMessage({id: item.status}) : "";
                const progressStatus = item.progressStatus ? translate.formatMessage({id: item.progressStatus}) : "";
                let scalingDate = "";
                let scalingTransmitterActivity = "";
                let assignmentContext = "";
                if(item.category === "SCALED"){
                    const scalingEvents = item.events.filter(scalingEvent => scalingEvent.type ==="SCALED" || scalingEvent.type === "SCALED_WITH_INCIDENT");
                    if(scalingEvents.length > 0){
                        const lastScalingEvent = _.sortBy(scalingEvents, scalingEvent => scalingEvent.date)[0];
                        scalingDate = format(new Date(lastScalingEvent.date), DATETIME_FORMAT).toString();
                        scalingTransmitterActivity = lastScalingEvent.author.activity.label;
                    }
                }

                const assignmentEvents = item.events?.filter(scalingEvent => scalingEvent.type ==="ASSIGNEMENT" );
                if(assignmentEvents?.length > 0 ){
                    const lastAssignmentEvent = _.sortBy(assignmentEvents, assignmentEvent => assignmentEvent.date)[0];
                    const eventAssignmentEvents = lastAssignmentEvent.valueChangeEvents.filter(event =>
                        event.field === "ASSIGNEMENT_CONTEXT");
                    if(eventAssignmentEvents?.length > 0){
                        assignmentContext = translate.formatMessage({id: eventAssignmentEvents[0].nextValue});
                    }
                }

                const data = [creationDate,
                    item.caseId,
                    status,
                    item.serviceType,
                    item.serviceId,
                    progressStatus,
                    updateDate,
                    ownerLogin,
                    qualification,
                    tag,
                    nptaDate,
                    scalingDate,
                    scalingTransmitterActivity,
                    scalingSite,
                    scalingPhysicalSite,
                    assignmentContext
                    ];
                if(isMaxwellEligible){
                    const onGoingIncident = item.lastOngoingIncident
                    if(onGoingIncident) {
                        const paramIncident = onGoingIncident.actDetail.paramIncident && onGoingIncident.actDetail.paramIncident.incident;
                        const incident = onGoingIncident.actDetail.incident;
                        const incidentValues = [
                            paramIncident?.priority +"/"+paramIncident?.segment+"/"+paramIncident?.domain+"/"+paramIncident?.subDomain+"/"+paramIncident?.application,
                            paramIncident?.priority,
                            onGoingIncident?.actId,
                            incident?.ticketId,
                            incident?.parentTicketId,
                            incident?.status,
                            incident?.creationDate,
                            incident?.updateDate,
                            incident?.technicalResult && incident?.technicalResult[incident?.technicalResult?.length -1]];
                        incidentValues.forEach(value => data.push(value));

                        if(onGoingIncident.actDetail.data){
                            onGoingIncident.actDetail.data.forEach(additionalData=>data.push(additionalData.label +"-" +additionalData.value));
                        }
                    }
                }
                csvData.push(data);
            });
        }
        return csvData
    }

    const fetchTraysAndFormatForCSV = async()  => {

        setIsBlockButtonExport(true);

        const caseService = new CaseService(true);
        const {lastTrayFetchDone} = props
        try {
            caseService.getAgentTrayCasesForCSV(lastTrayFetchDone.activityCodeSelected, props.isSupervisor, props.isCCMaxwell)
                .then(cases => {
                    const formattedCases = formatDataForTheCSV(cases)
                    setDataForCSV(formattedCases);
                    setIsBlockButtonExport(false);
                })
        } catch (e) {
            console.error(e);
            setIsBlockButtonExport(false);
        }
    }

    return (
        <>
            <Button className="float-right" component='span' color='primary' variant='outlined' disabled={isBlockButtonExport} onClick={fetchTraysAndFormatForCSV}>
                { isBlockButtonExport ?
                    <React.Fragment>
                        <Spinner size={"sm"} type={"grow"}/><Spinner size={"sm"} type={"grow"}/><Spinner size={"sm"} type={"grow"}/>
                    </React.Fragment>
                    :
                    <span>Extraire au format CSV</span>
                }
            </Button>

            {dataForCSV.length > 0 ?
                <CSVLink
                    data={dataForCSV}
                    separator={";"}
                    filename={'ExportCSVFromFAST.csv'}
                    ref={csvInstance}
                />
                : undefined}
        </>
    )

};

const mapStateToProps = (state: AppState) => ({
    lastTrayFetchDone: state.tray.lastTrayFetchDone,
});

export default connect(mapStateToProps)(CsvFileExport);