import React, {useState} from "react";
import ActionThemeStep from "./components/ActionThemeStep";
import {Card, CardBody, CardHeader, Collapse} from "reactstrap";
import {FormattedMessage} from "react-intl";
import './ActionPage.scss'
import {useDispatch} from "react-redux";
import {
    notifyActionThemeSelectionActionV2,
    setActionAdditionalDataV2,
    setActionBlockingError,
    setActionCode,
    setActionComment,
    setActionDisableValidation,
    setActionLabel,
    setIsActionThemeNotSelected,
    setLastArbeoDiagDetails,
    setSpecificActionValidRoutingRule
} from "../../../store/actions/v2/case/CaseActions";
import Button from "reactstrap/lib/Button";
import CardFooter from "reactstrap/lib/CardFooter";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {AppState} from "../../../store";
import ActionRoutingInformationV2 from "./components/ActionRoutingInformation";
import CaseDataSectionV2 from "../Cases/CaseData/CaseDataSectionV2";
import Formsy from "formsy-react";
import ActionComment from "./components/ActionComment";
import {ActionRequestCLO, SpecificActDetails} from "../../../model/actions/ActionRequestCLO";
import {NotificationManager} from "react-notifications";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {Activity} from "../../../model/Activity";
import ActionService from "../../../service/ActionService";
import {CaseRoutingRule} from "../../../model/CaseRoutingRule";
import {Action} from "../../../model/actions/Action";
import RegulFixeData from "./specificActions/RegulFixe/RegulFixeData";
import {DiagArbeo} from "../../../model/actions/DiagArbeo";

const ActionPage = (props) => {
    const actionService: ActionService = new ActionService(true);
    const [estimatedAssignmentDateStr, setEstimatedAssignmentDateStr] = useState()
    const [themeOutput, setThemeOutput] = useState()
    const [isThemeExpanded, setIsThemeExpanded] = useState(true)
    const currentCase = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.currentCase)
    const actionValidRoutingRule: CaseRoutingRule = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.actionValidRoutingRule)
    const specificActionRoutingRule: CaseRoutingRule = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.specificActionRoutingRule)
    const isActionThemeSelected = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.isActionThemeSelected)
    const actionThemeAdditionalData = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.actionAdditionalData)
    const actionThemeSelected = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.actionThemeSelected)
    const actionComment = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.actionComment)
    const actionBlockingError = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.actionBlockingError)
    const actionDisableValidation = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.actionDisableValidation)
    const lastArbeoDiagDetails = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.lastArbeoDiagDetails)
    const userActivity: Activity | undefined = useTypedSelector((state: AppState) => state.store.applicationInitialState?.user?.activity)
    const user = useTypedSelector((state: AppState) => state.store.applicationInitialState?.user)
    const currentContactId: string | undefined = useTypedSelector((state: AppState) => state.store.contact?.currentContact?.contactId)

    const dispatch = useDispatch()

    const displayActionThemeOutput = (elements: JSX.Element[]) => {
        setThemeOutput(elements)
    }

    const toggleActionTheme = () => {
        if (!isThemeExpanded) {
            clearAll()
        }
        setIsThemeExpanded(!isThemeExpanded)
    }

    const cancelAction = () => {
        clearAll()
        props.closeGrid()
    }

    const getEstimatedAssignmentDate = (date: Date) => {
        setEstimatedAssignmentDateStr(date);
    }

    const clearAll = () => {
        blockActionValidation(false)
        setDisableActionValidation(false)
        if (!props.specificAction) {
            setThemeOutput([])
            dispatch(notifyActionThemeSelectionActionV2(props.caseId))
            dispatch(setIsActionThemeNotSelected(props.caseId))
        }
        if (props.specificAction) {
            dispatch(setSpecificActionValidRoutingRule(props.caseId, []))
            dispatch(setLastArbeoDiagDetails(props.caseId, undefined))
            dispatch(setActionLabel(props.caseId, ''))
        }
        dispatch(setActionAdditionalDataV2(props.caseId, []))
        dispatch(setActionComment(props.caseId, ''))
        dispatch(setActionCode(props.caseId, ''));
    }

    const blockActionValidation = (bool) => {
        dispatch(setActionBlockingError(props.caseId, bool));
    }

    const setDisableActionValidation = (bool) => {
        dispatch(setActionDisableValidation(props.caseId, bool));
    }

    const validateAction = async () => {
        const specificActionEstimatedAssignmentDate = specificActionRoutingRule ? specificActionRoutingRule.estimatedResolutionDateOfCase : undefined
        const isSpecificActionWithActToCreate = props.specificAction && !specificActionRoutingRule;
        try {
            const actionRequest: ActionRequestCLO = {
                actionCode: props.actionThemeType,
                actionLabel: props.actionLabel,
                caseId: props.caseId,
                offerCategory: currentCase.offerCategory,
                serviceType: currentCase.serviceType,
                clientId: currentCase.clientId,
                serviceId: currentCase.serviceId,
                siebelAccount: currentCase.siebelAccount,
                themeQualification: actionThemeSelected ? actionThemeSelected[0] : undefined,
                comment: actionComment,
                additionalData: actionThemeAdditionalData,
                selectedActivity: userActivity,
                contactId: currentContactId,
                estimatedAssignmentDate: !props.specificAction ? estimatedAssignmentDateStr : specificActionEstimatedAssignmentDate,
                actionRoutingRule: actionValidRoutingRule
            }

            if (props.specificAction) {
                const diagArbeo: DiagArbeo = {
                    diagId: lastArbeoDiagDetails.arbeoDiagId,
                    actId: lastArbeoDiagDetails.actId
                }
                actionRequest.diagArbeo = diagArbeo;
                if (specificActionRoutingRule) { // assignation
                    actionRequest.actToCreate = false;
                    actionRequest.actionRoutingRule = specificActionRoutingRule;
                } else { // acte à créer
                    const regul2MontantTtc = actionThemeAdditionalData.find(d => d.code === "REGUL_2_MONTANT_TTC") ? actionThemeAdditionalData.find(d => d.code === "REGUL_2_MONTANT_TTC").value : "";
                    const regul2ModeRegul = actionThemeAdditionalData.find(d => d.code === "REGUL_2_MODE_REGUL") ? actionThemeAdditionalData.find(d => d.code === "REGUL_2_MODE_REGUL").value : "";
                    const codesArr: string[] = []
                    const items: any[] = []
                    const temp: string[] = []
                    let num = 1

                    const actDetails: SpecificActDetails = {
                        refSiebel: currentCase?.siebelAccount,
                        login: user?.login,
                        positionLibelle: user?.position?.label,
                        positionCode: user?.position?.code,
                        modeCalcul: actionThemeAdditionalData.find(d => d.code === "MODE_CALCUL").value,
                        categorie: actionThemeAdditionalData.find(d => d.code === "CATEGORIE").value,
                        motif: actionThemeAdditionalData.find(d => d.code === "MOTIF").value,
                        debutPeriode: actionThemeAdditionalData.find(d => d.code === "DEBUT_PERIODE").value,
                        finPeriode: actionThemeAdditionalData.find(d => d.code === "FIN_PERIODE").value,
                        montantTtc: actionThemeAdditionalData.find(d => d.code === "MONTANT_TTC").value,
                        tva: actionThemeAdditionalData.find(d => d.code === "TVA").value,
                        balanceEchue: actionThemeAdditionalData.find(d => d.code === "BALANCE_ECHUE").value,
                        statutFact: actionThemeAdditionalData.find(d => d.code === "STATUT_FACT").value,
                        regul1MontantTtc: actionThemeAdditionalData.find(d => d.code === "REGUL_1_MONTANT_TTC").value,
                        regul1ModeRegul: actionThemeAdditionalData.find(d => d.code === "REGUL_1_MODE_REGUL").value ? actionThemeAdditionalData.find(d => d.code === "REGUL_1_MODE_REGUL").value : actionThemeAdditionalData.find(d => d.code === "REGUL_1_MODE_REGUL").defaultValue,
                    }

                    actionThemeAdditionalData.map(d => {
                        if (d.code.includes("ITEM_")) {
                            codesArr.push(d.code)
                        }
                    })

                    codesArr.forEach(item => {
                        if (item.startsWith('ITEM_' + num) && !temp.includes(('ITEM_' + num))) {
                            temp.push(('ITEM_' + num))
                            items.push({
                                libelle: actionThemeAdditionalData.find(d => d.code === 'ITEM_' + num + '_LIBELLE').value,
                                code: actionThemeAdditionalData.find(d => d.code === 'ITEM_' + num + '_CODE').value,
                                montantTtc: actionThemeAdditionalData.find(d => d.code === 'ITEM_' + num + '_MONTANT_TTC').value,
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

                    actionRequest.actToCreate = true;
                    actionRequest.actDetails = actDetails
                }
            }

            const action: Action = await actionService.saveAction(actionRequest)

            const routingRule = !props.specificAction ? actionValidRoutingRule : specificActionRoutingRule;
            if (action) {
                if (action.processCurrentState?.status === "QUALIFIED") {
                    const qualifiedSuccessMsg = <div>
                        <FormattedMessage id="cases.actions.save.success.QUALIFIED"/>
                        <span>{routingRule.receiverActivity?.label}</span>
                    </div>
                    NotificationManager.success(qualifiedSuccessMsg);

                } else if(action.processCurrentState?.status === "ONGOING") {
                    NotificationManager.success(translate.formatMessage({id: "cases.actions.save.success.ONGOING"}));
                } else if((action.processCurrentState?.status === "RESOLVED" || action.processCurrentState?.status === "UNRESOLVED") && isSpecificActionWithActToCreate) {
                    NotificationManager.success(translate.formatMessage({id: "cases.actions.save.success.RESOLVED"}));
                }

                if (action.monitoringCurrentState?.assignee) {
                    if (action.monitoringCurrentState.assignee?.activity?.code === user?.activity.code) {
                        NotificationManager.success(translate.formatMessage({id: "cases.actions.save.automatic.follow.personal"}));
                    } else {
                        NotificationManager.success(translate.formatMessage({id: "cases.actions.save.automatic.follow"}));
                    }
                }
            }
        } catch (e) {
            const error = await e;
            console.error(error)
            if (isSpecificActionWithActToCreate) {
                NotificationManager.error(translate.formatMessage({id: "cases.actions.update.create.act.error"}) + error.message, null, 0);
            } else {
                NotificationManager.error(translate.formatMessage({id: "cases.actions.save.error"}));
            }
        } finally {
            if (props.closeGrid) {
                clearAll()
                props.closeGrid(false)
            }
        }
    }

    const handleChange = (id: string, val: string, code?: string) => {
        const actionAdditionalData = actionThemeAdditionalData.slice();
        actionAdditionalData.forEach((d) => {
            if (d.id === id || d.code === code) {
                d.value = val;
            }
        });
        if (actionAdditionalData) {
            dispatch(setActionAdditionalDataV2(props.caseId, actionAdditionalData))
        }
    };

    const renderGenericActionContent = () => {
        return <React.Fragment>
            <CardHeader onClick={toggleActionTheme} className={"action-theme-selection-v2__card-header"}>
                <div className="d-flex align-items-center">
                    <div className="mr-2">
                        <FormattedMessage id={"cases.actions.theme.header.title"}/>
                    </div>
                    <div>{themeOutput?.length > 0 && themeOutput}</div>
                </div>
                <i className={`icon icon-black float-right  ${isThemeExpanded ? 'icon-up' : 'icon-down'}`}/>
            </CardHeader>
            <Collapse isOpen={isThemeExpanded}>
                <ActionThemeStep name="actions.themeQualification"
                                 displayOutput={displayActionThemeOutput}
                                 shouldDisplay={true}
                                 toggleCard={toggleActionTheme}
                                 isThemeExpanded={isThemeExpanded}
                                 actionThemeType={props.actionThemeType}
                                 estimatedAssignmentDate={getEstimatedAssignmentDate}
                                 caseId={props.caseId}
                                 setDisableActionValidation={setDisableActionValidation}
                                 blockActionValidation={blockActionValidation}/>
            </Collapse>
            <ActionRoutingInformationV2
                caseId={props.caseId}
                routingRule={actionValidRoutingRule}/>
            {isActionThemeSelected && actionThemeAdditionalData &&
                <CaseDataSectionV2 data={actionThemeAdditionalData}
                                   readOnly={false}
                                   onChange={handleChange}
                                   sectionClass={"theme-additional-data"}
                                   specificAction={false}
                                   caseId={props.caseId}
                                   propreType={"action"}
                                   />
            }
        </React.Fragment>
    }

    const renderSpecificActionContent = () => {
        if (actionThemeAdditionalData.length > 0) {
            return <RegulFixeData caseId={props.caseId}
                                  handleChange={handleChange}
                                  specificAction={props.specificAction}
                                  blockActionValidation={blockActionValidation}
                                  setDisableActionValidation={setDisableActionValidation}/>
        } else {
            return <React.Fragment/>
        }
    }
    return (
        <div className="action_page">
            <Formsy onSubmit={validateAction}
                    onValid={() => setDisableActionValidation(false)}
                    onInvalid={() => setDisableActionValidation(true)}>
                <Card className="action-theme-selection">
                    {props.specificAction ?
                        renderSpecificActionContent()
                        : renderGenericActionContent()
                    }
                    <Card className="">
                        <CardHeader>
                            <section>
                                {/*<i className="icon-gradient icon-document mr-2"></i>*/}
                                <span>Commentaire</span><span className="text-danger">*</span>
                            </section>
                        </CardHeader>
                        <CardBody className="action-body-padding">
                            <ActionComment caseId={props.caseId} readOnly={false}/>
                        </CardBody>
                    </Card>
                    <CardFooter className="text-right action-footer-padding">
                        <Button size="sm" color="primary" className="m-1" id="cancelADG"
                                onClick={cancelAction}>{translate.formatMessage({id: "act.action.cancel"})}</Button>
                        {!actionBlockingError &&
                            <Button size="sm" color="primary" type="submit" className="m-1" id={"submitADG"}
                                    disabled={(!props.specificAction && !isActionThemeSelected) || actionDisableValidation}>{translate.formatMessage({id: "act.action.validate"})}</Button>
                        }
                    </CardFooter>
                </Card>
            </Formsy>
        </div>)
}

export default ActionPage
