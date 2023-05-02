import React, {useEffect, useState} from 'react';
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {CaseDataProperty} from "../../../../model/CaseDataProperty";
import CaseDataSectionV2 from "../../Cases/CaseData/CaseDataSectionV2";
import ActionInfos from "./ActionInfos";
import ActionConclusion from "./ActionConclusion";
import CaseMediaV2 from "../../Cases/Components/CaseMediaV2";
import './ActionModalContent.scss'
import {
    setActionAdditionalDataV2,
    setActionBlockingError,
    setSpecificActionValidRoutingRule
} from "../../../../store/actions/v2/case/CaseActions";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {AppState} from "../../../../store";
import {FormattedMessage} from "react-intl";
import ActionComment from "./ActionComment";
import {DiagAnalysisRequestCLO} from "../../../../model/DiagAnalysisRequestCLO";
import {DiagAnalysisCLO} from "../../../../model/DiagAnalysisCLO";
import {NotificationManager} from "react-notifications";
import CaseService from "../../../../service/CaseService";
import * as moment from "moment";
import ActionService from "../../../../service/ActionService";
import {Card, CardHeader, Col, Row} from "reactstrap";
import ActionRoutingInformationV2 from "./ActionRoutingInformation";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {formatDate} from "../../../../utils/ActionUtils";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";

const ActionModalContent = (props) => {
    const {caseId, modalType, actionData} = props;
    const [regulFixeValidRoutingRules, setRegulFixeValidRoutingRules] = useState();
    const actionProgressStatus = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.caseAction?.actionProgressStatus)
    const caseService: CaseService = new CaseService(true)
    const actionService: ActionService = new ActionService(true);
    const dispatch = useDispatch();
    const siebelAccount = useTypedSelector((state: AppState) => state.store.client?.currentClient?.service?.siebelAccount)
    const billingAccountId = useTypedSelector((state: AppState) => state.store.client?.currentClient?.service?.billingAccount.id)
    const userLogin = useTypedSelector((state: AppState) => state.store.applicationInitialState.user?.login)
    const caseAction = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.caseAction)
    const actionAdditionalData = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.actionAdditionalData)
    const specificAction = actionData?.specificAction;
    const userActivityCode = useTypedSelector((state: AppState) => state.store.applicationInitialState.user?.activity?.code);
    const userSiteCode = useTypedSelector((state: AppState) => state.store.applicationInitialState.user?.site?.code);
    const actionStatus = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.caseAction?.actionStatus)
    const client: ClientContextSliceState = useTypedSelector(state => state.store.clientContext);

    const handleChange = (id: string, val: string) => {
        const additionalData = specificAction ? actionAdditionalData.slice() : actionData?.processCurrentState?.data.slice();
        additionalData.forEach((d) => {
            if (d.id === id) {
                d.value = val;
            }
        });
        if (additionalData) {
            dispatch(setActionAdditionalDataV2(caseId, additionalData))
        }
    }

    useEffect(() => {
        if (specificAction && modalType === "ACTION_TRAITEMENT") {
            launchDiagAnalysis()
        }
    }, [])

    useEffect(() => {
        if (specificAction && modalType === "ACTION_TRAITEMENT" && actionProgressStatus?.code === "TREATMENT_END" && actionStatus === "RESOLVED") {
            getRegulFixeValidRoutingRules()
        } else {
            setRegulFixeValidRoutingRules(undefined);
        }
    }, [actionStatus, actionProgressStatus?.code, actionAdditionalData])

    const getRegulFixeValidRoutingRules = async () => {
        const activityCode = userActivityCode ? userActivityCode : "";
        const siteCode = userSiteCode ? userSiteCode : "";
        const regulAmount = actionAdditionalData.find(d => d.code === 'MONTANT_TTC') ? actionAdditionalData.find(d => d.code === 'MONTANT_TTC').value : "";
        const bankRefund1 = actionAdditionalData.find(d => d.code === "REGUL_1_MODE_REGUL") ? actionAdditionalData.find(d => d.code === "REGUL_1_MODE_REGUL").value : "";
        const bankRefund2 = actionAdditionalData.find(d => d.code === "REGUL_2_MODE_REGUL") ? actionAdditionalData.find(d => d.code === "REGUL_2_MODE_REGUL").value : "";
        const bankRefund = bankRefund1 === 'REMBOURSEMENT' || bankRefund2 === 'REMBOURSEMENT';

        try {
            const routingRuleResult = await actionService.getCalculateRegulFixeRoutingRules(activityCode, siteCode, regulAmount, bankRefund);

            if (routingRuleResult) {

                if (!routingRuleResult?.actCode) {
                    const estimatedAssignmentDate = moment().utc(true).add(routingRuleResult.estimatedAssignmentDelay, 'days')
                    if (estimatedAssignmentDate) {
                        routingRuleResult.estimatedResolutionDateOfCase = estimatedAssignmentDate.toDate()
                    }
                    dispatch(setSpecificActionValidRoutingRule(caseId, routingRuleResult))
                } else {
                    dispatch(setSpecificActionValidRoutingRule(caseId, undefined))
                }

                setRegulFixeValidRoutingRules(routingRuleResult)
            }
        } catch (e) {
            const error = await e;
            NotificationManager.error(error.message, null, 0, blockActionValidation(true));
        }
    }


    const launchDiagAnalysis = async () => {
        try {
            const request: DiagAnalysisRequestCLO = {
                caseId,
                loginCC: userLogin,
                siebelCode: siebelAccount,
                billingAccountId,
                doNotApplyFilters: true,
                serviceId: client.serviceId!,
                actId: actionData.diagArbeo.actId
            }

            const diagAnalysis: DiagAnalysisCLO = await caseService.getDiagArbeoAnalysis(request)

            if (diagAnalysis) {
                if (diagAnalysis.success) {
                    if (diagAnalysis.data?.additionalData?.length > 0) {
                        dispatch(setActionAdditionalDataV2(caseId, diagAnalysis.data?.additionalData));
                    }
                } else {
                    const diagAnalysisErrors = diagAnalysis.errors ? Object.keys(diagAnalysis.errors) : []
                    const diagAnalysisErrorLabel = diagAnalysisErrors[0]
                    NotificationManager.error(translate.formatMessage({id: diagAnalysisErrorLabel}), null, 0, () => blockActionValidation(true));
                }
            }
        } catch (e) {
            const error = await e;
            console.error(error.message)
            NotificationManager.error(translate.formatMessage({id: "regul.fixe.data.analyse.error"}), null, 200000)
        }
    }


    const blockActionValidation = (bool) => {
        dispatch(setActionBlockingError(props.caseId, bool));
    }

    const translateActionDataValue = (value: string) => {
        if (value === "yes") {
            return translate.formatMessage({id: "global.dialog.yes"})
        } else if (value === "no") {
            return translate.formatMessage({id: "global.dialog.no"})
        }
        return value;
    }

    const renderActionAdditionalData = (dataArray: CaseDataProperty[], isSpecificAction: boolean) => {
        return <section className={"selected-case-summary__additional-data-container"}>
            {
                dataArray.map((data) => {
                    const value = data.type === "DATE" && isSpecificAction ? formatDate(data.value) : data.value;
                    return data.value ? <section className={"selected-case-summary__additional-data"}>
                        <span className={"selected-case-summary__additional-data-label"}>{data.label} : </span>
                        <span>{translateActionDataValue(value)}</span></section> : <React.Fragment/>
                })
            }
        </section>
    }

    const returnModalTitle = () => {
        let title;
        if (modalType === "ACTION_TRAITEMENT") {
            title = translate.formatMessage({id: "cases.actions.traitement.action"})
        } else if (modalType === "ACTION_ADD_INFOS") {
            title = translate.formatMessage({id: "cases.actions.traitement.add.infos"})
        } else {
            title = translate.formatMessage({id: "cases.actions.traitement.cancel.action"})
        }
        return title
    }

    const renderActionBreadcrumb = (tags: string[]) => {
        return <section className={"selected-case-summary__breadcrumb"}>
            {tags?.map((tag) => (
                <BreadcrumbItem key={tag}>
                    {tag}
                </BreadcrumbItem>)
            )}
        </section>
    }

    function themeAndInitialRequestRender() {
        return <div className='action-body__right col-md-8 d-flex flex-column'>
            <div className='mb-8 d-flex'>
                <span className='font-weight-bold mr-1'><FormattedMessage
                    id={"cases.actions.theme.header.title"}/> : </span>
                <span>{renderActionBreadcrumb(actionData?.themeQualification?.tags)}</span>
            </div>
            <div className='mb-8 field-br'>
                <span className='font-weight-bold mr-1'><FormattedMessage
                    id={"cases.actions.consult.request"}/> : </span>
                <span>{actionData?.initialRequest}</span>
            </div>
        </div>;
    }

    return (
        <div>
            {themeAndInitialRequestRender()}
            <div className="action-modal__title font-weight-bold">{returnModalTitle()}</div>
            {actionData?.processCurrentState?.data && modalType === "ACTION_TRAITEMENT" &&
                <div className="pt-2">
                    <CaseDataSectionV2
                        data={specificAction ? caseAction.actionAdditionalData : actionData?.processCurrentState?.data}
                        readOnly={false}
                        onChange={handleChange}
                        specificAction={specificAction}
                        sectionClass={"action-modal__additional-data"}/>
                </div>
            }
            <div className="action-modal__container">
                <div className="action-modal__content">
                    {actionData?.processCurrentState?.data && modalType !== "ACTION_TRAITEMENT" &&
                        <div className='mb-3 mt-3 field-br'>
                            <span className='font-weight-bold mr-1'><FormattedMessage id={"ADDITIONAL_DATA"}/> : </span>
                            {
                                actionData?.processCurrentState?.data && actionData?.processCurrentState?.data.length > 0 &&
                                renderActionAdditionalData(actionData?.processCurrentState?.data, actionData?.specificAction)
                            }
                        </div>
                    }
                    <ActionInfos caseId={caseId} actionData={actionData} readOnly={modalType !== "ACTION_TRAITEMENT"}/>
                </div>
                {actionProgressStatus?.code === "TREATMENT_END" &&
                    <ActionConclusion caseId={caseId} actionData={actionData} readOnly={true}/>
                }

                {modalType === "ACTION_TRAITEMENT" && specificAction && regulFixeValidRoutingRules &&
                    <div className="action-modal__content">
                        <Card className="">
                            <CardHeader>
                                <section>
                                    {regulFixeValidRoutingRules.actCode ?
                                        <div>
                                        <span><FormattedMessage id={"regul.fixe.data.next.step"}/> : <FormattedMessage
                                            id={"regul.fixe.data.launch.acte.regul"}/></span><span
                                            className="text-danger">*</span>
                                        </div>
                                        : <div>
                                        <span><FormattedMessage id={"regul.fixe.data.next.step"}/> : <FormattedMessage
                                            id={"regul.fixe.data.assign.to.team"}/></span><span
                                            className="text-danger">*</span>
                                        </div>
                                    }
                                </section>
                            </CardHeader>
                            <div className="mt-1 mb-1">
                                {regulFixeValidRoutingRules.actCode ?
                                    <Row className={"routing-information-V2 p-4"}>
                                        <Col>
                                            <FormattedMessage id={"regul.fixe.data.immediate.launch"}/>
                                        </Col>
                                    </Row>
                                    : <ActionRoutingInformationV2
                                        caseId={caseId}
                                        routingRule={regulFixeValidRoutingRules}/>
                                }
                            </div>
                        </Card>
                    </div>
                }
                <div className="action-modal__title font-weight-bold border-right-0 border-left-0">
                    <i className={`icon-gradient icon-user mr-2`}/>
                    <FormattedMessage id={"cases.create.contact"}/>
                </div>
                <div className="action-modal__content">
                    {caseId &&
                        <CaseMediaV2 caseId={caseId} isEditable={true} fromActionModal={true}/>
                    }
                    {/* <div className="action-modal__title font-weight-bold">
                        <span><FormattedMessage id={"cases.actions.traitement.comment"}/> </span>
                        <span className="text-danger">*</span>
                    </div> */}

                    <ActionComment caseId={caseId} readOnly={false}/>
                </div>
            </div>
            {/*  <!-- ./END BODY CONTAINER --> */}
        </div>
    )
}

export default ActionModalContent
