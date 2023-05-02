import * as React from "react";
import {FormGroup, Label} from "reactstrap"
import Col from "reactstrap/lib/Col"
import {GingerParameter} from "../../../../../model/acts/send-communication/GingerTemplateModel"
import {PreviewParameters} from "../../../../../model/acts/send-communication/SendCommunicationRequestDTO"
import Input from "./ParamFormInput"

// TODO a typer
interface FormProps {
    parameters?: Array<GingerParameter>
    onParamChange
    onDateParamChange
    onFocus
    setIsValidForm
    form?: PreviewParameters
}

const ParamForm: React.FunctionComponent<FormProps> = (props: FormProps) => {
    const manualParams = props.parameters ? props.parameters.filter(param => !param.auto) : []
    const initialValidArr = manualParams.map(
        param => !param.mandatory
    )
    const [validArr, setValidArr] = React.useState<Array<boolean>>(initialValidArr.length ? initialValidArr : [true])


    const updateValidArray = (index) => ((isValid) => {
            if (validArr && validArr[index] !== isValid) {
                const newValidArr = [...validArr]
                newValidArr[index] = isValid
                setValidArr(newValidArr)
            }
        }
    )

    React.useEffect(() => {
        const isFormValid = validArr && validArr.reduce((accumulator, currentValue) => accumulator && currentValue)
        props.setIsValidForm(isFormValid)
    }, [validArr])

    const listInputs: Array<JSX.Element> =
        manualParams.map((param, index) =>
            <FormGroup key={param.name}>
                <Col>
                    <h6>
                        <Label className={"col-form-label"} for={"date"}>
                            {param.name}{param.mandatory && <span className="text-danger">*</span>}
                        </Label>
                    </h6>
                </Col>
                <Col>
                    <Input size="sm" param={param} index={index} updateValidArray={updateValidArray}
                           form={props.form ? props.form : []} {...props}/>
                </Col>
            </FormGroup>
        )

    return (
        <div className="params ml-lg-5">
            <h5>Saisie des paramètres</h5>
            {listInputs}
        </div>
    )

}


export default ParamForm;
