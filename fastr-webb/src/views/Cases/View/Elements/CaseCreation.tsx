import * as React from "react";
import {FormattedMessage} from "react-intl";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
// Components
import {User} from "../../../../model/User";

interface Props {
    creationDate: string,
    owner: User
}

export default class CaseCreation extends React.Component<Props> {

    public render(): JSX.Element {
        const {owner: {login, loginAcd, activity: {label}, site, physicalSite}} = this.props;
        return (
            <Card className="mb-2 text-center h-100">
                <CardBody className="h-100 pb-0">
                    <Row className="h-100">
                        <Col md={3}>
                            <span className="icon icon-touch mr-1"/><strong><FormattedMessage
                            id="cases.get.creator.activity"/></strong>
                            <p>{label}</p>
                        </Col>
                        <Col md={3}>
                            <span className="icon icon-connected-home mr-1"/>
                            <strong><FormattedMessage
                                id="cases.get.creator.location"/></strong>
                            <p>{site  ? site.label : "-"}</p>
                        </Col>
                        <Col md={3}>
                            <span className="icon icon-connected-home mr-1"/>
                            <strong><FormattedMessage
                                id="cases.get.creator.physicallocation"/></strong>
                            <p>{physicalSite  ? physicalSite.label : "-"}</p>
                        </Col>
                        <Col md={3}>
                            <span className="icon icon-user mr-1"/><strong><FormattedMessage
                            id="cases.get.details.handled.by.login"/></strong>
                            <p>{login} {loginAcd !== null && loginAcd !== undefined ? `(${loginAcd})` : ""}</p>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}