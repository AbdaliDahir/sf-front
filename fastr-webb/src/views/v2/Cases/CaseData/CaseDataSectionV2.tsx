import * as React from "react";
import {Col, Row} from "reactstrap"
import { useTypedSelector } from "src/components/Store/useTypedSelector";
import {CaseDataProperty} from "../../../../model/CaseDataProperty"
import CaseDataInput from "../../../Cases/Components/CaseData/Fields/CaseDataInput";
import FlatAdditionnalData from "../../../Cases/Components/CaseData/Fields/FlatAdditionnalData";


interface Props {
    data: CaseDataProperty[]
    readOnly?: boolean
    onChange?: (id: string, val: string, code?: string) => void
    sectionClass?: string
    specificAction?: boolean
    caseId ?: any
    propreType ?: string
}

const CaseDataSectionV2: React.FunctionComponent<Props> = (props: Props) => {
    const {data, readOnly, onChange, sectionClass, specificAction, caseId, propreType} = props;
    const userActivity: any = useTypedSelector(state => state.store.applicationInitialState.user?.activity);
    let receiverActivity: any;
    if(caseId && propreType) {
        receiverActivity = useTypedSelector(state => propreType == "action" ? state.store.cases.casesList[caseId]?.caseAction?.actionValidRoutingRule?.receiverActivity : state.store.cases.casesList[caseId]?.validRoutingRule?.receiverActivity);
    }
    
    const isDataAction = specificAction

    if (data && !data.length) {
        return null
    }

    const result = data.map((element, i) => {
        if(receiverActivity && userActivity.code !== receiverActivity?.code && element?.editOnlyByReceiver) {
            return <React.Fragment/>
        }
        if(specificAction && !element.displayable) {
            return <React.Fragment/>
        } else if(specificAction && element.displayable && !element.editable) {
            return <FlatAdditionnalData data={element}/>
        } else {
            return <CaseDataInput key={element.id} data={element} index={i} disabled={readOnly} onChange={onChange} isDataAction={isDataAction}/>
        }
    });

    return (
        <Row>
            <Col className={"border-right" + sectionClass ? sectionClass : ""}>
                {result}
            </Col>
        </Row>
    );




}
export default CaseDataSectionV2;
