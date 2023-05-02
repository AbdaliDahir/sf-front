import * as React from "react";

import {CaseDataProperty} from "../../../../model/CaseDataProperty";
import {GenericIncident} from "../../../../model/GenericIncident";
import {FormChanges} from "../../View/ViewCasePage"
import CaseDataSection from "./CaseDataSection"
import MaxwellSection from "./Maxwell/MaxwellSection"


interface Props {
    data: CaseDataProperty[];
    incidentToSelect?: GenericIncident;
    readOnly?: boolean
    onChange?: (formChange) => void
}


const CaseData: React.FunctionComponent<Props> = (props: Props) => {
    const {data, readOnly, onChange} = props
    const handleChange = (id: string, val: string) => {
        const additionalData = props.data.slice();
        additionalData.forEach((d) => {
            if (d.id === id) {
                d.value = val;
            }
        });
        const formChanges: FormChanges = {
            data: additionalData
        };
        if (onChange) {
            onChange(formChanges)
        }

    };

    const isMaxwell = caseDataProps => caseDataProps.category === "MAXWELL"
    const maxwellCaseData = data.filter(isMaxwell)

    if (maxwellCaseData.length) {
        const motifCaseData = data.filter(c => !isMaxwell(c))
        return (
            <React.Fragment>
                <CaseDataSection key="MotifDataSection" data={motifCaseData} readOnly={readOnly}
                                 onChange={handleChange}/>
                <MaxwellSection name="MaxwellData" key="MaxwellDataSection" data={maxwellCaseData} readOnly={readOnly}
                                onChange={handleChange}/>
            </React.Fragment>
        )
    } else {
        return (
            <CaseDataSection data={data} readOnly={readOnly}
                             onChange={handleChange}/>
        )
    }
}

export default CaseData