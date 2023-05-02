import React from "react";
import {Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {MobileLineService} from "../../../../../model/service";
import LoadableText from "../../../../../components/LoadableText";
import LocaleUtils from "../../../../../utils/LocaleUtils";
import DisplayField from "../../../../../components/DisplayField";
import {SimCard} from "../../../../../model/service/SimCard";
import {FormattedMessage} from "react-intl";
import BlockMobileSimPin from "./BlockMobileSimPin";

interface Props {
    collapse: boolean
    clientContext?: ClientContextSliceState
}

const BlockMobileSimSynthetic = (props: Props) => {
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as MobileLineService;
    const simCard = service?.simCard


    return (
        <React.Fragment>
            <Row className="flex-align-middle p-2 ">
                <Col sm={10} className="d-flex">
                <span className="d-flex flex-align-middle">
                    <div>
                        <LoadableText isLoading={service}>
                            <span className="icon-gradient icon-sim-card font-size-xl mr-2"/>
                            <span className="mb-0 font-size-m font-weight-bold">
                                {printSimName(simCard)}
                            </span>
                        </LoadableText>
                    </div>
                </span>
                </Col>

                <Col sm={2}>
                    <LoadableText isLoading={service}>
                        <h6 className="mb-0 float-right">{LocaleUtils.formatCurrency(simCard?.simPrice, true)}</h6>
                    </LoadableText>
                </Col>
            </Row>
            {!props.collapse &&
            <Row className="w-100 ml-1">
                <Col sm={6} className="py-1 px-2">
                    <DisplayField fieldName={"offer.equipements.sim.iccid"} fieldValue={simCard?.iccid}
                                  isLoading={service}/>
                    <DisplayField fieldName={"offer.equipements.sim.imsi"} fieldValue={simCard?.imsi}
                                  isLoading={service}/>
                </Col>
                <Col sm={6} className="py-1 px-2">
                    <BlockMobileSimPin simCard={simCard}/>
                </Col>
            </Row>
            }
        </React.Fragment>
    )
}

const printSimName = (sim?: SimCard) => {
    if (!sim) {
        return <FormattedMessage id={"offer.equipements.sim"}/>
    } else {
        if (sim.type && sim.type !== "") {
            return <React.Fragment><FormattedMessage id={"offer.equipements.sim.type"}/> {sim.type} </React.Fragment>
        }
        else {
            return <FormattedMessage id={"offer.equipements.sim"}/>
        }
    }
}

export default BlockMobileSimSynthetic
