import React from 'react';
import BillsAndPayments from "../BillsAndPayments/BillsAndPayment";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";

interface Props {
    clientContext?: ClientContextSliceState
}

const BillingAndPayment = (props: Props) => {

    const {clientContext} = props;

    return (
        <div>
            <BillsAndPayments clientContext={clientContext}/>
        </div>
    );
}

export default BillingAndPayment;
