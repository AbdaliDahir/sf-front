import React from "react";
import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {MobileLineService, Renewal} from "../../../../../model/service";
import {FormattedDate, FormattedMessage} from "react-intl";
import CardHeader from "reactstrap/lib/CardHeader";
import Card from "react-bootstrap/Card";
import DisplayTitle from "../../../../../components/DisplayTitle";
import CardBody from "reactstrap/lib/CardBody";
import DateUtils from "../../../../../utils/DateUtils";
import ExternalLinksBlock from "../../../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../../../ExternalAppsConfig"

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockMobileRenewal = (props: Props) => {
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const service = client.service as MobileLineService;
    const renewalData = client?.renewalData?.mobileRenewal as Renewal;

    const externalAppsSettings = BlocksExternalAppsConfig.offerAndUsage.blockMobileRenewal;

    const shouldDisplayLastRM = () => {
        if (renewalData) {
            return !(new Date(renewalData?.lastRenewal)?.getDate() === new Date()?.getDate() && renewalData?.remainingMonths === 0);
        }
        return false
    };

    if (shouldDisplayLastRM()) {
        return (
            <Card>
                <CardHeader className="d-flex">
                    <div className="d-flex justify-content-between w-100">
                        <div className="d-flex justify-content-between">
                            <DisplayTitle icon="icon-gradient icon-restart" fieldName="offer.renewal.title"
                                          isLoading={client.renewalData}/>
                            <div>
                                &nbsp;
                                <FormattedDate value={renewalData?.lastRenewal}/>
                                &nbsp;
                                (sur {calculateRmDuration(renewalData)} mois)
                            </div>
                        </div>
                        {!!externalAppsSettings?.length &&
                            <div>
                                <ExternalLinksBlock settings={externalAppsSettings} isLoading={client.renewalData} clientContext={clientContext}/>
                            </div>
                        }
                    </div>
                </CardHeader>
                {service.brand !== "RED" &&
                <CardBody className="text-center">
                            <span>
                                <FormattedMessage id={"offer.renewal.next.best.price"}/> &nbsp;
                                <span className="font-weight-bold font-size-l" style={{color: '#26c281'}}>
                                    <FormattedDate value={renewalData?.nextRenewal}/>
                                </span>
                            </span>
                </CardBody>
                }
            </Card>
        )
    } else {
        return <React.Fragment/>
    }
}

const calculateRmDuration = (renewalData: Renewal | undefined) => {
    const endRenewal = renewalData?.dateFinOptionMobile!;
    if (!endRenewal) {
        return 0
    }
    return (DateUtils.monthsBetween(new Date(renewalData?.lastRenewal!), new Date(renewalData?.dateFinOptionMobile!)))
}

export default BlockMobileRenewal
