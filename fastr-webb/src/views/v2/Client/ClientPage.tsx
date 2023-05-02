import classnames from 'classnames';
import React, {useEffect} from "react";
import 'react-block-ui/style.css';
import {FormattedMessage} from "react-intl";
import 'react-notifications/lib/notifications.css';
import {connect, useDispatch} from "react-redux";
import SockJsClient from 'react-stomp';
import {Col, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap"
import {ClientActiveTab, setActiveTab} from 'src/store/UISlice';
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {renderAlertNotification} from "../../../utils/AlertUtils";
import Administrative from "../../Clients/Administrative/Administrative";
import OfferAndUsage from "../../Clients/OfferAndUsage/OfferAndUsage";
import BillingAndPayment from "../../Clients/BillingAndPayment/BillingAndPayment";
import {fetchAndStoreAuthorizations, fetchAndStoreExternalApps} from "../../../store/actions";
import SessionService from "../../../service/SessionService";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {TabCategory} from "../../../model/utils/TabCategory";
import {AppState} from "../../../store";
import {fetchActivationFlags} from "../../../store/ActivationFlagSlice";
import ListRecentCasesPageV2 from "../../v2/Cases/ListRecentCasesPageV2";
import {createAndStoreContactV2} from "../../../store/actions/v2/contact/ContactActions";
import {ContactDTO} from "../../../model/ContactDTO";
import Equipment from "../../Clients/Equipement/Equipment";
import {
    fetchAndStoreClientV2,
    fetchLandedPaymentFacilityAndStoreClientV2,
    fetchMobileRenewalAndStoreClientV2
} from "../../../store/actions/v2/client/ClientActions";

import "./ClientPage.scss";
import {ApplicationMode} from "../../../model/ApplicationMode";
import useIsFirstRender from "../../../utils/useIsFirstRender";
import {DataLoad} from "../../../context/ClientContext";
import {infoNeedToBeRefresh} from "../../../store/actions/v2/case/CaseActions";
import Summary from "../../Clients/summary/Summary";
import OfferLocation from 'src/views/Clients/OfferAndUsage/Offers/location/OfferLocation';
import LocationEquipments from 'src/views/Clients/OfferAndUsage/Offers/location/LocationEquipments';
import { ServiceType } from 'src/model/ServiceType';
import Historique from 'src/views/Clients/Historique/Historique';

interface Props {
    clientId?: string
    serviceId?: string
}

const ClientPage = (props: Props) => {
    const dispatch = useDispatch();
    const activeTabs = useTypedSelector(state => state.uiContext.activeTab);
    const {clientId, serviceId} = props
    const activeTab = useTypedSelector(state => state.uiContext.activeTab.find(value => value.clientId === clientId)?.activeTab?? TabCategory.SYNTHESE);
    const clientContext: ClientContextSliceState = useTypedSelector(state => state.store.client.loadedClients.find(c => c.clientData?.id === clientId && c.serviceId === serviceId)!);
    const sessionFrom = useTypedSelector(state => state.store.applicationInitialState.sessionIsFrom);
    const recentCases = useTypedSelector( state => state.store.client.loadedClients.find(c => c.clientData?.id === clientContext.clientData?.id && c.serviceId === clientContext.serviceId)?.recentCases)
    const firstRender = useIsFirstRender()
    const session = SessionService.getSession();

    useEffect(() => {
        if (clientContext && clientContext.clientData && clientContext.service) {
            dispatch(fetchAndStoreExternalApps());
            dispatch(fetchActivationFlags());
            dispatch(fetchAndStoreAuthorizations(session));
            //dispatch(fetchAlertsAndStoreClientV2(clientContext.clientData.id, clientContext.service.id, ServiceUtils.isMobileService(clientContext.service)));
            dispatch(fetchMobileRenewalAndStoreClientV2(clientContext.service.id));
            if(clientContext.service.siebelAccount) {
                dispatch(fetchLandedPaymentFacilityAndStoreClientV2(clientContext.service.siebelAccount));
            }
            if (sessionFrom === ApplicationMode.DISRC) {
                initializeContact(clientContext.clientData.id, clientContext.service.id);
            }
            if (sessionFrom === ApplicationMode.GOFASTR) {
                initializeContactGoFastr(clientContext.clientData.id, clientContext.service.id);
            }
        }
    }, []);
    useEffect(() => {
        if(!recentCases?.loading && !firstRender && recentCases?.casesList.length === 0 ){
            if(clientId){
                const globalActifTabs:ClientActiveTab[] = []
                globalActifTabs.push({clientId, activeTab:TabCategory.ADMINISTRATIVE})
                activeTabs.filter(value => value.clientId !== clientId).forEach(value => {
                    globalActifTabs.push(value)
                })
                dispatch(setActiveTab(globalActifTabs));
            }
        }
    }, [recentCases?.casesList.length,recentCases?.loading]);

    const initializeContact = (c, s) => {
        const contact: ContactDTO = {
            clientId: c,
            serviceId: s,
            contactId: "",
            channel:  'DISTRIBUTION',
            media:   {type: "BOUTIQUE", direction: "ENTRANT"}
        }
        dispatch(createAndStoreContactV2(contact));
    }

    const initializeContactGoFastr = (c, s) => {
        const contact: ContactDTO = {
            clientId: c,
            serviceId: s,
            channel:  'CUSTOMER_CARE',
        }
        dispatch(createAndStoreContactV2(contact));
    }


    const toggle = (tab) => {
        if (activeTab !== tab) {
            const globalActifTabs:ClientActiveTab[] = []
            if(clientId){
                globalActifTabs.push({clientId, activeTab:tab})
                const othersClientTabs = activeTabs.filter(value => value.clientId !== clientId)
                othersClientTabs.forEach(value => {
                    globalActifTabs.push(value)
                })
            }
            dispatch(setActiveTab(globalActifTabs));
        }
    }

    
    const onMessage = (list) => {
        dispatch(infoNeedToBeRefresh());
        if (serviceId && clientId && (sessionFrom === ApplicationMode.DISRC || sessionFrom === ApplicationMode.GOFASTR)) {
            dispatch(fetchAndStoreClientV2(clientId, serviceId, DataLoad.ONE_SERVICE));
        }
    }

    return (
        <React.Fragment>
            {
                serviceId ? <SockJsClient url={process.env.REACT_APP_FASTR_API_URL + "/fastr-cases/subscribe-service/"}
                                                               topics={["/topic/subscribeService-" + serviceId ]}
                                                               onMessage={onMessage}/> : <></>
            }
            
            <Nav tabs className={"sticky-top bg-white service-nav shadow client-page"} >
                {Object.entries(TabCategory).map(([tabKey, tabValue]) => (
                    <NavItem key={tabKey}>
                        <NavLink className={classnames({'active': activeTab === tabValue})}
                                 onClick={() => toggle(tabValue)}>
                            <FormattedMessage id={`tabs.${tabKey}`}/>
                            {renderAlertNotification(tabValue, clientId, serviceId)}
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
            <TabContent activeTab={activeTab} className="bg-light flex-column client-tab">
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.synthese"})}
                         className="z-index-1 h-100 p-3 flex-column" style={{background: "#fff"}}>
                    <Col lg={{size: 12}}>
                        <Summary clientContext={clientContext} toggleTab={toggle}/>
                    </Col>
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.historique"})}
                         className="z-index-1 h-100 p-3 flex-column bg-white"> 
                    <Historique />
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.administrative"})}
                         className="z-index-1 h-100 p-3 bg-light flex-column">
                    <Col lg={{size: 12 }}>
                        <Administrative clientContext={clientContext}/>
                    </Col>
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.offerAndUsage"})}
                         className="z-index-1 h-100 p-3 bg-light flex-column">
                    <Col lg={{size: 12 }}>
                        { clientContext.service?.serviceType === ServiceType.LOCATION ? <OfferLocation clientContext={clientContext}/> : <OfferAndUsage clientContext={clientContext}/> }
                    </Col>
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.equipements"})}
                         className="z-index-1 h-100 p-3 bg-light flex-column">
                    <Col lg={{size: 12 }}>
                    { clientContext.service?.serviceType === ServiceType.LOCATION ? <LocationEquipments clientContext={clientContext}/> : <Equipment clientContext={clientContext}/> }
                    </Col>
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.billsAndPayment"})}
                         className="z-index-1 h-100 p-3 bg-light flex-column">
                    <Col lg={{size: 12 }}>
                        <BillingAndPayment clientContext={clientContext}/>
                    </Col>
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.cases"})}
                         className="z-index-1 h-100 bg-light flex-column">
                    <Col lg={{size: 12 }}>
                        <ListRecentCasesPageV2 clientContext={clientContext}/>
                    </Col>
                </TabPane>
            </TabContent>
        </React.Fragment>
    )
}

const mapStateToProps = (state: AppState) => ({
    appsList: state.externalApps.appsList,

});

const mapDispatchToProps = {
    fetchAndStoreExternalApps,
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientPage)
