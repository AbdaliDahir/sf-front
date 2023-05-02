import React from "react";
import {Card, CardBody, CardHeader} from "reactstrap";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {MobileLineService} from "../../../model/service";
import DisplayTitle from "../../../components/DisplayTitle";
import BlockMobileSim from "../OfferAndUsage/Equipement/Sim/BlockMobileSimSynthetic";
import BlockMobileBox4gSynthetic from "../OfferAndUsage/Equipement/Box4g/BlockMobileBox4gSynthetic";
import ExternalLinksBlock from "../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../ExternalAppsConfig"
import {NatureDeServiceBios} from "../../../model/enums/NatureDeServiceBios";
import JarvisEquipment from "../OfferAndUsage/Equipement/jarvis/JarvisEquipment";

interface Props {
    fastrView?: boolean,
    clientContext?: ClientContextSliceState,
    forIframeView?: boolean
}
const BlockMobileEquipements = (props: Props) => {

    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as MobileLineService;
    const externalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.blockMobileEquipements;
    return (
        <div>
            {
                !props.fastrView ?
                <div className="container-fluid">
                    <BlockMobileSim collapse={false} clientContext={clientContext}/>
                    <BlockMobileBox4gSynthetic collapse={false} csuLigne={client.serviceId} clientContext={clientContext} forIframeView={props.forIframeView}/>
                </div>
                :
                <Card>
                    <CardHeader className="d-flex justify-content-between">
                        <DisplayTitle icon="icon-gradient icon-multi-devices" fieldName="offer.equipements.title"
                                    isLoading={service}/>
                        <div className="d-flex justify-content-between align-items-center">
                            { !!externalAppsSettings?.length &&
                                <div className="mr-2">
                                    <ExternalLinksBlock settings={externalAppsSettings} isLoading={service} clientContext={clientContext}/>
                                </div>
                            }
                        </div>
                    </CardHeader>
                    <CardBody>
                        <BlockMobileSim collapse={false} clientContext={clientContext}/>
                        {
                            clientContext?.service?.natureServiceBios === NatureDeServiceBios.HOME ?
                                <JarvisEquipment  collapse={false}/> :
                                <BlockMobileBox4gSynthetic collapse={false} csuLigne={client.serviceId} clientContext={clientContext} forIframeView={props.forIframeView}/>
                        }
                    </CardBody>
                </Card>
            }
        </div>
    );
}

export default BlockMobileEquipements
