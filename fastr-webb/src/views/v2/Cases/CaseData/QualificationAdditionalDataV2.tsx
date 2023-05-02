import React from "react";

import {GenericIncident} from "../../../../model/GenericIncident";
import CaseDataSectionV2 from "./CaseDataSectionV2"
import {useDispatch, useSelector} from "react-redux";
import {setAdditionalDataV2} from "../../../../store/actions/v2/case/CaseActions";
import {Case} from "../../../../model/Case";
import {AppState} from "../../../../store";
import {CaseState} from "../../../../store/reducers/v2/case/CasesPageReducerV2";
import "./QualificationAdditionalDataV2.scss"

interface Props {
    caseId,
    incidentToSelect?: GenericIncident,
    readOnly?: boolean
    onChange?: (formChange) => void
}

const QualificationAdditionalDataV2: React.FunctionComponent<Props> = (props: Props) => {
    const dispatch = useDispatch();
    const {caseId, readOnly} = props
    const casesList: Case = useSelector((state: AppState) => state.store.cases.casesList)
    const currentCaseState: CaseState = casesList ? casesList[caseId] : undefined
    const motifData = currentCaseState?.additionalData.filter((dat)=>dat.category==='MOTIF');
    const themeData = currentCaseState?.additionalData.filter((dat)=>dat.category==='THEME');

    const handleChange = (id: string, val: string) => {
        const additionalData = motifData.slice();
        additionalData.forEach((d) => {
            if (d.id === id) {
                d.value = val;
            }
        });
        if (additionalData) {
            let temp: any[] = []
            if (themeData) {
                temp = [...themeData!];
            }
            temp = [...temp, ...additionalData];
            dispatch(setAdditionalDataV2(caseId,temp))
        }
    };

    return (
        motifData?.length > 0 ?
            <CaseDataSectionV2 data={motifData} readOnly={readOnly}
                               onChange={handleChange} sectionClass={"qualification-additional-data"}/>
            : <React.Fragment/>

    )
}

export default QualificationAdditionalDataV2
