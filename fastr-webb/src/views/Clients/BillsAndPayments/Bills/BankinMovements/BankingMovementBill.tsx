import * as React from "react"
import {useState} from "react"
import Col from "reactstrap/lib/Col";
import {FormattedDate, FormattedMessage} from "react-intl";
import LocaleUtils from "../../../../../utils/LocaleUtils";
import DisplayField from "../../../../../components/DisplayField";
import {BankingMovement} from "../../../../../model/person/billing/BillingInformation";
import {MdCancel, MdCheckCircle} from "react-icons/all";
import {Row} from "reactstrap";
import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {Service} from "../../../../../model/service";
import ServiceUtils from "../../../../../utils/ServiceUtils";
import {BillingState} from "../../../../../store/reducers/BillingReducer";
import BillType from "../../../../../model/acts/duplicate-billing/BillType";
import {translate} from "../../../../../components/Intl/IntlGlobalProvider";
import Fadet from "../Fadet/Fadet"

interface Props {
    bankingMovement: BankingMovement
    bill: boolean
    clientContext? : ClientContextSliceState
}


const BankingMovementBill = ({bankingMovement, bill, clientContext}: Props) => {

    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext)
    const billingSettings: BillingState = useTypedSelector(state => state.billings)

    const {service} = client

    const [expandedBill, setExpandedBill] = useState(false);

    const toggleBill = () => {
        setExpandedBill(!expandedBill);
    };
    const isLandedService = ServiceUtils.isLandedService(service)

    const renderBillsDownloadPdfs = () => {
        if (isLandedService) {
            return (
                <Row>
                    <Col>
                        <a href={getBillOverview()} target="_blank">
                            <i className={"icon-gradient icon-bill font-size-xl"}/></a>
                    </Col>
                </Row>
            )
        } else {
            return (
                <Row className="d-flex justify-content-between w-25">
                    <div>
                        <a href={getBillOverview()} target="_blank">
                            <i className={"icon-gradient icon-bill font-size-xl"}/></a>
                    </div>
                    <div>
                        <a href={getBillDetailed()} target="_blank">
                            <i className={"icon icon-bill font-size-xl"}/>
                        </a>
                    </div>
                </Row>
            )
        }
    };

    const getBillOverview = () => {
        const billOverview = bankingMovement.bill.documents?.find(document => document.type === "OVERVIEW");
        return billOverview?.url;
    };

    const getBillDetailed = () => {
        const billOverview = bankingMovement.bill.documents?.find(document => document.type === "FULL");
        return billOverview?.url;
    };

    const getBankingMovementName = (service: Service, code: string): string => {
        const currentSetting: BillType[] | undefined = billingSettings.billingsSettings?.billTypes
            .filter(type => service.category === type.category && code === type.code)

        if (!currentSetting || !currentSetting.length) {
            return bill && ServiceUtils.isLandedService(service)
                ? translate.formatMessage({id: "billsAndPayment.nav.bills"})
                : bankingMovement.name
        }
        return currentSetting[0].label
    }

    return (
        <React.Fragment>
            {bill ?
                <Col sm={3} className="px-1 text-left">
                    <div className="font-weight-bold">{getBankingMovementName(service!, bankingMovement.bill.type)}</div>
                    <div className="font-weight-light">
                        {bankingMovement.bill &&
                        <React.Fragment><FormattedMessage id={"billsAndPayment.bill.emitted"}/>&nbsp;
                            <FormattedDate
                                value={bankingMovement.date}/>
                        </React.Fragment>
                        }
                    </div>
                </Col>
                : <Col sm={3} className={bankingMovement.rejectionReason ? "px-1 pb-3 text-left" : "px-1 text-left"}>
                    <div className="font-weight-bold"><span
                        className={bankingMovement.rejectionReason ? "text-primary" : ""}>{getBankingMovementName(service!, bankingMovement.name)}</span>
                    </div>
                    <div className="font-weight-light">
                        {bankingMovement.date &&
                        <React.Fragment><FormattedMessage id={"billsAndPayment.bill.emitted"}/>&nbsp;
                            <FormattedDate
                                value={bankingMovement.date}/>
                        </React.Fragment>
                        }
                    </div>
                </Col>
            }
            <Col sm={3} className="px-1 text-center">
                {displayAdditionalInformationAboutBillStatus(bankingMovement)}
            </Col>
            <Col sm={2} className="px-1">


                {bankingMovement.rejectionReason ?
                    <React.Fragment>
                        <div>
                            <span className="font-weight-bold text-primary"><FormattedMessage
                                id={bankingMovement.rejectionReason}/> </span>
                        </div>
                        <span
                            className={"text-primary font-weight-bold"}>{LocaleUtils.formatCurrency(bankingMovement.amount, false, true)}</span>
                    </React.Fragment>
                    : <span
                        className={"font-weight-bold"}>{LocaleUtils.formatCurrency(bankingMovement.amount, false, true)}</span>
                }

            </Col>
            <Col sm={1} className="px-1">
                {bankingMovement.litigious &&
                <span
                    className={"font-weight-bold"}>{LocaleUtils.formatCurrency(bankingMovement.unpaidAmount, false, true)}</span>
                }

            </Col>
            <Col sm={2} className="px-1 d-flex justify-content-center">
                {bill && renderBillsDownloadPdfs()}
            </Col>
            <Col sm={1} className="px-1 d-flex justify-content-around" onClick={toggleBill}>
                <i className={"icon " + (expandedBill ? "icon-up" : "icon-down")}/>
            </Col>
            {expandedBill && renderBillDetails(bankingMovement, bill, service)}
        </React.Fragment>
    )
};

const renderBillDetails = (bankingMovement: BankingMovement, isBill: boolean, service?: Service) => {
    const isMobileService = ServiceUtils.isMobileService(service)

    if (isBill) {
        return (<div className={"w-100 mt-1"}>
            <Row className="text-left bill-details border-bottom-0 mx-1 pb-0 pt-2">
                <Fadet bankingMovement={bankingMovement} isMobileService={isMobileService}/>
            </Row>
        </div>)
    } else {
        const movementRef = isMobileService ? "billAndPayment.bill.reference" : "billAndPayment.bill.landed.reference"
        return (
            <div className={"w-100 mt-1"}>
                <Row className="text-left bill-details border-bottom-0 mx-1 pb-0 pt-2">

                    <Col sm={6} className={"px-0"}><DisplayField fieldName={movementRef}
                                                                 isLoading={bankingMovement}
                                                                 fieldValue={bankingMovement.reference}
                                                                 bold/></Col>
                    <Col sm={6}/>
                </Row>
            </div>)
    }
};


const displayAdditionalInformationAboutBillStatus = (bankingMovement: BankingMovement) => {
    return (
        <div>
            {inUnpaid(bankingMovement) ?
                <div>
                    <div>
                    <span className="font-weight-bold text-primary">
                        {bankingMovement.bill && <FormattedMessage id="billsAndPayment.bill.notPaid"/>}
                        </span>
                    </div>
                    <span className="font-size-l"><MdCancel color="#da3832"/></span>
                    <span><FormattedDate value={bankingMovement.dueDate}/></span>
                </div>
                : <div>
                    {bankingMovement.bill && !dueDateNotArrived(bankingMovement) ?
                        <span className="font-size-l"><MdCheckCircle color="#55AF27"/></span> : <React.Fragment/>}
                    <span><FormattedDate value={bankingMovement.dueDate}/> </span>
                </div>
            }
        </div>
    )
};


const dueDateNotArrived = (bankingMovement: BankingMovement) => {
    const now: Date = new Date()
    const dueDate = new Date(bankingMovement.dueDate)
    return dueDate > now
}

const inUnpaid = (bankingMovement: BankingMovement) => {
    if (bankingMovement.rejectionReason) {
        return true
    }
    const now: Date = new Date()
    const dueDate = new Date(bankingMovement.dueDate)
    const res = now.getTime() > dueDate.getTime()
    const presentUnpaiedAmount = bankingMovement.unpaidAmount > 0
    return res && presentUnpaiedAmount
}
export default BankingMovementBill;