import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import moment from "moment";
import Collapse from "reactstrap/lib/Collapse";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import Row from "reactstrap/lib/Row";
import ProgressBackgroundStatus from "../../../../components/Bootstrap/ProgressBackgroundStatus";
import DisplayField from "../../../../components/DisplayField";
import DisplayTitle from "../../../../components/DisplayTitle";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";

import {FormattedMessage, FormattedDate} from "react-intl";
import {format} from "date-fns";
import LocaleUtils from "../../../../utils/LocaleUtils";
import ExternalLinksBlock from "../../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../../ExternalAppsConfig"

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockMobilePaymentFacility = (props: Props) => {
    const {clientContext} = props;
    const [isCollapsed, setCollapsed] = useState(false)
    const externalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.blockMobilePaymentFacility;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const paymentFacility = client.renewalData?.paymentFacility;

    const toggleCollapse = () => {
        setCollapsed(!isCollapsed)
    }

    const parseDate = (str) => {
        let day = str.split('/');
        return new Date(day[2], day[0]-1, day[1]);
    }

    const daysDiff = (dateFrom, dateTo) => {
        return Math.round((dateTo - dateFrom)/(1000*60*60*24));
    }

    if (paymentFacility) {
        const startDateFormatted = moment(paymentFacility?.engagementEndDate).subtract(moment.duration({M: paymentFacility?.totalDurationInMonths})).format('LL')
        const endDateFormatted = moment(paymentFacility?.engagementEndDate).format('LL');

        const startDate = moment(paymentFacility?.engagementEndDate).subtract(moment.duration({M: paymentFacility?.totalDurationInMonths})).format('L')
        const now = moment(new Date()).format('L')
        const endDate = moment(paymentFacility?.engagementEndDate).format('L')

        const daysBetweenStartAndEndDates = daysDiff(parseDate(startDate), parseDate(endDate))
        const daysBetweenNowAndEndDates = daysDiff(parseDate(now), parseDate(endDate))

        return (
            <Card>
                <CardHeader onClick={toggleCollapse}>
                        <div className="d-flex justify-content-between align-items-center mr-0 pr-0">
                            <div style={{width:"25%"}}>
                                <DisplayTitle icon="icon-gradient icon-sim-card" fieldName="offer.payment.facility.title"
                                              isLoading={client.renewalData}/>
                            </div>
                            <div style={{width:"75%"}} className="d-flex justify-content-between align-items-center">
                                <div style={{width:"75%"}} className="d-flex justify-content-start">
                                    <div style={{width:"80%"}} className="mr-3">
                                            <ProgressBackgroundStatus total={daysBetweenStartAndEndDates}
                                                                      value={daysBetweenNowAndEndDates}
                                                                      size={"progress-md"}/>
                                            <div className="d-flex justify-content-between">
                                                <small>
                                                    <FormattedDate
                                                        value={startDateFormatted}
                                                        year="numeric"
                                                        month="long"
                                                        day="2-digit"
                                                    />
                                                </small>
                                                {paymentFacility.remainingPaymentMonths > 0 ?
                                                <small>{paymentFacility.remainingPaymentMonths}<FormattedMessage
                                                    id="offer.months.remaining"/></small> :
                                                <small>{daysBetweenNowAndEndDates}<FormattedMessage
                                                    id="offer.days.remaining"/></small>
                                                }
                                                <small>
                                                    <FormattedDate
                                                        value={endDateFormatted}
                                                        year="numeric"
                                                        month="long"
                                                        day="2-digit"
                                                    />
                                                </small>
                                            </div>
                                        </div>
                                    <div>+{LocaleUtils.formatCurrency(paymentFacility?.monthlyPaiementAmountTTC)}</div>
                                </div>
                                <div className="d-flex justify-content-between mw-100">
                                    {!!externalAppsSettings?.length &&
                                        <div className="mr-2 facility">
                                            <ExternalLinksBlock settings={externalAppsSettings} isLoading={client.renewalData} clientContext={clientContext}/>
                                        </div>
                                    }
                                    <span className={"icon-gradient " + (isCollapsed ? "icon-up" : "icon-down")}/>
                                </div>
                            </div>
                        </div>
                </CardHeader>
                <Collapse isOpen={isCollapsed}>
                    <CardBody>
                        <Row className="w-100 ml-1">
                            <Col sm={6} className="py-1 px-2">
                                <DisplayField
                                    isLoading={client.renewalData}
                                    fieldName={"offer.payment.facility.total.duration"}>
                                    <React.Fragment>{paymentFacility?.totalDurationInMonths}
                                        <FormattedMessage id="offer.payment.facility.engagement.remaining.duration.unit"/>
                                    </React.Fragment>
                                </DisplayField>
                            </Col>
                            <Col sm={6} className="py-1 px-2">
                                <DisplayField
                                    isLoading={client.renewalData}
                                    fieldName={"offer.payment.facility.engagement.monthly.payment"}>
                                    <React.Fragment>{LocaleUtils.formatCurrency(paymentFacility?.monthlyPaiementAmountTTC)}</React.Fragment>
                                </DisplayField>
                            </Col>
                            <Col sm={6} className="py-1 px-2"/>
                        </Row>
                        <Row className="w-100 ml-1">
                            <Col sm={6} className="py-1 px-2">
                                    <DisplayField
                                        isLoading={client.renewalData}
                                        fieldName={"offer.payment.facility.engagement.end.date"}
                                        fieldValue={format(new Date(paymentFacility?.engagementEndDate), 'dd/MM/yyyy')}
                                    />
                            </Col>
                            <Col sm={6} className="py-1 px-2">
                                    <DisplayField
                                        isLoading={client.renewalData}
                                        fieldName={"offer.payment.facility.anticipated.purshase"}
                                        fieldValue={paymentFacility?.anticipatedPurchaseEligibility ? "Oui": "Non"}
                                    />
                            </Col>
                        </Row>
                        <Row className="w-100 ml-1">
                            <Col sm={6} className="py-1 px-2">
                                    <DisplayField
                                        isLoading={client.renewalData}
                                        fieldName={"offer.payment.facility.engagement.remaining.duration"}>
                                        <React.Fragment>{paymentFacility?.remainingPaymentMonths}
                                        <FormattedMessage id="offer.payment.facility.engagement.remaining.duration.unit"/></React.Fragment>
                                    </DisplayField>
                            </Col>
                            <Col sm={6} className="py-1 px-2">
                                    <DisplayField
                                        isLoading={client.renewalData}
                                        fieldName={"offer.payment.facility.anticipated.purshase.date"}
                                        fieldValue={format(new Date(paymentFacility?.anticipatedPurchaseDate), 'dd/MM/yyyy')}
                                    />
                            </Col>
                        </Row>
                        <Row className="w-100 ml-1">
                            <Col sm={6} className="py-1 px-2">
                                    <DisplayField
                                        isLoading={client.renewalData}
                                        fieldName={"offer.payment.facility.engagement.remaining.amount"}>
                                        <React.Fragment>{LocaleUtils.formatCurrency(paymentFacility?.remainingAmountTTC)}</React.Fragment>
                                    </DisplayField>
                            </Col>
                            <Col sm={6} className="py-1 px-2"/>
                        </Row>
                    </CardBody>
                </Collapse>
            </Card>

        )
    } else {
        return <React.Fragment/>
    }
}

export default BlockMobilePaymentFacility
