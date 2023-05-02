import React from "react";

import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {MobileLineService} from "../../../model/service";
import Card from "reactstrap/lib/Card";
import {CardBody, CardHeader} from "reactstrap";
import DisplayTitle from "../../../components/DisplayTitle";
import LoadableText from "../../../components/LoadableText";
import {FormattedMessage} from "react-intl";
import MobileEngagementTimeline from "./Offers/Engagement/MobileEngagementTimeline";
import ExternalLinksBlock from "../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../ExternalAppsConfig"

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockEngagementsDetails = (props: Props) => {
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as MobileLineService;
    const externalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.blockEngagementsDetails;

    return (
        <Card>
            <CardHeader className="d-flex justify-content-between">
                <DisplayTitle icon="icon-bill" isLoading={service}>
                    <LoadableText isLoading={service}>
                        <FormattedMessage id="offer.engagements.title"/>
                    </LoadableText>
                </DisplayTitle>
                <LoadableText isLoading={service}>
                    <span>{service?.engagementCurrentStatus?.currentEngagementStatusLabel}</span>
                </LoadableText>
                { !!externalAppsSettings?.length &&
                    <ExternalLinksBlock settings={externalAppsSettings} isLoading={true} clientContext={clientContext}/>
                }
            </CardHeader>
            <CardBody>
                <MobileEngagementTimeline clientContext={clientContext}/>
            </CardBody>
        </Card>
    );
}

export default BlockEngagementsDetails
