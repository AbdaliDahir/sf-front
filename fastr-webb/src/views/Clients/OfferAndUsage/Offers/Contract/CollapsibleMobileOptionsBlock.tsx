import React, {ChangeEvent, useState} from "react";
import 'react-block-ui/style.css';
import {Col, Collapse, FormGroup, Input} from "reactstrap"
import Row from "reactstrap/lib/Row";
import {FormattedMessage, FormattedPlural} from "react-intl";


import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {MobileLineService} from "../../../../../model/service";
import LoadableIcon from "../../../../../components/LoadableIcon";
import LoadableText from "../../../../../components/LoadableText";
import {MobileOption} from "../../../../../model/service/MobileOption";
import LocaleUtils from "../../../../../utils/LocaleUtils";
import MobileServiceUtils from "../../../../../utils/MobileServiceUtils";
import ContractUtils from "../Utils/ContractUtils";
import {
    renderOnlyStartDate,
    renderRunningOptionsOrDiscounts,
    renderTerminatedOptionsOrDiscounts
} from "../Utils/OffersUtils";
import ServiceUtils from "../../../../../utils/ServiceUtils";
import {is5G, renderOfferNetworkInfo} from "../Utils/NetworkTypeUtils";


interface Props {
    title: string
    icon: string
    clientContext?: ClientContextSliceState
}


const renderOption = (option: MobileOption) => {
    return <Row className="border-top flex-align-middle p-2" key={option.id}>
        <Col md={4} className="d-flex">
            <span className="d-flex flex-middle"/>
            <span className="d-flex flex-align-middle">
                    <div>
                        <h6 className="mb-0">
                            {option.name}
                        </h6>
                    </div>
                    { is5G(option.networkType) && formatNetworkInfo(option)}
                </span>
        </Col>
        <Col md={3}>
            {renderDate(option)}
        </Col>
        <Col md={3} className={"text-center"}>
            {renderPeriodicity(option)}
        </Col>
        <Col md={2} className={"text-center"}>
            <h6 className="mb-0 float-right">{LocaleUtils.formatCurrency(option?.billing?.billingPrice)}</h6>
        </Col>
    </Row>
};

const formatNetworkInfo = (option :MobileOption) => {
    return (<React.Fragment>
        {" (Compatible"} {renderOfferNetworkInfo(option.networkType, option.debit, option.unit)} {" )"}
        </React.Fragment>
    )
};

const renderPeriodicity = (option: MobileOption) => {
    const billingType = option.billing?.billingType;
    const billingPeriodicty = option.billing?.billingPeriodicty;
    if (billingType) {
        if (billingType === "PERIODIC" && billingPeriodicty === "MONTHLY") {
            return "Récurrente"
        } else if (billingType === "PONCTUAL") {
            return "Ponctuelle"
        }
    }
    return ""
};


const renderDate = (option: MobileOption) => {
    const startDate = new Date(option.activationDate ? option.activationDate : option.creationDate);
    let endDate;
    if (option.endDate) {
        endDate = new Date(option.endDate);
    }
    if (endDate) {
        if (option.status === "ACTIVE") {
            return renderRunningOptionsOrDiscounts(startDate, endDate)
        } else if (option.status === "TERMINATED" && startDate) {
            return renderTerminatedOptionsOrDiscounts(startDate, endDate)
        }
    } else {
        return renderOnlyStartDate(startDate)
    }
    return;
};

const CollapsibleMobileOptionsBlock = (props: Props) => {
    const {title, icon, clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as MobileLineService;
    const [open, setOpen] = useState(false);
    const [optionState, setOptionState] = useState("Actives");
    const toggle = () => {
        setOpen(prevState => {
            return !prevState
        })
    };

    const changeOptions = (val: ChangeEvent<HTMLInputElement>) => {
        if (val.currentTarget.value !== optionState) {
            setOptionState(val.currentTarget.value)
        }
    };

    const filterByOptionStatus = (option: MobileOption) => {
        if (optionState === "Actives") {
            return option.status === "ACTIVE"
        } else {
            return option.status === "TERMINATED"
        }
    };

    const sortOptionByDate = (optionA: MobileOption, optionB: MobileOption) => {
        if (optionState === "Actives") {
            return ContractUtils.sortActiveMobileOptions(optionA, optionB);
        } else {
            return ContractUtils.sortTerminatedOptionsByDate(optionA, optionB);
        }
    };

    const renderMobileOptions = (options: MobileOption[]) => {
        const mobileOptions = options.filter(o => filterByOptionStatus(o));
        if (!mobileOptions.length) {
            if (optionState === "Actives") {
                return ServiceUtils.renderEmptyDataMsg("offer.options.enabled.empty", true)
            } else {
                return ServiceUtils.renderEmptyDataMsg("offer.options.disabled.empty", true)
            }
        } else {
            return mobileOptions.sort((optionA, optionB) => sortOptionByDate(optionA, optionB))
                .map(e => renderOption(e))
        }
    }


    if (service && service.options && service.options.length > 0) {
        const options = [...service.options];
        const billedOptions = options.filter(option => option.status === 'ACTIVE' && option?.billing?.billingPrice > 0)?.length;
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
                            {billedOptions} <FormattedPlural value={billedOptions} one="option payante"
                                                             other="options payantes"/>
                        </LoadableText>
                    </div>
                </span>
                </Col>
                <Col md={{size: 2}}>
                    {!!open &&
                    <FormGroup>
                        <Input type="select"
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
                {!!MobileServiceUtils.computeOptionAmount(service) &&
                <Col md={2} className={'offset-md-3'}>
                    <LoadableText isLoading={service}>
                        <h6 className="mb-0 float-right">{LocaleUtils.formatCurrency(MobileServiceUtils.computeOptionAmount(service))}</h6>
                    </LoadableText>
                </Col>
                }
                <Col sm={1}>
                    <span className={"icon " + (open ? "icon-up" : "icon-down")} onClick={toggle}/>
                </Col>
                <Collapse className="w-100 p-2" isOpen={open}>
                    {renderMobileOptions(options)}
                </Collapse>
            </Row>
        )
    } else {
        return <React.Fragment/>
    }
};


export default CollapsibleMobileOptionsBlock