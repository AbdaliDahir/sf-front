import React, {ChangeEvent, useState} from "react";
import 'moment/locale/fr';

import {
    FormGroup, Row
} from "reactstrap";
import Label from "reactstrap/lib/Label";
import Formsy from "formsy-react";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import ValidationUtils from "../../../../utils/ValidationUtils";


interface Props {
    changePeriod?: (selectedPeriod: string) => void
    changeType?: (selectedType: string) => void
}

const ChartHeader = (props : Props) => {
    const {changePeriod, changeType} = props;
    const [periodValue, setPeriodValue] = useState("3");
    const [typeValue, setTypeValue] = useState("Récurrente");

    //Period selection
    const periodOptionsList = ["3", "6"]
    const typeOptionsList = ["Récurrente", "Toutes"]

    const renderPeriodOptionsList = () => {
        const temp: Array<JSX.Element> = [];
        periodOptionsList.forEach(opt => {
            temp.push(
                <option
                    value={opt} key={opt}>{`${opt} mois`}</option>)
        })
        return temp
    }

    const renderTypeOptionsList = () => {
        const temp: Array<JSX.Element> = [];
        typeOptionsList.forEach(opt => {
            temp.push(
                <option
                    value={opt} key={opt}>{`${opt}`}</option>)
        })
        return temp
    }

    const handleOnPeriodChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedPeriod = event.currentTarget.value;
        setPeriodValue(selectedPeriod)
        if(changePeriod) {
            changePeriod(selectedPeriod)
        }
    }

    const handleOnTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedType = event.currentTarget.value;
        setTypeValue(selectedType)
        if(changeType) {
            changeType(selectedType)
        }
    }

    return <Row className="chartSelectContainer d-flex mb-2">
                <div className={"chartSelectBlock"}>
                    <Formsy>
                        <FormGroup className="chartSelectInput">
                            <Label for="analyseGraphByPeriod" className="font-weight-bold">Periode d'analyse :</Label>

                            <FormSelectInput name="analyseGraphByPeriod" id="analyseGraphByPeriod"
                                             validations={{isRequired: ValidationUtils.notEmpty}}
                                             value={periodValue}
                                             onChange={handleOnPeriodChange}
                                             disabled={false}>
                                {renderPeriodOptionsList()}
                            </FormSelectInput>
                        </FormGroup>
                    </Formsy>
                </div>
                <div className={"chartSelectBlock"}>
                    <Formsy>
                        <FormGroup className="chartSelectInput">
                            <Label for="analyseGraphByType" className="font-weight-bold">Type de facture :</Label>

                            <FormSelectInput name="analyseGraphByType" id="analyseGraphByType"
                                             validations={{isRequired: ValidationUtils.notEmpty}}
                                             value={typeValue}
                                             onChange={handleOnTypeChange}
                                             disabled={false}>
                                {renderTypeOptionsList()}
                            </FormSelectInput>
                        </FormGroup>
                    </Formsy>
                </div>
            </Row>
}

export default ChartHeader