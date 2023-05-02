import React from "react";
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import DisplayTitle from "../../../../components/DisplayTitle";
import {Consumption} from "../../../../model/service/consumption/MobileConsumption";
import MobileConsumptionType from "./MobileConsumptionType";


const BlockMobileConsumption = () => {

    const consumption: Consumption | undefined = useTypedSelector(state => state.store.clientContext.consumption);
    if (consumption) {
        return (
            <div>
                <Card>
                    <CardHeader className="d-flex justify-content-between">
                        <DisplayTitle icon="icon-gradient icon-graph" fieldName="offer.consumptions"
                                      isLoading={consumption}/>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col sm={4}>
                                <MobileConsumptionType title={"offer.consumptions.inPlan"} history={consumption?.inPlan}/>
                            </Col>
                            <Col sm={4}>
                                <MobileConsumptionType title={"offer.consumptions.beyondPlan"} history={consumption?.beyondPlan}/>
                            </Col>
                            <Col sm={4}>
                                <MobileConsumptionType title="offer.consumptions.outPlan" history={consumption?.outPlan}/>
                            </Col>
                        </Row>

                    </CardBody>
                </Card>

            </div>
        )
    } else return <React.Fragment/>
}

export default BlockMobileConsumption
