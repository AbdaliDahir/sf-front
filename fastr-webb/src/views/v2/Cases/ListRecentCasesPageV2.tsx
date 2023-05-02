import * as React from "react";
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {Container, Navbar, Row} from "reactstrap";
import {Case} from "../../../model/Case";
import ErrorModel from "../../../model/utils/ErrorModel";
import CaseService from "../../../service/CaseService";
import {AppState} from "../../../store";
import {fetchAndStoreCase} from "../../../store/actions/CaseActions"
import Loading from "../../../components/Loading";
import {
    clearCaseFromCasesListV2,
    initEmptyCaseV2, notifyThemeSelectionActionV2,
    setAdditionalDataV2,
    setCaseMotifV2,
    setIsCurrentCaseScaledV2,
    setIsMatchingCaseModalDisplayedV2,
    setMatchingCaseV2,
    setPayloadFromQuickAccessV2,
    setQualificationLeafV2,
    setQualificationSelectedV2,
    storeCaseBooleansV2,
    storeCaseV2,
    updateSectionsV2,
    setIsThemeSelectedV2,
    setCaseHasInProgressIncident
} from "../../../store/actions/v2/case/CaseActions"
import {setBlockingUIV2} from "../../../store/actions/v2/ui/UIActions";
import {
    fetchRecentCasesV2
} from "../../../store/actions/v2/case/RecentCasesActions";
import {setActiveTab} from "../../../store/UISlice";
import CasePageV2 from "./CasePageV2";
import HistoRapideModal from "./Components/HistoRapideModal";
import {CaseCLO} from "../../../model/CaseCLO";
import {Contact} from "../../../model/Contact";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {CaseRequestCLO} from "../../../model/CaseRequestCLO";
import {CasesQualificationSettings} from "../../../model/CasesQualificationSettings";
import {HistoRapideSetting} from "../../../model/HistoRapideSetting";
import ServiceUtils from "../../../utils/ServiceUtils";
import FastService from "../../../service/FastService";
import {
    fetchAndStoreIsServiceInLists,
    fetchRecentCasesForClientV2,
    pushCaseToRecentCasesClientV2,
    setIsRecentCasesListDisplayedV2
} from "../../../store/actions/v2/client/ClientActions";
import {CaseCategory} from "../../../model/CaseCategory";
import RecentCasesListV2 from "./List/RecentCasesListV2";
import "./ListRecentCasesPageV2.scss"
import FastrPage from "../../../components/Pages/FastrPage";
import queryString, {ParsedUrlQuery} from "querystring";
import {Payload} from "../../../model/case/CaseActPayload";
import {isAuthorizedBebOrBebCoFixe} from "../../../utils/AuthorizationUtils";
import {CaseRoutingRule} from "../../../model/CaseRoutingRule";
import {ApplicationMode} from "../../../model/ApplicationMode";

interface Param {
    id?: string,
}

export interface State {
    eligibilityToReCreateExistingCase: boolean;
    shouldDisplayHistoRapide: boolean,
    currentCaseId: string | undefined,
    adgQuickAccessPayload: Payload | undefined,
    isHistoRapid: boolean;
    isHistoRapidScaled: boolean;
    isHistoRapidScaledLoaded: boolean;
    seletctedHistoRapid:HistoRapideSetting | undefined,
    defaultClientRequest: string | undefined
}

interface Props extends RouteComponentProps<Param> {
    setBlockingUIV2: (x: boolean) => void
    setActiveTab: (tabId) => void
    blockingUI: boolean
    setIsRecentCasesListDisplayedV2: (idClient: string, idService: string, state: boolean) => void
    pushCaseToRecentCasesV2: (aCase: Case) => void
    clearCaseFromCasesListV2
    setQualificationSelectedV2
    setCaseMotifV2
    setQualificationLeafV2
    storeCaseV2: (casetoSave) => void
    fetchRecentCases: (idClient: string, idService: string, fromDisrc?: boolean) => void
    fetchRecentCasesForClient: (idClient: string, idService: string, fromDisrc?: boolean) => void
    loadingCases
    loadingClient
    payload
    recentCases
    clientContext: ClientContextSliceState
    contact: Contact | undefined
    from: string
    fetchAndStoreCase
    authorizations
    initEmptyCaseV2,
    updateSectionsV2,
    histoRapideSettings: HistoRapideSetting[]
    setMatchingCaseV2
    setIsMatchingCaseModalDisplayedV2
    setAdditionalDataV2
    fetchAndStoreIsServiceInLists: (clientId: string, serviceId: string) => {},
    inCreateCaseBlacklist?: boolean,
    sessionIsFrom
    setIsCurrentCaseScaledV2
    storeCaseBooleansV2
    setPayloadFromQuickAccessV2
    notifyThemeSelectionActionV2,
    activityCode: string;
    setIsThemeSelectedV2: (caseId: string) => void;
    setCaseHasInProgressIncident: (caseId: string) => void;
    integratedViewMode: boolean,
    selectedCase: string,
    selectedHistoRapide
}

export const FastTabContext = React.createContext('');

class ListRecentCasesPageV2 extends FastrPage<Props, State, Param> {
    // public static contextType = BlockingContext;
    private caseService: CaseService = new CaseService(true);

    constructor(props: Props) {
        super(props);

        this.state = {
            eligibilityToReCreateExistingCase: true,
            shouldDisplayHistoRapide: false,
            currentCaseId: "",
            adgQuickAccessPayload: undefined,
            isHistoRapid: false,
            isHistoRapidScaledLoaded: false,
            isHistoRapidScaled: false,
            seletctedHistoRapid:undefined,
            defaultClientRequest: undefined
        }
    }

    public async componentWillMount() {
        //await this.getRecentCasesListFromFastrCases();
        if (this.props.clientContext){
            const serviceId =  this.props.clientContext?.service!.id;
            const clientId=  this.props.clientContext?.clientData!.id;
            if (serviceId && clientId) {
                this.props.fetchAndStoreIsServiceInLists(clientId, serviceId!)
                await this.getRecentCasesListFromFastrCases();
                if (!!this.props.location?.search) {
                    this.processActFromHomeActsGrid()
                }
            }
        }
    }

    public async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (!prevProps.recentCases?.isRecentCasesListDisplayed && this.props.recentCases?.isRecentCasesListDisplayed) { // list got re-displayed
            //await this.getRecentCasesListFromFastrCases();
        }
        // reprise de dossier depuis la bannette dossier (GOFASTR)
        if (prevProps.selectedCase !== this.props.selectedCase && this.props.selectedCase && (this.isFromGoFastr() || this.props.integratedViewMode))  {
            this.handleReprendre(this.props.selectedCase);
        }

        if (prevProps.selectedHistoRapide !== this.props.selectedHistoRapide && this.props.selectedHistoRapide) {
            this.initHistoRapideCase(this.props.selectedHistoRapide);
        }
    }

    private processActFromHomeActsGrid() { // ADG quick access
        const query: ParsedUrlQuery = queryString.parse(this.props.location?.search?.replace("?", ""));
        if (!query.payload) {
            return
        }
        const urlPayload: Payload = JSON.parse(decodeURIComponent(escape(atob(query.payload.toString().replace(" ", "+")))));
        if (urlPayload.idAct && urlPayload.fromQA && this.props.from !== "TabContainer") {
            this.createCase(urlPayload)
        }
    }

    private getRecentCasesListFromFastrCases = async () => {
        try {
            this.props.setBlockingUIV2(true);
            /*Get cases list*/
            // if we have a payload (iFrame case) -> getting serviceId & clientId from payload
            if (this.props.clientContext) {
                const serviceId = this.props.payload ? this.props.payload?.idService : this.props.clientContext?.service!.id;
                const clientId= this.props.payload ? this.props.payload?.idClient : this.props.clientContext?.clientData!.id;
                //this.props.fetchRecentCases(clientId, serviceId, this.props.payload?.fromdisrc);
                this.props.fetchRecentCasesForClient(clientId, serviceId, this.props.payload?.fromdisrc);
            }
        } catch (error) {
            return error.then((element: ErrorModel) => {
                NotificationManager.error(element.message);
            });
        } finally {
            this.props.setBlockingUIV2(false);
        }
    };

    private createNewCase = async (isHistoRapid?: boolean) => {
        if (this.isFromDisRc() || this.isFromGoFastr() || this.props.integratedViewMode) {
            try {
                this.props.setBlockingUIV2(true);
                const caseCLO = await this.caseService.getNewCaseWithoutSave();
                this.props.initEmptyCaseV2(caseCLO.currentCase.caseId);
                this.props.updateSectionsV2(caseCLO.currentCase.caseId, caseCLO.sections);
                this.setState({ currentCaseId: caseCLO.currentCase.caseId });
                this.props.setIsRecentCasesListDisplayedV2(this.props.clientContext.clientData!.id, this.props.clientContext.service!.id, false);
                this.props.storeCaseBooleansV2(caseCLO.currentCase.caseId, {
                    canCCUpdateCurrentCase: caseCLO.canCCUpdateCurrentCase,
                    canCCAddNoteToCurrentCase: caseCLO.canCCAddNoteToCurrentCase,
                    canCCAutoAssignCurrentCase: caseCLO.canCCAutoAssignCurrentCase,
                    canCCReQualifyCurrentCase: caseCLO.canCCReQualifyCurrentCase,
                    canCCUpdateMandatoryADGForCurrentCase: caseCLO.canCCUpdateMandatoryADGForCurrentCase,
                    mustCCReQualifyCurrentCase: caseCLO.mustCCReQualifyCurrentCase,
                    canDisplayPrendreEnChargeBtn: caseCLO.canDisplayPrendreEnChargeBtn,
                });
                if (isHistoRapid) {
                    const payload = { ...this.state.adgQuickAccessPayload, idCase: caseCLO.currentCase.caseId } as Payload;
                    this.props.setPayloadFromQuickAccessV2(payload);
                }else{
                    this.setState({ isHistoRapid: false });
                }
            } catch (error) {
                console.error(error);
                NotificationManager.error(error.message);
                this.props.setIsRecentCasesListDisplayedV2(this.props.clientContext.clientData!.id, this.props.clientContext.service!.id, true);
            } finally {
                this.props.setBlockingUIV2(false);
            }
        } else { // iframe, open fastTab
            const service = this.props.clientContext?.service;
            const isLineFixe = ServiceUtils.isLandedService(service)
            const category = isLineFixe ? "FIXE" : "MOBILE"
            FastService.postOpenNewTabMessage({
                serviceId: this.props.clientContext?.serviceId,
                clientId: this.props.clientContext?.clientData?.id,
                mode: 'CREATION',
                category
            });
        }
    }

    private handleOnCloseCasePage = (aCase: Case | undefined) => {
        this.props.setIsRecentCasesListDisplayedV2(this.props.clientContext.clientData!.id, this.props.clientContext.service!.id, true);
        if (aCase) {
            this.props.pushCaseToRecentCasesV2(aCase);
        }
        this.setState({ currentCaseId: undefined });
        this.props.clearCaseFromCasesListV2(this.state.currentCaseId);
    }

    private toggleHistoRapidePopup = () => {
        this.setState({
            shouldDisplayHistoRapide: !this.state.shouldDisplayHistoRapide
        });
    }

    private updateCaseWithDefaultValues = (caseCLO: CaseCLO, histoRapideCode: string): CaseCLO => {
        const defaultValues = this.props.histoRapideSettings.find((hrs) => hrs.code === histoRapideCode);
        return {
            ...caseCLO,
            currentCase: {
                ...caseCLO.currentCase,
                processing: defaultValues?.status === "RESOLVED",
                ...defaultValues
            }
        };
    }

    private initHistoRapideCase = async (codeClickEvent) => {
        const histoRapideCode = codeClickEvent.currentTarget.value;
        const histRapid = this.props.histoRapideSettings.find((hs) => hs.code === histoRapideCode);
        const qualifCodeFromHistoRapide = histRapid?.qualificationCode;
        const listCasesMatchingQualification = this.props.recentCases?.casesList!.filter((recentCase: Case) => {
            return recentCase.category === "IMMEDIATE" && recentCase.status !== "CLOSED" && qualifCodeFromHistoRapide === recentCase.qualification.code;
        })
        const caseCLO = await this.caseService.getNewCaseWithoutSave();
        const caseRequestCLO: CaseRequestCLO = {
            caseId: caseCLO.currentCase.caseId,
            contact: { id: this.props.contact?.contactId },
            clientId: this.props.clientContext.clientData!.id,
            serviceId: this.props.clientContext.serviceId!,
            activityCode: this.props.activityCode,
            serviceType: this.props.clientContext.service?.serviceType,
        }
        const adgQuickAccessPayload = {
            idClient: caseRequestCLO.clientId,
            idService: caseRequestCLO.serviceId,
            idAct: histRapid?.hasADG ?  histRapid?.codeADGorAction: '',
            idContact: caseRequestCLO.contact.id,
            fromQA: true,
            histoCode: histoRapideCode
        } as Payload;
        try {
            if (listCasesMatchingQualification.length > 0) {
                await this.handleCaseSelected(listCasesMatchingQualification[0].caseId);
            } else {
                this.setState({isHistoRapid:true});
                const newCase: CaseCLO = await this.caseService.initHistoRapideCase(
                    histoRapideCode,
                    caseRequestCLO);
                adgQuickAccessPayload.idCase = newCase.currentCase.caseId;
                this.props.setPayloadFromQuickAccessV2(adgQuickAccessPayload);
                const updatedNewCase = this.updateCaseWithDefaultValues(newCase, histoRapideCode);
                this.setState({seletctedHistoRapid:histRapid});
                await this.replaceCase(updatedNewCase);
            }
        } catch (errorPromise) { // if initHistoRapideCase fails (most likely missing settings error)
            this.setState({isHistoRapid: false});
            errorPromise.then((error) => {
                if (error.status === 404) {
                    NotificationManager.error(error.message);
                    this.setState({ adgQuickAccessPayload })
                    this.createNewCase(true);
                }
            });
        }
    }

    private replaceCase = async (caseCLO: CaseCLO) => {
        const caseId: string = caseCLO.currentCase.caseId;

        this.setState({ currentCaseId: caseId });
        this.props.storeCaseV2(caseCLO.currentCase);
        this.props.storeCaseBooleansV2(caseCLO.currentCase.caseId, {
            canCCUpdateCurrentCase: caseCLO.canCCUpdateCurrentCase,
            canCCAddNoteToCurrentCase: caseCLO.canCCAddNoteToCurrentCase,
            canCCAutoAssignCurrentCase: caseCLO.canCCAutoAssignCurrentCase,
            canCCReQualifyCurrentCase: caseCLO.canCCReQualifyCurrentCase,
            canCCUpdateMandatoryADGForCurrentCase: caseCLO.canCCUpdateMandatoryADGForCurrentCase,
            mustCCReQualifyCurrentCase: caseCLO.mustCCReQualifyCurrentCase,
            canDisplayPrendreEnChargeBtn: caseCLO.canDisplayPrendreEnChargeBtn,
        });
        this.props.setQualificationSelectedV2(caseId);
        this.props.setIsCurrentCaseScaledV2(caseId, caseCLO.currentCase.category === CaseCategory.SCALED);
        this.props.setCaseMotifV2(caseId, caseCLO.currentCase.qualification);
        const rule: CaseRoutingRule = {
            estimatedResolutionDateOfCase: caseCLO.currentCase.estimatedResolutionDate?.toString(),
            receiverActivity: caseCLO.currentCase.caseOwner.activity,
            receiverSite: caseCLO.currentCase.caseOwner.site,
            routingMode: "",
            transmitterActivity: caseCLO.currentCase.caseOwner.activity,
            transmitterSite: caseCLO.currentCase.caseOwner.site
        }
        let caseQualification: CasesQualificationSettings | undefined;
        try {
            caseQualification = await this.caseService.getCaseQualifSettings(caseCLO.currentCase.qualification.code);

            this.props.setQualificationLeafV2(caseId, caseQualification);
            const additionnalDataMotif = caseQualification.data.map(caseDataProp => ({
                ...caseDataProp,
                category: "MOTIF"
            }));
            if(additionnalDataMotif.length>0){
                this.props.setAdditionalDataV2(caseId, additionnalDataMotif);
            }
        } catch (e) {

            this.props.setQualificationLeafV2(caseId);
        } finally {
            this.props.notifyThemeSelectionActionV2(caseId, caseQualification, rule)
        }
        this.props.updateSectionsV2(caseId, caseCLO.sections)
        if (caseCLO.currentCase.data) {
            this.props.setAdditionalDataV2(caseId, caseCLO.currentCase.data);
        }
        this.props.setIsRecentCasesListDisplayedV2(this.props.clientContext.clientData!.id, this.props.clientContext.service!.id, false);
        if (caseCLO.currentCase.themeCode) {
            await this.updateScaling(caseCLO);
        } else {
            this.setState({isHistoRapidScaledLoaded: true});
        }
    }

    private updateScaling = async (caseCLO: CaseCLO) => {
        const caseId: string = caseCLO.currentCase.caseId;
        const serviceType = caseCLO.currentCase.serviceType;

        if (caseCLO.currentCase.themeCode && caseCLO.currentCase.serviceType && caseCLO.currentCase.code) {
            const isValidTheme = await this.caseService.checkValidScalingTheme(caseCLO.currentCase.code, this.props.activityCode, serviceType);
            if (!isValidTheme) { return }
            let theme: CasesQualificationSettings;
            try {
                theme = await this.caseService.getCaseQualifSettings(caseCLO.currentCase.themeCode);
                if (theme && theme.code) {
                    try {
                        const rule = await this.caseService.getReceiverSiteFromleafTheme(theme.code, serviceType);
                        this.props.setIsCurrentCaseScaledV2(caseId, true);
                        this.props.setBlockingUIV2(true);
                        if(theme.incident){
                            this.props.setCaseHasInProgressIncident(caseId);
                        }
                        const sections = caseCLO.sections;
                        (sections.find((s) => s.code === "QUALIFICATION") || { editable: false }).editable = false;
                        this.props.updateSectionsV2(caseId, [...sections]);
                        if (caseCLO.currentCase.data) {
                            this.props.setAdditionalDataV2(caseId, caseCLO.currentCase.data);
                        }
                        this.props.notifyThemeSelectionActionV2(caseId, theme, rule);
                        this.props.setIsThemeSelectedV2(caseId);
                        this.setState({isHistoRapidScaledLoaded: true});
                        this.setState({isHistoRapidScaled: true});
                    } catch (error) {
                        NotificationManager.error('Erreur au chargement des regles du theme');
                        this.setState({isHistoRapidScaledLoaded: true});
                    }
                }
            } catch (error) {
                this.setState({isHistoRapidScaledLoaded: true});
                NotificationManager.error('Erreur au chargement du theme')
            }
        }
    }
    private handleCaseSelected = async (selectedCaseId) => {
        const updatedNewCase = await this.caseService.getCaseCLO(selectedCaseId);
        await this.replaceCase(updatedNewCase);
    }

    private handleReprendre = async (caseId: string) => {
        if (this.isFromDisRc() || this.isFromGoFastr() || this.props.integratedViewMode) {
            // creation case from summary
            if (caseId && caseId.includes("new") && caseId.includes("|")) {
                this.createNewCase(false);
                if (caseId.split("|")?.length > 1) {
                    this.setState({defaultClientRequest: caseId.split("|")[1]})
                }
            } else {
                try {
                    this.props.setBlockingUIV2(true);
                    const caseCLO = await this.caseService.getCaseCLO(caseId);
                    this.setState({ isHistoRapid: false});
                    await this.replaceCase(caseCLO);
                } catch (error) {
                    console.error(error);
                    NotificationManager.error(error.message);
                    this.props.setIsRecentCasesListDisplayedV2(this.props.clientContext.clientData!.id, this.props.clientContext.service!.id, true);
                } finally {
                    this.props.setBlockingUIV2(false);
                }
            }
        } else { // iframe, open fastTab
            const service = this.props.clientContext?.service;
            // const url: string = "/cases/" + caseId + "/view" + this.props.location?.search;
            FastService.postRedirectMessage({
                idCase: caseId,
                serviceId: service?.id
            })

        }
    }

    private isFromDisRc() {
        return this.props.sessionIsFrom === ApplicationMode.DISRC;
    }

    private isFromFast() {
        return this.props.sessionIsFrom === ApplicationMode.FAST;
    }
    private isFromGoFastr() {
        return this.props.sessionIsFrom === ApplicationMode.GOFASTR;
    }

    private handleToutHistoriqueClick = () => {
        this.openNewFastTab("'All_Historique'")
    }

    private openNewFastTab = (mode) => {
        const service = this.props.clientContext.service;
        const client = this.props.clientContext.clientData
        const isLineFixe = ServiceUtils.isLandedService(service)
        const category = isLineFixe ? "FIXE" : "MOBILE"
        FastService.postOpenNewTabMessage({
            serviceId: service?.id,
            clientId: client?.id,
            mode,
            category
        });
    }

    private isFrom = () => {
        if (this.isFromFast()) {
            return ApplicationMode.FAST;
        } else if (this.isFromGoFastr()) {
            return ApplicationMode.GOFASTR;
        } else if (this.isFromDisRc()) {
            return ApplicationMode.DISRC
        } else {
            return "";
        }
    }
    private redirectToHistoRappid = () => {
        this.openNewFastTab("histo-rapide");
    }
    private displayCreateNewCaseButton = () => {
        const { recentCases, blockingUI } = this.props;
        const openRetrievedCases = recentCases?.casesList.filter(aCase => aCase.status !== "CLOSED");
        const isFrom = this.isFrom();
        return (
            <Row className="d-flex justify-content-center align-items-center flex-column w-100">
                <div>
                    <p className="font-weight-bold mb-13"><FormattedMessage id="dossiers.actifs.v2.no.cases.found" /></p>
                    <button id="listRecentCases.duplicate.id"
                        type="button"
                        onClick={() => this.createNewCase(false)}
                        disabled={blockingUI}
                        color={openRetrievedCases.length > 0 ? "primary" : "secondary"}
                        className={openRetrievedCases.length > 0 ? "btn createNew btn-outline-secondary" : "btn createNew btn-outline-primary"}>
                        <FormattedMessage id="cases.list.recent.create.button" />
                    </button>
                    {(recentCases?.isRecentCasesListDisplayed && isFrom !== ApplicationMode.DISRC && this.props.histoRapideSettings.length>0) ? <button type="button"
                        color={openRetrievedCases.length > 0 ? "primary" : "secondary"}
                        id="listRecentCases.histo.rapide"
                        onClick={isFrom !== ApplicationMode.FAST ? this.toggleHistoRapidePopup : this.redirectToHistoRappid}
                        disabled={blockingUI}
                        className={openRetrievedCases.length > 0 ? "btn createNew btn-outline-secondary ml-6" : "btn createNew btn-outline-primary ml-6"}
                    >
                        <FormattedMessage id="cases.list.recent.quick.histo.rapide" />
                    </button> : <></>}
                </div>
            </Row >
        );
    }

    private displayClientForbidden = () => {
        return (
            <Row className="d-flex justify-content-center align-items-center flex-column w-100">
                <p className="font-weight-bold mb-13 text-primary font-size-l">
                    <FormattedMessage id="dossiers.actifs.v2.creation.forbidden" />
                </p>
            </Row>
        );
    }

    public render(): JSX.Element {
        const fastTabId = this.props.payload?.fastTabId;
        const {
            recentCases,
            loadingCases,
            loadingClient,
            clientContext,
            authorizations,
            blockingUI,
            inCreateCaseBlacklist
        } = this.props;
        const isRecentCasesListDisplayed = this.props.recentCases?.isRecentCasesListDisplayed
        const {currentCaseId, shouldDisplayHistoRapide} = this.state;
        const isLoading = loadingCases || loadingClient;
        const idParamFromUrl = this.props.match && this.props.match.params.id ? this.props.match.params.id : null;
        const isScaledHistoRapid = this.state.isHistoRapid && this.state.isHistoRapidScaledLoaded;
        const histRapidCondition = !this.state.isHistoRapid || isScaledHistoRapid;
        return (
            <FastTabContext.Provider value={fastTabId}>
                {isLoading ?
                    <Loading />
                    :
                    <div className="RecentCasesListV2">
                        <Container fluid>
                            {isRecentCasesListDisplayed &&
                                <RecentCasesListV2
                                    casesRecentList={recentCases?.casesList !== undefined && recentCases?.casesList.length > 0 ? recentCases.casesList : []}
                                    idService={clientContext?.serviceId}
                                    authorizations={authorizations}
                                    handleReprendre={this.handleReprendre}
                                    handleToutHistoriqueClick={this.handleToutHistoriqueClick}
                                    toggleHistoRapidePopup={this.toggleHistoRapidePopup}
                                    isRecentCasesListDisplayed={isRecentCasesListDisplayed}
                                    isFrom={this.isFrom()}
                                    blockingUI={blockingUI}
                                idParamFromUrl= {idParamFromUrl}
                                />
                            }
                        </Container>
                        <Navbar>
                            {inCreateCaseBlacklist === undefined ?
                                <Loading/> :
                                !inCreateCaseBlacklist ?
                                    isRecentCasesListDisplayed && (isAuthorizedBebOrBebCoFixe(authorizations) || this.isFromDisRc())  ?
                                        this.displayCreateNewCaseButton()
                                        : <React.Fragment/>
                                    : this.displayClientForbidden()
                            }
                        </Navbar>
                    </div>
                }

                {!isRecentCasesListDisplayed && currentCaseId && this.props.clientContext && histRapidCondition &&
                    <CasePageV2 caseId={currentCaseId} onClosePage={this.handleOnCloseCasePage} clientContext={this.props.clientContext}
                        handleCaseSelected={this.handleCaseSelected} isHistoRapid={this.state.isHistoRapid} histoRapidIsScaled={this.state.isHistoRapidScaled}
                        currentDescription={this.state.seletctedHistoRapid ? this.state.seletctedHistoRapid?.clientRequest : this.state.defaultClientRequest} currentNoteValue={this.state.seletctedHistoRapid?.description}/>
                }

                <HistoRapideModal isModalOpen={shouldDisplayHistoRapide}
                    initCase={this.initHistoRapideCase}
                                  shutModal={this.toggleHistoRapidePopup}/>
            </FastTabContext.Provider>
        );
    }

    private createCase(payload: Payload) {
        this.props.setPayloadFromQuickAccessV2(payload)
        const {history, location} = this.props;
        history.push("/cases/create" + location.search)
    }
}

const mapStateToProps = (state: AppState, ownProps) => ({
    recentCases: ownProps.clientContext ? state.store.client.loadedClients.find(c => c.clientData?.id === ownProps.clientContext.clientData?.id && c.serviceId === ownProps.clientContext.serviceId)?.recentCases : state.store.recentCases.casesList,
    authorizations: state.store.applicationInitialState.authorizations,
    blockingUI: state.store.ui.blockingUI,
    client: state.store.client.currentClient,
    contact: state.store.contact.currentContact,
    histoRapideSettings: state.store.applicationInitialState.histoRapideSettings,
    inCreateCaseBlacklist: state.store.client.isServiceInLists?.inCreateCaseBlacklist,
    isMatchingCaseModalDisplayed: state.recentCases.isMatchingCaseModalDisplayed,// !_! y'a un mix de source de recentCases
    loadingCases: state.store.recentCases.loading,
    loadingClient: state.store.client.currentClient?.loading,
    payload: state.payload.payload,
    sessionIsFrom: state.store.applicationInitialState.sessionIsFrom,
    activityCode: state.store.applicationInitialState.user?.activity.code,
    integratedViewMode: state.store.applicationInitialState.integratedViewMode,
    selectedCase: ownProps.clientContext ? state.store.client.loadedClients.find(c => c.clientData?.id === ownProps.clientContext.clientData?.id && c.serviceId === ownProps.clientContext.serviceId)?.recentCases?.selectedCase : "",
    selectedHistoRapide: state.store.cases.selectedHistoRapide
})

const mapDispatchToProps = {
    clearCaseFromCasesListV2,
    fetchAndStoreCase,
    fetchAndStoreIsServiceInLists,
    fetchRecentCases: fetchRecentCasesV2,
    fetchRecentCasesForClient: fetchRecentCasesForClientV2,
    initEmptyCaseV2,
    pushCaseToRecentCasesV2: pushCaseToRecentCasesClientV2,
    setActiveTab,
    setAdditionalDataV2,
    setBlockingUIV2,
    setCaseMotifV2,
    setIsCurrentCaseScaledV2,
    setIsMatchingCaseModalDisplayedV2,
    setIsRecentCasesListDisplayedV2,
    setMatchingCaseV2,
    setQualificationLeafV2,
    setQualificationSelectedV2,
    storeCaseV2,
    updateSectionsV2,
    storeCaseBooleansV2,
    setPayloadFromQuickAccessV2,
    notifyThemeSelectionActionV2,
    setIsThemeSelectedV2,
    setCaseHasInProgressIncident
}

export default connect(mapStateToProps, mapDispatchToProps)(ListRecentCasesPageV2)
