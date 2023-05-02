import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {Col, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {Status} from "../../../../model/Status";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {AppState} from "../../../../store";
import ActionStatus from "./ActionStatus";
import ActionService from "../../../../service/ActionService";
import {setActionConclusion, setActionStatus} from "../../../../store/actions/v2/case/CaseActions";
import {ActionProgressStatusRequestCLO} from "../../../../model/actions/ActionProgressStatusRequestCLO";
import {ActionConclusionStatusResponseCLO} from "../../../../model/actions/ActionConclusionStatusResponseCLO";

const ActionConclusion = (props) => {
    const {caseId, readOnly, actionData} = props;
    const actionService: ActionService = new ActionService(true);
    const actionStatus = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.caseAction?.actionStatus)
    const [actionConclusions, setActionConclusions] = useState();
    const [beforeselect, setBeforeselect] = useState();
    const userActivity = useTypedSelector((state: AppState) => state.store.applicationInitialState.user?.activity)
    const dispatch = useDispatch();
    const resetFlag = useRef(false)

    useEffect(() => {
        getConclusions()
    }, [caseId])

    const getConclusions = async () => {
        try {
            const progressRequest: ActionProgressStatusRequestCLO = {
                leafThemeCode: actionData?.themeQualification?.code,
                actionCode: actionData?.actionCode,
                activityCode: userActivity?.code
            }
            const actionConclusionsList: ActionConclusionStatusResponseCLO[] = await actionService.getActionConclusions(progressRequest)
            setActionConclusions(actionConclusionsList)
        } catch (e) {
            const error = await e;
            console.error(error)
        }
    }

    const handleActionStatus = (status: Status | '') => {
        dispatch(setActionStatus(caseId, status))
        resetFlag.current = true
    };

    const onChangeActionConclusion = (evt) => {
        const conclusionCode = evt.currentTarget.value
        const conclusion = {
            code: conclusionCode,
            label: actionConclusions.find(data => data.code === conclusionCode)?.label,
            automaticMonitoring: actionConclusions.find(data => data.code === conclusionCode)?.automaticMonitoring
        }
        dispatch(setActionConclusion(caseId, conclusion));
    };

    const filterActionConclusions = () => {
        if (actionConclusions) {
            return actionConclusions.filter(conclusion => conclusion.status === actionStatus).sort(function (a, b) {
                return a.label.trim().toLowerCase().localeCompare(b.label.trim().toLowerCase());
            });
        }
    }

    function getnewValue(resultConclusions: any) {
        if (resultConclusions[0].code && beforeselect !== resultConclusions[0].code) {
            setBeforeselect(resultConclusions[0].code);
        }
    }

    const retrieveActionConclusions = (): JSX.Element[] => {
        const resultConclusions: JSX.Element[] = [];
        if (readOnly) {
            if ((actionStatus === "RESOLVED" || actionStatus === "UNRESOLVED") && actionConclusions) {
                const filteredActionConclusions = filterActionConclusions();
                if (filteredActionConclusions && filteredActionConclusions?.length > 0) {
                    for (const conclusion of filteredActionConclusions) {
                        resultConclusions.push(<option key={conclusion.code}
                                                       value={conclusion.code}>{conclusion.label}</option>)
                    }
                }
                if (filteredActionConclusions?.length === 1) {
                    getnewValue(filteredActionConclusions);
                } else if (beforeselect) {
                    setBeforeselect(null);
                }
                if (filteredActionConclusions?.length === 0) {
                    resultConclusions.push(
                        <option key={"none"} disabled>
                            {translate.formatMessage({id: "cases.get.details.conclusions.none"})}
                        </option>
                    )                }
            } else {
                resultConclusions.push(
                    <option key={"none"} disabled>
                        {translate.formatMessage({id: "cases.get.details.conclusions.none"})}
                    </option>
                )
            }
        } else {
            resultConclusions.push(<option key={"none"}>
                {actionData?.processCurrentState?.conclusion?.label}
            </option>)
        }
        return resultConclusions;
    };


    return (
        <>
            <div className="action-modal__title font-weight-bold border-right-0 border-left-0">
                <i className={`icon-gradient icon-contract mr-2`}/>
                <FormattedMessage id={"cases.get.details.conclusion"}/>
            </div>
            <div className="action-modal__content">
                <Row>
                    <Col md={6}>
                        {/* <FormGroup> */}
                            <ActionStatus handleStatusChange={handleActionStatus}
                                        value={actionStatus}
                                        disabled={false}/>
                        {/* </FormGroup> */}
                    </Col>
                    <Col md={6}>
                        {/* <h6><Label className="col-form-label"><FormattedMessage
                            id="cases.create.conclusion"/><span
                            className="text-danger">*</span></Label>
                        </h6> */}
                        <FormSelectInput
                            forceDirty={true}
                            validations={{isRequired: ValidationUtils.notEmpty}}
                            name="actionProcessingConclusion" id="actionProcessingConclusion"
                            onChange={onChangeActionConclusion}
                            forcedValue={beforeselect}
                            className={"custom-select-sm mb-0"}
                            resetActionConclusionFlag={resetFlag}
                        >
                            <option key="default" value="" disabled selected/>
                            {retrieveActionConclusions()}
                        </FormSelectInput>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default ActionConclusion
