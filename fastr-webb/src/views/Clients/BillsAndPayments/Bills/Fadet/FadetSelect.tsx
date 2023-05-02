import React, {useState} from "react"
import {FormGroup} from "reactstrap";
import Label from "reactstrap/lib/Label";
import FormSelectInput from "../../../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../../../utils/ValidationUtils";
import Formsy from "formsy-react";

interface Props {
    initPhoneNumber?: string
    fadetPhoneNumbers?: string[]
    changeNumber?: (numb: string) => void
}
const FadetSelect = (props: Props) => {
    const [selectedValue, setSelectedValue] = useState(props.initPhoneNumber);

    const renderFadetPhoneNumbersList = () => {
        const temp: Array<JSX.Element> = [];
        props.fadetPhoneNumbers?.forEach(phoneNumber => {
            temp.push(
                <option
                    value={phoneNumber} key={phoneNumber}>{phoneNumber}</option>)
        })
        return temp
    }

    const renderfadetPhoneNumbersList = renderFadetPhoneNumbersList()
    const fadetPhoneNumbersLength = renderfadetPhoneNumbersList.length

    const handleOnChangeNumber = (e) => {
        const selectedValue = e.currentTarget.value;
        if(props.changeNumber) {
            props.changeNumber(selectedValue)
        }
        setSelectedValue(selectedValue)
    }

    return(
        <React.Fragment>
            {fadetPhoneNumbersLength ?
                <Formsy>
                    <FormGroup>
                        <Label for="dunningTrigger" className="font-weight-bold">N° de ligne :</Label>

                        <FormSelectInput name="fadet" id="fadet"
                                         validations={{isRequired: ValidationUtils.notEmpty}}
                                         value={selectedValue}
                                         onChange={handleOnChangeNumber}
                                         disabled={fadetPhoneNumbersLength <= 1}>
                            {renderfadetPhoneNumbersList}
                        </FormSelectInput>
                    </FormGroup>
                </Formsy>
                : <React.Fragment/>
            }
        </React.Fragment>
    )
}

export default FadetSelect;