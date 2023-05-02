import React, { useEffect, useState } from "react";
import 'react-block-ui/style.css';
import {CardBody, CardHeader, Col, Tooltip,} from "reactstrap"
import Card from "reactstrap/lib/Card";
import Row from "reactstrap/lib/Row";
import {FormattedDate, FormattedMessage} from "react-intl";
import multipackIcon from "../../../../img/multipacks.svg";
import redBySfrIcon from "../../../../img/redbysfr.svg";
import sfrIcon from "../../../../img/sfrIcon.svg";
import sfrFamilyIcon from "src/img/sfrfamily.svg";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import LoadableText from "../../../../components/LoadableText";
import DisplayTitle from "../../../../components/DisplayTitle";
import {getCurrentMobilePlan} from "../../../../utils/PlansUtils";
import {MobileLineService, MobilePlan} from "../../../../model/service";
import CollapsibleMobileOptionsBlock from "./Contract/CollapsibleMobileOptionsBlock";
import OfferPriceBlock from "./Contract/OfferPriceBlock";
import CollapsibleMobileDiscountsBlock from "./Contract/CollapsibleMobileDiscountsBlock";
import LocaleUtils from "../../../../utils/LocaleUtils";
import MobileServiceUtils from "../../../../utils/MobileServiceUtils";
import {is4G, is5G, renderOfferNetworkInfo} from "./Utils/NetworkTypeUtils";
import ExternalLinksBlock from "../../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../../ExternalAppsConfig"
import { EngagementStatus } from "src/model/service/EngagementCurrentStatus";
import * as moment from "moment";
import { useDispatch } from "react-redux";
import { fetchAndStoreExternalApps } from "src/store/actions";

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockMobileOffer = (props: Props) => {
    const dispatch = useDispatch();
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const userPassword = useTypedSelector((state) => state.store.applicationInitialState.userPassword)
    const service = client.service as MobileLineService;

    const externalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.blockMobileOffer;

    const currentplan = getCurrentMobilePlan(service);
    let price: number | undefined = undefined;
    if (currentplan !== undefined && currentplan.offerPrice) {
        price = currentplan?.offerPrice + MobileServiceUtils.computeOptionAmount(service) + MobileServiceUtils.computeDiscountAmount(service)
    }

    const [familyTooltipIsOpen, toggleFamilyTooltipIsOpen] = useState(false)
    const [multiPackTooltipIsOpen, toggleMultiPackTooltipIsOpen] = useState(false)
    const toggleFamilyTooltip = () => toggleFamilyTooltipIsOpen(prevState => !prevState)
    const toggleMultiPackTooltip = () => toggleMultiPackTooltipIsOpen(prevState => !prevState)
    
    useEffect(() => {
        dispatch(fetchAndStoreExternalApps());
    }, [])

    return (
        <Card>
            <CardHeader className="d-flex justify-content-between">
                    <div>
                        <DisplayTitle imgSrc={getBrandIcon(service)}
                                      isLoading={service}>
                            {renderCurrentOfferName(currentplan, service)}
                            {renderPlanStartDate(currentplan, service)}
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
                    <Col md={6} xs={12}>
                        {renderContractStartDate(service)}
                    </Col>
                    <Col md={3} xs={6}>
                        <LoadableText isLoading={service}>
                            <b><FormattedMessage id="offer.active.JJ.CutOff"/></b>
                        </LoadableText>
                        <LoadableText isLoading={service}>
                            {service?.billingAccount.cutOffDay}
                        </LoadableText>
                    </Col>
                    <Col md={3} xs={6} className="text-right">                        
                        {externalAppsSettings && externalAppsSettings.length ?
                            <ExternalLinksBlock settings={externalAppsSettings} clientContext={client} idParams={{password: userPassword}} isLoading={service} textLink={'Consulter RIO'}/> : ''
                        }
                    </Col>
                </Row>
                <Row className="mb-2">
                    {service?.billingAccount.billingDay !== 0 &&
                    <Col>
                        <LoadableText isLoading={service}>
                            <b><FormattedMessage id="offer.active.pay.day"/></b>
                        </LoadableText>
                        <LoadableText isLoading={service}>
                            {service?.billingAccount.billingDay}
                        </LoadableText>
                    </Col>
                    }
                </Row>
                <OfferPriceBlock icon="icon-euro" title="offer.active.price" clientContext={clientContext}/>
                <CollapsibleMobileOptionsBlock icon="icon-data-share" title="offer.active.options.price" clientContext={clientContext}/>
                {service?.mobileDiscount?.discounts?.length !== 0 &&
                <CollapsibleMobileDiscountsBlock icon="icon-voucher" title="offer.active.discounts.price" clientContext={clientContext}/>
                }
            </CardBody>
        </Card>
    )
};


const renderContractStartDate = (service: MobileLineService) => {
    return (
        <React.Fragment>
            <LoadableText isLoading={service}>
                <FormattedMessage id="offer.active.contract"/>
            </LoadableText>
            <LoadableText isLoading={service}>
                {service?.id}
            </LoadableText>
            <LoadableText isLoading={service}> <FormattedMessage
                id={"offer.active.subscriptiondate"}/>
            </LoadableText>
            <LoadableText isLoading={service}>
                <FormattedDate
                    value={service?.creationDate ? new Date(service?.creationDate) : ''}
                    year="numeric"
                    month="long"
                    day="2-digit"
                />
            </LoadableText>
        </React.Fragment>
    )
}
const renderPlanStartDate = (currentplan: undefined | MobilePlan, service: MobileLineService) => {
    return (
        currentplan?.startDate &&
        <div>
            <small>
                <LoadableText isLoading={service}>
                    <FormattedMessage id="offer.active.subscription.date" />
                </LoadableText>
                &nbsp;
                {moment(currentplan.startDate).format("DD/MM/YYYY")}
                &nbsp;-&nbsp;
                {service.engagementCurrentStatus ?
                <React.Fragment>
                    {service.engagementCurrentStatus.status === EngagementStatus.ENGAGED ? <FormattedMessage id="offer.active.committed.until" /> :
                        service.engagementCurrentStatus.status === EngagementStatus.DISENGAGED ? <b><FormattedMessage id="offer.active.disengaged.since" /></b> :
                            <FormattedMessage id="offer.active.without.engagement" />}
                    &nbsp;
                    {service.engagementCurrentStatus.status === EngagementStatus.ENGAGED ? moment(service.engagementCurrentStatus.engagementDate).format("DD/MM/YYYY") : service.engagementCurrentStatus.status === EngagementStatus.DISENGAGED ? <b>{moment(service.engagementCurrentStatus.engagementDate).format("DD/MM/YYYY")}</b> : <React.Fragment />}
                </React.Fragment> : <FormattedMessage id="offer.active.without.engagement" />}
            </small>
        </div>
    )
}

const renderCurrentOfferName = (currentplan: undefined | MobilePlan, service: MobileLineService) => {
    return (
        <div className={"text-uppercase"}>
            <LoadableText isLoading={service}>
                <FormattedMessage id="offer.active.title"/>
            </LoadableText>
            {currentplan &&
            <LoadableText fieldValue={currentplan?.offerName}
                          isLoading={service}/>
            }
            {(is5G(currentplan?.networkType) || is4G(currentplan?.networkType))
                && renderOfferNetworkInfo(currentplan?.networkType, currentplan?.debit, currentplan?.unit)}

        </div>
    )
}

const renderMarkersIcon = (service: MobileLineService, toggleFamilyTooltip, toggleMultiPackTooltip, familyTooltipIsOpen, multiPackTooltipIsOpen) => {
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

const renderInfoIcons = (service: MobileLineService) => {
    if (service && service.chatelEligible) {
        return <div className="bg-dark text-white p-2 d-flex align-items-center font-size-xs mx-3">CHÂTEL</div>
    } else {
        return <React.Fragment />
    }
};

const getBrandIcon = (service: MobileLineService) => {
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
};

export default BlockMobileOffer
