import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Card, CardHeader, Col, Row} from "reactstrap";

interface Props {
    id: string
}

export default class CaseHeader extends React.Component<Props, object> {
    public render() {
        return <Card>
            <CardHeader className="bg-light font-weight-bold text-center">
                <Row>
                    <Col><strong><FormattedMessage id="cases.get.details.title"/>
                    <span id={"headerCaseId"}>{this.props.id}
                    </span>
                    </strong></Col>
                </Row>
            </CardHeader>
        </Card>;
    }
}