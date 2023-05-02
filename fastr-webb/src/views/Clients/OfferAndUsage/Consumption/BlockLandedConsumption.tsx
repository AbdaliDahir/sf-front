import React, {useEffect} from "react";
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import DisplayTitle from "../../../../components/DisplayTitle";
import {CurrentLandedConsumption} from "../../../../model/service/consumption/CurrentLandedConsumption";
import LandedConsumptionPeriod from "./LandedConsumptionPeriod";
import {FormattedMessage} from "react-intl";
import {ClientContextSliceState, fetchCurrentLandedConsumption} from "../../../../store/ClientContextSlice";
import {useParams} from "react-router";
import {useDispatch} from "react-redux";
import ExternalLinksBlock from "../../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../../ExternalAppsConfig"
import * as moment from "moment-timezone";
import LandedDetailedConsumptionTable from "./LandedDetailedConsumptionTable";
import "./BlockLandedConsumption.css"
import {fetchLandedConsumptionAndStoreClientV2} from "../../../../store/actions/v2/client/ClientActions";

interface Props {
    refClientDisRc?: string
    clientContext?: ClientContextSliceState
}

const BlockLandedConsumption = (props: Props) => {

    const MOMENT_DATE_FORMAT = process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT;

    const {clientContext, refClientDisRc} = props;
    const {refClient} = useParams();
    const currentLandedConsumption: CurrentLandedConsumption | null | undefined = clientContext ? clientContext.currentLandedConsumption : useTypedSelector(state => state.store.clientContext.currentLandedConsumption);
    const currentLandedConsumptionLoading: boolean = clientContext ? clientContext.currentLandedConsumptionLoading : useTypedSelector(state => state.store.clientContext.currentLandedConsumptionLoading);
    const refClientToSend = refClientDisRc ? refClientDisRc : refClient;
    const dispatch = useDispatch();
    const syntheticRouteMatch = location.pathname.match("^\\/landedService\\/[^\\/]*\\/consumption\\/synthetic$");
    const detailedRouteMatch = location.pathname.match("^\\/landedService\\/[^\\/]*\\/consumption\\/detailed$");

    const externalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.blockLandedConsumption;

    useEffect(() => {
        if (refClientToSend) {
            if (clientContext) {
                dispatch(fetchLandedConsumptionAndStoreClientV2(refClientToSend));
            } else {
                dispatch(fetchCurrentLandedConsumption(refClientToSend));
            }
        }
    }, [])

    const formatCurrencyCents = amountInCents => {
        const currencyFormatter = new Intl.NumberFormat('fr', {style: 'currency', currency: 'EUR'});
        return amountInCents && currencyFormatter.format(JSON.parse(amountInCents) / 100);
    }

    if (currentLandedConsumptionLoading || undefined === currentLandedConsumption) {
        return <React.Fragment/>
    }

    const renderConsumptionData = (isSyntheticMode: boolean) => {
        if (!currentLandedConsumption?.startDate && !currentLandedConsumption?.endDate && !currentLandedConsumption?.amount && !currentLandedConsumption?.updateDate && !currentLandedConsumption?.consumptionPeriods) {
            return (
                <React.Fragment>
                    <span className="icon-gradient icon-warning"/>
                    <span className="text-danger font-weight-bold ml-2">
                        <FormattedMessage id="offer.consumptions.empty"/>
                    </span>
                </React.Fragment>
            )
        }

        const textSize = isSyntheticMode ? "xs" : "sm"
        const startDateFormatted = moment(currentLandedConsumption?.startDate).format(MOMENT_DATE_FORMAT)
        const endDateFormatted = moment(currentLandedConsumption?.endDate).format(MOMENT_DATE_FORMAT)
        const updateDateFormatted = moment.utc(Number(currentLandedConsumption?.updateDate)).format('HH:mm');
        const amountFormatted = formatCurrencyCents(currentLandedConsumption?.amount)

        return (
            <React.Fragment>
                <Row className={`mt-2 mb-2 font-size-${textSize} text-center`}>
                    <Col>
                        <span className='font-weight-bold'>Encours du </span>
                        {startDateFormatted}
                        <span className='font-weight-bold'> au </span>
                        {endDateFormatted}
                        <span className='font-weight-bold'> à </span>
                        {updateDateFormatted}
                        <span className='font-weight-bold'> : </span>
                        {amountFormatted}
                        <span> TTC </span>
                    </Col>
                </Row>
                {!currentLandedConsumption?.consumptionPeriods || !currentLandedConsumption?.consumptionPeriods.length &&
                <Row className={`font-size-${textSize} text-center`}>
                    <Col>
                        <span><FormattedMessage id="offer.consumptions.no.active.plan"/></span>
                    </Col>
                </Row>
                }
                {!!currentLandedConsumption?.consumptionPeriods && !!currentLandedConsumption.consumptionPeriods.length && currentLandedConsumption.consumptionPeriods.map((consumptionPeriod, index) => (
                    <LandedConsumptionPeriod consumptionPeriod={consumptionPeriod} key={index} index={index}
                                             isSyntheticMode={isSyntheticMode}/>
                ))}
                {currentLandedConsumption?.lemaireFlag &&
                <Row className={`mt-4 mb-2 font-size-${textSize} text-center`}>
                    <Col>
                        <span><FormattedMessage id="offer.consumptions.lemaire.mention"/></span>
                    </Col>
                </Row>
                }
                {!syntheticRouteMatch &&
                <div className='mt-4 consumptionTable'>
                    <LandedDetailedConsumptionTable refClient={refClientToSend}/>
                </div>
                }
            </React.Fragment>
        )
    }

    return !syntheticRouteMatch && !detailedRouteMatch
        ? (
            <div>
                <Card>
                    <CardHeader className="d-flex justify-content-between">
                        <div className="d-flex justify-content-between w-100">
                            <DisplayTitle icon="icon-gradient icon-graph" fieldName="offer.consumptions"
                                          isLoading={true}/>
                            {!!externalAppsSettings?.length &&
                                <div>
                                    <ExternalLinksBlock settings={externalAppsSettings} isLoading={true}/>
                                </div>
                            }
                        </div>
                    </CardHeader>
                    <CardBody>
                        {renderConsumptionData(false)}
                    </CardBody>
                </Card>
            </div>
        )
        : (
            <div>
                {renderConsumptionData(!!syntheticRouteMatch)}
            </div>
        )
}


export default BlockLandedConsumption
