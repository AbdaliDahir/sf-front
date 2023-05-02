import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import FormGroup from "reactstrap/lib/FormGroup";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {loadBills} from "../../../store/BillsSlices";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import BlockBills from "./BlockBills";
import BlockPayment from "./BlockPayment";
import ServiceUtils from "../../../utils/ServiceUtils";
import {fetchAndStoreBillingsSettings} from "../../../store/actions";


const BillingAndPaymentsRCViewSynthetic = () => {

    const client: ClientContextSliceState = useTypedSelector(state => state.store.clientContext);
    const {service} = client;
    const dispatch = useDispatch();

    useEffect(() => {
        if (service) {
            const accountId = service.billingAccount.id
            const refSiebel = service?.siebelAccount

            dispatch(loadBills(accountId, refSiebel, ServiceUtils.isMobileService(service)));
        }
    }, [service])

    useEffect(() => {
        dispatch(fetchAndStoreBillingsSettings());
    }, [])

    return (
        <React.Fragment>
            <FormGroup>
                <BlockPayment/>
            </FormGroup>
            <FormGroup>
                <BlockBills/>
            </FormGroup>
        </React.Fragment>
    )
};

export default BillingAndPaymentsRCViewSynthetic
