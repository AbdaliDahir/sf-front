import * as React from "react";
import {FormattedMessage} from "react-intl"
import {CardHeader, Row, Col, Card, CardBody} from "reactstrap"
import {CaseDataProperty} from "../../../../model/CaseDataProperty"
import CaseDataInput from "./Fields/CaseDataInput"

interface Props {
    data: CaseDataProperty[]
    readOnly?: boolean
    onChange?: (id: string, val: string) => void
}

const CaseDataSection: React.FunctionComponent<Props> = (props: Props) => {
    const {data, readOnly, onChange} = props;

    if (data && !data.length) {
        return null
    }
    const renderData = () => {
        const result = data.map((element, i) => (
            <CaseDataInput key={element.id} data={element} index={i} disabled={readOnly} onChange={onChange}/>));

        return (
            <Row>
                <Col className={"border-right"}>
                    {result}
                </Col>
            </Row>
        );
    };


    return (
        <Card className="mt-1">
            <CardHeader>
                <span><FormattedMessage id={"cases.elements.additionnalData"}/></span>
            </CardHeader>
            <CardBody>
                {renderData()}
            </CardBody>
        </Card>
    )


}
export default CaseDataSection;
