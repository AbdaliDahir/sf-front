import React from "react";
import {FormGroup} from "reactstrap";
import BlockMobilePlans from "./BlockMobilePlans";
import BlockMobileConsumption2 from "./Consumption/BlockMobileConsumption2";
import BlockMobilePaymentFacility from "./Equipement/BlockMobilePaymentFacility";
import BlockLandedOffer from "./Offers/BlockLandedOffer";
import BlockMobileOffer from "./Offers/BlockMobileOffer";
import {TabCategory} from "../../../model/utils/TabCategory";
import AlertBloc from "../AlertBloc";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import ServiceUtils from "../../../utils/ServiceUtils";
import BlockMobileRenewal from "./Equipement/Terminal/BlockMobileRenewal";
import BlockLandedPaymentFacility from "./Equipement/BlockLandedPaymentFacility";
import BlockEngagementsDetails from "./BlockMobileEngagementsDetails";
import BlockLandedConsumption from "./Consumption/BlockLandedConsumption"
import Loading from "../../../components/Loading";


interface Props {
    clientContext?: ClientContextSliceState
}

const OfferAndUsage = (props: Props) => {

    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const {service} = client;

    if (service && service.category) {
        const isMobileService = ServiceUtils.isMobileService(service);
        return (
            <React.Fragment>
                <FormGroup>
                    <AlertBloc pwd={TabCategory.OFFER_AND_USAGE} clientContext={clientContext}/>
                </FormGroup>
                <FormGroup>
                    {renderOfferAndUsage(isMobileService, clientContext)}
                </FormGroup>
                <FormGroup>
                    {renderPaymentFacility(isMobileService, clientContext)}
                </FormGroup>
                <FormGroup>
                    {renderMobilRenewal(isMobileService, clientContext)}
                </FormGroup>
                <FormGroup>
                    <BlockEngagementsDetails clientContext={clientContext}/>
                </FormGroup>
                {isMobileService && service.plans && service.plans.length > 0 &&
                <FormGroup>
                    <BlockMobilePlans plans={service.plans} clientContext={clientContext}/>
                </FormGroup>
                }
                <FormGroup>
                    {renderConsumptionBlock2(isMobileService, service.siebelAccount, clientContext)}
                </FormGroup>
            </React.Fragment>
        )
    } else {
        return <Loading/>
    }
}

const renderOfferAndUsage = (isMobileService: boolean, clientContext: ClientContextSliceState|undefined) => {
    if (isMobileService) {
        return (<BlockMobileOffer clientContext={clientContext}/>)
    }
    return (<BlockLandedOffer clientContext={clientContext}/>)
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

const renderConsumptionBlock2 = (isMobileService: boolean, siebelAccount: string|undefined, clientContext: ClientContextSliceState|undefined) => {
    if (isMobileService) {
        return <BlockMobileConsumption2 clientContext={clientContext}/>
    }
    return (<BlockLandedConsumption refClientDisRc={siebelAccount} clientContext={clientContext}/>)
}
export default OfferAndUsage
