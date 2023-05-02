import * as React from "react";
import {useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {Button} from "reactstrap";
import FormButtonGroupRadio from "../../../../components/Form/FormButtonGroupRadio";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {useDispatch} from "react-redux";
import {setProcessing} from "../../../../store/actions/CaseActions";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";


interface Props {
    value?: string
    handleStatusChange?: (status: 'RESOLVED' | 'UNRESOLVED' | '') => void,
    disabled?: boolean
    initialValue: string
    position? : ('left'|'center'|'right')
    className?: string
}

let currentSelectedValue: string | undefined = "";

const CaseStatusV2 = (props: Props) => {

    const dispatch = useDispatch()
    const handleStatus = (evt) => {
        currentSelectedValue = evt.currentTarget.value
        if (props.handleStatusChange) {
            props.handleStatusChange(evt.currentTarget.value);
        }
        dispatch(setProcessing(evt.currentTarget.value === "RESOLVED"))
    };

    useEffect(() => {
        handleStatus({currentTarget: {value: props.initialValue}})
    }, [props.initialValue])

    return (
        <div className={`d-flex justify-content-${props.position || 'center'} align-items-center ${props.className}`}>
            {/*<Label className="col-form-label font-weight-bold">Statut<span className="text-danger">*</span></Label>*/}
            <FormButtonGroupRadio name="status"
                                  label={translate.formatMessage({id: "input.validations.status"})}
                                  className={"mb-0"}
                                  validations={{isRequired: ValidationUtils.notEmpty}}
                                  id="status"
                                  value={props.value}
                                  onRadioBtnChange={handleStatus}
                                  disabled={props.disabled}>
                <Button size={"sm"} color={"primary"} outline={currentSelectedValue !== "RESOLVED"} id="resolved" value="RESOLVED" block
                        active={currentSelectedValue === "RESOLVED"}>
                    <FormattedMessage id={"RESOLVED"}/>
                </Button>
                <Button size={"sm"} color={"primary"} outline={currentSelectedValue !== "UNRESOLVED"} id="unresolved" value="UNRESOLVED" block
                        active={currentSelectedValue === "UNRESOLVED"}>
                    <span className="text-nowrap"><FormattedMessage id={"UNRESOLVED"}/></span>
                </Button>
            </FormButtonGroupRadio>
        </div>
    )
}


export default CaseStatusV2