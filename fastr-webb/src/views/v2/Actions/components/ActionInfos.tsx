import React, {useEffect} from "react";
import {Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import Label from "reactstrap/lib/Label";
import {FormattedMessage} from "react-intl";
import FormDateInputV2 from "../../../../components/Form/Date/FormDateInputV2";
import ValidationUtils from "../../../../utils/ValidationUtils";
import ActionProgress from "./ActionProgress";
import {useDispatch} from "react-redux";
import {setDoNotResolveActionBeforeDate} from "../../../../store/actions/v2/case/CaseActions";
import "./DatepickerNPTA.scss";

const ActionInfos = (props) => {
    const {caseId, actionData} = props
    const date = actionData?.processCurrentState?.doNotResolveBeforeDate ? new Date( actionData?.processCurrentState?.doNotResolveBeforeDate) : null;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setDoNotResolveActionBeforeDate(caseId, actionData?.processCurrentState?.doNotResolveBeforeDate != null ? actionData?.processCurrentState?.doNotResolveBeforeDate : ""))
    }, [])

    const handleActionDateChange = (dateValue: Date) => {
        dispatch(setDoNotResolveActionBeforeDate(caseId, dateValue))
    }

    return (
        <Row>
            <ActionProgress caseId={props.caseId}
                            readOnly={props.readOnly}
                            actionData={actionData}/>
            <Col md={4}>
                    <span>
                        <Label>
                            <FormattedMessage
                                id="case.scaled.doNotResolveBeforeDate"/>
                        </Label>
                    </span>
                <div className="ml-2 mb-0">
                    <FormDateInputV2 peekNextMonth={true}
                                     className={"custom-select-sm"}
                                     minDate={new Date()}
                                     classNameFormGroup={"mb-0"}
                                     showMonthDropdown={true}
                                     showYearDropdown={true}
                                     disabled={props.readOnly}
                                     id="action.doNotResolveBeforeDate"
                                     name="action.doNotResolveBeforeDate"
                                     value={date}
                                     handleActionDateChange={handleActionDateChange}
                                     isClearable={!props.readOnly}
                                     validations={!props.readOnly ? {isFutureDateOrEmpty: ValidationUtils.isFutureDateOrEmpty} : {} }/>
                </div>
            </Col>
        </Row>
    )
}

export default ActionInfos