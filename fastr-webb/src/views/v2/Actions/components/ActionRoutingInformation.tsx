import * as moment from "moment";
import React, {} from 'react';
import {FormattedMessage} from "react-intl";
import {Row} from "reactstrap";
import Alert from "reactstrap/lib/Alert";
import Col from "reactstrap/lib/Col";

const ActionRoutingInformationV2 = (props) => {
    const {routingRule} = props
    if (routingRule?.receiverSite?.code && routingRule?.receiverActivity?.code) {
        return (
            <Row className={"routing-information-V2"}>
                <Col>
                    <Alert color="light" className="pb-2 mb-0">
                        <Row>

                            <Col className={"text-center"}>
                                <Row>
                                    <Col>
                                        <span><FormattedMessage id="cases.scaling.receiver.act"/></span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                            <span
                                                className="font-weight-bold">{routingRule?.receiverActivity?.label}</span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className={"text-center"}>
                                <Row>
                                    <Col>
                                        <span><FormattedMessage id="cases.scaling.receiver.site"/></span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <span className="font-weight-bold">{routingRule?.receiverSite?.label}</span>
                                    </Col>
                                </Row>
                            </Col>

                            <Col className={"text-center"}>
                                <Row>
                                    <Col>
                                            <span><FormattedMessage
                                                id="cases.scaling.estimated.resolution.date"/></span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                            <span
                                                className="font-weight-bold">{moment(routingRule?.estimatedResolutionDateOfCase).format('DD/MM/YYYY')}</span>
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


export default ActionRoutingInformationV2;
