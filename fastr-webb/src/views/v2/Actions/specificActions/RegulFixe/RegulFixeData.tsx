import React, {useEffect, useState} from "react";
import CaseDataSectionV2 from "../../../Cases/CaseData/CaseDataSectionV2";
import ActionService from "../../../../../service/ActionService";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {AppState} from "../../../../../store";
import {NotificationManager} from "react-notifications";
import ActionRoutingInformationV2 from "../../components/ActionRoutingInformation";
import {Card, CardHeader, Row, Col} from "reactstrap";
import {setSpecificActionValidRoutingRule} from "../../../../../store/actions/v2/case/CaseActions";
import * as moment from "moment";
import {useDispatch} from "react-redux";
import {FormattedMessage} from "react-intl";

const RegulFixeData = (props) => {
    const {caseId, specificAction, blockActionValidation, setDisableActionValidation} = props
    const actionService: ActionService = new ActionService(true);
    const userActivityCode = useTypedSelector((state: AppState) => state.store.applicationInitialState.user?.activity?.code);
    const userSiteCode = useTypedSelector((state: AppState) => state.store.applicationInitialState.user?.site?.code);
    const actionAdditionalData = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.caseAction?.actionAdditionalData)

    const [regulFixeValidRoutingRules, setRegulFixeValidRoutingRules] =  useState();
    const dispatch = useDispatch()

   useEffect(() => {
       blockActionValidation(false)
       getRegulFixeValidRoutingRules()
    }, [actionAdditionalData])



    const getRegulFixeValidRoutingRules = async () => {
        const activityCode = userActivityCode ? userActivityCode : "";
        const siteCode = userSiteCode ? userSiteCode : "";
        const regulAmount = actionAdditionalData.find(d => d.code === 'MONTANT_TTC') ? actionAdditionalData.find(d => d.code === 'MONTANT_TTC').value : "";
        const bankRefund1 = actionAdditionalData.find(d => d.code === "REGUL_1_MODE_REGUL") ? actionAdditionalData.find(d => d.code === "REGUL_1_MODE_REGUL").value : "";
        const bankRefund2 = actionAdditionalData.find(d => d.code === "REGUL_2_MODE_REGUL") ? actionAdditionalData.find(d => d.code === "REGUL_2_MODE_REGUL").value : "";
        const bankRefund = bankRefund1 === 'REMBOURSEMENT' || bankRefund2 === 'REMBOURSEMENT';

        try {

            const regulFixeValidRoutingRules = await actionService.getCalculateRegulFixeRoutingRules(activityCode, siteCode, regulAmount, bankRefund);

            if(regulFixeValidRoutingRules) {

                if(!regulFixeValidRoutingRules?.actCode) {
                    const estimatedAssignmentDate = moment().utc(true).add(regulFixeValidRoutingRules.estimatedAssignmentDelay, 'days')
                    if (estimatedAssignmentDate) {
                        regulFixeValidRoutingRules.estimatedResolutionDateOfCase = estimatedAssignmentDate.toDate()
                    }
                    dispatch(setSpecificActionValidRoutingRule(caseId, regulFixeValidRoutingRules))
                } else {
                    dispatch(setSpecificActionValidRoutingRule(caseId, undefined))
                }

                setRegulFixeValidRoutingRules(regulFixeValidRoutingRules)
            }
        } catch (e) {
            const error = await e;
            setDisableActionValidation(true)
            NotificationManager.error(error.message, null, 0, blockActionValidation(true));
        }
    }

    return (
        <React.Fragment>
            {actionAdditionalData &&
                <div className="d-flex flex-row flex-wrap">
                    <CaseDataSectionV2 data={actionAdditionalData}
                                       specificAction={specificAction}
                                       onChange={props.handleChange}
                                       sectionClass={"theme-additional-data"}/>
                </div>
            }

            {regulFixeValidRoutingRules &&
                <Card className="">
                <CardHeader>
                    <section>
                        {regulFixeValidRoutingRules.actCode ?
                            <div>
                                <span><FormattedMessage id={"regul.fixe.data.next.step"}/> : <FormattedMessage id={"regul.fixe.data.launch.acte.regul"}/></span><span className="text-danger">*</span>
                            </div>
                            :  <div>
                                <span><FormattedMessage id={"regul.fixe.data.next.step"}/> : <FormattedMessage id={"regul.fixe.data.assign.to.team"}/></span><span className="text-danger">*</span>
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
            }

        </React.Fragment>
    )
}

export default RegulFixeData