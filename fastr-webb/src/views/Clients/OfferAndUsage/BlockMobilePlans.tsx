import React, {useState} from 'react';
import {FormattedDate, FormattedMessage} from "react-intl";
import {CardBody, CardHeader} from "reactstrap";
import Card from "reactstrap/lib/Card";
import Col from "reactstrap/lib/Col";
import Collapse from "reactstrap/lib/Collapse";
import Row from "reactstrap/lib/Row";
import DisplayTitle from "../../../components/DisplayTitle";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {MobileLineService} from "../../../model/service";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import ExternalLinksBlock from "../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../ExternalAppsConfig"
import {Plan} from "../../../model/service/Plans";

interface Props {
    clientContext?: ClientContextSliceState,
    plans: Plan[]
}

const BlockMobilePlans = (props: Props) => {

    const {clientContext} = props;
    const [isCollapsed, setCollapsed] = useState(false)
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as MobileLineService;
    const externalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.blockMobilePlans;
    const toggleCollapse = () => {
        setCollapsed(!isCollapsed)
    }
    return (
        <Card>
            <CardHeader className="d-flex justify-content-between" onClick={toggleCollapse}>
                <DisplayTitle icon="icon-gradient icon-clock" fieldName="offer.plans.title"
                              isLoading={service}/>
                <div className="d-flex justify-content-between align-items-center">
                    {!!externalAppsSettings?.length &&
                        <div className="mr-2">
                            <ExternalLinksBlock settings={externalAppsSettings} isLoading={service} clientContext={clientContext}/>
                        </div>
                    }
                    <span className={"icon-gradient " + (isCollapsed ? "icon-up" : "icon-down")}/>
                </div>
            </CardHeader>
            <Collapse isOpen={isCollapsed}>
                <CardBody>
                    <Row className={"font-weight-bold"}>
                        <Col>
                            <FormattedMessage id="offer.plans.name"/>
                        </Col>
                        <Col>
                            <FormattedMessage id="offer.plans.startDate"/>
                        </Col>
                        <Col>
                            <FormattedMessage id="offer.plans.endDate"/>
                        </Col>
                        <Col>
                            <FormattedMessage id="offer.plans.price"/>
                        </Col>
                    </Row>
                    {props.plans.map((plan, index) => (
                        <div key={index}>
                            <hr/>
                            <Row key={plan.offerId}>
                                <Col>
                                    {plan.offerName}
                                </Col>
                                <Col>
                                    <FormattedDate
                                        value={new Date(plan.startDate)}
                                        year="numeric"
                                        month="long"
                                        day="2-digit"
                                    />
                                </Col>
                                <Col>
                                    {plan.endDate ?<FormattedDate
                                                    value={new Date(plan.endDate)}
                                                    year="numeric"
                                                    month="long"
                                                    day="2-digit"/>:
                                                    <React.Fragment/>}
                                </Col>
                                <Col>
                                    {plan.offerPrice}€
                                </Col>
                            </Row>
                        </div>
                    ))}
                </CardBody>
            </Collapse>
        </Card>
    )
}

export default BlockMobilePlans;
