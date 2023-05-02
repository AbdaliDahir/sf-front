import * as React from "react";
import {FormattedMessage} from "react-intl";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    reopened: number,
    status: string
    category: string
    type: string | undefined,
}


export interface State {
    listOfProgressStatus: JSX.Element[];
}


export default class CaseStatus extends React.Component<Props, State> {

    public render(): JSX.Element {
        const {type, status, reopened, category} = this.props;
        return (
            <Card className={"h-100"}>
                <CardBody className="h-100 pb-0">
                    <Row>
                        <Col md={3} className="pl-1">
                            <span className="icon icon-settings mr-1"/>
                            <strong><FormattedMessage id={"cases.get.details.type"}/></strong>
                            <p>{type === undefined || type === 'UNDEFINED' || type === null  ? <FormattedMessage id={"cases.get.details.type.undefined"}/> : type}</p>
                        </Col>
                        <Col md={3} className="pl-1">
                            <span className="icon icon-settings mr-1"/>
                            <strong><FormattedMessage id="cases.get.details.status"/></strong>
                            <p><FormattedMessage id={status}/></p>
                        </Col>
                        <Col md={3} className="pl-1">
                            <span className="icon icon-info mr-1"/>
                            <strong><FormattedMessage id="cases.get.details.category"/></strong>
                            <p>{category ? <FormattedMessage id={category}/> : <FormattedMessage id="IMMEDIATE"/>}</p>
                        </Col>
                        <Col md={3} className="pl-0 pr-1">
                            <span className="icon icon-eye mr-1"/>
                            <strong><FormattedMessage id="cases.get.details.modif.number"/></strong>
                            <p>{reopened}</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}