import moment from "moment"
import React from "react"
import { FormattedMessage } from "react-intl"
import { Row, Col, Label, Container } from "reactstrap"

const VegasCouriersActDataSummary = ({ act }) => {
    const attachedCouriers = act.actDetail.data.filter(courier => courier.type === "attachment").map(courier => courier.externalEventObjectId).join(', ')
    const dettachedCouriers = act.actDetail.data.filter(courier => courier.type === "detachment").map(courier => courier.externalEventObjectId).join(', ')
    return (
        <React.Fragment>
            <Container>
                <Row className="pt-3">
                    <Col>
                        <Label className="mr-1 mb-0 font-weight-bold"><FormattedMessage id="global.form.creationDate" /></Label>:
                        <br />
                        {moment(act.actCreationInfo.date).format('DD/MM/YYYY HH:mm')}
                    </Col>
                    <Col>
                        <Label className="mr-1 mb-0 font-weight-bold">Référence(s) TCO/EMAIL rattachée(s)</Label>:
                        <br />
                        {attachedCouriers}
                    </Col>
                    <Col>
                        <Label className="mr-1 mb-0 font-weight-bold">Référence(s) TCO/EMAIL détachée(s)</Label>:
                        <br />
                        {dettachedCouriers}
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default VegasCouriersActDataSummary;