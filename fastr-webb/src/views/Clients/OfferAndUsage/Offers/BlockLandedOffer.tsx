import React, { useEffect, useState } from "react";
import 'react-block-ui/style.css';
import {CardBody, CardHeader, Col, Tooltip,} from "reactstrap"
import Card from "reactstrap/lib/Card";
import Row from "reactstrap/lib/Row";
import {FormattedDate, FormattedMessage} from "react-intl";
import {GroupingData, LandedLineService, LandedPlan} from "../../../../model/service/LandedLineService";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import LoadableText from "../../../../components/LoadableText";
import DisplayTitle from "../../../../components/DisplayTitle";
import LocaleUtils from "../../../../utils/LocaleUtils";
import CollapsibleLandedDiscountsBlock from "./Contract/CollapsibleLandedDiscountsBlock";
import CollapsibleLandedOptionsBlock from "./Contract/CollapsibleLandedOptionsBlock";
import sfrIcon from "src/img/sfrIcon.svg";
import redBySfrIcon from "src/img/redbysfr.svg";
import multipackIcon from "src/img/multipacks.svg";
import sfrFamilyIcon from "src/img/sfrfamily.svg";
import multiTvIcon from "src/img/MULTI TV_RGB.svg";
import tvIcon from "src/img/TELEVISION_RGB.svg"
import multiTvStbless from "src/img/MultiTv5.svg"
import CollapsibleLandedOptionsTvBlock from "./Contract/CollapsibleLandedOptionsTvBlock";
import LandedOfferPriceBlock from "./Contract/LandedOfferPriceBlock";
import ExternalLinksBlock from "../../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../../ExternalAppsConfig";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import { NextRenewalDate } from "src/model/service/NextRenewalDate";
import * as moment from "moment";
import { EngagementStatus } from "src/model/service/EngagementCurrentStatus";
import { useDispatch } from "react-redux";
import { fetchAndStoreExternalApps } from "src/store/actions";
import {AppState} from "../../../../store";
import {ApplicationMode} from "../../../../model/ApplicationMode";

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockLandedOffer = (props: Props) => {
    const dispatch = useDispatch();
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const userPassword = useTypedSelector((state) => state.store.applicationInitialState.userPassword)
    const sessionIsFrom = useTypedSelector((state: AppState) => state.store.applicationInitialState.sessionIsFrom)
    const service = client.service as LandedLineService;
    const landedPlan = service?.landedPlan;
    let price: number | undefined = undefined

    const [familyTooltipIsOpen, toggleFamilyTooltipIsOpen] = useState(false)
    const [multiPackTooltipIsOpen, toggleMultiPackTooltipIsOpen] = useState(false)
    const toggleFamilyTooltip = () => toggleFamilyTooltipIsOpen(prevState => !prevState)
    const toggleMultiPackTooltip = () => toggleMultiPackTooltipIsOpen(prevState => !prevState)
    const externalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.blockLandedOffer;
    const tvChannelListExternalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.tvChannelList;

    useEffect(() => {
        dispatch(fetchAndStoreExternalApps());
    }, [])

    const isLineHasTVServices = () => {
        return  service?.servicePictos?.length > 0 && (service.servicePictos.includes("TV") || service.servicePictos.includes("MULTI_TV"));
    }

    return (
        <Card>
            <CardHeader className="d-flex justify-content-between">
                <div>
                    <DisplayTitle imgSrc={getBrandIcon(service)}
                                  isLoading={service}>
                        {renderCurrentLandedOfferName(service, landedPlan)}
                        {renderLandedPlanStartDate(service, landedPlan)}
                    </DisplayTitle>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex justify-content-center align-items-center">
                        {renderInfoIcons(service)}
                            {renderMarkersIcon(service, toggleFamilyTooltip, toggleMultiPackTooltip, familyTooltipIsOpen, multiPackTooltipIsOpen)}
                        <LoadableText isLoading={service}>
                            {!!price &&
                            <h5 className="mb-0">
                                {LocaleUtils.formatCurrency(price)}
                            </h5>
                            }
                        </LoadableText>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-0 px-4 pt-2">
                <Row className="mb-2">
                    <Col md={6}>
                        {renderServicePictos(service)}
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col md={{ size: 6, order: 1 }} xs={{ size: 12, order: 1 }}>
                        {renderContractSubscriptionDate(service, landedPlan)}
                    </Col>
                    <Col md={{ size: 3, order: 2 }} xs={{ size: 6, order: 3 }}>
                        {renderJJCutOff(service)}
                    </Col>                    
                    <Col md={{ size: 3, order: 3 }} xs={{ size: 6, order: 4 }} className="text-right">
                        {
                            sessionIsFrom !== ApplicationMode.DISRC && isLineHasTVServices() &&
                            <>
                                <ExternalLinksBlock settings={tvChannelListExternalAppsSettings} clientContext={client}
                                                    idParams={{password: userPassword}} isLoading={service}
                                                    textLink={'Liste chaînes TV'}/>
                                <br/>
                            </>
                        }
                        {externalAppsSettings && externalAppsSettings.length ?
                            <ExternalLinksBlock settings={externalAppsSettings} clientContext={client} idParams={{password: userPassword}} isLoading={service} textLink={'Consulter RIO'}/> : ''
                        }
                    </Col>
                    {
                        client.nextRenewalDate?.codeRetour === "01" && 
                        <Col md={{ size: 12, order: 4 }} xs={{ size: 12, order: 2 }}>
                            {renderNextRenewalDate(client.nextRenewalDate)}
                        </Col>
                    }
                </Row>
                <Row className="mb-2">
                    <Col md={6}>
                        {renderUngroupmentStatus(service)}
                    </Col>
                    <Col md={3}>
                        {renderUngroupmentZoneStatus(service)}
                    </Col>
                </Row>
                <Row className="mb-2">
                    {renderBilligDay(service)}
                </Row>
                <LandedOfferPriceBlock icon="icon-euro" title="offer.active.price" clientContext={clientContext}/>
                <CollapsibleLandedOptionsBlock icon="icon-data-share" title="offer.active.options.price"
                                               clientContext={clientContext}/>
                {
                    service?.optionsTv?.length !== 0 &&
                    <CollapsibleLandedOptionsTvBlock icon="icon-tv-apps" title="offer.active.options.tv.name"
                                                     clientContext={clientContext}/>
                }
                {
                    service?.discounts?.length !== 0 &&
                    <CollapsibleLandedDiscountsBlock icon="icon-voucher" title="offer.active.discounts.price"
                                                     clientContext={clientContext}/>
                }
            </CardBody>
        </Card>
    );
}
const renderUngroupmentStatus = (landedLineService: LandedLineService) => {
    const groupingData = landedLineService?.groupingData;
    if (!groupingData) {
        return <React.Fragment/>
    }
    const partialUngroupment = groupingData.partialUngroupment;
    const totalUngroupment = groupingData.totalUngroupment;
    if (!partialUngroupment && !totalUngroupment) {
        return <React.Fragment/>
    }
    return (
        <React.Fragment>
            <LoadableText isLoading={landedLineService}>
                <b><FormattedMessage id="offer.ungroupment.title"/></b>
            </LoadableText>
            <LoadableText isLoading={landedLineService}>
                {renderUngroupmentValue(groupingData)}
            </LoadableText>
        </React.Fragment>
    );
}
const renderUngroupmentValue = (groupingData: GroupingData) => {
    if (!groupingData) {
        return <React.Fragment/>
    }
    const partialUngroupment = groupingData.partialUngroupment;
    const totalUngroupment = groupingData.totalUngroupment;
    if (totalUngroupment) {
        return <FormattedMessage id="offer.total.ungroupment"/>
    } else if (partialUngroupment) {
        return <FormattedMessage id="offer.partial.ungroupment"/>
    }
    return ""
}

const renderUngroupmentZoneStatus = (landedLineService: LandedLineService) => {
    const groupingData = landedLineService?.groupingData;

    if (!groupingData) {
        return <React.Fragment/>
    }
    const ungroupedZone = groupingData.zoneUngrouped;
    const notUngroupedZone = groupingData.zoneNotUngrouped;
    if (!ungroupedZone && !notUngroupedZone) {
        return <React.Fragment/>
    }
    return (
        <React.Fragment>
            <LoadableText isLoading={landedLineService}>
                <b><FormattedMessage id="offer.zone.ungroupment.title"/></b>
            </LoadableText>
            <LoadableText isLoading={landedLineService}>
                {renderUngroupmentZoneValue(groupingData)}
            </LoadableText>
        </React.Fragment>
    );
}

const renderUngroupmentZoneValue = (groupingData: GroupingData) => {
    if (!groupingData) {
        return <React.Fragment/>
    }
    const ungroupedZone = groupingData.zoneUngrouped;
    const notUngroupedZone = groupingData.zoneNotUngrouped;
    if (ungroupedZone) {
        return <FormattedMessage id="offer.zone.ungrouped.value"/>
    } else if (notUngroupedZone) {
        return <FormattedMessage id="offer.zone.not.ungrouped.value"/>
    }
    return ""
}

const renderJJCutOff = (landedLineService: LandedLineService) => {
    return (
        <React.Fragment>
            <LoadableText isLoading={landedLineService}>
                <b><FormattedMessage id="offer.active.JJ.CutOff"/></b>
            </LoadableText>
            <LoadableText isLoading={landedLineService}>
                {landedLineService?.billingAccount.cutOffDay}
            </LoadableText>
        </React.Fragment>
    );
}

const renderNextRenewalDate = (nextRenewalDate: NextRenewalDate) => {
    return (
        <React.Fragment>
            <FormattedMessage id="offer.next.renewal.date.label"/>
            {moment(nextRenewalDate.dateProchainREQ).format('DD/MM/YYYY')}
            <FormattedMessage id="offer.next.renewal.date.best.price"/>
        </React.Fragment>
    );
}

const renderBilligDay = (landedLineService: LandedLineService) => {
    return (landedLineService?.billingAccount.billingDay !== 0 &&
        <Col>
            <LoadableText isLoading={landedLineService}>
                <b><FormattedMessage id="offer.active.pay.day"/></b>
            </LoadableText>
            <LoadableText isLoading={landedLineService}>
                {landedLineService?.billingAccount.billingDay}
            </LoadableText>
        </Col>
    );
}

const renderCurrentLandedOfferName = (landedLineService: LandedLineService, landedPlan: LandedPlan) => {
    return (
        <React.Fragment>
            <div className={"text-uppercase"}>
                <LoadableText isLoading={landedLineService}>
                    <FormattedMessage id="offer.active.title"/>
                </LoadableText>
                {landedPlan?.offerName &&
                <LoadableText fieldValue={landedPlan.offerName}
                              isLoading={landedLineService}/>
                }
            </div>
        </React.Fragment>
    );
}

const renderLandedPlanStartDate = (landedLineService: LandedLineService, landedPlan: LandedPlan) => {
    if (!landedPlan || !landedPlan.startDate) {
        return <React.Fragment/>
    }
    return (
        <React.Fragment>
            <div>
                <small>
                    <LoadableText isLoading={landedLineService}>
                        <FormattedMessage id="offer.active.subscription.date" />
                    </LoadableText>
                    &nbsp;
                    {moment(landedPlan.startDate).format("DD/MM/YYYY")}
                    &nbsp;-&nbsp;
                    {landedLineService.engagementCurrentStatus ?
                    <React.Fragment>
                        {landedLineService.engagementCurrentStatus.status === EngagementStatus.ENGAGED ? <FormattedMessage id="offer.active.committed.until" /> :
                            landedLineService.engagementCurrentStatus.status === EngagementStatus.DISENGAGED ? <b><FormattedMessage id="offer.active.disengaged.since" /></b> :
                                <FormattedMessage id="offer.active.without.engagement" />}
                        &nbsp;
                        {landedLineService.engagementCurrentStatus.status === EngagementStatus.ENGAGED ? moment(landedLineService.engagementCurrentStatus.engagementDate).format("DD/MM/YYYY")
                        : landedLineService.engagementCurrentStatus.status === EngagementStatus.DISENGAGED ? <b>{moment(landedLineService.engagementCurrentStatus.engagementDate).format("DD/MM/YYYY")}</b> : <React.Fragment />}
                    </React.Fragment> : <FormattedMessage id="offer.active.without.engagement" />}
                </small>
            </div>
        </React.Fragment>
    );
}

const renderContractSubscriptionDate = (landedLineService: LandedLineService, landedPlan: LandedPlan) => {
    return (
        <React.Fragment>
            <LoadableText isLoading={landedLineService}>
                <FormattedMessage id="offer.active.contract"/>
            </LoadableText>
            <LoadableText isLoading={landedLineService}>
                {landedLineService?.id}
            </LoadableText>
            <LoadableText isLoading={landedLineService}> - <FormattedMessage
                id={"offer.active.subscriptiondate"}/>
            </LoadableText>
            <LoadableText isLoading={landedLineService}>
                <FormattedDate
                    value={landedPlan?.startDate ? new Date(landedPlan?.startDate) : ''}
                    year="numeric"
                    month="long"
                    day="2-digit"
                />
            </LoadableText>
        </React.Fragment>
    );
}

const renderMarkersIcon = (service: LandedLineService, toggleFamilyTooltip, toggleMultiPackTooltip, familyTooltipIsOpen, multiPackTooltipIsOpen) => {
    if (!service || !service.multiPacks) {
        return <React.Fragment />
    }

    if (service.multiPacks.hasFamilyOffer) {
        return <React.Fragment>
            <Tooltip placement="bottom" target={"multipackIcon"} toggle={toggleMultiPackTooltip} isOpen={multiPackTooltipIsOpen}>
                <FormattedMessage id="offer.line.discount" /> {service.multiPacks.refundLine}€ TTC
                <br/>
                <FormattedMessage id="offer.total.discount" /> {service.multiPacks.refundGroup}€ TTC
            </Tooltip>
            {service.multiPacks?.coeurLine && <Tooltip placement="bottom" target={"sfrFamilyIcon"} toggle={toggleFamilyTooltip} isOpen={familyTooltipIsOpen}>
                <FormattedMessage id="offer.line.heart" />
            </Tooltip>}
            <img className="img-responsive mr-3" width={37} src={multipackIcon} id="multipackIcon" />
            <img className="img-responsive mr-3" width={37} src={sfrFamilyIcon} id="sfrFamilyIcon" />
        </React.Fragment>
    } else if (service.multiPacks.hasMultiPackOffer) {
        return <React.Fragment>
            <Tooltip placement="bottom" target={"multipackIcon"} toggle={toggleFamilyTooltip} isOpen={multiPackTooltipIsOpen}>
                <FormattedMessage id="offer.line.discount" /> {service.multiPacks.refundLine}€ TTC
                <br/>
                <FormattedMessage id="offer.total.discount" /> {service.multiPacks.refundGroup}€ TTC
            </Tooltip>
            <img className="img-responsive mr-3" width={37} src={multipackIcon} id="multipackIcon" />
        </React.Fragment>
    } else {
        return <React.Fragment />
    }
};

const renderInfoIcons = (service: LandedLineService) => {
    if (service && service.technology) {
        return <div
            className="bg-dark text-white p-2 d-flex align-items-center font-size-sm mx-3">{service.technology}</div>
    } else {
        return <React.Fragment/>
    }
}

const renderServicePictos = (service: LandedLineService) => {
    return (service.servicePictos?.map(iconeName =>
            renderServicePicto(iconeName, serviceToIconeMap.get(iconeName)))
            .reduce((previous, current) => previous === null ? [current] : [previous, ' + ', current], null)
    );
}

const serviceToIconeMap = new Map([
    ["INTERNET", "icon-internet-consommation"],
    ["TELEPHONE", "icon-call"],
    ["TV", tvIcon],
    ["UNLIMITED_MOBILE", "icon-phone"],
    ["HOME", "icon-home"],
    ["MULTI_TV", multiTvIcon],
    ["MULTI_TV_STBLESS", multiTvStbless]
]);

const renderServicePicto = (servicePictoName: string, serviceIcon) => {
    if (servicePictoName.includes('MULTI_TV') || servicePictoName === "TV") {
        return (
            <img className={"mr-1 ml-1 p-1 icon-gradient "} src={serviceIcon} height={"35px"} title={translate.formatMessage({id: "offer.landed.service." + servicePictoName.toLowerCase()})} />
        );
    } else {
        return (
            <i className={"mr-1 ml-1 p-1 icon-gradient " + serviceIcon}
               title={translate.formatMessage({id: "offer.landed.service." + servicePictoName.toLowerCase()})}/>
        );
    }
}

const getBrandIcon = (service: LandedLineService) => {
    if (!service || !service.brand) {
        return ''
    }
    if (service.brand === 'SFR') {
        return sfrIcon;
    } else if (service.brand === 'RED') {
        return redBySfrIcon;
    } else {
        return ''
    }
}

export default BlockLandedOffer;
