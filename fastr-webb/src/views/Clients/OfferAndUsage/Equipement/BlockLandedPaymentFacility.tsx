import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import Row from "reactstrap/lib/Row";
import DisplayTitle from "../../../../components/DisplayTitle";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import CollapsibleLandedPaymentFacilityBlock from "./CollapsibleLandedPaymentFacilityBlock";
import ExternalLinksBlock from "../../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../../ExternalAppsConfig"

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockLandedPaymentFacility = (props: Props) => {
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const paymentFacilities = client.landedPaymentFacilityData

    const externalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.blockLandedPaymentFacility;

    if (paymentFacilities && paymentFacilities.length) {
        return (
            <Card>
                <CardHeader className="justify-content-between">
                    <Row className="pt-1 pb-1">
                        <Col sm={6}>
                            <DisplayTitle icon="icon-gradient icon-euro" fieldName="offer.payment.facility.title"
                                          isLoading={client.landedPaymentFacilityData}/>
                        </Col>
                        {!!externalAppsSettings?.length &&
                            <ExternalLinksBlock settings={externalAppsSettings} isLoading={client.landedPaymentFacilityData}/>
                        }
                    </Row>
                </CardHeader>
                <CardBody className="pt-0 pb-0">
                    {paymentFacilities.map((paymentFacility, index) =>
                        <CollapsibleLandedPaymentFacilityBlock
                            key={index}
                            title={`Equipement N° ${index + 1}`}
                            icon="icon-gradient icon-tv"
                            paymentFacilityValues={paymentFacility}/>)}
                </CardBody>
            </Card>
        )
    } else {
        return <React.Fragment/>
    }
}

export default BlockLandedPaymentFacility
