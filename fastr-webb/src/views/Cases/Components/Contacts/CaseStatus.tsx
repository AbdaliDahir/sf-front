import * as React from "react";
import {useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {Button} from "reactstrap";
import FormGroup from "reactstrap/lib/FormGroup";
import FormButtonGroupRadio from "../../../../components/Form/FormButtonGroupRadio";
import {Status} from "../../../../model/Status";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {useDispatch} from "react-redux";
import {setProcessing} from "../../../../store/actions/CaseActions";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";

interface Props {
    value?: string
    handleStatusChange?: (status: 'RESOLVED' | 'UNRESOLVED' | '') => void,
    disabled?: boolean
    forceValue?: Status | ""
    active?: boolean | undefined,
    isHidden?: boolean | undefined,
}

const CaseStatus = (props: Props) => {

    const dispatch = useDispatch()

    const hasCallTransfer = useTypedSelector(state => state.casePage.hasCallTransfer)
    const isCallTransferStatusOK = useTypedSelector(state => state.casePage.isCallTransferStatusOK)

    const handleStatus = (evt) => {
        if (props.handleStatusChange) {
            props.handleStatusChange(evt.currentTarget.value);
        }
        dispatch(setProcessing(evt.currentTarget.value === "RESOLVED"))
    };

    useEffect(() => {
        dispatch(setProcessing(props.value === "RESOLVED"))
    }, [props.active])

    const resolvedActive = hasCallTransfer && isCallTransferStatusOK ? false : props.active ? props.active : props.value === "RESOLVED";
    const unresolvedActive = hasCallTransfer && isCallTransferStatusOK ? true : (props.active ? !props.active : props.value === "UNRESOLVED")

    return (
        <FormGroup>
            <FormButtonGroupRadio name="status"
                                  validations={props.isHidden ? {} : {isRequired: ValidationUtils.notEmpty}}
                                  id="status" value={props.value} onRadioBtnChange={handleStatus}
                                  disabled={props.disabled}
                                  longButtons>
                <Button size={"sm"} color={"primary"} outline={!resolvedActive} id="resolved" value="RESOLVED" block
                        active={resolvedActive}>
                    <FormattedMessage id={"RESOLVED"}/>
                </Button>
                <Button size={"sm"} color={"primary"} outline={!unresolvedActive} id="unresolved" value="UNRESOLVED" block
                        active={unresolvedActive}>
                    <span className="text-nowrap"><FormattedMessage id={"UNRESOLVED"}/></span>
                </Button>
            </FormButtonGroupRadio>
        </FormGroup>
    )
}

export default CaseStatus