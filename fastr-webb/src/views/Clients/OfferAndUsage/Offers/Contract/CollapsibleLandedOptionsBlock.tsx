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

const CollapsibleLandedOptionsBlock = (props: Props) => {

    const {title, icon, clientContext} = props
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as LandedLineService;
    const [open, setOpen] = useState(false)
    const [optionState, setOptionState] = useState("Actif");
    const toggle = () => {
        setOpen(prevState => {
            return !prevState
        })
    }
    const renderDate = (option: LandedOption) => {
        if (!option.activationDate) {
            return;
        }
        const activationDate = new Date(option.activationDate)
        let endDate
        if (option.terminationDate) {
            endDate = new Date(option.terminationDate);
        }
        if (endDate) {
            const optionStatus = option.status
            if (optionStatus === "Actif" || !optionStatus) {
                return renderRunningOptionsOrDiscounts(activationDate, endDate)
            } else if (optionStatus === "Désactivé") {
                return renderTerminatedOptionsOrDiscounts(activationDate, endDate)
            }
        } else {
            return renderOnlyStartDate(activationDate)
        }
        return;
    };
    const changeOptions = (val: ChangeEvent<HTMLInputElement>) => {
        if (val.currentTarget.value !== optionState) {
            setOptionState(val.currentTarget.value)
        }
    };

    const sortOptionsByDate = (optionA: LandedOption, optionB: LandedOption) => {
        if (optionState === "Actif") {
            return ContractUtils.sortActiveLandedOptions(optionA, optionB);
        } else {
            return ContractUtils.sortActiveDiscountsByDate(optionA, optionB);
        }
    }

    const renderSuspendedOptionStatus = (option : LandedOption) => {
        if (option && option?.status == "Suspendu") {
            return (
                <React.Fragment>
                    <span className="icon-gradient icon-warning"/> <span className="text-danger font-weight-bold ml-2">Suspendue</span>
                </React.Fragment>)
        } else {
            return <React.Fragment/>
        }
    };

    const filterByOptionStatus = (option) => {
        if (optionState === "Actif") {
            return option.status === "Actif" || option.status === null || option.status === "Suspendu"
        } else {
            return option.status === "Désactivé"
        }
    };

    const renderParameters = (option: LandedOption) => {
        if (option?.parameters) {
            return (
                <React.Fragment>
                    {Object.entries(option?.parameters).map(([key, value]) => {
                        return (<Row key={key}><Col><b>{key}</b>: {value}</Col></Row>)
                    })}
                </React.Fragment>
            )
        } else
            return <React.Fragment />
    };

    const renderOption = (option: LandedOption) => {
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
            <Col md={3}>
                {renderDate(option)}
            </Col>
            <Col md={5}>
                <Row>
                    <Col md={3} className="p-0">
                        {renderSuspendedOptionStatus(option)}
                    </Col>
                    <Col md={5}>
                        {renderParameters(option)}
                    </Col>
                    <Col md={4}>
                        <h6 className="mb-0 float-right">{LocaleUtils.formatCurrency(option?.billing?.billingPrice)}</h6>
                    </Col>
                </Row>
            </Col>
        </Row>
    }

    const renderOptions = (options: LandedOption[]) => {
        const landedOptions = options.filter(option => filterByOptionStatus(option));
        if (!landedOptions.length) {
            if (optionState === "Actif") {
                return ServiceUtils.renderEmptyDataMsg("offer.options.enabled.empty", true)
            } else {
                return ServiceUtils.renderEmptyDataMsg("offer.options.disabled.empty", true)
            }
        } else {
            return landedOptions.sort((optionA, optionB) => sortOptionsByDate(optionA, optionB)).map(e => renderOption(e))}
        }

    if (service && service.options) {
        const options = [...service.options];
        const billedOptions = options.filter(e => e?.status === "Actif").filter(e => e?.billing?.billingPrice > 0)?.length
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
                        <Input
                            type="select"
                            name={"select"}
                            id={"selectType"}
                            onChange={changeOptions}
                            value={optionState}>
                            <option value="Actif">Actives/Suspendues</option>
                            <option value="Désactivé">Inactives</option>
                        </Input>
                    </FormGroup>
                    }
                </Col>
                <Col md={2} className={'offset-md-3'}>
                    <LoadableText isLoading={service}>
                        <h6 className="mb-0 float-right">{LocaleUtils.formatCurrency(MobileServiceUtils.computeLandedOptionAmount(options))}</h6>
                    </LoadableText>
                </Col>
                <Col sm={1}>
                     <span className={"icon " + (open ? "icon-up" : "icon-down")} onClick={toggle}/>
                </Col>
                <Collapse className="w-100 p-2" isOpen={open}>
                    {renderOptions(options)}
                </Collapse>
            </Row>
        )
    } else {
        return <React.Fragment/>
    }
}

export default CollapsibleLandedOptionsBlock
