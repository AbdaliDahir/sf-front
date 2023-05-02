import React from "react";
import {Col, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import * as moment from "moment";
import classnames from 'classnames';


import {OfferLocation} from "../../../../../model/OfferLocation";
import StringUtils from "../../../../../utils/StringUtils";

interface Props {
    history: OfferLocation[]
}

const LocationHistoryV2 = (props: Props) => {
    return <div className="timeline-container">
        <ul className="vertical-timeline w-100 mb-0">
            <Row>
                <Col sm={1}>
                    <label style={{fontWeight: "bold"}}><FormattedMessage id={"offer.location.status"}/></label>
                </Col>
                <Col sm={2}>
                    <label style={{fontWeight: "bold"}}><FormattedMessage id={"offer.location.equipment"}/></label>
                </Col>
                <Col sm={2}>
                    <label style={{fontWeight: "bold"}}><FormattedMessage id={"offer.location.month.price"}/></label>
                </Col>
                <Col sm={2}>
                    <label style={{fontWeight: "bold"}}><FormattedMessage id={"offer.location.engagement.start.date"}/></label>
                </Col>
                <Col sm={2}>
                    <label style={{fontWeight: "bold"}}><FormattedMessage id={"offer.location.engagement.end"}/></label>
                </Col>
                <Col sm={2}>
                    <label style={{fontWeight: "bold"}}><FormattedMessage id={"offer.location.engagement.next.renewal.date"}/></label>
                </Col>
                <Col sm={1}>
                    <label style={{fontWeight: "bold"}}><FormattedMessage id={"offer.location.linked.pta"}/></label>
                </Col>
            </Row>
            {
                props.history.map((location, index) => (
                    <li key={index}
                        className={` cursor-pointer text-left highLightRow`}
                    >
                                <span
                                    className={classnames('v-timeline-icon', 'v-not', {'v-last': index === (props.history.length - 1)}, {'v-first': index === 0})}/>
                        <Row className={"mx-1"}>
                            <Col sm={1}>
                                {location.statut}
                            </Col>
                            <Col sm={2}>
                                {location.libelleEquipement}
                            </Col>
                            <Col sm={2}>
                                {StringUtils.formatPrice(location.montant)}
                            </Col>
                            <Col sm={2}>
                                {moment(location.dateDebutEngagement).format(process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT)}
                            </Col>
                            <Col sm={2}>
                                {moment(location.dateFinEngagement).format(process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT)}
                            </Col>
                            <Col sm={2}>
                                {moment(location.dateRenouvellementLocation).format(process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT)}
                            </Col>
                            <Col sm={1}>
                                {location.pta}
                            </Col>
                        </Row>
                    </li>
                ))}
        </ul>
    </div>

}

export default LocationHistoryV2;