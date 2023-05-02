import React from 'react';
import {FormattedMessage} from "react-intl";
import {Card, CardBody, CardHeader, Col, FormGroup, Row} from "reactstrap";
import * as moment from "moment";
import DateUtils from "../../../utils/DateUtils";
import {commentRender} from "../../Commons/Acts/ActsUtils";
import {formattedStatus, getBadgeBgColor} from "../../../utils/MaxwellUtilsV2";

const IncidentsListV1 = ({incidents}) => {

    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    const renderIncidentsTable = () => {
        const incidentsList: JSX.Element[] = [];
        incidents.forEach(incident => {
            const badgeBG = getBadgeBgColor(incident.timeSpentLastUpdate, incident.status)
            incidentsList.push(
                <Row className="w-100 pt-2 pb-2 border-bottom align-items-center incident-line">
                    <Col md={1} className="d-flex flex-column align-items-center justify-content-center">
                        {incident?.ticketId && <div className="pb-1">{incident.ticketId}</div>}
                        <span className={`badge badge-round d-flex align-items-center ${badgeBG}`}>
                            <span className="text-white">{DateUtils.formatTimeSpentLastUpdate(incident.timeSpentLastUpdate, "d[j] h[h] m[min] s[s]") || 5+'s'}</span>
                        </span>
                    </Col>

                    <Col md={3}>
                        {incident?.creationDate && <div><FormattedMessage
                            id="maxwellV2.incident.list.created.on"/> {moment(incident.creationDate).format(DATETIME_FORMAT)}
                        </div>}
                        {incident?.updateDate && <div><FormattedMessage
                            id="maxwellV2.incident.list.updated.on"/> {moment(incident.updateDate).format(DATETIME_FORMAT)}
                        </div>}
                    </Col>

                    <Col xs={2}>{incident?.status && formattedStatus(incident)}</Col>
                    
                    <Col md={6}>{commentRender(incident?.comment)}</Col>
                </Row>
            )
        })
        return incidentsList
    }

    const renderSection = () => {
        if (incidents && incidents.length > 0) {
            return <Card className="mt-1">
                <CardHeader>
                    <span className="icon-gradient icon-diag mr-2"/>
                    <FormattedMessage id={"maxwellV2.incident.list.title"}/>
                </CardHeader>
                <CardBody>
                    <section className={"maxwell-section__wrapper"}>
                        <FormGroup>
                            {renderIncidentsTable()}
                        </FormGroup>
                    </section>
                </CardBody>
            </Card>
        } else {
            return <React.Fragment/>
        }
    }

    return (
        <section className={"maxwell-section__wrapper"}>
            <div className="my-2">
                <div>
                    {renderSection()}
                </div>
            </div>
        </section>
    )
}

export default IncidentsListV1