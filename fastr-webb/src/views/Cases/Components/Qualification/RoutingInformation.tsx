import * as moment from "moment";
import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";
import {Row} from "reactstrap";
import Alert from "reactstrap/lib/Alert";
import Col from "reactstrap/lib/Col";


interface Props {
    routingRule
}


class RoutingInformation extends Component<Props> {
    public render() {
        const {routingRule} = this.props
        if (routingRule && routingRule.receiverSite
            && routingRule.receiverSite.code && routingRule.receiverActivity
            && routingRule.receiverActivity.code) {
            return (
                <Row>
                    <Col xs={12}>
                        <Alert color="light" className="pb-0 mb-0">
                            <Row>
                                <Col xs={4} className={"text-center"}>
                                    <Row>
                                        <Col>
                                    <span>  <FormattedMessage
                                        id="cases.scaling.receiver.act"/></span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                    <span
                                        className="font-weight-bold">{routingRule.receiverActivity.label} </span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={4} className={"text-center"}>
                                    <Row>
                                        <Col>
                                    <span>  <FormattedMessage
                                        id="cases.scaling.receiver.site"/> </span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                    <span
                                        className="font-weight-bold">{routingRule.receiverSite.label}</span>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col xs={4} className={"text-center"}>
                                    <Row>
                                        <Col>
                                    <span>  <FormattedMessage
                                        id="cases.scaling.estimated.resolution.date"/> </span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                    <span
                                        className="font-weight-bold">{moment(routingRule.estimatedResolutionDateOfCase).format('DD/MM/YYYY')}</span>
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>
                        </Alert>
                    </Col>
                </Row>
            );
        } else {
            return <React.Fragment/>
        }
    }
}

export default RoutingInformation;
