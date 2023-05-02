import React from "react";
import {Card, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import Col from "reactstrap/lib/Col";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {renderMobilePlans} from "../../../../utils/PlansUtils";
import {MobileLineService} from "../../../../model/service";

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockMobileOffersHistory = (props: Props) => {

    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const {clientData} = client;

    const service = client.service as MobileLineService;
    if (!clientData || !service || !service.plans) {
        return <React.Fragment/>
    }

    return (
        <Card body>
            <Row className="font-weight-bold text-center pb-2">
                <Col md={6}>
                    <FormattedMessage
                        id={"offer.column.label"}/>
                </Col>
                <Col md={2}>
                    <FormattedMessage
                        id={"offer.column.activation.date"}/>
                </Col>
                <Col md={2}>
                    <FormattedMessage
                        id={"offer.column.desactivation.date"}/>
                </Col>
                <Col md={2}>
                    <FormattedMessage
                        id={"offer.column.price"}/>
                </Col>
            </Row>
            {renderMobilePlans(service.plans)}
        </Card>
    )
}

export default BlockMobileOffersHistory
