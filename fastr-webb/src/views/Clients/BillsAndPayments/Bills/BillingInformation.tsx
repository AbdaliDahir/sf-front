import React from "react";
import Col from "reactstrap/lib/Col";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import DisplayField from "../../../../components/DisplayField";
import LocaleUtils from "../../../../utils/LocaleUtils";
import {FormGroup, Row} from "reactstrap";
import BillingTablesContainer from "./BillingTablesContainer";
import ServiceUtils from "../../../../utils/ServiceUtils";
import {Service} from "../../../../model/service";
import {BillingInformation} from "../../../../model/person/billing/BillingInformation";
import {FormattedMessage} from "react-intl";
import Loading from "../../../../components/Loading";
import {shallowEqual} from "react-redux";

interface Props {
    clientContext?: ClientContextSliceState
}

const BillingInformation = (props: Props) => {
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const {service} = client;
    const bills = clientContext ? (
        useTypedSelector(state => state.store.client.loadedClients.find(c => c.clientData?.id === clientContext.clientData?.id && c.serviceId === clientContext.service?.id)?.bills, shallowEqual)
    ) : (
        useTypedSelector(state => state.bills.data)
    );
    const billingAccountValue = getBillingAccountValue(service);

    return (
        <React.Fragment>
            <Row className="w-100 m-2">
                <Col sm={6}>
                    <DisplayField fieldName="billsAndPayment.billingAccount.label"
                                  isLoading={service}
                                  fieldValue={billingAccountValue}
                                  bold/>
                </Col>
                <Col sm={6}>
                    <FormGroup className="py-1 px-2 display-field mb-1">
                        <div>
                            <h6>
                                <FormattedMessage id={getBalanceLabel(service, bills)}/>
                            </h6>
                            {getBalanceValue(service, bills)}
                        </div>
                    </FormGroup>
                </Col>
            </Row>
            <div className="mt-4 w-100">
                {bills ? <BillingTablesContainer clientContext={clientContext}/> : <Loading/>}
            </div>
        </React.Fragment>
    );
}

const getBalanceValue = (service: Service | undefined, bills: BillingInformation | undefined) => {
    const balance = bills?.balance;
    if (balance) {
        if (balance < 0) {
            return (
                <span style={{color: '#17B01E', fontWeight: 'bold'}}>
                    {LocaleUtils.formatCurrency(bills?.balance, true, true)}
                </span>
            );
        } else if (balance > 0) {
            return (
                <span style={{color: 'red', fontWeight: 'bold'}}>
                    {LocaleUtils.formatCurrency(bills?.balance, true, true)}
                </span>
            );
        }
    }
    return (
        <span>
            {LocaleUtils.formatCurrency(bills?.balance, true, true)}
        </span>
    );
}

const getBillingAccountValue = (service: Service | undefined) => {
    const defaultVal = service?.billingAccount.id;
    if (ServiceUtils.isMobileService(service)) {
        return service?.billingAccount.groupedBills ? defaultVal + " " + "(Facture Groupée)" : defaultVal
    }
    return defaultVal;
}

const getBalanceLabel = (service: Service | undefined, bills: BillingInformation | undefined) => {
    let balanceLabel = "billsAndPayment.billingAccount.balance";
    const balance = bills?.balance;
    if (balance) {
        if (balance < 0) {
            balanceLabel = "billsAndPayment.billingAccount.balance.negative"
        } else if (balance > 0) {
            balanceLabel = "billsAndPayment.billingAccount.balance.positive"
        }
    }
    return balanceLabel;
}

export default BillingInformation;