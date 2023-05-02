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
import OfferAndUsage from "./OfferAndUsage";
import {useTypedSelector} from 'src/components/Store/useTypedSelector';
import ServiceUtils from "../../../utils/ServiceUtils";

const OfferAndUsageRCViewDetailed = (props) => {
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
            <OfferAndUsage/>
        </div>
    );
}

export default OfferAndUsageRCViewDetailed