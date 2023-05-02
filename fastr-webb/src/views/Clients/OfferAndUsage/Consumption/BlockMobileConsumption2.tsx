import React, {useEffect, useState} from "react";
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import DisplayTitle from "../../../../components/DisplayTitle";
import {CurrentMobileConsumption} from "../../../../model/service/consumption/CurrentMobileConsumption";
import MobileConsumptionPeriod from "./MobileConsumptionPeriod";
import {FormattedMessage} from "react-intl";
import {
    ClientContextSliceState,
    fetchClient,
    fetchCurrentMobileConsumption
} from "../../../../store/ClientContextSlice";
import {useLocation, useParams} from "react-router";
import {useDispatch} from "react-redux";
import {ConsumptionPeriod} from "../../../../model/service/consumption/ConsumptionPeriod";
import ExternalLinksBlock from "../../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../../ExternalAppsConfig"
import {fetchAndStoreAuthorizations, fetchAndStoreExternalApps} from "../../../../store/actions";
import {fetchMobileConsumptionAndStoreClientV2} from "../../../../store/actions/v2/client/ClientActions";
import queryString from "querystring";
import {DataLoad} from "../../../../context/ClientContext";
import {ApplicationMode} from "../../../../model/ApplicationMode";
interface Props {
    clientContext?: ClientContextSliceState
}

const BlockMobileConsumption2 = (props: Props) => {

    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const currentConsumption: CurrentMobileConsumption | null | undefined = client.currentConsumption;
    const currentConsumptionLoading: boolean = client.currentConsumptionLoading;
    const {serviceId, isBiosNotLca, clientId} = useParams();
    const {sessionId}  =  queryString.parse(window.location.search.replace("?", ""))
    const idService = clientContext ? clientContext.service?.id : serviceId;
    const idClient = clientContext && clientContext.clientData ? clientContext.clientData.id : clientId;
    const location = useLocation();
    const dispatch = useDispatch();
    const syntheticRouteMatch = location.pathname.match("^\\/mobileService\\/[^\\/]*\\/clientId\\/[^\\/]*\\/consumption\\/synthetic\\/isBiosNotLca\\/[^\\/]*$");
    const detailedRouteMatch = location.pathname.match("^\\/mobileService\\/[^\\/]*\\/clientId\\/[^\\/]*\\/consumption\\/detailed\\/isBiosNotLca\\/[^\\/]*$");
    const HORS_FORFAIT_LABEL = "Hors forfait";
    const ACHAT_LABEL = "Achat";
    const ELIGIBLE_EUROS_LABELS: string[] = [HORS_FORFAIT_LABEL, ACHAT_LABEL];
    const [params, setParams] = useState();
    const userPassword = useTypedSelector((state) => state.store.applicationInitialState.userPassword)
    const externalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.blockMobileConsumption2;
    let displayExternalApp = useTypedSelector(state => state.store.applicationInitialState.sessionIsFrom) !== ApplicationMode.FAST;

    useEffect(() => {
        if (idClient && serviceId && !client.serviceId){
            dispatch(fetchClient(idClient, serviceId, DataLoad.ONE_SERVICE, true, true));
        }
        if (clientContext) {
            dispatch(fetchMobileConsumptionAndStoreClientV2(idService!));
        } else if (idService) {
            dispatch(fetchCurrentMobileConsumption(idService));
        }
        if (isBiosNotLca !== undefined) {
            dispatch(fetchAndStoreAuthorizations(sessionId));
            dispatch(fetchAndStoreExternalApps());
        }

        const idParams = {
            clientId:idClient,
            password: userPassword
        }
        setParams(idParams);
    }, [])

    if (currentConsumptionLoading || undefined === currentConsumption) {
        return <React.Fragment/>
    }

    const isEligibleEurosMeter = (period: ConsumptionPeriod): boolean => {
        if ("EUROS" != period.unityType || !period.meterLabel) {
            return false
        }
        return ELIGIBLE_EUROS_LABELS.map((label) => label.toLowerCase()).includes(period.meterLabel.toLowerCase())
    }

    const compareMeter = function compare(m1: ConsumptionPeriod, m2: ConsumptionPeriod) {
        if (HORS_FORFAIT_LABEL == m1.meterLabel) {
            return -1;
        }
        if (HORS_FORFAIT_LABEL == m2.meterLabel) {
            return 1;
        }
        if (ACHAT_LABEL == m1.meterLabel) {
            return -1;
        }
        if (ACHAT_LABEL == m2.meterLabel) {
            return 1;
        }
        return 0;
    }

    const filterVisibleMeter = (): ConsumptionPeriod[] => {
        return currentConsumption!.consumptionPeriods
            .filter(period => ["TEL", "DATA"].includes(period.unityType) || isEligibleEurosMeter(period))
            .sort(compareMeter);
    }

    const renderConsumptionData = (isSyntheticMode: boolean) => {
        if (!currentConsumption || !currentConsumption.consumptionPeriods || !currentConsumption.consumptionPeriods.length) {
            return (
                <React.Fragment>
                    <span className="icon-gradient icon-warning"/> <span
                    className="text-danger font-weight-bold ml-2"><FormattedMessage
                    id="offer.consumptions.empty"/></span>
                </React.Fragment>
            )
        }
        const textSize = isSyntheticMode ? "xs" : "sm"
        const visibleMeters: ConsumptionPeriod[] = filterVisibleMeter();
        const periodSize: number = isSyntheticMode ? Math.min(4, visibleMeters.length) : visibleMeters.length
        if (isBiosNotLca !== undefined) {
            displayExternalApp = isBiosNotLca === "true";
        }
        return (
            <React.Fragment>
                <Row className={`mb-2 font-size-${textSize}`}>
                    <Col md={6}>
                        <span style={{textDecoration: "underline"}}><FormattedMessage
                            id="offer.consumptions.data.info"/></span>
                    </Col>
                    {(externalAppsSettings && externalAppsSettings.length && displayExternalApp) &&
                    <Col md={6} className={`text-right`}>
                        <ExternalLinksBlock settings={externalAppsSettings} isLoading={true} idParams={params}
                                            clientContext={client}/>
                    </Col>
                    }
                </Row>
                {
                    visibleMeters.slice(0, periodSize).map((consumptionPeriod, index) => (
                        <MobileConsumptionPeriod consumptionPeriod={consumptionPeriod} key={index} index={index}
                                                 isSyntheticMode={isSyntheticMode}/>
                    ))
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

export default BlockMobileConsumption2
