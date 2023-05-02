import React, {useEffect, useState} from "react";
import ActionService from "../../../service/ActionService";
import {Action} from "../../../model/actions/Action";
import GenericCardToggleV2 from "../Cases/Components/Sections/GenericCardToggleV2";
import {Button, Card, CardBody, CardHeader, UncontrolledTooltip} from "reactstrap";
import actionWaiting from "../../../img/ihmV2/action-waiting-white.svg";
import {FormattedMessage} from "react-intl";
import moment from "moment";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {AppState} from "../../../store";
import ModalAction from "./components/ModalAction";
import {useDispatch} from "react-redux";
import {ActionMonitoringRequest} from "../../../model/ActionMonitoringRequest";
import {NotificationManager} from "react-notifications";
import {setActionslist} from "../../../store/actions/v2/case/CaseActions";
import ActionDetail from "../../Cases/View/Elements/ActionDetail";
import ActionDetailHistory from "../../Cases/View/Elements/ActionDetailHistory";

const ActionComponent = (props) => {
    const {caseId, isExpanded, fromActiveCases, checkInProgressActions, isOpened} = props
    const actionService: ActionService = new ActionService(true);
    const MOMENT_DATE_FORMAT = process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT;
    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
    const [actions, setActions] = useState()
    const [actionDataForModal, setActionDataForModal] = useState()
    const [isOpendActionModal, setIsOpendActionModal] = useState(false)
    const [modalType, setModalType] = useState()
    const userActivity = useTypedSelector((state: AppState) => state.store.applicationInitialState.user!.activity)
    const userLogin = useTypedSelector((state: AppState) => state.store.applicationInitialState.user!.login)
    const actionResourcesLength = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.currentCase.resources?.filter((res) => res.resourceType === "ACTION_FASTR"))?.length;
    const dispatch = useDispatch();
    const [showHistory, setShowHistory] = useState<boolean[]>([]);
    const authorizations = useTypedSelector(state => state.authorization.authorizations);
    const isProcessActionOnlyEligible: boolean = authorizations.indexOf("processActionOnly") > -1;

    useEffect(() => {
        getActions()
    }, [isOpened, actionResourcesLength])

    const getActions = async () => {
        try {
            const actionDatas: Array<Action> = await actionService.getInProgressAndResolvedUnresolvedActionsBy(caseId, userActivity.code)
            setActions(actionDatas);
            if (caseId && !fromActiveCases) {
                dispatch(setActionslist(caseId, actionDatas))
            }
            const showHistoryList: boolean[] = Array.from({length: actionDatas.length}, val => val = false);
            setShowHistory(showHistoryList)
            if (actionDatas?.length > 0) {
                forceOpenTreatmentModal(actionDatas);
            }
        } catch (e) {
            const error = await e;
            console.error(error)
        }
    }

    const areActionsActivitiesMatching = (actionStatus, assigneeActivity, assigneeLogin) => {
        const qualifiedActionsTest = actionStatus === 'QUALIFIED' && (assigneeActivity?.code === userActivity?.code)
        const onGoingActionsTest = actionStatus === 'ONGOING' && (assigneeActivity?.code === userActivity?.code) && (assigneeLogin === userLogin)
        return qualifiedActionsTest || onGoingActionsTest
    }

    const handleTraitement = (actionData) => {
        setModalType('ACTION_TRAITEMENT')
        setIsOpendActionModal(true)
        setActionDataForModal(actionData)
    }

    const forceOpenTreatmentModal = (actionDatas: Array<Action>) => {
        const elementFromLocalStorage = localStorage.getItem('INFOS_FOCUS_TREATMENT_ACTION_FROM_TRAY');
        if (elementFromLocalStorage) {
            const element = JSON.parse(elementFromLocalStorage);
            if (isProcessActionOnlyEligible && element?.actionId) {
                const action = actionDatas.filter(act => act.actionId === element.actionId)
                if (action?.length > 0) {
                    handleTraitement(action.pop())
                }
            }
        }
    }

    const handleMonitoringStart = async (actionData) => {
        try {
            const actionMonitoringRequest: ActionMonitoringRequest = {
                actionId: actionData.actionId,
                login: userLogin
            }
            const result: boolean = await actionService.monitoringStart(actionMonitoringRequest)
            if (result) {
                NotificationManager.success(translate.formatMessage({id: "cases.actions.save.automatic.follow.personal"}));
            } else {
                NotificationManager.error(translate.formatMessage({id: "cases.actions.save.automatic.follow.personal.error.message"}));
            }
            await getActions()
        } catch (e) {
            const error = await e;
            console.error(error)
            NotificationManager.error(translate.formatMessage({id: "cases.actions.save.automatic.follow.personal.error.message"}));
        }
    }

    const handleMonitoringStop = async (actionData) => {
        try {
            const result: boolean = await actionService.monitoringStop(actionData.actionId)
            if (result) {
                NotificationManager.success(translate.formatMessage({id: "cases.actions.stop.automatic.follow.personal"}));
            } else {
                NotificationManager.error(translate.formatMessage({id: "cases.actions.stop.automatic.follow.personal.error.message"}));
            }
            await getActions()
        } catch (e) {
            const error = await e;
            console.error(error)
            NotificationManager.error(translate.formatMessage({id: "cases.actions.stop.automatic.follow.personal.error.message"}));
        }
    }

    const handleAddInfos = (actionData) => {
        setModalType('ACTION_ADD_INFOS')
        setIsOpendActionModal(true)
        setActionDataForModal(actionData)
    }

    const handleCancel = (actionData) => {
        setModalType('ACTION_CANCEL')
        setIsOpendActionModal(true)
        setActionDataForModal(actionData)
    }

    const toggleActionModal = () => {
        setIsOpendActionModal(!isOpendActionModal)
    }

    const handleHistoryClick = (idx: number) => {
        if (showHistory) {
            const newShowHistory: boolean[] = showHistory.slice();
            newShowHistory[idx] = !showHistory[idx];
            setShowHistory(newShowHistory);
        }
    }

    const renderActionHeader = (actionData, index) => {
        const actionStatus = actionData?.processCurrentState?.status;
        const assigneeActivity = actionData?.processCurrentState?.assignee?.activity;
        const assigneeLogin = actionData?.processCurrentState?.assignee?.login;
        const assigneeMonitoringActivity = actionData?.monitoringCurrentState?.assignee?.activity
        const assigneeMonitoringLogin = actionData?.monitoringCurrentState?.assignee?.login
        const actionsAlerts = areActionsActivitiesMatching(actionStatus, assigneeActivity, assigneeLogin)

        return <section className='d-flex justify-content-between align-items-center'>
            <div className='d-flex align-items-center'>
                {actionsAlerts && (<>
                    <span id={"picto" + index} className="action-waiting mr-2"><img src={actionWaiting}
                                                                                    alt="action en attente"/></span>
                    <UncontrolledTooltip target={"picto" + index}>
                        <FormattedMessage id={"cases.actions.consult.can.process.action"}/>
                    </UncontrolledTooltip>
                </>)}
                <span className='mr-2'>{actionData?.actionLabel}</span>
                <span>N° {actionData?.actionId}</span>
            </div>
            <div className='d-flex justify-content-center align-items-center'>
                {fromActiveCases &&
                    <div>
                        <UncontrolledTooltip target={"creationDate" + index}>
                            <FormattedMessage id={"cases.actions.consult.created.on"}/>
                            <span>{moment(actionData?.creationDate).format(DATETIME_FORMAT)}</span>
                        </UncontrolledTooltip>

                        <span id={"creationDate" + index}>{actionData?.timeElapsedSinceCreationDate}</span>

                        <span className='action-separator ml-1'> | </span>

                    </div>
                }
                {!fromActiveCases && assigneeMonitoringActivity?.code === userActivity?.code && !assigneeMonitoringLogin &&
                    <section>
                        <span><FormattedMessage
                            id="cases.actions.traitement.boutons.monitoring.start.preText"/>{moment(actionData?.monitoringCurrentState.startDate).format(MOMENT_DATE_FORMAT)}</span>
                        <Button id="caseNavbar.scalingMode.transfer.button.id" className="ml-2 mr-2 btn-sm" color="dark"
                                onClick={() => handleMonitoringStart(actionData)}>
                            <FormattedMessage id="cases.actions.traitement.boutons.monitoring.start"/>
                        </Button>
                    </section>
                }
                {!fromActiveCases && assigneeMonitoringActivity?.code === userActivity?.code && assigneeMonitoringLogin && assigneeMonitoringLogin !== userLogin &&
                    <section>
                        <span><FormattedMessage
                            id="cases.actions.traitement.boutons.monitoring.resume.preText"/>{assigneeMonitoringLogin}</span>
                        <Button id="caseNavbar.scalingMode.transfer.button.id" className="ml-2 mr-2 btn-sm" color="dark"
                                onClick={() => handleMonitoringStart(actionData)}>
                            <FormattedMessage id="cases.actions.traitement.boutons.monitoring.resume"/>
                        </Button>
                    </section>
                }
                {!fromActiveCases && assigneeMonitoringLogin !== undefined && assigneeMonitoringLogin === userLogin && assigneeMonitoringActivity?.code === userActivity?.code &&
                    <section>
                        <span className="ml-2 mr-2"><FormattedMessage
                            id="cases.actions.traitement.boutons.monitoring.stop.preText"/></span>
                        {(actionData?.processCurrentState?.status === "RESOLVED" || actionData?.processCurrentState?.status === "UNRESOLVED") &&
                            <Button id="caseNavbar.scalingMode.transfer.button.id" className="ml-2 mr-2 btn-sm"
                                    color="dark"
                                    onClick={() => handleMonitoringStop(actionData)}>
                                <FormattedMessage id="cases.actions.traitement.boutons.monitoring.stop"/>
                            </Button>}
                    </section>
                }
                {!fromActiveCases && actionStatus === 'QUALIFIED' && (assigneeActivity?.code !== userActivity?.code) &&
                    <Button id="actionCancel" type="button" color="primary"
                            className="bg-primary ml-2 mr-2 btn-sm"
                            onClick={() => handleCancel(actionData)}
                            disabled={false}>
                        <FormattedMessage id="cases.actions.traitement.boutons.cancel"/>
                    </Button>
                }
                {!fromActiveCases && assigneeActivity?.code !== userActivity?.code && actionStatus != "RESOLVED" && actionStatus != "UNRESOLVED" &&
                    <Button id="actionAddInfo" type="button" color="primary"
                            className="bg-primary btn-sm"
                            onClick={() => handleAddInfos(actionData)}
                            disabled={false}>
                        <FormattedMessage id="cases.actions.traitement.boutons.infos"/>
                    </Button>
                }
                {!fromActiveCases && assigneeActivity?.code === userActivity?.code &&
                    <Button id="actionTraitement" type="button" color="primary"
                            className="bg-primary ml-2 btn-sm"
                            onClick={() => handleTraitement(actionData)}
                            disabled={false}>
                        <FormattedMessage id="cases.actions.traitement.boutons.traiter"/>
                    </Button>
                }
                <button type="button"
                        className="btn histo btn-link"
                        id="cases.actions.consult.historique"
                        onClick={() => handleHistoryClick(index)}
                        disabled={false}>
                    <FormattedMessage id="cases.actions.consult.historique"/>
                </button>
            </div>
        </section>
    }

    const renderActionContent = (actionData, index) => {
        return <section key={`${index}${actionData.updateDate}`}>
            <Card>
                <CardHeader className='pt-0 pb-0 border-bottom'>
                    {renderActionHeader(actionData, index)}
                </CardHeader>
                <CardBody style={{padding: 0}}>
                    <ActionDetail action={actionData}/>
                    {
                        showHistory[index] ?
                            <ActionDetailHistory action={actionData}/>
                            :
                            <></>
                    }
                </CardBody>
            </Card>
        </section>
    }

    const renderActions = () => {
        return <div>
            {actions.map((action, index) => {
                    return <div className='mb-8'>
                        {renderActionContent(action, index)}
                    </div>
                }
            )}
        </div>
    }

    const renderActionsSection = () => {
        const actionsAlerts = actions && actions.length > 0 && actions.filter(action => {
            const actionStatus = action?.processCurrentState?.status;
            const assigneeActivity = action?.processCurrentState?.assignee?.activity;
            const assigneeLogin = action?.processCurrentState?.assignee?.login;
            return areActionsActivitiesMatching(actionStatus, assigneeActivity, assigneeLogin)
        })

        if (actionsAlerts.length && checkInProgressActions) {
            checkInProgressActions(true)
        }

        return (
            <React.Fragment>
                <GenericCardToggleV2
                    icon={""}
                    caseId={caseId}
                    title={"cases.events.type.ACTIONS"}
                    isExpandable
                    isExpanded={isExpanded}
                    casePicto={"ACTION_PLAIN"}
                    alertPicto={actionsAlerts.length ? "ACTION_YELLOW" : ""}
                    alertType={"actionAlert"}
                    whiteArrow
                    cardClass={"selected-case-summary__card"}
                    cardBodyClass={"selected-case-summary__card-body"}
                    cardHeaderClass={"selected-case-summary__card-header-closed"}
                    onToggle={(value) => props.onSectionToggle("ACTION", value)}
                    fromActiveCases={fromActiveCases}>
                    {renderActions()}
                </GenericCardToggleV2>
                {!fromActiveCases &&
                    <ModalAction caseId={caseId}
                                 modalType={modalType}
                                 data={actionDataForModal}
                                 isOpen={isOpendActionModal}
                                 refreshActionList={getActions}
                                 onToggle={toggleActionModal}
                                 onCancel={props.onCancel}/>
                }
            </React.Fragment>
        )
    }

    return (
        <div>
            {actions && actions.length > 0 ?
                renderActionsSection()
                : <React.Fragment/>
            }
        </div>
    )
}

export default ActionComponent
