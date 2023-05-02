import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {ClientContextSliceState, fetchClient, fetchLandedPaymentFacility} from "../../../store/ClientContextSlice";
import {DataLoad} from "../../../context/ClientContext";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import BillingAndPaymentsRCViewSynthetic from "../BillsAndPayments/BillsAndPaymentsRCSynthetic";

const BillsAndPaymentsRCViewSynthetic = (props) => {
    const dispatch = useDispatch();
    const {clientId, serviceId} = useParams();
    const client: ClientContextSliceState = useTypedSelector(state => state.store.clientContext);
    const [clientAlreadyLoaded,setClientAlreadyLoaded]= useState(false);

    useEffect(() => {
        if (clientId && serviceId) {
            dispatch(fetchClient(clientId, serviceId, DataLoad.ONE_SERVICE, true));
        }
    }, [])

    useEffect(() => {
        if (!clientAlreadyLoaded && !client.loading && client.clientData) {
            dispatch(fetchLandedPaymentFacility(client.service?.siebelAccount));
            setClientAlreadyLoaded(true);
        }
    }, [client.loading])

    return (
        <div>
            <BillingAndPaymentsRCViewSynthetic/>
        </div>
    );
}

export default BillsAndPaymentsRCViewSynthetic
