import React, {useEffect, useState} from 'react';
import {FormattedMessage} from "react-intl";
import {Button, Col, PopoverBody, Row, UncontrolledPopover} from "reactstrap";
import MaxwellSectionV2 from "../../../Acts/Maxwell/MaxwellSectionV2";
import {EMaxwellCallOrigin} from "../../../../../model/maxwell/enums/EMaxwellCallOrigin";
import {AppState} from "../../../../../store";
import {useDispatch, useSelector} from "react-redux";
import {CaseState} from "../../../../../store/reducers/v2/case/CasesPageReducerV2";
import {IncidentsListItem} from "../../../../../model/IncidentsList";
import CaseService from "../../../../../service/CaseService";
import * as moment from "moment";
import {isAllowedAutorisations} from "../../../../../utils/AuthorizationUtils";
import {
    setCaseHasInProgressIncident,
    setCaseHasInProgressIncidentExceptWaiting,
    setCaseHasNotInProgressIncident,
    setCaseHasNotInProgressIncidentExceptWaiting,
    setIncidentsIdsWithWaitingStatus,
    setMaxwellActIdToFinalize,
    setMaxwellIncidentsListClosed,
    setMaxwellIncidentsListOpened
} from "../../../../../store/actions/v2/case/CaseActions";
import {MaxwellIncidentStatusOrder} from "../../../../../model/maxwell/enums/EMaxwellIncidentStatus";
import {
    formattedStatus,
    getBadgeBgColor,
    isInProgressIncident,
    isInProgressIncidentExceptWaiting,
    isWaitingIncident
} from "../../../../../utils/MaxwellUtilsV2";
import DateUtils from "../../../../../utils/DateUtils";
import {commentRender} from "../../../../Commons/Acts/ActsUtils";

interface Props {
    caseId: string
    disabled?: boolean
}

const IncidentsList = (props: Props) => {

    const dispatch = useDispatch();

    const caseService: CaseService = new CaseService(true);
    const {caseId} = props
    const currentCase: CaseState = useSelector((state: AppState) => state.store.cases.casesList[caseId])
    const isMaxwellIncidentList: boolean = useSelector((state: AppState) => state.store.cases.casesList[caseId].maxwellIncident.isMaxwellIncidentList)
    const authorizations = useSelector((state: AppState) => state.store.applicationInitialState.authorizations);
    const canCCUpdateCurrentCase: boolean = useSelector((state: AppState) => state.store.cases.casesList[caseId]?.caseBooleans?.canCCUpdateCurrentCase)
    const [incidents, setIncidents] = useState();
    const [actDetail, setActDetail] = useState();
    const [errorFetching, setErrorFetching] = useState();

    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    useEffect(() => {
        dispatch(setMaxwellIncidentsListOpened(caseId))
        loadIncidentsList()
    }, [])

    useEffect(() => {
        loadIncidentsList()
    }, [isMaxwellIncidentList]);

    const finalizeIncident = actId => (async e => {
        e.preventDefault()
        await getActDetailByActId(actId)
        dispatch(setMaxwellActIdToFinalize(caseId, actId))
        dispatch(setMaxwellIncidentsListClosed(caseId))
    })

    const loadIncidentsList = async () => {
        try {
            const incidentsArr: IncidentsListItem[] = await caseService.getIncidentsList(caseId)
            if (incidentsArr) {
                incidentsArr?.sort((a, b) => DateUtils.compareStringDates(b.creationDate, a.creationDate))
                    .sort((a, b) => MaxwellIncidentStatusOrder[a.status] - MaxwellIncidentStatusOrder[b.status])
                setIncidents(incidentsArr)
            }
            if (incidentsArr && incidentsArr.length > 0 && incidentsArr.find(incident => isInProgressIncident(incident))) {
                dispatch(setCaseHasInProgressIncident(caseId));
            } else {
                dispatch(setCaseHasNotInProgressIncident(caseId));
            }

            // les statuts en cours hors waiting
            if (incidentsArr && incidentsArr.length > 0 && incidentsArr.find(incident => isInProgressIncidentExceptWaiting(incident))) {
                dispatch(setCaseHasInProgressIncidentExceptWaiting(caseId));
            } else {
                dispatch(setCaseHasNotInProgressIncidentExceptWaiting(caseId));
            }

            const ids: Array<string> = incidentsArr.filter(incident => isWaitingIncident(incident)).map(incident => incident.actId);
            dispatch(setIncidentsIdsWithWaitingStatus(caseId, ids));
        } catch (e) {
            dispatch(setCaseHasNotInProgressIncident(caseId));
            const error = await e;
            console.error(error)
            setErrorFetching(error)
        }
    }

    const getActDetailByActId = async actId => {
        try {
            const retrievedActDetail = await caseService.getActDetailByActId(actId)
            if (retrievedActDetail) {
                setActDetail(retrievedActDetail)
            }
        } catch (e) {
            const error = await e;
            console.error(error)
        }
    }

    const handleErrorMsg = () => {
        if (!incidents?.length && !errorFetching) {
            return <div className={"text-center"}>
                <FormattedMessage id={"maxwellV2.incident.list.empty"}/>
            </div>
        } else if (!incidents?.length && errorFetching) {
            return <div className={"text-center"}>
                <UncontrolledPopover
                    placement="bottom"
                    trigger="hover"
                    target={"fetching-error"}>
                    <PopoverBody>
                        {errorFetching.message}
                    </PopoverBody>
                </UncontrolledPopover>
                <FormattedMessage id={"maxwellV2.incident.list.fetching.error"}/>
                <span id={"fetching-error"} className={`cursor-pointer ml-1`}>/!\</span>
            </div>
        } else {
            return <React.Fragment/>
        }
    }

    const renderIncidentsTable = () => {
        const incidentsList: JSX.Element[] = [];
        incidents.filter(incident => isInProgressIncident(incident)).forEach(incident => {
            const badgeBG = getBadgeBgColor(incident.timeSpentLastUpdate, incident.status)
            incidentsList.push(
                <Row className="border-bottom align-items-center incident-line justify-content-between">
                    <Col xs={1} className="d-flex flex-column align-items-center justify-content-center">
                        {incident?.ticketId && <div className="pb-1">{incident.ticketId}</div>}
                        <span className={`badge badge-round d-flex align-items-center ${badgeBG}`}>
                            <span className="text-white">{DateUtils.formatTimeSpentLastUpdate(incident.timeSpentLastUpdate, "d[j] h[h] m[min] s[s]") || 5+'s'}</span>
                        </span>
                    </Col>

                    <Col xs={4}>
                        {incident?.creationDate &&
                            <div className={"d-flex"}>
                                <FormattedMessage id="maxwellV2.incident.list.created.on"/>
                                <span className={"pl-1"}>{moment(incident.creationDate).format(DATETIME_FORMAT)}</span>
                            </div>
                        }
                        {incident?.updateDate &&
                            <div className={"d-flex"}>
                                <FormattedMessage id="maxwellV2.incident.list.updated.on"/>
                                <span className={"pl-1"}>{moment(incident.updateDate).format(DATETIME_FORMAT)}</span>
                            </div>
                        }
                    </Col>

                    <Col xs={2}>{incident?.status && formattedStatus(incident)}</Col>

                    {incident?.status === "WAITING" && !incident?.comment ?
                        <Col xs={4}>
                            <FormattedMessage id="maxwellV2.incident.list.infos"/>
                        </Col> : <Col className="mb-2" xs={5}>{commentRender(incident.comment)}</Col>
                    }

                    {isWaitingIncident(incident) &&
                        <Col xs={1}>
                            <div className="d-flex justify-content-center">
                                <Button size={"sm"} color={"dark"} id="maxwellV2.incident.list.finalise.button.id"
                                        onClick={finalizeIncident(incident.actId)}>
                                    <FormattedMessage id="maxwellV2.incident.list.finalise.btn.label"/>
                                </Button>
                            </div>
                        </Col>
                    }
                </Row>
            )
        })
        return incidentsList
    }

    const renderSection = () => {
        const isUpdateAllowed = canCCUpdateCurrentCase && isAllowedAutorisations(authorizations, ["ADG_MAXWELL"])
        if (isMaxwellIncidentList && incidents?.length) {
            return renderIncidentsTable()
        } else if (!isMaxwellIncidentList && actDetail) {
            return <MaxwellSectionV2 name="MaxwellData" key="MaxwellDataSection"
                                     caseId={caseId}
                                     currentSelectedTheme={currentCase.themeSelected}
                                     themeQualificationCode={currentCase.currentCase?.themeQualification?.code}
                                     readOnly={!isUpdateAllowed}
                                     maxwellCaseData={actDetail?.maxwellAct?.data}
                                     attachments={actDetail?.maxwellAct?.attachments}
                                     incident={actDetail?.maxwellAct?.incident}
                                     callOrigin={EMaxwellCallOrigin.FROM_INCIDENTS_LIST}/>

        } else {
            return handleErrorMsg()
        }
    }

    return (
        <section className={"maxwell-section__wrapper my-2"}>
            {renderSection()}
        </section>
    )
}

export default IncidentsList