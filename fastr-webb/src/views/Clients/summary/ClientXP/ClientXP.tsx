import React from "react"; 
import moment from "moment";

import { Service } from "src/model/service";
import { ClientContextSliceState } from "src/store/ClientContextSlice";
import "./ClientXP.scss";
import { shallowEqual } from "react-redux";
import { useTypedSelector } from "src/components/Store/useTypedSelector";
import { BankingMovement, BillingInformation } from "src/model/person/billing/BillingInformation";

interface Props {
    clientContext: ClientContextSliceState
}


const ClientXP = ({ clientContext }: Props) => {
    const invoices: BillingInformation = clientContext ? (
        useTypedSelector(state => state.store.client.loadedClients.find(c => c.clientData?.id === clientContext.clientData?.id && c.serviceId === clientContext.service?.id)?.bills, shallowEqual)
    ) : (
        useTypedSelector(state => state.bills.data)
    );


    const averageSpending = (bankingMovements: BankingMovement[]): string => {
        const sum = bankingMovements.map(mv => mv.amount).filter(amount => amount !== null).reduce((f1, f2) =>  f1 + f2 , 0);
        return `${Math.round((sum / 12))}€/mois `;
    }

    const getActiveServiceNumber = (services: Service[]) => {
        return services.filter(service => service.status === "ACTIVE").length;
    } 
    
    function calculedSeniority(services: Service[]) {
        return moment(services.sort((a, b) => {
            const aa = new Date(a.creationDate).getTime();
            const bb = new Date(b.creationDate).getTime();
            return aa < bb ? -1 : aa < bb ? 1 : 0;
        })[0]?.creationDate)?.fromNow().replace("il y a", "depuis");
    }

    const iconVip = (ccss: ClientContextSliceState) => {
        return ccss?.clientData?.vip ?<span className="badge badge-white badge-small badge-pill mt-1">vip</span> : <></>;
    }

    const iconUser = (ccss: ClientContextSliceState) => {
        return <i className={"icon-white " + (ccss?.clientData?.corporation ? "icon-pro" : "icon-user")}/>;
    }
    if (!clientContext) return <></>
    
    return <div className="client-xp-card-container p-1 mb-3">
        <div className="header w-100 d-flex align-items-center justify-content-between">
                    <div className="pastille input-group-prepend p-1 flex justify-content-center align-items-center" >
                        { iconUser(clientContext) }
                    </div>
                    <div className={`pastille input-group-prepend p-1 flex justify-content-center align-items-center ${clientContext?.clientData?.vip ? 'border rounded border-white' : ''}`} >
                        { iconVip(clientContext) }
                    </div>
        </div>
        <div className="infos h-100">
            {clientContext?.clientData?.services ? <><div className="line line-1 text-capitalize">
                {calculedSeniority(clientContext?.clientData?.services)} déjà
            </div> <hr/></>: <></>}
            {invoices?.bankingMovements ? <><div className="line line-2 ">Dépense {averageSpending(invoices?.bankingMovements?.filter(move => move.bill).splice(0, 12))} (moy)</div> <hr/></> : <></>}
            {clientContext?.clientData?.services ? <div className="line line-1 ">{`${getActiveServiceNumber(clientContext?.clientData?.services)} services activés`}</div>  : <></>}
            <div className="line line-4"></div>
        </div>
    </div>
}

export default ClientXP;