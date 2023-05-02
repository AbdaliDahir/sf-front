import * as React from "react";
import {FormGroup} from "reactstrap"
import Col from "reactstrap/lib/Col"
import Label from "reactstrap/lib/Label"
import {CaseDataProperty} from "../../../../../model/CaseDataProperty"
import CaseDataDate from "./CaseDataDate"
import CaseDataDateTime from "./CaseDataDateTime"
import CaseDataList from "./CaseDataList"
import CaseDataRadioBoolean from "./CaseDataRadioBoolean"
import CaseDataString from "./CaseDataString"
import RestitutionCaseDataBoolean from "./RestitutionCaseDataBoolean";

interface Props {
    data: CaseDataProperty
    index: number
    disabled?: boolean
    isDataAction?: boolean
    onChange?: (id: string, val: string, code?: string) => void
}

const CaseDataInput: React.FunctionComponent<Props> = (props: Props) => {
    const {data, index, disabled, onChange} = props

    const isExpectedValue = (values, value) => (value === props.data.expectedValue ? true : "Ce n'est pas la valeur attendu")

    return <FormGroup key={index}>
        <Col>
            <Label className={"col-form-label"} for={"date"}>
                {data.label}{data.required && <span className="text-danger">*</span> }
            </Label>
        </Col>
        <Col>
            <CustomInput data={data} id={data.id} disabled={disabled} onChange={onChange} requiredData={data.required} isDataAction={props.isDataAction} otherValidations={data.expectedValue && {expectedValue: isExpectedValue}}/>
        </Col>
    </FormGroup>
}

export default CaseDataInput;
export const CustomInput = (props) => {
    const {id, ...otherProps} = props
    switch (props.data.type) {
        case "DATE":
            return <CaseDataDate bsSize={"sm"} name={`data[${id}]`} {...otherProps}/>;
        case "DATETIME":
            return <CaseDataDateTime className={"form-control-sm"} name={`data[${id}]`} {...otherProps}/>;
        case "BOOLEAN":
            return props.disabled ? <RestitutionCaseDataBoolean value={props.data[id]}/> : <CaseDataRadioBoolean name={`data[${id}]`} {...otherProps}/>;
        case "LIST":
            return <CaseDataList name={`data[${id}]`} {...otherProps}/>;
        default:
            return <CaseDataString name={`data[${id}]`} {...otherProps}/>;
    }
}

