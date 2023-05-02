import React from "react";
import {RenvoiEquipementActResponse} from "../../../../model/service/RenvoiEquipementActResponse";
import Table from "reactstrap/lib/Table";
import {FormattedMessage} from "react-intl";
import {PopoverBody, UncontrolledPopover} from "reactstrap";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import * as moment from "moment-timezone";


const RenvoiEquipementDataSummary = (props) => {
    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
    const actDetails : RenvoiEquipementActResponse = props.adgFixeDetails;

    const formatStatusEqt = (deliveryStatus : string) : string => {
        if (deliveryStatus) {
            if (deliveryStatus === "OK") {
                return "Client";
            } else if (deliveryStatus === "KO") {
                return "Retourné";
            }
        }
        return "";
    }

    return (
        <React.Fragment>
            <Table bordered className="table table-sm mt-2  table-hover text-center">
                <thead>
                    <tr>
                        <th><FormattedMessage id="acts.history.adg.fixe.modal.act.renvoi.eqt.table.header.origin"/></th>
                        <th><FormattedMessage id="acts.history.adg.fixe.modal.act.renvoi.eqt.table.header.return"/></th>
                        <th><FormattedMessage id="acts.history.adg.fixe.modal.act.renvoi.eqt.table.header.statut"/></th>
                        <th><FormattedMessage id="acts.history.adg.fixe.modal.act.renvoi.eqt.table.header.delivery.statut"/></th>
                    </tr>
                </thead>
                <tbody>
                {
                    actDetails.actDetails?.map((event, index) =>
                        event.label ?
                        <>
                            <tr id={"renvoiEqt" + index} key={index}>
                                <td>{event.label}</td>
                                <td>{event.label}</td>
                                <td>{formatStatusEqt(event.status)}</td>
                                <td>{event.status}</td>
                            </tr>
                            <UncontrolledPopover
                                placement="bottom"
                                trigger="hover"
                                target={"renvoiEqt" + index}>
                                <PopoverBody>
                                    <Row>
                                        <Col md={6}>
                                            <div className={"text-left font-weight-bold"}>
                                                Equipement :
                                            </div>
                                            {event.label}
                                        </Col>
                                        <Col md={6}>
                                            <div className={"text-left font-weight-bold"}>
                                                Transport (Statut) :
                                            </div>
                                            {event.status}
                                        </Col>
                                    </Row>
                                    <Row>
                                        { event.serialNumber ?
                                            <Col md={6}>
                                                <div className={"text-left font-weight-bold"}>
                                                    N° Série :
                                                </div>
                                                {event.serialNumber}
                                            </Col> : <></>
                                        }
                                        { event.deliveryNumber ?
                                            <Col md={6}>
                                                <div className={"text-left font-weight-bold"}>
                                                    Référence transporteur :
                                                </div>
                                                {event.deliveryNumber}
                                            </Col> : <></>
                                        }
                                    </Row>
                                    <Row>
                                        { event.sendDate ?
                                            <Col md={6}>
                                                <div className={"text-left font-weight-bold"}>
                                                    Date envoi :
                                                </div>
                                                {moment(event.sendDate).format(DATETIME_FORMAT)}
                                            </Col> : <></>
                                        }
                                        { event.sendDate ?
                                            <Col md={6}>
                                                <div className={"text-left font-weight-bold"}>
                                                    Message transporteur :
                                                </div>
                                                {event.deliveryMessage}
                                            </Col> : <></>
                                        }
                                    </Row>
                                    <Row>
                                        { event.deliveryDate ?
                                            <Col md={6}>
                                                <div className={"text-left font-weight-bold"}>
                                                    Date envoi :
                                                </div>
                                                {moment(event.deliveryDate).format(DATETIME_FORMAT)}
                                            </Col> : <></>
                                        }
                                        { event.returnDate ?
                                            <Col md={6}>
                                                <div className={"text-left font-weight-bold"}>
                                                    Date envoi :
                                                </div>
                                                {moment(event.returnDate).format(DATETIME_FORMAT)}
                                            </Col> : <></>
                                        }
                                    </Row>
                                </PopoverBody>
                            </UncontrolledPopover>
                        </>
                            :
                        <></>
                )}
                </tbody>
            </Table>
        </React.Fragment>
    )
}

export default RenvoiEquipementDataSummary;