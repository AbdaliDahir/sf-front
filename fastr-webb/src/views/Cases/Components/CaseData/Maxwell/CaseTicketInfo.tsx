import * as React from 'react';
import {Card, CardBody, Row} from "reactstrap";
import CardHeader from "reactstrap/lib/CardHeader";
import {AppState} from "../../../../../store";
import {connect} from "react-redux";
import {Case} from "../../../../../model/Case";
import Col from "reactstrap/lib/Col";
import * as moment from "moment";
import {FormattedMessage} from "react-intl";


interface Props {
    retrievedCase: Case
}

class CaseTicketInfo extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
    }


    public render() {
        const currentCase: Case = this.props.retrievedCase
        return (
            <div>
                <Card className="mt-1">
                    <CardHeader>
                        <span className="icon-gradient icon-contract mr-2"/>
                        Informations du ticket de l'incident
                    </CardHeader>
                    <CardBody>
                        <Col>
                            <Row>
                                <Col xs={3} className={"text-center border-right"}>
                                    <Row>
                                        <Col>
                                            <h6><FormattedMessage id="cases.maxwell.incident.number"/></h6>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col>
                                            {currentCase.incident && currentCase.incident.ticketId}
                                        </Col>
                                    </Row>

                                </Col>

                                <Col xs={3} className={"text-center border-right"}>
                                    <Row>
                                        <Col>
                                            <h6><FormattedMessage id="cases.maxwell.incident.creationDate"/></h6>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col>
                                            {moment(currentCase.creationDate).format('DD/MM/YYYY')}
                                        </Col>
                                    </Row>
                                </Col>

                                <Col xs={3} className={"text-center border-right"}>
                                    <Row>
                                        <Col>
                                            <h6><FormattedMessage id="cases.maxwell.incident.statut"/></h6>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col>
                                            {currentCase.incident && currentCase.incident.status}
                                        </Col>
                                    </Row>


                                </Col>

                                <Col xs={3} className={"text-center"}>
                                    <Row>
                                        <Col>
                                            <h6><FormattedMessage id="cases.maxwell.incident.updateDate"/>
                                            </h6>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col>
                                            {currentCase.incident.updateDate ? moment(currentCase.incident.updateDate).format('DD/MM/YYYY'):''}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <section className="bg-light p-2 rounded mt-3">
                                <Row>
                                    <Col xs={12} className="d-flex">
                                        <h6 className="ml-3 mr-3"><FormattedMessage
                                            id="cases.maxwell.incident.technicalResult"/></h6>
                                        <span> {currentCase.incident && currentCase.incident.technicalResult}</span>
                                    </Col>
                                </Row>
                            </section>

                        </Col>
                    </CardBody>
                </Card>
            </div>
        );
    }
}


const mapStateToProps = (state: AppState) => ({
    retrievedCase: state.case.currentCase

});

export default connect(mapStateToProps, null)(CaseTicketInfo)