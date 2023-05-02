import React, {useState} from "react";
import 'react-block-ui/style.css';
import {Col, Collapse} from "reactstrap"
import Row from "reactstrap/lib/Row";
import {FormattedDate, FormattedMessage} from "react-intl";
import LocaleUtils from "../../../../utils/LocaleUtils";
import DisplayTitle from "../../../../components/DisplayTitle";
import ProgressBackgroundStatus from "../../../../components/Bootstrap/ProgressBackgroundStatus";
import DisplayField from "../../../../components/DisplayField";
import {format} from "date-fns";
import CardBody from "reactstrap/lib/CardBody";
import {
    ClientContextSliceState
} from "../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import moment from "moment";

interface Props {
    title: string
    icon: string
    paymentFacilityValues: any
    clientContext?: ClientContextSliceState
}

const CollapsibleLandedPaymentFacilityBlock = (props: Props) => {
    const {title, icon, paymentFacilityValues, clientContext} = props
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const [open, setOpen] = useState(false)

    const toggle = () => {
        setOpen(prevState => {
            return !prevState
        })
    }

    const parseDate = (str) => {
        let day = str.split('/');
        return new Date(day[2], day[0]-1, day[1]);
    }

    const daysDiff = (dateFrom, dateTo) => {
        return Math.round((dateTo - dateFrom)/(1000*60*60*24));
    }

    const getFormattedDatesValues = (obj) => {
        const startDateFormatted = moment(obj.engagementEndDate).subtract(moment.duration({M: obj.totalDurationInMonths})).format('YYYY/MM/DD')
        const endDateFormatted = moment(obj.engagementEndDate).format('YYYY/MM/DD');

        const startDate = moment(obj.engagementEndDate).subtract(moment.duration({M: obj.totalDurationInMonths})).format('L')
        const now = moment(new Date()).format('L')
        const endDate = moment(obj.engagementEndDate).format('L')

        const daysBetweenStartAndEndDates = daysDiff(parseDate(startDate), parseDate(endDate))
        const daysBetweenNowAndEndDatesTemp = daysDiff(parseDate(now), parseDate(endDate))
        const daysBetweenNowAndEndDates = daysBetweenNowAndEndDatesTemp > 0 ? daysBetweenNowAndEndDatesTemp : 0

        return { startDateFormatted, endDateFormatted, daysBetweenStartAndEndDates, daysBetweenNowAndEndDates };
    }

    const renderProgressBar = (obj) => {
        if (!paymentFacilityValues) {
            return <React.Fragment/>
        }
        const formattedDatesValues = getFormattedDatesValues(obj);
        return (<React.Fragment>
            <ProgressBackgroundStatus total={formattedDatesValues.daysBetweenStartAndEndDates}
                                      value={formattedDatesValues.daysBetweenNowAndEndDates}
                                      size={"progress-md"}/>
            <div className="d-flex justify-content-between">
                <small>
                    <FormattedDate
                        value={formattedDatesValues.startDateFormatted}
                        year="numeric"
                        month="long"
                        day="2-digit"/>
                </small>
                {obj.remainingPaymentMonths > 0
                    ? <small>{obj.remainingPaymentMonths}<FormattedMessage
                        id="offer.months.remaining"/></small>
                    : <small>{formattedDatesValues.daysBetweenNowAndEndDates}<FormattedMessage
                        id="offer.days.remaining"/></small>}
                <small>
                    <FormattedDate
                        value={formattedDatesValues.endDateFormatted}
                        year="numeric"
                        month="long"
                        day="2-digit"/>
                </small>
            </div>
        </React.Fragment>)
    }

    if (paymentFacilityValues) {
        const formattedDates = getFormattedDatesValues(paymentFacilityValues);
        let i = 0;
        return (
            <Row key={i++} className="border-bottom pt-4 pb-4 m-0 w-100 flex-align-middle">
                <Col sm={3} className="p-0">
                    <DisplayTitle icon={icon} fieldName={title}
                                  isLoading={client.landedPaymentFacilityData}/>
                </Col>
                <Col sm={6}>
                    {renderProgressBar(paymentFacilityValues)}
                </Col>
                <Col sm={2} className="d-flex justify-content-center">+
                    {LocaleUtils.formatCurrency(paymentFacilityValues.monthlyPaiementAmountTTC/100)}
                </Col>
                <Col sm={1} onClick={toggle}>
                    <span className={"icon " + (open ? "icon-up" : "icon-down")}/>
                </Col>

                <Collapse className="w-100 p-2" isOpen={open}>
                    <CardBody>
                        <Row className="w-100 ml-1">
                            <Col sm={6} className="py-1 px-2">
                                <DisplayField
                                    isLoading={client.landedPaymentFacilityData}
                                    fieldName={"offer.payment.facility.total.duration"}>
                                    {paymentFacilityValues.totalDurationInMonths &&
                                        <React.Fragment>
                                            {paymentFacilityValues.totalDurationInMonths}
                                            <FormattedMessage id="offer.payment.facility.engagement.remaining.duration.unit"/>
                                        </React.Fragment>
                                    }
                                </DisplayField>
                            </Col>
                            <Col sm={6} className="py-1 px-2">
                                <DisplayField
                                    isLoading={client.landedPaymentFacilityData}
                                    fieldName={"offer.payment.facility.engagement.monthly.payment"}>
                                    <React.Fragment>{paymentFacilityValues.monthlyPaiementAmountTTC ? LocaleUtils.formatCurrency(paymentFacilityValues.monthlyPaiementAmountTTC/100) : ''}</React.Fragment>
                                </DisplayField>
                            </Col>
                            <Col sm={6} className="py-1 px-2"/>
                        </Row>
                        <Row className="w-100 ml-1">
                            <Col sm={6} className="py-1 px-2">
                                <DisplayField
                                    isLoading={client.landedPaymentFacilityData}
                                    fieldName={"offer.payment.facility.engagement.end.date"}
                                    fieldValue={paymentFacilityValues.engagementEndDate ? format(new Date(paymentFacilityValues.engagementEndDate), 'dd/MM/yyyy') : ''}
                                />
                            </Col>
                            <Col sm={6} className="py-1 px-2">
                                <DisplayField
                                    isLoading={client.landedPaymentFacilityData}
                                    fieldName={"offer.payment.facility.anticipated.purshase"}
                                    fieldValue={paymentFacilityValues.anticipatedPurchaseEligibility ? "Oui" : "Non"}
                                />
                            </Col>
                        </Row>
                        <Row className="w-100 ml-1">
                            <Col sm={6} className="py-1 px-2">
                                <DisplayField
                                    isLoading={client.landedPaymentFacilityData}
                                    fieldName={"offer.payment.facility.engagement.remaining.duration"}>

                                    {paymentFacilityValues.remainingPaymentMonths > 0
                                        ? <React.Fragment>
                                                {paymentFacilityValues.remainingPaymentMonths}
                                                <FormattedMessage id="offer.payment.facility.engagement.remaining.duration.unit"/>
                                            </React.Fragment>
                                        : <React.Fragment>
                                            {formattedDates.daysBetweenNowAndEndDates}
                                            <FormattedMessage id="offer.payment.facility.engagement.remaining.duration.days.unit"/>
                                        </React.Fragment>
                                    }
                                </DisplayField>
                            </Col>
                            {paymentFacilityValues.anticipatedPurchaseDate &&
                                <Col sm={6} className="py-1 px-2">
                                    <DisplayField
                                        isLoading={client.landedPaymentFacilityData}
                                        fieldName={"offer.payment.facility.anticipated.purshase.date"}
                                        //@ts-ignore
                                        fieldValue={format(new Date(paymentFacilityValues.anticipatedPurchaseDate), 'dd/MM/yyyy')}
                                    />
                                </Col>
                            }
                        </Row>
                        <Row className="w-100 ml-1">
                            <Col sm={6} className="py-1 px-2">
                                <DisplayField
                                    isLoading={client.landedPaymentFacilityData}
                                    fieldName={"offer.payment.facility.engagement.remaining.amount"}>
                                    <React.Fragment>{paymentFacilityValues.remainingAmountTTC ? LocaleUtils.formatCurrency(paymentFacilityValues.remainingAmountTTC/100) : ''}</React.Fragment>
                                </DisplayField>
                            </Col>
                            <Col sm={6} className="py-1 px-2"/>
                        </Row>
                    </CardBody>
                </Collapse>
            </Row>
        )
    } else {
        return <React.Fragment/>
    }
}


export default CollapsibleLandedPaymentFacilityBlock
