import React, {ChangeEvent, useState} from "react";
import 'react-block-ui/style.css';
import {Col, Collapse, FormGroup, Input,} from "reactstrap"
import Row from "reactstrap/lib/Row";
import {FormattedMessage, FormattedPlural} from "react-intl";
import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {MobileDiscount, MobileLineService} from "../../../../../model/service";
import LoadableIcon from "../../../../../components/LoadableIcon";
import LoadableText from "../../../../../components/LoadableText";
import LocaleUtils from "../../../../../utils/LocaleUtils";
import MobileServiceUtils from "../../../../../utils/MobileServiceUtils";
import ContractUtils from "../Utils/ContractUtils";
import {
    renderOnlyStartDate,
    renderRunningOptionsOrDiscounts,
    renderTerminatedOptionsOrDiscounts
} from "../Utils/OffersUtils";
import ServiceUtils from "../../../../../utils/ServiceUtils";

interface Props {
    title: string
    icon: string
    clientContext?: ClientContextSliceState
}

const renderPeriodicity = (option: MobileDiscount) => {
    const billingType = option.billingType;
    if (billingType) {
        if (billingType === "PERIODIC") {
            return "Récurrente"
        } else if (billingType === "PONCTUAL") {
            return "Ponctuelle"
        }
    }
    return ""
};

const renderDiscount = (option: MobileDiscount, index: number) => {
    return <Row className="border-top flex-align-middle p-2" key={index}>
        <Col md={4} className="d-flex">
            <span className="d-flex flex-middle"/>
            <span className="d-flex flex-align-middle">
                    <div>
                        <h6 className="mb-0">
                            {option.label}
                        </h6>
                    </div>
                </span>
        </Col>
        <Col md={3}>
            {renderDate(option)}
        </Col>
        <Col md={3} className={"text-center"}>
            {renderPeriodicity(option)}
        </Col>
        <Col md={2} className={"text-center"}>
            <h6 className="mb-0 float-right">{LocaleUtils.formatCurrency(option.amount)}</h6>
        </Col>
    </Row>
};

const renderDate = (discount: MobileDiscount) => {
    const startDate = new Date(discount.startDate);
    let endDate;
    if (discount.effectiveEndDate) {
        endDate = new Date(discount.effectiveEndDate);
    }
    if (endDate) {
        if (discount.status === "ACTIVE") {
            return renderRunningOptionsOrDiscounts(startDate, endDate)
        } else if (discount.status === "TERMINATED") {
            return renderTerminatedOptionsOrDiscounts(startDate, endDate)
        }
    } else {
        return renderOnlyStartDate(startDate)
    }
    return;
};

const CollapsibleMobileDiscountsBlock = (props: Props) => {
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as MobileLineService;
    const {title, icon} = props;
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(prevState => {
            return !prevState
        })
    };
    const [optionState, setOptionState] = useState("Actives");
    const changeOptions = (val: ChangeEvent<HTMLInputElement>) => {
        if (val.currentTarget.value !== optionState) {
            setOptionState(val.currentTarget.value)
        }
    };

    const filterByDiscountStatus = (discount: MobileDiscount) => {
        if (optionState === "Actives") {
            return discount.status === "ACTIVE"
        } else {
            return discount.status === "TERMINATED"
        }
    };

    const sortDiscountByDate = (discountA: MobileDiscount, discountB: MobileDiscount) => {
        if (optionState === "Actives") {
            return ContractUtils.sortActiveMobileDiscounts(discountA, discountB);
        } else {
            return ContractUtils.sortTerminatedOptionsByDate(discountA, discountB);
        }
    };

    const renderMobileDiscounts = (discounts: MobileDiscount[]) => {
        const mobileDiscounts = discounts.filter(discount => filterByDiscountStatus(discount));
        if (!mobileDiscounts.length) {
            if (optionState === "Actives") {
                return ServiceUtils.renderEmptyDataMsg("offer.discounts.enabled.empty", true)
            } else {
                return ServiceUtils.renderEmptyDataMsg("offer.discounts.disabled.empty", true)
            }
        } else {
            return mobileDiscounts.sort((discountA, discountB) => sortDiscountByDate(discountA, discountB))
                .map((e, index) => renderDiscount(e, index))
        }
    }

    if (service && service.mobileDiscount && service.mobileDiscount.discounts.length > 0) {
        const discounts = [...service?.mobileDiscount?.discounts];
        const numberOfActiveDiscounts = discounts.filter(discount => discount.status === "ACTIVE").length;
        return (
            <Row className="border-top flex-align-middle p-2">
                <Col md={4} className="d-flex">
                <span className="d-flex flex-middle">
                    <LoadableIcon name={icon}
                                  className="font-size-l mr-3"
                                  color="gradient"
                                  isLoading={service}/>
                </span>
                    <span className="d-flex flex-align-middle">
                    <div>
                        <LoadableText isLoading={service}>
                            <h6 className="mb-0">
                                <FormattedMessage id={title}/>
                            </h6>
                        </LoadableText>
                        <LoadableText isLoading={service}>
                             {numberOfActiveDiscounts} <FormattedPlural value={numberOfActiveDiscounts}
                                                                        one="geste commercial ou remise active"
                                                                        other="gestes commerciaux ou remises actives"/>
                        </LoadableText>
                    </div>
                </span>
                </Col>
                <Col md={{size: 2}}>
                    {!!open &&
                    <FormGroup>
                        <Input
                            type="select"
                            name={"select"}
                            id={"selectType"}
                            onChange={changeOptions}
                            value={optionState}>
                            <option value="Actives">Actives</option>
                            <option value="Inactives">Inactives</option>
                        </Input>
                    </FormGroup>
                    }
                </Col>
                <Col md={2} className={'offset-md-3'}>
                    <LoadableText isLoading={service}>
                        <h6 className="mb-0 float-right">{LocaleUtils.formatCurrency(MobileServiceUtils.computeDiscountAmount(service))}</h6>
                    </LoadableText>
                </Col>
                <Col sm={1}>
                    <span className={"icon " + (open ? "icon-up" : "icon-down")} onClick={toggle}/>
                </Col>
                <Collapse className="w-100 p-2" isOpen={open}>
                    {renderMobileDiscounts(discounts)}
                </Collapse>
            </Row>
        )
    } else {
        return <React.Fragment/>
    }
};

export default CollapsibleMobileDiscountsBlock
