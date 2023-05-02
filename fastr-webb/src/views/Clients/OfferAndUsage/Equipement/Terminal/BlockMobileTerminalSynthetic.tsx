import React, {useEffect, useState} from "react";
import {FormGroup, Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {MobileLineService} from "../../../../../model/service";
import LoadableText from "../../../../../components/LoadableText";
import {MobileTerminal} from "../../../../../model/service/MobileTerminal";
import {FormattedMessage} from "react-intl";
import {is5G, renderOfferNetworkInfo} from "../../Offers/Utils/NetworkTypeUtils";
import ExternalLinksBlock from "../../../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../../../ExternalAppsConfig";
import {connect, useDispatch} from "react-redux";
import {fetchAndStoreExternalApps} from "../../../../../store/actions";
import {AppState} from "../../../../../store";
import ExternalAppsUtils from "../../../../../utils/ExternalAppsUtils";
import {ApplicationMode} from "../../../../../model/ApplicationMode";


interface Props {
    collapse: boolean
    userPassword: string
    perId: string
    sessionIsFrom: string
    clientContext?: ClientContextSliceState
    appsList : string[] | undefined,
}


const BlockMobileTerminalSynthetic = (props: Props) => {
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as MobileLineService;
    const externalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.blockMobileEquipements;
    const [showExternalApps, setShowExternalApps] = useState(false)
    const dispatch = useDispatch();
    useEffect(() => {
        if (service) {
            dispatch(fetchAndStoreExternalApps());
        }
    }, [service])

    useEffect(() => {
        setShowExternalApps(ExternalAppsUtils.isExternalAppAuthorized(props.appsList, externalAppsSettings));
    }, [props.appsList])

    const contractualTerminal = service?.contractualTerminal
    const usageTerminal = service?.usageTerminal
    const printedTerminal = usageTerminal ? usageTerminal : contractualTerminal
    const sameTerminal = contractualTerminal && contractualTerminal.imei && contractualTerminal.imei === usageTerminal?.imei

    const idParams = {
        perId: buildAdaptedPerId(props.perId),
        CodeTAC: "",
        password: props.userPassword
    }
    const isFromDisRc = () => {
        return props.sessionIsFrom === ApplicationMode.DISRC;
    }

    const shouldDisplayInfoMobileLink = () => {
        return  !isFromDisRc() && showExternalApps;
    }

    const completeIdParams = (imei?: string) => {
        return {
            ...idParams,
            CodeTAC: buildCodeTac(imei)
        };
    }

    if (props.collapse && printedTerminal) {
        return (
            <React.Fragment>
                <Row className="flex-align-middle p-2 border-top ">
                    <Col md={10} className="d-flex">
                <span className="d-flex flex-align-middle">
                    <div>
                        <LoadableText isLoading={service}>
                            <span className="icon-gradient icon-phone font-size-l mr-2"/>
                            <span className="mb-0 font-size-m font-weight-bold">
                                 {printTerminalName(printedTerminal)}
                          </span>
                        </LoadableText>
                    </div>
                </span>
                    </Col>

                    <Col md={2}/>
                </Row>
            </React.Fragment>
        )
    } else {
        return !sameTerminal ?
            (
                <React.Fragment>
                    {contractualTerminal &&
                    <React.Fragment>
                        <Row className="flex-align-middle p-2 border-top ">
                            <Col sm={12} className="d-flex">
                            <span className="d-flex flex-align-middle">
                                <div>
                                    <LoadableText isLoading={service}>
                                        <h6 className="mb-0">
                                             <FormattedMessage id={"offer.equipements.terminal.contractual"}/>
                                        </h6>
                                    </LoadableText>

                                </div>
                            </span>
                            </Col>
                        </Row>
                        <Row className="w-100 ml-1">
                            <Col sm={6} className="py-1 px-2">
                                <FormGroup className="py-1 px-2 display-field mb-1">
                                    <div>
                                        <h6>
                                            <FormattedMessage id={"offer.equipements.terminal.name"}/>
                                        </h6>
                                        <span>
                                            {!shouldDisplayInfoMobileLink() ? printTerminalName(contractualTerminal) :
                                                <ExternalLinksBlock textLink={printTerminalName(contractualTerminal)}
                                                                    settings={externalAppsSettings} isLoading={service}
                                                                    idParams={completeIdParams(contractualTerminal?.imei)}/>}
                                        </span>
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col sm={6} className="py-1 px-2">
                                <FormGroup className="py-1 px-2 display-field mb-1">
                                    <div>
                                        <h6>
                                            <FormattedMessage id={"offer.equipements.terminal.imei"}/>
                                        </h6>
                                        <span>
                                             {contractualTerminal?.imei}
                                        </span>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                    </React.Fragment>
                    }
                    {usageTerminal &&
                    <React.Fragment>
                        <Row className="flex-align-middle p-2 border-top ">
                            <Col sm={12} className="d-flex">
                            <span className="d-flex flex-align-middle">
                                <div>
                                    <LoadableText isLoading={service}>
                                        <h6 className="mb-0">
                                             <FormattedMessage id={"offer.equipements.terminal.used"}/>
                                        </h6>
                                    </LoadableText>

                                </div>
                            </span>
                            </Col>
                        </Row>
                        <Row className="w-100 ml-1">
                            <Col sm={6} className="py-1 px-2">
                                <FormGroup className="py-1 px-2 display-field mb-1">
                                    <div>
                                        <h6>
                                            <FormattedMessage id={"offer.equipements.terminal.name"}/>
                                        </h6>
                                        <span>
                                            {!shouldDisplayInfoMobileLink() ? printTerminalName(usageTerminal) :
                                                <ExternalLinksBlock textLink={printTerminalName(usageTerminal)}
                                                                    settings={externalAppsSettings} isLoading={service}
                                                                    idParams={completeIdParams(usageTerminal?.imei)}/>}
                                        </span>
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col sm={6} className="py-1 px-2">
                                <FormGroup className="py-1 px-2 display-field mb-1">
                                    <div>
                                        <h6>
                                            <FormattedMessage id={"offer.equipements.terminal.imei"}/>
                                        </h6>
                                        <span>
                                             {usageTerminal?.imei}
                                </span>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                    </React.Fragment>
                    }
                </React.Fragment>
            ) :
            (<React.Fragment>
                <Row className="flex-align-middle p-2 border-top ">
                    <Col sm={12} className="d-flex">
                            <span className="d-flex flex-align-middle">
                                <div>
                                    <LoadableText isLoading={service}>
                                         <span className="icon-gradient icon-phone font-size-l mr-2"/>
                                         <span className="mb-0 font-size-m font-weight-bold">
                                            <FormattedMessage id={"offer.equipements.terminal.contractualAndUsed"}/>
                                         </span>
                                    </LoadableText>
                                </div>
                            </span>
                    </Col>
                </Row>
                <Row className="w-100 ml-1">

                    <Col sm={6} className="py-1 px-2">
                        <FormGroup className="py-1 px-2 display-field mb-1">
                            <div>
                                <h6>
                                    <FormattedMessage id={"offer.equipements.terminal.name"}/>
                                </h6>
                                <span>
                                     {!shouldDisplayInfoMobileLink() ? printTerminalName(contractualTerminal) :
                                         <ExternalLinksBlock textLink={printTerminalName(contractualTerminal)}
                                                             settings={externalAppsSettings} isLoading={service}
                                                             idParams={completeIdParams(contractualTerminal?.imei)}/>}
                                </span>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm={6} className="py-1 px-2">
                        <FormGroup className="py-1 px-2 display-field mb-1">
                            <div>
                                <h6>
                                    <FormattedMessage id={"offer.equipements.terminal.imei"}/>
                                </h6>
                                <span>
                                    {contractualTerminal?.imei}
                                </span>
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
            </React.Fragment>)
    }
}

const printTerminalName = (terminal?: MobileTerminal) => {
    if (!terminal) {
        return <React.Fragment/>
    }
    if (terminal.name) {
        return (
            <React.Fragment>
                {terminal?.brand} {terminal?.name} {is5G(terminal?.bearer) && renderOfferNetworkInfo(terminal?.bearer)}
            </React.Fragment>
        )
    } else {
        return <FormattedMessage id={"offer.equipements.terminal.unknown"}/>
    }
}


const buildAdaptedPerId = (perId?: string) => {
    if (!perId) {
        return ""
    }
    return perId.replace("Id", "");
}

const buildCodeTac = (imei?: string) => {
    if (!imei) {
        return ""
    }
    return imei.substr(0, 8);
}


const mapStateToProps = (state: AppState) => ({
    appsList: state.externalApps.appsList,
    userPassword: state.store.applicationInitialState.userPassword,
    login: state.store.applicationInitialState?.user?.login,
    perId: state.store.applicationInitialState?.user?.perId,
    sessionIsFrom: state.store.applicationInitialState.sessionIsFrom
});


export default connect(mapStateToProps)(BlockMobileTerminalSynthetic)
