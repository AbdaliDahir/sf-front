import classnames from 'classnames';
import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import SockJsClient from 'react-stomp';
import 'react-block-ui/style.css';
import {FormattedMessage} from "react-intl";
import 'react-notifications/lib/notifications.css';
import {connect, useDispatch} from "react-redux";
import {useParams} from "react-router";
import {Col, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap"
import {ClientActiveTab, setActiveTab} from 'src/store/UISlice';
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {DataLoad} from "../../../context/ClientContext";
import {fetchClient, fetchLandedPaymentFacility, fetchMobileRenewal} from "../../../store/ClientContextSlice";
import {renderAlertNotification} from "../../../utils/AlertUtils";
import Administrative from "../Administrative/Administrative";
import OfferAndUsage from "../OfferAndUsage/OfferAndUsage";
import BlockLine from "./BlockLine";
import BillingAndPayment from "../BillingAndPayment/BillingAndPayment";
import {setPayload} from "../../../store/PayloadSlice";
import * as moment from "moment";
import {fetchAndStoreExternalApps} from "../../../store/actions";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {TabCategory} from "../../../model/utils/TabCategory";
import {AppState} from "../../../store";
import ServiceUtils from "../../../utils/ServiceUtils";
import ListRecentCasesPageV2 from "../../v2/Cases/ListRecentCasesPageV2";
import {createAndStoreContactV2} from "../../../store/actions/v2/contact/ContactActions";
import {ContactDTO} from "../../../model/ContactDTO";
import Equipment from "../Equipement/Equipment";
import Header from "./Header";
import {fetchAlertsAndStoreClientV2, storeClientV2} from "../../../store/actions/v2/client/ClientActions";
import {ApplicationMode} from "../../../model/ApplicationMode";
import {useLocalClientContext} from 'src/hooks';
import {
    convertSessionMode,
    switchToIntegratedViewMode
} from "../../../store/actions/v2/applicationInitalState/ApplicationInitalStateActions";
import OfferLocation from "../OfferAndUsage/Offers/location/OfferLocation";
import {ServiceType} from "../../../model/ServiceType";
import LocationEquipments from "../OfferAndUsage/Offers/location/LocationEquipments";
import Summary from '../summary/Summary';
import Historique from '../Historique/Historique';

const TabContainer = () => {
    const [tabOffset, setTabOffset] = useState("100px")
    const dispatch = useDispatch();
    const activeTabs = useTypedSelector(state => state.uiContext.activeTab);
    const {clientId, serviceId} = useParams();
    const [clientContext] = useLocalClientContext();
    const search = useLocation().search;
    const integratedView = new URLSearchParams(search).get('integratedView');
    const defaultTab = clientContext.recentCases?.casesList && clientContext.recentCases?.casesList.length > 0 ? TabCategory.CASES : TabCategory.ADMINISTRATIVE;
    const activeTab = useTypedSelector(state => state.uiContext.activeTab.find(value => value.clientId === clientId)?.activeTab?? defaultTab);
    const sessionFrom = useTypedSelector(state => state.store.applicationInitialState.sessionIsFrom);
    const [clientAlreadyLoaded, setClientAlreadyLoaded] = useState(false);
    const userActivity = useTypedSelector((state: AppState) => state.store.applicationInitialState?.user?.activity)


    // SessionService.registerSession("5A4391AF854AB35595210A6A19FAA9E7");

    useEffect(() => {
        if (clientId && serviceId) {
            dispatch(fetchClient(clientId, serviceId, DataLoad.ONE_SERVICE, true, true));
            if (integratedView) {
                dispatch(switchToIntegratedViewMode(true));
                dispatch(convertSessionMode(ApplicationMode.GOFASTR))
            }
            if (sessionFrom === ApplicationMode.DISRC) {
                initializeContact();
            }
            if (sessionFrom === ApplicationMode.GOFASTR || integratedView) {
                initializeContactGoFastr()
            }
            
        }
    }, [sessionFrom]);

    useEffect(() => {
        if (clientId && serviceId && clientContext) {
            dispatch(storeClientV2(clientContext))
        }
    }, [clientContext])

    function initializeContact() {
        const contact: ContactDTO = {
            clientId,
            serviceId,
            contactId: "",
            channel: 'DISTRIBUTION',
            media: {type: "BOUTIQUE", direction: "ENTRANT"}
        }
        dispatch(createAndStoreContactV2(contact));
    }

    function initializeContactGoFastr() {
        const contact: ContactDTO = {
            clientId,
            serviceId,
            channel: "CUSTOMER_CARE"
        }
        dispatch(createAndStoreContactV2(contact));
    }

    useEffect(() => {
        if (!clientAlreadyLoaded && !clientContext?.loading && clientContext?.clientData) {
            dispatch(setPayload({
                idClient: clientContext?.clientData.id,
                idService: clientContext?.serviceId,
                idCase: 0,
                offerCode: clientContext?.service!.offerTypeId,
                contactCreatedByFast: false,
                fromdisrc: true,
                contactMediaType: 'BOUTIQUE',
                contactChannel: 'CUSTOMER_CARE',
                contactMediaDirection: "ENTRANT",
                contactStartDate: moment().toISOString(),
                results: [],
                fastTabId: "toto",
                motif: undefined
            }));
            dispatch(fetchLandedPaymentFacility(clientContext?.service?.siebelAccount));
            dispatch(fetchMobileRenewal(clientContext?.service?.id));
            dispatch(fetchAlertsAndStoreClientV2(clientId!, serviceId!, ServiceUtils.isMobileService(clientContext.service)));
            setClientAlreadyLoaded(true);
        }
    }, [clientContext?.loading])

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

    const changeTabOffset = (heightProperty: number) => {
            setTabOffset(heightProperty + "px")
    }

    const onMessage = (list) => {
        //dispatch(infoNeedToBeRefresh());
        if (serviceId && clientId && (sessionFrom === ApplicationMode.DISRC || sessionFrom === ApplicationMode.GOFASTR)) {
            dispatch(fetchClient(clientId, serviceId, DataLoad.ONE_SERVICE, true, true));
        }
    }

    return (
        <React.Fragment>
            {
                serviceId ? <SockJsClient url={process.env.REACT_APP_FASTR_API_URL + "/fastr-cases/subscribe-service/"}
                                          topics={["/topic/subscribeService-" + serviceId ]}
                                          onMessage={onMessage}/> : <></>
            }
            { !integratedView ? <>
                <Header/>
                <BlockLine onHeightChange={changeTabOffset} clientContext={clientContext}/>
            </> : <>
            </>}

            <Nav tabs className={!integratedView ? "sticky-top bg-white service-nav shadow" : " bg-white service-nav shadow"} style={{top: !integratedView ? tabOffset : 0}}>
                {Object.entries(TabCategory).map(([tabKey, tabValue]) => (
                    <NavItem key={tabKey}>
                        <NavLink className={classnames({'active': activeTab === tabValue})}
                                 onClick={() => toggle(tabValue)}>
                            <FormattedMessage id={`tabs.${tabKey}`}/>
                            { renderAlertNotification(tabValue, clientContext?.clientData?.id, clientContext?.service?.id) }
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
            <TabContent activeTab={activeTab} className="bg-light">
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.synthese"})}
                         className="z-index-1 p-3 bg-white">
                    <Row>
                        <Col lg={{size: 10, offset: 1}}>
                             {clientContext?.service?.id && userActivity? <Summary clientContext={clientContext} toggleTab={toggle}/> : <></>}
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.historique"})}
                         className="z-index-1 p-3 bg-white h-100">
                    <Row className='h-100'>
                        <Col lg={{size: 10, offset: 1}} className='h-100'>
                            <Historique />
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.administrative"})}
                         className="z-index-1 p-3 bg-light">
                    <Row>
                        <Col lg={{size: 10, offset: 1}}><Administrative/></Col>
                    </Row>
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.offerAndUsage"})}
                         className="z-index-1 p-3 bg-light">
                    <Row>
                        <Col lg={{size: 10, offset: 1}}>{ clientContext?.service?.serviceType === ServiceType.LOCATION && integratedView ? <OfferLocation clientContext={clientContext}/>:<OfferAndUsage/> }</Col>
                    </Row>
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.equipements"})}
                         className="z-index-1 p-3 bg-light">
                    <Row>
                        <Col lg={{size: 10, offset: 1}}>{ clientContext?.service?.serviceType === ServiceType.LOCATION && integratedView ? <LocationEquipments clientContext={clientContext}/> : <Equipment clientContext={clientContext}/>}</Col>
                    </Row>
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.billsAndPayment"})}
                         className="z-index-1 p-3 bg-light">
                    <Row>
                        <Col lg={{size: 10, offset: 1}}><BillingAndPayment clientContext={clientContext}/></Col>
                    </Row>
                </TabPane>
                <TabPane tabId={translate.formatMessage({id: "disrc.tabs.cases"})}
                         className="z-index-1 p-3 bg-light">
                    <Row>
                        <Col lg={{size: 10, offset: 1}}>
                            {clientContext && clientContext?.service?.id && userActivity ? <ListRecentCasesPageV2 clientContext={clientContext}/> : null}
                        </Col>
                    </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(TabContainer)
