import * as React from "react";
import {AppState} from "../../../../store";
import {EMaxwellCallOrigin} from "../../../../model/maxwell/enums/EMaxwellCallOrigin";
import MaxwellSectionV2 from "./MaxwellSectionV2";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {CasesQualificationSettings} from "../../../../model/CasesQualificationSettings";
import {CaseCategory} from "../../../../model/CaseCategory";

const MaxwellCard = (props) =>  {
    const currentCaseCategory: CaseCategory = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.currentCase?.category)
    const themeSelected: CasesQualificationSettings[] = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.themeSelected)
    const isCurrentCaseScaled: CaseCategory = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.isCurrentCaseScaled)
    const isCurrentCaseCancelScaling: CaseCategory = useTypedSelector((state: AppState) => state.store.cases.casesList[props.caseId]?.isCurrentCaseCancelScaling)
    const condition = isCurrentCaseScaled && (currentCaseCategory === 'IMMEDIATE' || isCurrentCaseCancelScaling) && themeSelected && themeSelected.length > 0 && !!themeSelected[0].incident
        return  condition ? (
            <MaxwellSectionV2 name="MaxwellData" key="MaxwellDataSection"
                              caseId={props.caseId}
                              currentSelectedTheme={themeSelected}
                              themeQualificationCode={themeSelected[0].code}
                              readOnly={false}
                              callOrigin={EMaxwellCallOrigin.FROM_CASE}
                              setTitle={props.setTitle}
            />
        ) : <React.Fragment/>
}

export default MaxwellCard
