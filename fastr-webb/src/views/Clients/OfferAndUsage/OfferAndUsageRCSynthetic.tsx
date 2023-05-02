import React from "react";

import {FormGroup} from "reactstrap";
import {Service} from "../../../model/service";
import BlockLandedOffer from "./Offers/BlockLandedOffer";
import BlockMobileOffer from "./Offers/BlockMobileOffer";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import ServiceUtils from "../../../utils/ServiceUtils";
import BlockEngagementsDetails from "./BlockMobileEngagementsDetails";
import Loading from "../../../components/Loading";
import BlockMobilePaymentFacility from "./Equipement/BlockMobilePaymentFacility";
import BlockLandedPaymentFacility from "./Equipement/BlockLandedPaymentFacility";
import BlockMobileRenewal from "./Equipement/Terminal/BlockMobileRenewal";


interface Props {
    clientContext?: ClientContextSliceState
}

const OfferAndUsageRCSynthetic = (props: Props) => {
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const {service} = client;

    //pour le loading
    if (service && service.category) {
        const isMobileService = ServiceUtils.isMobileService(service);
        return (
            <React.Fragment>
                <FormGroup>
                    {renderOfferAndUsage(service)}
                </FormGroup>
                <FormGroup>
                    {renderPaymentFacility(isMobileService, clientContext)}
                </FormGroup>
                <FormGroup>
                    {renderMobilRenewal(isMobileService, clientContext)}
                </FormGroup>
                <FormGroup>
                    <BlockEngagementsDetails/>
                </FormGroup>
            </React.Fragment>
        )
    } else {
        return <Loading/>
    }
}
const renderPaymentFacility = (isMobileService: boolean, clientContext: ClientContextSliceState|undefined) => {
    if (isMobileService) {
        return (<BlockMobilePaymentFacility clientContext={clientContext}/>)
    }
    return (<BlockLandedPaymentFacility clientContext={clientContext}/>)
}

const renderMobilRenewal = (isMobileService: boolean, clientContext: ClientContextSliceState|undefined) => {
    if (isMobileService) {
        return (<BlockMobileRenewal clientContext={clientContext}/>)
    }
    return <React.Fragment/>
}

const renderOfferAndUsage = (service: Service | undefined) => {
    if (ServiceUtils.isMobileService(service)) {
        return (<BlockMobileOffer/>)
    }
    return (<BlockLandedOffer/>)

}
export default OfferAndUsageRCSynthetic
