import React from "react";
import {Card, CardBody, CardHeader, CardText} from "reactstrap";
import DisplayTitle from "../../../components/DisplayTitle";
import BillingInformation from "./Bills/BillingInformation";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import ExternalLinksBlock from "../ExternalLinksBlock";
import {BlocksExternalAppsConfig} from "../ExternalAppsConfig"
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {shallowEqual} from "react-redux";

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockBills = (props: Props) => {
    const {clientContext} = props;
    const bills = clientContext ? (
        useTypedSelector(state => state.store.client.loadedClients.find(c => c.clientData?.id === clientContext.clientData?.id && c.serviceId === clientContext.service?.id)?.bills, shallowEqual)
    ) : (
        useTypedSelector(state => state.bills.data)
    );
    const externalAppsSettings = BlocksExternalAppsConfig.billingAndPayment.BlockBills;

    return <div className="card-block">
        <Card>
            <CardHeader className="d-flex justify-content-between">
                <DisplayTitle icon="icon-gradient icon-bill" fieldName="billsAndPayment.title"
                              isLoading={bills}/>

                <ExternalLinksBlock settings={externalAppsSettings} isLoading={bills} clientContext={clientContext}/>

            </CardHeader>
            <CardBody>
                <CardText tag={"div"}>
                    <BillingInformation clientContext={clientContext}/>
                </CardText>
            </CardBody>
        </Card>
    </div>
};

export default BlockBills
