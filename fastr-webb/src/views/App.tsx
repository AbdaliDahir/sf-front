import * as React from 'react';
import {lazy} from 'react';
import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css';
import {IntlProvider} from 'react-intl';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {connect} from 'react-redux';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {AppState} from 'src/store';
import '../components/Form/Validation/FormsyValidationRules'
import IntlGlobalProvider from "../components/Intl/IntlGlobalProvider";
import SessionRoute from "../components/Route/SessionRoute";
import {ClientContext, ClientContextProvider, DataLoad} from "../context/ClientContext";
import language from "../messages/fr";
import Loading from "../components/Loading";
import * as moment from "moment";
import TabContainer from "./Clients/Layout/TabContainer";
import AuthDistrib from "./Auth/AuthDistrib";
import CasePageV2 from "./v2/Cases/CasePageV2";
import {
    fetchAndStoreApplicationInitialStateV2,
    storeUserPasswordV2
} from "../store/actions/v2/applicationInitalState/ApplicationInitalStateActions";
import queryString, {ParsedUrlQuery} from "querystring";
import SessionService from "../service/SessionService";
import {setPayload} from "../store/PayloadSlice";
import {ClientContextSliceState, fetchClient, fetchMobileRenewal} from "../store/ClientContextSlice";
import {fetchAndStoreAuthorizations, fetchAndStoreExternalApps} from "../store/actions";
import {fetchActivationFlags} from "../store/ActivationFlagSlice";
import {storeContactChannelV2, storePartialContactV2} from "../store/actions/v2/contact/ContactActions";
import { selectClientV2, storeClientV2} from "../store/actions/v2/client/ClientActions";
import Activities from "./v2/Login/Activities";
import LoginPage from "./v2/Login/LoginPage";
import LogoutPage from "./v2/Login/logout";
import {Redirect} from "react-router";
import GlobalPage from "./v2/GlobalPage";
import {setDefaultOptions} from 'esri-loader';
import DevTools from "./DevTools/DevTools";
import ActionsTray from "./FASTTray/ActionsTray";
import ActionsSuiviesTray from "./FASTTray/ActionsSuiviesTray";
import AccesDeniedPage from "./Error/AccesDeniedPage";
import HistoRapideCaseContainer from './v2/Cases/Components/HistoRapide/HistoRapideCaseContainer';
import DashboardV2 from 'src/poc/dashboard/DashboardV2';
import DashboardContainer from 'src/poc/dashboard/v2/DashboardContainer';

// configure esri-loader to lazy load the CSS
// the fisrt time any react-arcgis components are rendered
setDefaultOptions({css: true});

const ListRecentCasesPageV2 = lazy(() => import('./v2/Cases/ListRecentCasesPageV2'));
const GetPUK = lazy(() => import('./Acts/GetPUK/GetPUK'));
const EditBillingDay = lazy(() => import('./Acts/EditBillingDay/EditBillingDay'));
const EditProfessionalData = lazy(() => import('./Acts/EditProfessionalData/EditProfessionalData'));
const HomeActsGridPage = lazy(() => import('./Acts/Grid/HomeActsGridPage'));
const EditCompanyRegistrationNumber = lazy(() => import('./Acts/EditProfessionalData/EditRegistrationNumber/EditCompanyRegistrationNumber'));
const ErrorPage = lazy(() => import('./Error/ErrorPage'));
const SearchClient = lazy(() => import('./Search/SearchClientsPage'));
const CaseDetailedTray = lazy(() => import('./FASTTray/CaseDetailedTray'));
const CaseSyntheticTray = lazy(() => import('./FASTTray/CaseSyntheticTray'));
const OrderPage = lazy(() => import('./Orders/OrderPage'));
const ViewClientMonitoringPage = lazy(() => import('./SelfCareMobile/Views/ViewClientMonitoringPage'));
const ViewClientMonitoringTimeLine = lazy(() => import('./SelfCareMobile/Views/ViewClientMonitoringTimeLine'));
const BlockMobileConsumption2 = lazy(() => import('./Clients/OfferAndUsage/Consumption/BlockMobileConsumption2'));
const BlockLandedConsumption = lazy(() => import('./Clients/OfferAndUsage/Consumption/BlockLandedConsumption'));
const SavOmnicanal = lazy(() => import("./Acts/SavOmnicanal/SavOmnicanal"));
const SyntheticRecommandations = lazy(() => import('./Clients/OfferAndUsage/Recommandations/SyntheticRecommandations'));
const DetailedRecommandations = lazy(() => import('./Clients/OfferAndUsage/Recommandations/DetailedRecommandations'));
const ClientPage = lazy(() => import("./v2/Client/ClientPage"));
const AnalyseGraphique = lazy(() => import('../poc/analyse-graphique'));
const AnalyseGraphiqueV2 = lazy(() => import('../poc/analyse-graphiqueV2'));

const BillingAndPaymentRCViewDetailed = lazy(() => import('./Clients/BillingAndPayment/BillingAndPaymentRCViewDetailed'));
const PaiementRCViewSynthetic = lazy(() => import('./Clients/BillingAndPayment/PaiementRCViewSynthetic'));

const OfferAndUsageRCViewSynthetic = lazy(() => import('./Clients/OfferAndUsage/OfferAndUsageRCViewSynthetic'));
const OfferAndUsageRCViewDetailed = lazy(() => import('./Clients/OfferAndUsage/OfferAndUsageRCViewDetailed'));

const ContratRCViewSynthetic = lazy(() => import('./Clients/Administrative/ContratRCViewSynthetic'));
const ContratRCViewDetailed = lazy(() => import('./Clients/Administrative/ContratRCViewDetailed'));
const ActsHistoryAdgFixeModal = lazy(() => import('./Cases/View/Elements/ActsHistoryAdgFixeModal'));

const BillingAndPaymentRCViewSynthetic = lazy(() => import('./Clients/BillingAndPayment/BillingAndPaymentRCViewSynthetic'));
const BlockEquipment = lazy(() => import('./Clients/Equipement/Equipment'));
const HistoRapidePage = lazy(() => import('./v2/Cases/Components/HistoRapide/HistoRapidePage'));
const VegasCouriers = lazy(() => import('./Clients/VegasCouriers/VegasCouriers'));

moment.locale(process.env.REACT_APP_FASTR_LANGUAGE);

export interface BlockingContextInterface {
    blockUi: () => void,
    unblockUi: () => void
}

export const BlockingContext = React.createContext<BlockingContextInterface>({
    blockUi: () => {
        ;
    },
    unblockUi: () => {
        ;
    }
});

const errorsToWarn: string[] = [
    "Warning:", "[React Intl]"
];

const oldConsError = console.error;

console.error = (...args) => {
    let toWarn: boolean = false;

    if (typeof args[0] === 'string') {
        errorsToWarn.forEach((s: string) => {
            if (args[0].startsWith(s)) {
                toWarn = true;
            }
        })
    }

    toWarn ? console.warn(...args) : oldConsError(...args);
}

interface State {
    blocking: boolean,
    currentCaseIdFromPayload: string,
    currentNoteValue: string,
    initialStateLoaded: boolean,
    sessionHandled: boolean,
    hideDevTools?: () => void
}

interface Props {
    isUIblocked: boolean,
    authorizations,
    flags,
    forceStoreV2Flag,
    fetchAndStoreApplicationInitialStateV2,
    isApplicationInitialStateLoaded,
    payload,
    setPayload,
    client: ClientContextSliceState,
    clientV2: ClientContextSliceState,
    fetchClient,
    storeClientV2,
    selectClientV2,
    fetchMobileRenewal,
    storePartialContactV2,
    fetchAndStoreAuthorizations,
    fetchAndStoreExternalApps,
    fetchActivationFlags,
    storeUserPasswordV2,
    targetCaseId,
    storeContactChannelV2,
    casesList,
    clientContext?
    adgQuickAccessPayload
}

class App extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            blocking: true,
            currentCaseIdFromPayload: "",
            currentNoteValue: "",
            initialStateLoaded: false,
            sessionHandled: false,
            hideDevTools: undefined
        };
    }

    public async handleSession(queryParams: string) {
        const query: ParsedUrlQuery = queryString.parse(queryParams.replace("?", ""));
        const session: string = SessionService.getSession();

        if (query?.sessionId && query?.sessionId !== session) {
            const newSession = query.sessionId.toString();
            return SessionService.checkSession(newSession)
                .then((r) => {
                    if (r.ok) {
                        SessionService.registerSession(newSession);
                        return newSession;
                    } else {
                        SessionService.clearSession()
                        return undefined;
                    }
                })
                .catch(() => {
                    SessionService.clearSession()
                    return undefined;
                })
        }

        if (session) {
            return SessionService.checkSession(session)
                .then((r) => {
                    if (r.ok) {
                        return session;
                    } else {
                        SessionService.clearSession()
                        return undefined;
                    }
                })
                .catch(() => {
                    SessionService.clearSession()
                    return undefined;
                })
        }

        return undefined;
    }

    public componentDidMount() {
        this.blockUi();
        this.checkForPayload();
        if (window.location.pathname !== "/") {
            this.handleSession(window.location.search)
                .then((session) => {
                    this.sessionHandled();
                    this.initiliseStateV2(session);
                })
        }
    }

    public async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (prevProps.isApplicationInitialStateLoaded !== this.props.isApplicationInitialStateLoaded) {
            this.setState({
                initialStateLoaded: true
            })
        }

        if (prevProps.targetCaseId !== this.props.targetCaseId) {
            const note: string = this.props.casesList[this.state.currentCaseIdFromPayload].currentNote;
            this.setState({
                currentCaseIdFromPayload: this.props.targetCaseId,
                currentNoteValue: note
            })
        }

        if (!prevProps.payload && this.props.payload) {
            await this.initStoreFromPayload();
        }

        if (prevProps.client !== this.props.client) {
            await this.props.storeClientV2(this.props.client);
            if (this.props.client.serviceId && this.props.payload?.idClient && this.props.payload?.idService) {
                this.props.selectClientV2(this.props.payload?.idClient, this.props.payload?.idService);
            }
        }

        if (this.state.blocking && this.state.initialStateLoaded && (!this.props.clientV2?.loading || !this.props.clientV2) && this.state.sessionHandled) {
            this.unblockUi()
        }
    }

    public sessionHandled = () => {
        this.setState({
            sessionHandled: true
        })
    };

    public blockUi = () => {
        this.setState({
            blocking: true
        })
    };

    public unblockUi = () => {
        this.setState({
            blocking: false
        })
    };


    public render(): JSX.Element {
        return (
            <IntlProvider locale={language.locale} messages={language.messages}>
                <IntlGlobalProvider>
                    <ClientContextProvider>


                        {this.props.authorizations.includes("isDebugAuthorized") &&
                            <DevTools authorizations={this.props.authorizations} hideDevTools={this.setHideDevTools} payload={this.props.payload} />}
                        <div id="fastr-container" onClick={this.useHideDevTools}>
                            <BlockUi blocking={this.props.isUIblocked} keepInView={true}
                                loader={<Loading />} tag="div" className={"block-ui-wrapper"}>
                                <BrowserRouter>
                                    <ClientContext.Consumer>{
                                        client => (
                                            <React.Suspense fallback={<Loading />}>
                                                <Switch>
                                                    <Route path="/" exact>
                                                        <Redirect to={"/activities/"} />
                                                    </Route>

                                                    <Route component={LoginPage} path={"/login"} exact />
                                                    <Route component={LogoutPage} path={"/logout"} exact />
                                                    <Route component={ErrorPage} path={"/error"} />
                                                    <Route component={ErrorPage} path="/error" exact />
                                                    <Route component={AccesDeniedPage} path={"/accesDenied"}/>

                                                    <Route component={SearchClient} path="/search/client" exact />

                                                    <Route component={GetPUK} path="/acts/mobile/puk"
                                                        exact />

                                                    <Route component={OrderPage}
                                                        path="/orders/" exact />

                                                    <Route exact path="/client/:clientId/service/:serviceId" ready={this.state.initialStateLoaded && !this.state.blocking && this.props.clientV2}>
                                                        <TabContainer/>
                                                    </Route>

                                                    <Route exact path="/client/:clientId/service/:serviceId/paiementDetails">
                                                        <PaiementRCViewSynthetic/>
                                                    </Route>

                                                    <Route exact path="/disrc/cases">
                                                        <CasePageV2 clientContext={this.props.clientContext} />
                                                    </Route>

                                                    <Route exact path="/auth/sso">
                                                        <AuthDistrib />
                                                    </Route>

                                                    <Route exact path="/poc/graph">
                                                        <AnalyseGraphique />
                                                    </Route>

                                                    <Route exact path="/poc/dashboard">
                                                        <DashboardContainer />
                                                    </Route>
                                                    <Route exact path="/poc/dashboardV2/:profile">
                                                        <DashboardV2 />
                                                    </Route>

                                                    <Route exact path="/poc/graphV2">
                                                        <AnalyseGraphiqueV2 />
                                                    </Route>

                                                    <Route exact path="/client/:clientId/service/:serviceId/billsAndPayments/synthetic">
                                                        <BillingAndPaymentRCViewSynthetic/>
                                                    </Route>

                                                    <Route exact path="/client/:clientId/service/:serviceId/billsAndPayments/detailed">
                                                        <BillingAndPaymentRCViewDetailed/>
                                                    </Route>

                                                    <Route exact path="/client/:clientId/service/:serviceId/offerAndUsage/synthetic">
                                                        <OfferAndUsageRCViewSynthetic/>
                                                    </Route>

                                                    <Route exact path="/client/:clientId/service/:serviceId/offerAndUsage/detailed">
                                                        <OfferAndUsageRCViewDetailed/>
                                                    </Route>

                                                    <Route exact path="/client/:clientId/service/:serviceId/contrat/synthetic">
                                                        <ContratRCViewSynthetic/>
                                                    </Route>

                                                    <Route exact path="/client/:clientId/service/:serviceId/contrat/detailed">
                                                        <ContratRCViewDetailed/>
                                                    </Route>

                                                    <Route exact path="/client/:clientId/service/:serviceId/historapide">
                                                        <HistoRapidePage/>
                                                    </Route>

                                                    <Route exact path="/vegas-couriers/:serviceId">
                                                        <VegasCouriers  />
                                                    </Route>

                                                    <SessionRoute component={GlobalPage}
                                                        ready={true}
                                                        path="/v2"
                                                        shouldRedirectToLogin
                                                        exact />

                                                    <SessionRoute component={Activities}
                                                        ready={true}
                                                        path="/activities"
                                                        shouldRedirectToLogin
                                                        exact />

                                                    <SessionRoute component={ClientPage}
                                                        ready={true}
                                                        path={"/v2/client/:clientId/service/:serviceId"}
                                                        shouldRedirectToLogin
                                                        exact />

                                                    <SessionRoute component={EditBillingDay}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/acts/client/billing/day" client={client}
                                                        exact />

                                                    <SessionRoute component={ViewClientMonitoringPage}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/monitoringClientMobile"
                                                        exact />

                                                    <SessionRoute component={ViewClientMonitoringTimeLine}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/monitoringClientMobileTimeline"
                                                        exact />

                                                    <SessionRoute component={SyntheticRecommandations}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/client/:clientId/service/:serviceId/synthetic/nba/:idCsu"
                                                        exact />

                                                    <SessionRoute component={DetailedRecommandations}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/client/:clientId/service/:serviceId/detailed/nba/:idCsu"
                                                        exact />

                                                    <SessionRoute component={EditProfessionalData}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/acts/client/pro" exact />

                                                    <SessionRoute component={HomeActsGridPage}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/acts/home" client={client} exact />

                                                    <SessionRoute component={HomeActsGridPage}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/acts/home/fast" client={client} exact />

                                                    <SessionRoute component={CaseDetailedTray}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path='/tray/detailed' exact />

                                                    <SessionRoute component={CaseSyntheticTray}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path='/tray/synthetic' exact />

                                                    <SessionRoute component={ActionsTray}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path='/tray/actions' exact />

                                                    <SessionRoute component={ActionsSuiviesTray}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path='/tray/actionsSuivies' exact />

                                                    <SessionRoute component={BlockMobileConsumption2}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/mobileService/:serviceId/clientId/:clientId/consumption/synthetic/isBiosNotLca/:isBiosNotLca"
                                                        exact />

                                                    <SessionRoute component={BlockMobileConsumption2}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/mobileService/:serviceId/clientId/:clientId/consumption/detailed/isBiosNotLca/:isBiosNotLca"
                                                        exact />

                                                    <SessionRoute component={BlockLandedConsumption}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/landedService/:refClient/consumption/synthetic"
                                                        exact />

                                                    <SessionRoute component={BlockLandedConsumption}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/landedService/:refClient/consumption/detailed"
                                                        exact />

                                                    <SessionRoute component={SavOmnicanal}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/sav/:technicalSupportId"
                                                        exact />

                                                    <SessionRoute component={CasePageV2}
                                                                  ready={this.state.initialStateLoaded && this.props.clientV2 && !this.state.blocking}
                                                                  path="/cases/create"
                                                                  caseId={this.state.currentCaseIdFromPayload}
                                                                  currentNoteValue={this.state.currentNoteValue}
                                                                  client={client} exact/>

                                                    <SessionRoute component={CasePageV2}
                                                                  ready={this.state.initialStateLoaded && this.props.clientV2 && !this.state.blocking}
                                                                  path="/cases/:id/view"
                                                                  caseId={this.state.currentCaseIdFromPayload}
                                                                  currentNoteValue={this.state.currentNoteValue}
                                                                  clientContext={this.props.clientContext}
                                                                  client={client} exact/>
                                                    <SessionRoute component={HistoRapideCaseContainer}
                                                                  ready={this.state.initialStateLoaded && this.props.clientV2 && !this.state.blocking}
                                                                  path="/cases/histo/:histoCode"
                                                                  caseId={this.state.currentCaseIdFromPayload}
                                                                  currentNoteValue={this.state.currentNoteValue}
                                                                  clientContext={this.props.clientContext}
                                                                  client={client} exact
                                                                  />

                                                    <SessionRoute component={ListRecentCasesPageV2}
                                                                  ready={this.state.initialStateLoaded && this.props.clientV2 && !this.state.blocking}
                                                                  path="/cases/list/:id?" clientContext={this.props.clientContext}
                                                                  exact/>

                                                    <SessionRoute component={EditCompanyRegistrationNumber}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/acts/client/pro/registration"
                                                        client={client}
                                                        exact />

                                                    <SessionRoute component={ActsHistoryAdgFixeModal}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/regularisation-fixe/:transactionId/:refSeibel/:actCode"
                                                        exact />

                                                    <SessionRoute component={BlockEquipment}
                                                        ready={this.state.initialStateLoaded && !this.state.blocking}
                                                        path="/show-equipement/client/:idTitulaire/service-csu/:csuLigne"
                                                        forIframeView={true}
                                                        exact />

                                                </Switch>
                                            </React.Suspense>
                                        )
                                    }
                                    </ClientContext.Consumer>
                                </BrowserRouter>
                                <NotificationContainer />
                            </BlockUi>
                        </div>
                    </ClientContextProvider>
                </IntlGlobalProvider>
            </IntlProvider>
        );
    }

    private setHideDevTools = (fct) => {
        this.setState({
            hideDevTools: fct
        })
    }

    private useHideDevTools = () => {
        if (this.state.hideDevTools) {
            this.state.hideDevTools();
        }
    }
    private async initiliseStateV2(session?:string){
        if(session || this.state.sessionHandled){
            await this.props.fetchAndStoreApplicationInitialStateV2();
        }
    }

    private checkForPayload = () => { // load potentially missing data (when not from disrc, where loading is done on TabContainer)
        if (!this.props.payload) {
            const query: ParsedUrlQuery = queryString.parse(location.search.replace("?", ""));
            if (query.payload) {
                const urlPayload = JSON.parse(decodeURIComponent(escape(atob(query.payload.toString().replace(" ", "+")))));
                this.setState({
                    currentCaseIdFromPayload: urlPayload?.idCase
                });
                if (urlPayload?.idClient || urlPayload?.userPassword) {
                    this.props.setPayload(urlPayload)
                }
            } // else, no payload at all (disrc + fastr standalone)
        }
    }

    private  initStoreFromPayload = async () => {
        if (this.props.payload) {
            if (this.props.payload.idClient && this.props.payload.idService && !this.props.clientV2) {
                await this.props.fetchClient(this.props.payload.idClient, this.props.payload.idService, DataLoad.ONE_SERVICE, this.props.payload.fromdisrc);
                await this.props.fetchMobileRenewal(this.props.payload.idService);
            }
            if (this.props.payload.idContact) {
                this.props.storePartialContactV2(this.props.payload.idContact);
            }
            if (!this.props.isApplicationInitialStateLoaded) {
                await this.initiliseStateV2();
            }
            if (SessionService.getSession()) {
                await  this.props.fetchAndStoreAuthorizations(SessionService.getSession());
            }
            if (this.props.payload.userPassword) {
                this.props.storeUserPasswordV2(this.props.payload.userPassword);
            }
            if (this.props.payload.contactChannel) {
                this.props.storeContactChannelV2(this.props.payload.contactChannel)
            }
            await this.props.fetchAndStoreExternalApps();
            await this.props.fetchActivationFlags();
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    isUIblocked: state.uiContext.blockingUI,
    authorizations: state.store.applicationInitialState.authorizations,
    forceStoreV2Flag: state.store.applicationInitialState.activationFlags.find((f) => f.label === "forceAccessStoreV2"),
    flags: state.store.applicationInitialState.activationFlags,
    isApplicationInitialStateLoaded: state.store.applicationInitialState.sessionId,
    payload: state.payload.payload,
    client: state.store.clientContext,
    clientV2: state.store.client.currentClient,
    clientContext: state.store.client.currentClient,
    targetCaseId: state.store.applicationInitialState.targetCaseId,
    casesList: state.store.cases.casesList
});

const mapDispatchToProps = {
    fetchAndStoreApplicationInitialStateV2,
    setPayload,
    selectClientV2,
    fetchClient,
    storeClientV2,
    fetchMobileRenewal,
    storePartialContactV2,
    fetchAndStoreAuthorizations,
    fetchAndStoreExternalApps,
    fetchActivationFlags,
    storeUserPasswordV2,
    storeContactChannelV2
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
