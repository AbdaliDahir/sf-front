import {AdditionalDataType} from './AdditionalDataType';
import {CaseDataCategory} from "./CaseDataCategory"

export interface CaseDataProperty {

    code: string

    id: string

    qualificationCode: string

    label: string

    type: AdditionalDataType

    pattern: string

    listValues: Array<string>

    defaultValue?: string

    value: string

    category: CaseDataCategory

    expectedValue?: string

    order?: number

    required? : boolean

    displayable? : boolean

    editable? : boolean

    editOnlyByReceiver ?: boolean

}
