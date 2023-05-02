import React from "react";
import {Card, CardBody, CardHeader, Col, FormGroup, PopoverBody, Row, UncontrolledPopover} from "reactstrap";
import DisplayTitle from "../../../../../components/DisplayTitle";
import {FormattedMessage} from "react-intl";
import * as moment from "moment";
import classnames from 'classnames';
import {MdNote} from "react-icons/md";

const LocationEquipmentsHistory = (props) => {
    return (
        <FormGroup>
            <Card>
                <CardHeader className="d-flex justify-content-between">
                    <div className="d-flex justify-content-between w-100">
                        <DisplayTitle icon={"icon-clock"} fieldName="location.equipments.history.title"
                                      isLoading={props.history}/>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="timeline-container">
                        <ul className="vertical-timeline w-100 mb-0">
                            <Row>
                                <Col>
                                    <label style={{fontWeight: "bold"}}><FormattedMessage
                                        id={"location.equipment.name"}/></label>
                                </Col>
                                <Col>
                                    <label style={{fontWeight: "bold"}}><FormattedMessage
                                        id={"location.equipment.imei"}/></label>
                                </Col>
                                <Col>
                                    <label style={{fontWeight: "bold"}}><FormattedMessage
                                        id={"location.equipment.status"}/></label>
                                </Col>
                                <Col>
                                    <label style={{fontWeight: "bold"}}><FormattedMessage
                                        id={"location.equipment.subscription.date"}/></label>
                                </Col>
                                <Col>
                                    <label style={{fontWeight: "bold"}}><FormattedMessage
                                        id={"location.equipment.restitution.date"}/></label>
                                </Col>
                                <Col>
                                    <label style={{fontWeight: "bold"}}><FormattedMessage
                                        id={"location.equipment.location.order"}/></label>
                                </Col>
                                <Col>
                                    <label style={{fontWeight: "bold"}}><FormattedMessage
                                        id={"location.equipment.insurance"}/></label>
                                </Col>
                                <Col>
                                    <label style={{fontWeight: "bold"}}><FormattedMessage
                                        id={"location.equipment.penalty"}/></label>
                                </Col>
                            </Row>
                            {
                                props.history?.sort((a, b) => {
                                    return new Date(b.subscriptionDate).getTime() - new Date(a.subscriptionDate).getTime()
                                }).map((equipment, index) => (
                                    <li key={index}
                                        className={` cursor-pointer text-left highLightRow`}
                                    >
                                <span
                                    className={classnames('v-timeline-icon', 'v-not', {'v-last': index === (props.history.length - 1)}, {'v-first': index === 0})}/>
                                        <Row className={"mx-1"}>
                                            <Col>
                                                {equipment.label}
                                            </Col>
                                            <Col>
                                                {equipment.imei}
                                            </Col>
                                            <Col>
                                                {equipment.status}
                                            </Col>
                                            <Col>
                                                {moment(equipment.subscriptionDate).format(process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT)}
                                            </Col>
                                            <Col>
                                                {equipment.restitutionDate ? moment(equipment.restitutionDate).format(process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT) : ""}
                                            </Col>
                                            <Col id={'td-order' + index.toString() + equipment.imei}
                                                 className={"td-order"}><MdNote size={"2em"}/></Col>
                                            <UncontrolledPopover
                                                placement='auto'
                                                trigger="hover"
                                                target={'td-order' + index.toString() + equipment.imei}>
                                                <PopoverBody>
                                                    <ul>
                                                        <li><FormattedMessage
                                                            id={"location.equipment.location.order.number"}/> : {equipment.locationOrderNumber} </li>
                                                        <li><FormattedMessage
                                                            id={"location.equipment.restitution.order.number"}/> : {equipment.restitutionOrderNumber} </li>
                                                    </ul>
                                                </PopoverBody>
                                            </UncontrolledPopover>
                                            <Col>
                                                {equipment.insurance}
                                            </Col>
                                            <Col id={'td-penalty' + index.toString() + equipment.imei}
                                                 className={"td-penalty"}><MdNote size={"2em"}/></Col>
                                            <UncontrolledPopover
                                                placement='auto'
                                                trigger="hover"
                                                target={'td-penalty' + index.toString() + equipment.imei}>
                                                <PopoverBody>
                                                    <ul>
                                                        <li><FormattedMessage
                                                            id={"location.equipment.penalty.type"}/> : {equipment.penaltyType} </li>
                                                        <li><FormattedMessage
                                                            id={"location.equipment.penalty.amount"}/> : {equipment.amount} </li>
                                                    </ul>
                                                </PopoverBody>
                                            </UncontrolledPopover>
                                        </Row>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </CardBody>
            </Card>
        </FormGroup>
    )
}

export default LocationEquipmentsHistory;