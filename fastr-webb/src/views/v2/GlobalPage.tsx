import * as React from "react";
import {useEffect, useState} from "react";
import {TabContent, TabPane} from "reactstrap";
import ClientPage from "./Client/ClientPage";
import { useTypedSelector } from "../../components/Store/useTypedSelector";
import { selectClientV2 } from "../../store/actions/v2/client/ClientActions";
import { useDispatch } from "react-redux";
import HomePage from "./Login/HomePage";
import './GlobalPage.scss';
import LeftDashboard from "./Layout/LeftDashboard";
import ClientInfo from "./Client/ClientInfo/ClientInfo";
import ClientServices from "./Client/ClientServices/ClientServices";
import SearchPage from "./Search/SearchPage";
import ClientSecureCall from "./Client/ClientSecureCall/ClientSecureCall";

const GlobalPage = () => {
    const [activeTab, setActiveTab] = useState("HOME");
    const [searchQuery, setSearchQuery] = useState();
    const dispatch = useDispatch();
    const loadedClients = useTypedSelector(state => state.store.client.loadedClients);
    const currentClient = useTypedSelector(state => state.store.client.currentClient);
    const [isLeftMenuOpen , setIsLeftMenuOpen] = useState(true)

    useEffect(() => {
        if (currentClient && currentClient.clientData && currentClient.clientData.id && currentClient.serviceId) {
            setActiveTab("CLIENT_" + currentClient.clientData.id);
        } else if (activeTab !== "SEARCH") {
            setActiveTab("HOME");
        }
    }, [currentClient])


    const onHeaderSearch = (query: string) => {
        dispatch(selectClientV2("", ""));
        setSearchQuery(query);
        setActiveTab("SEARCH");
    }

    const onHomeSelection = () => {
        dispatch(selectClientV2("", ""));
        setActiveTab("HOME");
    }
    const onMenuChange = (show: boolean) => {
        setIsLeftMenuOpen(show)

    }

    const renderOpenClientList = () => {
        let loadedToDisplay = currentClient ? [currentClient]:[];
        loadedToDisplay = [...loadedToDisplay, ...loadedClients.filter(c=>c.clientData && c.clientData.id !== currentClient?.clientData?.id)];
        return loadedToDisplay.map(e => {
            return (
                <TabPane tabId={"CLIENT_" + e.clientData?.id}
                    key={"CLIENT_" + e.clientData?.id}
                    className={"flex-content"}>
                    <ClientPage clientId={e.clientData?.id} serviceId={e.serviceId} />
                </TabPane>
            );
        });
    }
    const fullWidth = (tab: string) => {
        console.log('tab', 'tab')
        if(tab === 'HOME' ||tab === 'SEARCH' ){
            return true
        }
        return false
    }
    return (
        <>
            <div className="main">
                <div className="main-dashboard">
                    <div className={isLeftMenuOpen ? "main-dashboard-left" : "main-dashboard-left"}>
                        <LeftDashboard
                            noSearch={activeTab === "SEARCH"}
                            activeTab={activeTab}
                            onHeaderSearch={onHeaderSearch}
                            onHomeSelection={onHomeSelection}
                            onMenuChange={onMenuChange}
                        />
                    </div>
                    { !(activeTab === 'HOME' ||activeTab === 'SEARCH' ) && <div className="main-dashboard-right p-2 ">
                        <div className="main-dashboard-right-security mb-2" >

                            <ClientSecureCall clientData={currentClient?.clientData}
                                              currentService={currentClient?.service} />
                        </div>
                        <div className="main-dashboard-right-titulaire mb-2" >
                            <ClientInfo clientData={currentClient?.clientData} />
                        </div>
                        <div className="main-dashboard-right-service mb-2" >
                            <ClientServices 
                                clientData={currentClient?.clientData} 
                                currentService={currentClient?.service} 
                                loadedClients = {loadedClients}/>
                        </div>
                        <div className="main-dashboard-right-alerte mb-2" >
                            <h5> Alertes</h5>
                        </div>
                    </div>}
                </div>

                <div className={ fullWidth? "main-container-full":"main-container" }>
                    <TabContent activeTab={activeTab} className={"globalpagecontent " +(activeTab === 'SEARCH'? "p-4" : "")}>
                        <TabPane tabId={"HOME"}>
                            <HomePage />
                        </TabPane>
                        <TabPane tabId={"SEARCH"}>
                            <SearchPage q={searchQuery}/>
                        </TabPane>
                        {renderOpenClientList()}
                    </TabContent>
                </div>
            </div>


        </>
    )
}

export default GlobalPage