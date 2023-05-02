import React, {useState} from "react";
import {Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import {FormattedMessage} from "react-intl";
import classnames from 'classnames';
import SearchClients from "./SearchClients";
import SearchCommands from "./SearchCommands";
const SEARCH_TABS = ["search.nav.line", "search.nav.command", "search.nav.advanced.fixe"];
interface Props {
    q?: string | null | undefined;
}
const SearchPage = (props: Props) => {
    const [activeTab, setActiveTab] = useState(0);
    const changeTab = (tabNumber: number) => () => {
        setActiveTab(tabNumber);
    };

    return (
        <Card className="mt-3">
            <CardBody id="tab-device-container" className="border-0 p-0">
                <Nav tabs>
                    {
                        SEARCH_TABS.map((tabName, index) => (
                            <NavItem key={index}>
                                <NavLink
                                    className={classnames({'active-tab': activeTab === index})}
                                    onClick={
                                        changeTab(index)
                                    }>
                                    <FormattedMessage id={tabName}/>
                                </NavLink>
                            </NavItem>
                        ))
                    }
                </Nav>
                <TabContent activeTab={activeTab} className={"mt-3"}>
                    <TabPane tabId={0}>
                        <div className="timeline-container pl-2">
                            <SearchClients q={props.q}/>
                        </div>
                    </TabPane>
                    <TabPane tabId={1}>
                        <div className="timeline-container pl-2">
                            <SearchCommands/>
                        </div>
                    </TabPane>
                    <TabPane tabId={2}>
                        <div className="timeline-container pl-2">
                            <SearchClients q={props.q}/>
                        </div>
                    </TabPane>
                </TabContent>
            </CardBody>
        </Card>
    )

}
export default SearchPage