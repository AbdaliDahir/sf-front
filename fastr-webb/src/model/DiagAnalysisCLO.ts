import {AdditionalDataType} from "./AdditionalDataType";
import {CaseDataCategory} from "./CaseDataCategory";
import {DiagAnalysisErrorsKeys} from "./DiagAnalysisErrorsKeys";

export interface DiagAnalysisCLO {
    data: DiagAdditionalDatas
    success: boolean
    actCode: string
    actionLabel: string
    errors?: Map<DiagAnalysisErrorsKeys, string>
    actId?: string
}
interface DiagAdditionalDatas {
    additionalData : Array<DiagDataProperty>,
    arbeoDiagId: string
}

interface DiagDataProperty {
    id: string,
    label: string,
    code: string,
    type: AdditionalDataType,
    pattern?: string,
    listValues: Array<string>,
    value: string,
    category: CaseDataCategory,
    order?: number,
    defaultValue?: string,
    expectedValue?: string,
    required?: boolean,
    displayable?: boolean,
    editable?: boolean,
}