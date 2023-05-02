import * as React from "react";
import {useState, useEffect} from "react";
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import {FormattedMessage} from "react-intl";
import classnames from 'classnames';
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import "../timeline.scss"
import "../billings.scss"
import BillingTable from "./BillingTable";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";

interface Props {
    clientContext?: ClientContextSliceState,
    paiementsShow?: boolean
}

const BILLING_TABLE_TABS = ["billsAndPayment.nav.all", "billsAndPayment.nav.bills", "billsAndPayment.nav.payment", "billsAndPayment.nav.failedPayment"];
const PAIEMENT_TABLE_TABS = ["billsAndPayment.nav.payment", "billsAndPayment.nav.failedPayment"];

const BillingTablesContainer = (props: Props) => {

    const {clientContext, paiementsShow} = props;
    const [activeTab, setActiveTab] = useState(0);
    const USED_TABS = paiementsShow ? PAIEMENT_TABLE_TABS : BILLING_TABLE_TABS;

    useEffect(() => {
        paiementsShow ? setActiveTab(2) : '';
    }, []);

    const changeTab = (tabNumber: number) => () => {
        setActiveTab(tabNumber);
    };

    return (
        <div id={"billing-tab-container"}>
            <Nav tabs className="border-0 bg-white">
                {
                    USED_TABS.map((tabName, index) => (
                        <NavItem key={paiementsShow ? index + 2 : index}>
                            <NavLink
                                className={classnames({'active-tab cd ': activeTab === (paiementsShow ? index + 2 : index) })}
                                onClick={
                                    changeTab(paiementsShow ? index + 2 : index)
                                }>
                                <FormattedMessage id={tabName}/>
                            </NavLink>
                        </NavItem>
                    ))
                }
            </Nav>
            <Row className="bg-dark text-white m-0 billing-tables-header font-size-xs py-1 text-center">
                {
                    !paiementsShow ? <>
                        <Col sm={3} className={"px-1 text-left"}><FormattedMessage id={"billsAndPayment.table.type"}/></Col>
                        <Col sm={3} className={"px-1"}><FormattedMessage id={"billsAndPayment.table.due"}/></Col>
                        <Col sm={2} className={"px-1"}><FormattedMessage id={"billsAndPayment.table.amount"}/></Col>
                    </> : ''
                }
                <Col sm={1} className={"px-1"}><FormattedMessage id={"billsAndPayment.table.balance"}/></Col>
                <Col sm={2} className={"px-1"}><FormattedMessage id={"billsAndPayment.table.links"}/></Col>
                <Col sm={1} className={"px-1"}/>
            </Row>
            <TabContent activeTab={activeTab}>
                {
                    !paiementsShow ? <>
                    <TabPane tabId={0}>
                        <div className="timeline-container pl-2">
                            <BillingTable filter={"all"} clientContext={clientContext}/>
                        </div>
                    </TabPane>
                    <TabPane tabId={1}>
                        <div className="timeline-container pl-2">
                            <BillingTable filter={"bills"} clientContext={clientContext}/>
                        </div>
                    </TabPane>
                    </> : ''
                }
                <TabPane tabId={2}>
                    <div className="timeline-container pl-2">
                        <BillingTable filter={"movement"} clientContext={clientContext}/>
                    </div>
                </TabPane>
                <TabPane tabId={3}>
                    <div className="timeline-container pl-2">
                        <BillingTable filter={"unpaid"} clientContext={clientContext}/>
                    </div>
                </TabPane>
            </TabContent>
        </div>
    )

}

export default BillingTablesContainer;