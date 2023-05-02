import * as React from "react";
import classnames from 'classnames';
import Row from "reactstrap/lib/Row";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import BankingMovementBill from "./BankinMovements/BankingMovementBill";
import {shallowEqual} from "react-redux";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";

interface Props {
    clientContext?: ClientContextSliceState
    filter: string
    activeTab?: string
}

const BillingTable = (props: Props) => {
    const {clientContext} = props;
    const bills = clientContext ? (
        useTypedSelector(state => state.store.client.loadedClients.find(c => c.clientData?.id === clientContext.clientData?.id && c.serviceId === clientContext.service?.id)?.bills, shallowEqual)
    ) : (
        useTypedSelector(state => state.bills.data)
    );

    const paymentFacilityDueLabel =  "Echéance FDP"

    if (bills) {
        const dataToDisplay = props.filter !== "all" ? bills?.bankingMovements.filter(bankingMovement => {
                switch (props.filter) {
                    case "bills" :
                        if (bankingMovement.bill?.id || bankingMovement.name == paymentFacilityDueLabel) return bankingMovement
                        break;
                    case "movement" :
                        if (!bankingMovement.bill && !bankingMovement.rejectionReason && bankingMovement.name !== paymentFacilityDueLabel) return bankingMovement
                        break;
                    case "unpaid" :
                        if (bankingMovement.rejectionReason) return bankingMovement
                        break;
                    default:
                        return null
                }
                return
            })
            : bills?.bankingMovements

        return (
            <React.Fragment key={props.activeTab}>
                {
                    dataToDisplay?.map((bankingMovement, index) => (
                        <React.Fragment key={bankingMovement.reference}>
                            <ul className="vertical-timeline w-100 mb-0">
                                <li className={`cursor-pointer`}>
                        <span
                            className={classnames('v-timeline-icon', {'v-last': index === (dataToDisplay.length - 1)}, {'v-first': index === 0})}/>
                                    <Row className="m-0 align-items-center text-center">
                                        <BankingMovementBill bankingMovement={bankingMovement} bill={!!bankingMovement.bill} clientContext={clientContext}/>
                                    </Row>
                                </li>
                            </ul>
                        </React.Fragment>
                    ))}
            </React.Fragment>
        )
    } else {
        return <React.Fragment/>
    }
}

export default BillingTable;