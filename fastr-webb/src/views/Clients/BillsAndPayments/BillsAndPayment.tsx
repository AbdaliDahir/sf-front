import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import FormGroup from "reactstrap/lib/FormGroup";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {TabCategory} from "../../../model/utils/TabCategory";
import {loadBills} from "../../../store/BillsSlices";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import AlertBlock from "../AlertBloc";
import BlockBills from "./BlockBills";
import BlockPayment from "./BlockPayment";
import ServiceUtils from "../../../utils/ServiceUtils";
import {fetchAndStoreBillingsSettings} from "../../../store/actions";
import GraphicalAnalysis from "./GraphicalAnalysis/GraphicalAnalysis";
import {isAllowedAutorisation} from "../../../utils/AuthorizationUtils";
import {fetchBillsAndStoreClientV2} from "../../../store/actions/v2/client/ClientActions";
import BillingTablesContainer from "./Bills/BillingTablesContainer";


const BillsAndPayments = (props) => {
    const {filter, clientContext} = props;

    const client: ClientContextSliceState = clientContext? clientContext : useTypedSelector(state => state.store.clientContext);
    const authorizations = useTypedSelector(state => state.store.applicationInitialState.authorizations);
    const {service} = client;
    const dispatch = useDispatch();

    useEffect(() => {
        if (service) {
            const accountId = service.billingAccount.id
            const refSiebel = service?.siebelAccount
            const isMobileLine = ServiceUtils.isMobileService(service);

            if (clientContext) {
                dispatch(fetchBillsAndStoreClientV2(accountId, refSiebel, isMobileLine));
            } else {
                dispatch(loadBills(accountId, refSiebel, isMobileLine));
            }
        }
    }, [service])

    useEffect(() => {
        dispatch(fetchAndStoreBillingsSettings());
    }, [])

    return ( filter ?
        <div className="timeline-container pl-2">
            <BillingTablesContainer paiementsShow={filter}/>
        </div> :
        <React.Fragment>
            <FormGroup>
                <AlertBlock pwd={TabCategory.BILLS_AND_PAYMENT} clientContext={clientContext}/>
            </FormGroup>
            <FormGroup>
                <BlockPayment service={service}/>
            </FormGroup>
            {isAllowedAutorisation(authorizations, "isSuperUser") &&
                <FormGroup>
                    <GraphicalAnalysis clientContext={clientContext}/>
                </FormGroup>
            }
            <FormGroup>
                <BlockBills clientContext={clientContext}/>
            </FormGroup>
        </React.Fragment>
    )
};

export default BillsAndPayments
