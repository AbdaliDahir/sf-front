import React from "react";
import 'react-block-ui/style.css';
import {
    Col, UncontrolledTooltip,
} from "reactstrap"
import Row from "reactstrap/lib/Row";
import {FormattedMessage} from "react-intl";
import {LandedLineService} from "../../../../../model/service/LandedLineService";
import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";

import LoadableIcon from "../../../../../components/LoadableIcon";
import LoadableText from "../../../../../components/LoadableText";
import LocaleUtils from "../../../../../utils/LocaleUtils";


interface Props {
    title: string
    icon: string
    clientContext?: ClientContextSliceState
}

const LandedOfferPriceBlock = (props: Props) => {

    const {title, icon, clientContext} = props
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as LandedLineService;
    const currentplan = service?.landedPlan

    return (
        <Row className="flex-align-middle p-2">
            <Col md={4} className="d-flex">
                <UncontrolledTooltip placement="left" target="price">
                    <FormattedMessage id="offer.active.price.info"/>
                </UncontrolledTooltip>
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
                    </div>
                </span>
                <span id="price" className="icon-gradient icon-info mx-2"/>
            </Col>
            <Col md={5}/>
            <Col md={2}>
                <LoadableText isLoading={service}>
                    <h6 className="mb-0 float-right">{LocaleUtils.formatCurrency(currentplan?.offerPrice)}</h6>
                </LoadableText>
            </Col>
        </Row>
    )
}

export default LandedOfferPriceBlock
