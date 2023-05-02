import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {
    ClientContextSliceState,
    fetchClient,
    fetchLandedPaymentFacility,
    fetchMobileRenewal
} from "../../../store/ClientContextSlice";
import {DataLoad} from "../../../context/ClientContext";
import {useDispatch} from "react-redux";
import OfferAndUsageRCSynthetic from "./OfferAndUsageRCSynthetic";
import ServiceUtils from "../../../utils/ServiceUtils";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";

const OfferAndUsageRCViewSynthetic = (props) => {
    const dispatch = useDispatch();
    const {clientId, serviceId} = useParams();

    const client: ClientContextSliceState = useTypedSelector(state => state.store.clientContext);
    const [clientAlreadyLoaded, setClientAlreadyLoaded] = useState(false);

    useEffect(() => {
        if (clientId && serviceId) {
            dispatch(fetchClient(clientId, serviceId, DataLoad.ONE_SERVICE, true, true));
        }
    }, [])

    useEffect(() => {
        if (!clientAlreadyLoaded && !client.loading && client.clientData) {
            const isMobileService = ServiceUtils.isMobileService(client.service);
            isMobileService ? dispatch(fetchMobileRenewal(serviceId)) : dispatch(fetchLandedPaymentFacility(client.service?.siebelAccount));
            setClientAlreadyLoaded(true);
        }
    }, [client.loading])

    return (
        <div>
            <OfferAndUsageRCSynthetic />
        </div>
    );
}

export default OfferAndUsageRCViewSynthetic