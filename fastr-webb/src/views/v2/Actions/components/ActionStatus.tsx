import * as React from "react";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "reactstrap";
import FormButtonGroupRadio from "../../../../components/Form/FormButtonGroupRadio";
import ValidationUtils from "../../../../utils/ValidationUtils";

interface Props {
    value?: string
    handleStatusChange?: (status: 'RESOLVED' | 'UNRESOLVED' | '') => void,
    disabled?: boolean
}

let currentSelectedValue: string | undefined = "";

const ActionStatus = (props: Props) => {

    const handleStatus = (evt) => {
        currentSelectedValue = evt.currentTarget.value
        if (props.handleStatusChange) {
            props.handleStatusChange(evt.currentTarget.value);
        }
    };

    useEffect(() => {
        handleStatus({ currentTarget: { value: props.value } })
    }, [props.value])

    return (
        <React.Fragment>
            {/* <h6><Label className="col-form-label">Statut</Label><span className="text-danger">*</span></h6> */}
            <FormButtonGroupRadio name="status"
                validations={{ isRequired: ValidationUtils.notEmpty }}
                id="status"
                value={props.value}
                onRadioBtnChange={handleStatus}
                disabled={props.disabled}>
                <Button size={"sm"} color={"primary"} outline={!(currentSelectedValue == "RESOLVED")} id="resolved" value="RESOLVED" block
                    active={currentSelectedValue == "RESOLVED"}>
                    <FormattedMessage id={"action.accepted"} />
                </Button>
                <Button size={"sm"} color={"primary"} outline={!(currentSelectedValue == "UNRESOLVED")} id="unresolved" value="UNRESOLVED" block
                    active={currentSelectedValue == "UNRESOLVED"}>
                    <FormattedMessage id={"action.refused"} />
                </Button>
            </FormButtonGroupRadio>
        </React.Fragment>
    )
}

export default ActionStatus
