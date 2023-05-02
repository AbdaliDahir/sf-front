import React from "react"; 
import { ClientContextSliceState } from "src/store/ClientContextSlice";
import "./LastInvoices.scss"
import iconBlock from "../../../../img/insert_chart.svg";
import lgPdfIcone from "../../../../img/pdf-icone.svg";
import PdfIcone from "../../../../img/pdf-icone-xs.svg";
import { useTypedSelector } from "src/components/Store/useTypedSelector";
import { shallowEqual } from "react-redux";
import { BankingMovement, BillingInformation } from "src/model/person/billing/BillingInformation";

interface Props {
    clientContext?: ClientContextSliceState
}

interface InvoiceProps {
    invoice: BankingMovement,
    last: boolean
}
const InvoiceItem = (props: InvoiceProps) => {
    const {invoice, last} = props;

    const getBillOverview = () => {
        const billOverview = invoice.bill.documents?.find(document => document.type === "OVERVIEW");
        return billOverview?.url;
    };

    return <div className={last ? "last-invoice background-grey" : ""}>
            <div className="d-flex ">
                <div className="pdf center d-flex justify-content-center align-items-center p-3">
                    {last ? <a href={getBillOverview()} target="_blank"> <img src={lgPdfIcone}/> </a>  : <a href={getBillOverview()} target="_blank">  <img src={PdfIcone} /> </a>}
                </div>
                <div className="invoice-details d-flex flex-direction-column justifiy-content-center p-1">
                    <span className="invoice-id">  Facture n°{invoice.reference} {last ? ''  : `- ${invoice.amount}€`} </span>
                    {last ? <span className="invoice-price"> {invoice.amount}€</span> : <></> }
                    {invoice.litigious ? <span className="invoice-payment-incident"><i className={"icon icon-warning mr-2"}/>Facture Impayée</span> : <></>}
                    <span className="invoice-payment-delay">émise le {invoice.date?.replace(/-/g, "/")}, échéance le {invoice.dueDate.replace(/-/g, "/")}</span>
                </div>
            </div>
        </div>
}
const LastInvoices = (props: Props) => {
    const { clientContext } = props;

    const invoices: BillingInformation = clientContext ? (
        useTypedSelector(state => state.store.client.loadedClients.find(c => c.clientData?.id === clientContext.clientData?.id && c.serviceId === clientContext.service?.id)?.bills, shallowEqual)
    ) : (
        useTypedSelector(state => state.bills.data)
    );
    
    const lastInvoices = invoices && invoices.bankingMovements.filter(move => move.bill);
    return <>
            { lastInvoices && lastInvoices.length > 0 &&
                <div className="last-invoices-container mb-4">
                <div className="title pt-2 pl-3 background-grey" >
                    <img src={iconBlock} /> <h6>DERNIÈRES FACTURES</h6>
                </div>
            
                <div className="last-invoice">
                    <InvoiceItem invoice={lastInvoices[0]} last={true} />
                </div>
                <div className="other-invoices">
                    {lastInvoices.slice(1, 3).map((invoice, index) => <InvoiceItem key={index} invoice={invoice} last={false}/>)}
                </div>
            </div>
            }
            
    </>
}

export default LastInvoices;