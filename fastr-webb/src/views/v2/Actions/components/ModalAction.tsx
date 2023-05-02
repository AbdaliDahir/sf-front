import React, {useRef, useState} from 'react';
import {Button, Card, CardBody, CardFooter, CardHeader, Modal, UncontrolledTooltip} from "reactstrap";
import actionWaiting from "../../../../img/ihmV2/action-waiting-white.svg";
import {FormattedMessage} from "react-intl";
import moment from "moment";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {AppState} from "../../../../store";
import './ModalAction.scss'
import {
    setActionAdditionalDataV2,
    setCurrentNoteV2,
    updateActionProgressStatus
} from "../../../../store/actions/v2/case/CaseActions";
import {useDispatch} from "react-redux";
import Formsy from "formsy-react";
import ActionModalContent from "./ActionModalContent";
import {ActionTreatmentRequest} from "../../../../model/actions/ActionTreatmentRequest";
import ActionService from "../../../../service/ActionService";
import {ActionProgressStatus} from "../../../../model/actions/ActionProgressStatus";
import {NotificationManager} from "react-notifications";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {CaseRoutingRule} from "../../../../model/CaseRoutingRule";
import {SpecificActDetails} from "../../../../model/actions/ActionRequestCLO";
import { catchChangedContact } from 'src/store/actions/v2/contact/ContactActions';

const ModalAction = (props) => {
    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
    const actionService: ActionService = new ActionService(true);
    const {caseId, isOpen, modalType, onToggle, data,refreshActionList} = props
    const refToFormsy: React.RefObject<Formsy> = useRef(null);
    const userActivity = useTypedSelector((state: AppState) => state.store.applicationInitialState.user!.activity)
    const userLogin = useTypedSelector((state: AppState) => state.store.applicationInitialState.user?.login)
    const userSite = useTypedSelector((state: AppState) => state.store.applicationInitialState.user!.site)
    const currentContact = useTypedSelector((state: AppState) => state.store.contact!.currentContact)
    const caseAction = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.caseAction)
    const actionAdditionalData = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.caseAction?.actionAdditionalData)
    const specificActionRoutingRule: CaseRoutingRule = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.specificActionRoutingRule)
    const user = useTypedSelector((state: AppState) => state.store.applicationInitialState?.user)
    const currentCase = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.currentCase)
    const currentContactState = useTypedSelector((state: AppState) => state.store.contact!.currentContact?.mediaChanged)
    const authorizations = useTypedSelector((state: AppState) => state.store.applicationInitialState.authorizations)
    
    const [isFormsyValid, setIsFormsyValid] = useState(false);
    const dispatch = useDispatch();

    const toggle = () => {
        onToggle()
    }

    const areActionsActivitiesMatching = (actionStatus, assigneeActivity, assigneeLogin) => {
        const qualifiedActionsTest = actionStatus === 'QUALIFIED' && (assigneeActivity?.code === userActivity?.code)
        const onGoingActionsTest = actionStatus === 'ONGOING' && (assigneeActivity?.code === userActivity?.code) && (assigneeLogin === userLogin)
        return qualifiedActionsTest || onGoingActionsTest
    }

    const renderActionHeader = (actionData) => {
        const actionStatus = actionData?.processCurrentState?.status;
        const assigneeActivity = actionData?.processCurrentState?.assignee?.activity;
        const assigneeLogin = actionData?.processCurrentState?.assignee?.login;
        const actionsAlerts = areActionsActivitiesMatching(actionStatus, assigneeActivity, assigneeLogin)
        return <section className='d-flex justify-content-between align-items-center'>
            <div className='d-flex align-items-center'>
                {actionsAlerts && modalType !== "ACTION_TRAITEMENT" &&
                    <span className="action-waiting mr-2"><img src={actionWaiting} alt="action en attente"/></span>
                }
                <span className='mr-2 font-weight-bold'>{actionData?.actionLabel}</span>
                <span className="font-weight-bold">N° {actionData?.actionId}</span>
            </div>
            <div className='d-flex justify-content-center align-items-center'>

                <div>
                    <UncontrolledTooltip target={"creationDate" + actionData?.actionId}>
                        <FormattedMessage id={"cases.actions.consult.created.on"}/>
                        <span>{moment(actionData?.creationDate).format(DATETIME_FORMAT)}</span>
                    </UncontrolledTooltip>

                    <span id={"creationDate" + actionData?.actionId}
                          className="font-weight-bold">{actionData?.timeElapsedSinceCreationDate}</span>
                   {/* <span className='action-separator ml-1'> | </span>*/}
                </div>
{/*                <button type="button"
                        className="btn histo btn-link"
                        id="cases.actions.consult.historique"
                        disabled={false}>
                    <FormattedMessage id="cases.actions.consult.historique"/>
                </button>*/}
            </div>
        </section>
    }

    const clearModalChanges = () => {
        dispatch(setActionAdditionalDataV2(props.caseId, []))
        dispatch(updateActionProgressStatus(caseId, undefined))
        dispatch(setCurrentNoteV2(caseId, ""))
    }

    const onFormsyValid = () => {
        setIsFormsyValid(true)
    }

    const onFormsyInValid = () => {
        setIsFormsyValid(false);
    }

    const onSubmit = async () => {
        const isSpecificActionWithActToCreate = data?.specificAction && (specificActionRoutingRule === undefined);
        if (isFormsyValid) {
            try {
                let actionTreatmentRequest: ActionTreatmentRequest;
                actionTreatmentRequest = {
                    actionCode: data.actionCode,
                    actionId: data.actionId,
                    activity: userActivity,
                    site: userSite,
                    contactId: currentContact!.contactId,
                    media: currentContact!.media
                };
                switch (modalType) {
                    case "ACTION_TRAITEMENT" :
                        await handleActionTreatment(actionTreatmentRequest)
                        NotificationManager.success(translate.formatMessage({id: "cases.actions.finished.success"}));
                        break;
                    case "ACTION_ADD_INFOS" :
                        await handleActionsTreatmentAddInfo(actionTreatmentRequest)
                        break;
                    case "ACTION_CANCEL" :
                        await handleActionsTreatmentCancel(actionTreatmentRequest)
                        NotificationManager.success(translate.formatMessage({id: "cases.actions.annulled.success"}));
                        break;
                }
                if(modalType !== "ACTION_TRAITEMENT" && modalType !== "ACTION_CANCEL") {
                    NotificationManager.success(translate.formatMessage({id: "cases.actions.update.success"}));
                }
                if (caseAction?.actionStatus === "RESOLVED" && isSpecificActionWithActToCreate) {
                    NotificationManager.success(translate.formatMessage({id: "cases.actions.update.create.act.success"}));
                }
            } catch (e) {
                const error = await e;
                console.error(error)
                if (caseAction?.actionStatus === "RESOLVED" && isSpecificActionWithActToCreate) {
                    NotificationManager.error(translate.formatMessage({id: "cases.actions.update.create.act.error"}) + error.message, null, 0);
                } else {
                    NotificationManager.error(translate.formatMessage({id: "cases.actions.update.error"}));
                }
            } finally {
                onToggle();
                if(refreshActionList){
                    refreshActionList();
                }
                if(authorizations.indexOf("processActionOnly") !== -1) {
                    setTimeout(() => {
                        props.onCancel()
                    }, 2000)
                }
            }
        }
    }

    function updateCommonsData(actionTreatmentRequest: ActionTreatmentRequest) {
        if (actionAdditionalData?.length > 0) {
            actionTreatmentRequest.additionalData = actionAdditionalData
        }

        actionTreatmentRequest.doNotResolveBeforeDate = caseAction?.doNotResolveActionBeforeDate
        actionTreatmentRequest.comment = caseAction.actionComment;
    }

    const handleActionTreatment = async (actionTreatmentRequest: ActionTreatmentRequest) => {
        updateCommonsData(actionTreatmentRequest);
        if (caseAction?.actionStatus === "RESOLVED" || caseAction?.actionStatus === "UNRESOLVED") {
            const progressStatus = {
                code : ActionProgressStatus.TREATMENT_END,
                label : "Fin de traitement"
            }
            actionTreatmentRequest.progressStatus = progressStatus
            actionTreatmentRequest.status = caseAction.actionStatus
            const actionConclusion = {
                code : caseAction.actionConclusion?.code,
                label : caseAction.actionConclusion?.label

            }
            actionTreatmentRequest.conclusion = actionConclusion
            actionTreatmentRequest.automaticMonitoring = caseAction.actionConclusion?.automaticMonitoring
        } else { // case status not changed
            actionTreatmentRequest.status = data.processCurrentState.status
            actionTreatmentRequest.progressStatus = caseAction.actionProgressStatus
        }

        if (caseAction?.actionStatus === "RESOLVED" && data.specificAction) {
            if (specificActionRoutingRule) { // assignation
                actionTreatmentRequest.actToCreate = false;
                actionTreatmentRequest.actionRoutingRule = specificActionRoutingRule;
            } else { // acte à créer
                const regul2MontantTtc = actionAdditionalData.find(d => d.code === "REGUL_2_MONTANT_TTC") ? actionAdditionalData.find(d => d.code === "REGUL_2_MONTANT_TTC").value : "";
                const regul2ModeRegul = actionAdditionalData.find(d => d.code === "REGUL_2_MODE_REGUL") ? actionAdditionalData.find(d => d.code === "REGUL_2_MODE_REGUL").value : "";
                const codesArr: string[] = []
                const items: any[] = []
                const temp: string[] = []
                let num = 1

                const actDetails: SpecificActDetails = {
                    refSiebel: currentCase?.siebelAccount,
                    login: user?.login,
                    positionLibelle: user?.position?.label,
                    positionCode: user?.position?.code,
                    modeCalcul: actionAdditionalData.find(d => d.code === "MODE_CALCUL").value,
                    categorie: actionAdditionalData.find(d => d.code === "CATEGORIE").value,
                    motif: actionAdditionalData.find(d => d.code === "MOTIF").value,
                    debutPeriode: actionAdditionalData.find(d => d.code === "DEBUT_PERIODE").value,
                    finPeriode: actionAdditionalData.find(d => d.code === "FIN_PERIODE").value,
                    montantTtc: actionAdditionalData.find(d => d.code === "MONTANT_TTC").value,
                    tva: actionAdditionalData.find(d => d.code === "TVA").value,
                    balanceEchue: actionAdditionalData.find(d => d.code === "BALANCE_ECHUE").value,
                    statutFact: actionAdditionalData.find(d => d.code === "STATUT_FACT").value,
                    regul1MontantTtc: actionAdditionalData.find(d => d.code === "REGUL_1_MONTANT_TTC").value,
                    regul1ModeRegul: actionAdditionalData.find(d => d.code === "REGUL_1_MODE_REGUL").value ? actionAdditionalData.find(d => d.code === "REGUL_1_MODE_REGUL").value : actionAdditionalData.find(d => d.code === "REGUL_1_MODE_REGUL").defaultValue,
                }

                actionAdditionalData.map(d => {
                    if (d.code.includes("ITEM_")) {
                        codesArr.push(d.code)
                    }
                })

                codesArr.forEach(item => {
                    if (item.startsWith('ITEM_' + num) && !temp.includes(('ITEM_' + num))) {
                        temp.push(('ITEM_' + num))
                        items.push({
                            libelle: actionAdditionalData.find(d => d.code === 'ITEM_' + num + '_LIBELLE').value,
                            code: actionAdditionalData.find(d => d.code === 'ITEM_' + num + '_CODE').value,
                            montantTtc: actionAdditionalData.find(d => d.code === 'ITEM_' + num + '_MONTANT_TTC').value,
                        })
                        num++;
                    }
                })

                if (items.length > 0) {
                    actDetails["items"] = items;
                }

                if (regul2MontantTtc) {
                    actDetails["regul2MontantTtc"] = regul2MontantTtc;
                }

                if (regul2ModeRegul) {
                    actDetails["regul2ModeRegul"] = regul2ModeRegul;
                }

                actionTreatmentRequest.actToCreate = true;
                actionTreatmentRequest.actDetails = actDetails
                actionTreatmentRequest.caseId = caseId
                actionTreatmentRequest.offerCategory = currentCase.offerCategory
                actionTreatmentRequest.serviceType = currentCase.serviceType
                actionTreatmentRequest.clientId = currentCase.clientId
                actionTreatmentRequest.serviceId = currentCase.serviceId
            }
        }
        await actionService.treatmentAutoAssign(actionTreatmentRequest);
        const action = await actionService.actionTreatment(actionTreatmentRequest);
        if (action?.monitoringHasJustBeenUpdated === true && action?.monitoringCurrentState?.assignee) {
            if (action.monitoringCurrentState.assignee?.activity?.code === user?.activity.code) {
                NotificationManager.success(translate.formatMessage({id: "cases.actions.save.automatic.follow.personal"}));
            } else {
                NotificationManager.success(translate.formatMessage({id: "cases.actions.save.automatic.follow"}));
            }
        }
        dispatch(catchChangedContact(!currentContactState));
    }

    const handleActionsTreatmentAddInfo = async (actionTreatmentRequest: ActionTreatmentRequest) => {
        updateCommonsData(actionTreatmentRequest);
        actionTreatmentRequest.status = data.processCurrentState.status;
        actionTreatmentRequest.progressStatus = data.processCurrentState.progressStatus;
        await actionService.actionTreatment(actionTreatmentRequest);
        dispatch(catchChangedContact(!currentContactState));
    }

    const handleActionsTreatmentCancel = async (actionTreatmentRequest: ActionTreatmentRequest) => {
        updateCommonsData(actionTreatmentRequest);
        await actionService.treatmentCancel(actionTreatmentRequest);
        dispatch(catchChangedContact(!currentContactState));
    }

    const handleCancel = () => {
        clearModalChanges()
        toggle()
    }

    return (
        <React.Fragment>
            <Modal isOpen={isOpen}
                   toggle={toggle}
                   size="lg"
                   style={{minWidth: '80%', width: '100%'}}
                   modalClassName="action-modal"
                   backdrop="static"
                   keyboard={false}
                   onClosed={clearModalChanges}>

                <Card>
                    <Formsy onValid={onFormsyValid} onInvalid={onFormsyInValid} onSubmit={onSubmit}
                            ref={refToFormsy}>
                        <CardHeader closeButton>
                            <div className="w-100 d-flex justify-content-end">
                                <span id="closeActionModal" className="cursor-pointer font-weight-bold font-size-l"
                                      onClick={toggle}>X</span>
                            </div>
                            {data && renderActionHeader(data)}
                        </CardHeader>
                        <CardBody>
                            {data && <ActionModalContent caseId={caseId}
                                                         modalType={modalType}
                                                         actionData={data}
                            />
                            }
                        </CardBody>
                        <CardFooter className="text-right">
                            <Button color="primary" className="m-1 btn-light" id="cancelAction"
                                    onClick={handleCancel}>ABANDONNER</Button>

                            <Button color="primary" type="submit" className="m-1" id={"submitActionAndStay"}
                                    disabled={!isFormsyValid}>{authorizations.indexOf("processActionOnly") !== -1 ? "ENREGISTRER L'ACTION & QUITTER DOSSIER" : "ENREGISTRER L'ACTION"}</Button>

                        </CardFooter>
                    </Formsy>
                </Card>

            </Modal>
        </React.Fragment>
    )
}

export default ModalAction
