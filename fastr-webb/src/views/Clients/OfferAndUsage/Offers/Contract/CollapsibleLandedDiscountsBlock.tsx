import React, {ChangeEvent, useState} from "react";
import 'react-block-ui/style.css';
import {Col, Collapse, FormGroup, Input,} from "reactstrap"
import Row from "reactstrap/lib/Row";
import {FormattedMessage, FormattedPlural} from "react-intl";
import {LandedLineService, LandedOption} from "../../../../../model/service/LandedLineService";
import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";

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

const renderDate = (option: LandedOption) => {
    const activationDate = new Date(option.activationDate)
    let endDate;
    if (option.terminationDate) {
        endDate = new Date(option.terminationDate);
    }
    if (endDate) {
        if (option.status === "ACTIVE") {
            return renderRunningOptionsOrDiscounts(activationDate, endDate)
        } else if (option.status === "TERMINATED" && activationDate) {
            return renderTerminatedOptionsOrDiscounts(activationDate, endDate)
        }
    } else {
        return renderOnlyStartDate(activationDate)
    }
    return;
}

const renderDiscount = (option: LandedOption) => {
    return <Row className="border-top flex-align-middle p-2">
        <Col md={4} className="d-flex">
            <span className="d-flex flex-middle"/>
            <span className="d-flex flex-align-middle">
                    <div>
                        <h6 className="mb-0">
                            {option.name}
                        </h6>
                    </div>
                </span>
        </Col>
        <Col md={5}>
            {renderDate(option)}
        </Col>
        <Col md={2}>
            <h6 className="mb-0 float-right">{LocaleUtils.formatCurrency(option.billing?.billingPrice)}</h6>
        </Col>
    </Row>
}

const CollapsibleLandedDiscountsBlock = (props: Props) => {

    const {title, icon, clientContext} = props
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as LandedLineService;
    const [open, setOpen] = useState(false)

    const toggle = () => {
        setOpen(prevState => {
            return !prevState
        })
    }
    const [optionState, setOptionState] = useState("Actives");
    const changeOptions = (val: ChangeEvent<HTMLInputElement>) => {
        if (val.currentTarget.value !== optionState) {
            setOptionState(val.currentTarget.value)
        }
    };

    const filterByDiscountStatus = (discount: LandedOption) => {
        if (optionState === "Actives") {
            return discount.status === "ACTIVE"
        } else {
            return discount.status === "TERMINATED"
        }
    };
    const sortDiscountByDate = (discountA: LandedOption, discountB: LandedOption) => {
        return ContractUtils.sortActiveDiscountsByDate(discountA, discountB);
    }

    const renderDiscounts = (discounts: LandedOption[]) => {
        const landedDiscounts = discounts.filter(discount => filterByDiscountStatus(discount));
        if (!landedDiscounts.length) {
            if (optionState === "Actives") {
                return ServiceUtils.renderEmptyDataMsg("offer.discounts.enabled.empty", true)
            } else {
                return ServiceUtils.renderEmptyDataMsg("offer.discounts.disabled.empty", true)
            }
        } else {
            return landedDiscounts.sort((discountA, discountB) => sortDiscountByDate(discountA, discountB)).map(e => renderDiscount(e))
        }
    }


    if (service && service.discounts && service.discounts.length > 0) {
        const discounts = [...service?.discounts];
        const numberOfActiveDiscount = discounts.filter(discount => discount.status === "ACTIVE").length;
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
                             {numberOfActiveDiscount} <FormattedPlural value={numberOfActiveDiscount}
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
                        <h6 className="mb-0 float-right">{LocaleUtils.formatCurrency(MobileServiceUtils.computeLandedDiscountAmount(discounts))}</h6>
                    </LoadableText>
                </Col>

                <Col sm={1}>
                    <span className={"icon " + (open ? "icon-up" : "icon-down")} onClick={toggle}/>
                </Col>
                <Collapse className="w-100 p-2" isOpen={open}>
                    {renderDiscounts(discounts)}
                </Collapse>
            </Row>
        )
    } else {
        return <React.Fragment/>
    }
}

export default CollapsibleLandedDiscountsBlock
