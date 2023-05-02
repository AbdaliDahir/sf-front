import React, {useEffect, useState} from "react";
import Label from "reactstrap/lib/Label";
import {FormattedMessage} from "react-intl";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {Col} from "reactstrap";
import {useDispatch} from "react-redux";
import {setActionConclusion, setActionStatus, updateActionProgressStatus} from "../../../../store/actions/v2/case/CaseActions";
import {AppState} from "../../../../store";
import ActionService from "../../../../service/ActionService";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {ActionProgressStatusRequestCLO} from "../../../../model/actions/ActionProgressStatusRequestCLO";
import {ActionProgressStatusResponseCLO} from "../../../../model/actions/ActionProgressStatusResponseCLO";
import {ActionProgressStatus} from "../../../../model/actions/ActionProgressStatus";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import { ActionConclusion } from "src/model/actions/ActionConclusion";

const ActionProgress = (props) => {
    const { caseId, actionData, readOnly } = props;
    const actionService: ActionService = new ActionService(true);
    const actionProgressStatus = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.caseAction?.actionProgressStatus)
    const userActivity = useTypedSelector((state: AppState) => state.store.applicationInitialState.user?.activity)
    
    const actionStatus = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.caseAction?.actionStatus)
    const actionConclusion = useTypedSelector((state: AppState) => state.store.cases.casesList[caseId]?.caseAction?.actionConclusion)
    const [listOfActionProgressStatus, setListOfActionProgressStatus] = useState();
    const dispatch = useDispatch();

    const emptyConclusion: ActionConclusion = {
        code: '',
        label: ''
    }
    
    useEffect(() => {
        getListOfActionProgressStatus()
    }, [])

    const getListOfActionProgressStatus = async () => {
        try {
            const progressRequest: ActionProgressStatusRequestCLO = {
                leafThemeCode : actionData?.themeQualification?.code,
                actionCode : actionData?.actionCode,
                activityCode : userActivity?.code
            }
            const actionProgressStatusList: ActionProgressStatusResponseCLO[] = await actionService.getActionProgressStatus(progressRequest)
            setListOfActionProgressStatus(actionProgressStatusList)
        } catch (e) {
            const error = await e;
            console.error(error)
        }
    }

    const getActionProgressStatusOptions = (): JSX.Element[] => {
        const actionProgressStatusOptions: JSX.Element[] = [];

        if(!readOnly) {
            if(listOfActionProgressStatus) {
                listOfActionProgressStatus
                    .sort((a, b) =>
                        a?.label.localeCompare(b?.label)
                    )
                    .forEach(progressStatus => {
                        actionProgressStatusOptions.push(
                            <option key={progressStatus?.code} value={progressStatus?.code}>
                                {progressStatus.label}
                            </option>
                        );
                    })

                actionProgressStatusOptions.push(<option key={"TREATMENT_END"} value={"TREATMENT_END"}>
                    {translate.formatMessage({id: ActionProgressStatus.TREATMENT_END})}
                </option>)
            } else {
                actionProgressStatusOptions.push(<option key={"none"}>
                    {translate.formatMessage({id: "cases.get.details.conclusions.none"})}
                </option>)
            }
        } else {
            actionProgressStatusOptions.push(<option key={"none"}>
                {actionData?.processCurrentState?.progressStatus?.label}
            </option>)
        }

        return actionProgressStatusOptions;

    };

    const handleActionProgressStatusChanged = (evt) => {
        const progressStatus = {
            code : evt.currentTarget.value,
            label: listOfActionProgressStatus.find(data => data.code === evt.currentTarget.value)?.label
        }
        dispatch(updateActionProgressStatus(caseId, progressStatus))

        if(progressStatus.code != "TREATMENT_END" && actionStatus != "" && actionConclusion != "") {
            dispatch(setActionStatus(caseId, ""));
            dispatch(setActionConclusion(caseId, emptyConclusion));
        }

    }


    return (
        <Col md={8}>
                <span>
                    <Label>
                        <FormattedMessage id="cases.edit.progress.list"/><span className="text-danger">*</span>
                    </Label>
                </span>
            <div className="flex-grow-1 ml-2">
                <FormSelectInput
                    className={"custom-select-sm"}
                    value={readOnly ? actionData?.processCurrentState?.progressStatus?.code : actionProgressStatus?.code}
                    name="action.progressStatus" id="action.progressStatus"
                    validations={readOnly ? {} : {isRequired: ValidationUtils.notEmpty}}
                    forceDirty={true}
                    onChange={handleActionProgressStatusChanged}
                    disabled={readOnly}>
                    <option key="default" value="" disabled selected/>
                    {
                        getActionProgressStatusOptions()
                    }
                </FormSelectInput>
            </div>
        </Col>
    )
}

export default ActionProgress
