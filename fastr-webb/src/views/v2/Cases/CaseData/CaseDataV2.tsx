import * as React from "react";

import {CaseDataProperty} from "../../../../model/CaseDataProperty";
import {GenericIncident} from "../../../../model/GenericIncident";
import CaseDataSectionV2 from "./CaseDataSectionV2"
import {useDispatch, useSelector} from "react-redux";
import {setAdditionalDataV2} from "../../../../store/actions/v2/case/CaseActions";
import {Case} from "../../../../model/Case";
import {AppState} from "../../../../store";
import GenericCardToggleV2 from "../Components/Sections/GenericCardToggleV2";
import {CaseState} from "../../../../store/reducers/v2/case/CasesPageReducerV2";

interface Props {
    caseId,
    isExpandable,
    isExpanded,
    isEditable,
    data: CaseDataProperty[];
    incidentToSelect?: GenericIncident;
    readOnly?: boolean
    onChange?: (formChange) => void
}

const CaseDataV2: React.FunctionComponent<Props> = (props: Props) => {
    const dispatch = useDispatch();
    const {caseId, isExpandable, isExpanded, isEditable} = props
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
        if(additionalData){
            if(themeData){
                additionalData.push(...themeData);
            }
            dispatch(setAdditionalDataV2(caseId,additionalData))
        }
    };

    return (
        motifData?.length > 0 ?
            <GenericCardToggleV2 title={"cases.elements.additionnalData"} icon={"icon-contract"}
                                 isExpandable={isExpandable} isExpanded={isExpanded}>
                <CaseDataSectionV2 data={motifData} readOnly={!isEditable}
                                   onChange={handleChange}/>
            </GenericCardToggleV2>
            : <React.Fragment/>

    )
}

export default CaseDataV2