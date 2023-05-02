import * as React from "react";
import {useEffect, useState} from "react";
import {Case} from "../../../../../../model/Case";
import {FormattedMessage} from "react-intl";
import CasePicto from "../CaseCardComponents/CasePicto";
import "./CaseSynthese.scss"
import CaseService from "../../../../../../service/CaseService";
import {CaseCounters} from "../../../../../../model/CaseCounters";
import DateUtils from "../../../../../../utils/DateUtils";
import {UncontrolledTooltip} from "reactstrap";
import UXUtils from "../../../../../../utils/UXUtils";


interface Props {
    recentCase?: Case
    openDetails?
    detailsOpened?: boolean
    sectionSetter?
    isScalingV2?: boolean
    isPastScaling?: boolean
    caseCardRef?: React.RefObject<HTMLDivElement>
    forceOpenActionsHistory
}

const CaseSynthese = (props: Props) => {
    const {recentCase, openDetails, sectionSetter, isScalingV2, caseCardRef, isPastScaling, forceOpenActionsHistory} = props;

    const caseService: CaseService = new CaseService(true);

    const [caseCounters, setCaseCounters] = useState<CaseCounters>();

    useEffect(()=>{
        loadCaseCounters()
    },[recentCase]);

    const loadCaseCounters = ()=>{
        if (recentCase) {
            caseService.getAllCaseCounters(recentCase.caseId).then((counters) =>
                setCaseCounters(counters)
            )
        }
    }

    const renderCaseInfosPictos = () => {
        const arr: any[] = []
        if (caseCounters?.incomingContactsCounter) {
            arr.push(<CasePicto id={"incomingContacts" + recentCase?.caseId} iconType={"ENTRANT"}
                                counts={caseCounters?.incomingContactsCounter} bgColor={"#fff"} textColor={"#9C3C7A"}/>)
            arr.push(<UncontrolledTooltip target={"incomingContacts" + recentCase?.caseId}>
                {caseCounters?.incomingContactsCounter} <FormattedMessage id={"dossiers.actifs.v2.contacts.incoming"}/>
            </UncontrolledTooltip>)
        }
        if (caseCounters?.outgoingContactsCounter) {
            arr.push(<CasePicto id={"outgoingContacts" + recentCase?.caseId} iconType={"SORTANT"}
                                counts={caseCounters?.outgoingContactsCounter} bgColor={"#fff"} textColor={"#9C3C7A"}/>)
            arr.push(<UncontrolledTooltip target={"outgoingContacts" + recentCase?.caseId}>
                {caseCounters?.outgoingContactsCounter} <FormattedMessage id={"dossiers.actifs.v2.contacts.outgoing"}/>
            </UncontrolledTooltip>)
        }
        if (caseCounters?.notesCount) {
            arr.push(<CasePicto id={"notes" + recentCase?.caseId} iconType={"COMMENT"}
                                counts={caseCounters?.notesCount} bgColor={"#fff"} textColor={"#9C3C7A"}/>)
            arr.push(<UncontrolledTooltip target={"notes" + recentCase?.caseId}>
                {caseCounters?.notesCount} <FormattedMessage id={"dossiers.actifs.v2.notes"}/>
            </UncontrolledTooltip>)
        }
        if (caseCounters?.actsCounter) {
            arr.push(<CasePicto id={"acts" + recentCase?.caseId} iconType={"AFFECTATION"}
                                counts={caseCounters?.actsCounter} bgColor={"#fff"}
                                textColor={"#9C3C7A"}/>)
            arr.push(<UncontrolledTooltip target={"acts" + recentCase?.caseId}>
                {caseCounters?.actsCounter} <FormattedMessage id={"dossiers.actifs.v2.acts"}/>
            </UncontrolledTooltip>)
        }

        if (caseCounters?.actionCounter) {
            arr.push(<CasePicto id={"actions" + recentCase?.caseId} iconType={"ACTION_DARK"}
                                counts={caseCounters?.actionCounter} bgColor={"#fff"}
                                textColor={"#9C3C7A"}/>)
            arr.push(<UncontrolledTooltip target={"actions" + recentCase?.caseId}>
                {caseCounters?.actionCounter} <FormattedMessage id={"dossiers.actifs.v2.actions"}
                                                                values={{ongoing:caseCounters.ongoingActionsCounter}}/>
            </UncontrolledTooltip>)
        }

        if (caseCounters?.couriersCounter) {
            arr.push(<CasePicto iconType={"COURIERS"} counts={caseCounters.couriersCounter}
                                id={"couriers" + recentCase?.caseId}
                                onClick={() => onPictoClick('HISTORY')}
                                textColor={"#9C3C7A"} bgColor={"#fff"} cursor="pointer"/>)
            arr.push(<UncontrolledTooltip target={"couriers" + recentCase?.caseId}>
                {caseCounters.couriersCounter} <FormattedMessage id={"dossiers.actifs.v2.couriers.counter"}/>
            </UncontrolledTooltip>)
        }

        return arr
    }

    const onPictoClick = (name) => {
        openDetails();
        caseCardRef?.current?.scrollIntoView(true);
        if (sectionSetter) {
            setTimeout(() => {
                sectionSetter(name)
            }, 1)
        }
    }



    const renderCaseSectionsPictos = () => {
        const arr: any[] = []
        if (caseCounters?.lastRetentionDuration && caseCounters.lastRetentionDuration <= (DateUtils.NB_MILIS_IN_DAY * 30)) {
            arr.push(<CasePicto iconType={"RETENTION_LIGHT"}
                                counts={DateUtils.renderDuration(caseCounters?.lastRetentionDuration)}
                                className={"case-synthese__picto"}
                                id={"lastRetention" + recentCase?.caseId}
                                onClick={() => onPictoClick('RETENTION')}
                                bgColor={"transparent linear-gradient(#888 0%, #000 100%) 0% 0% no-repeat padding-box"}
                                textColor={"#fff"}/>)
            arr.push(<UncontrolledTooltip target={"lastRetention" + recentCase?.caseId}>
                {DateUtils.renderDuration(caseCounters?.lastRetentionDuration)} <FormattedMessage
                id={"dossiers.actifs.v2.retention"}/>
            </UncontrolledTooltip>)
        }

        if (caseCounters?.lastScaleDuration || ((!isScalingV2 || isPastScaling) && recentCase?.scaleDetails && recentCase?.scaleDetails?.length > 0)) {
            arr.push(<CasePicto iconType={"SCALING_LIGHT"} counts={DateUtils.renderDuration(caseCounters?.lastScaleDuration)}
                                className={isPastScaling ? "case-synthese__picto-dark" : "case-synthese__picto"}
                                id={"lastScaling" + recentCase?.caseId}
                                onClick={() => onPictoClick('SCALING')}
                                textColor={"#fff"}/>)

            let messageId = ""
            if (isPastScaling) {
                messageId = "dossiers.actifs.past.scaling";
            } else if (isScalingV2) {
                messageId = "dossiers.actifs.v2.scaling";
            } else {
                messageId = "dossiers.actifs.v1.scaling"
            }
            arr.push(<UncontrolledTooltip target={"lastScaling" + recentCase?.caseId}>
                {DateUtils.renderDuration(caseCounters?.lastScaleDuration)} <FormattedMessage
                id={messageId}/>
            </UncontrolledTooltip>)
        }

        if (caseCounters?.lastIncidentDuration) {
            arr.push(<CasePicto iconType={"INCIDENT_LIGHT"} counts={DateUtils.renderDuration(caseCounters?.lastIncidentDuration)}
                                className={"case-synthese__picto"}
                                id={"lastIncident" + recentCase?.caseId}
                                onClick={() => onPictoClick('INCIDENTS')}
                                bgColor={"transparent linear-gradient(180deg, #DA3832 0%, #9C3C7A 100%) 0% 0% no-repeat padding-box"}
                                textColor={"#fff"}/>)
            arr.push(<UncontrolledTooltip target={"lastIncident" + recentCase?.caseId}>
                {DateUtils.renderDuration(caseCounters?.lastIncidentDuration)} <FormattedMessage
                id={"dossiers.actifs.v2.incidents"}/>
            </UncontrolledTooltip>)
        }

        if (caseCounters?.ongoingActionsCounter) {
            arr.push(<CasePicto iconType={"ACTION_LIGHT"} counts={caseCounters.ongoingActionsCounter}
                                className={"case-synthese__picto"}
                                id={"ongoingActions" + recentCase?.caseId}
                                onClick={() => onPictoClick('ACTION')}
                                bgColor={"transparent linear-gradient(180deg, #DA3832 0%, #9C3C7A 100%) 0% 0% no-repeat padding-box"}
                                textColor={"#fff"}/>)
            arr.push(<UncontrolledTooltip target={"ongoingActions" + recentCase?.caseId}>
                {caseCounters.ongoingActionsCounter} <FormattedMessage
                id={"dossiers.actifs.v2.ongoingActions"}/>
            </UncontrolledTooltip>)
        }

        const scrollToActionsHistoryTab = () => {
            openDetails();
            forceOpenActionsHistory();
        }

        if (caseCounters?.ongoingActionsCounter === 0 && caseCounters?.actionCounter > 0) {
            arr.push(<CasePicto iconType={"ACTION_LIGHT"} counts={caseCounters.actionCounter}
                                className={"case-synthese__picto-dark"}
                                id={"ongoingActions" + recentCase?.caseId}
                                onClick={() => scrollToActionsHistoryTab()}
                                textColor={"#fff"}/>)
            arr.push(<UncontrolledTooltip target={"ongoingActions" + recentCase?.caseId}>
                {caseCounters.actionCounter} <FormattedMessage
                id={caseCounters.actionCounter <= 1 ? "dossiers.actifs.v2.resolvedUnresolvedAndCanceledActions" : "dossiers.actifs.v2.resolvedUnresolvedAndCanceledActions.plural" }/>
            </UncontrolledTooltip>)
        }
        return arr
    }


    return (
        <div>
            <div className="caseStatus font-weight-bold font-size-sm mb-7">
                {recentCase?.status &&
                <div className={"d-flex flex-column"}>
                    <FormattedMessage id={recentCase.status}/>
                    {recentCase?.processingConclusion && <FormattedMessage id={recentCase.processingConclusion}/>}
                </div>
                }
            </div>
            <div className="font-weight-normal font-size-m mb-6">Dossier <span
                onClick={UXUtils.copyValueToClipboard} className={"px-1 cursor-pointer ripple rounded"}>{recentCase?.caseId}
            </span></div>

            <div className="caseInfos d-flex justify-content-start mb-6">
                {renderCaseInfosPictos()}
            </div>
            <div className="caseSections d-flex justify-content-start">
                {renderCaseSectionsPictos()}
            </div>

        </div>
    )
}

export default CaseSynthese