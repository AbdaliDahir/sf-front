import * as React from "react";
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {Container, Nav, Navbar, NavItem} from "reactstrap";
import Button from "reactstrap/lib/Button";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import {toggleBlockingUI} from "src/store/actions/UIActions";
import FastrPayloadPage from "../../../components/Pages/FastrPayloadPage";
import {DataLoad} from "../../../context/ClientContext";
import {Case} from "../../../model/Case";
import ErrorModel from "../../../model/utils/ErrorModel";
import CaseService from "../../../service/CaseService";
import FastService from "../../../service/FastService";
import {AppState} from "../../../store";
import {
    setAdditionalData,
    setCaseMotif,
    setCaseQualification,
    setDisplayGridADGForDISRC,
    setQualificationLeaf,
    setQualifWasGivenInThePayload,
    storeIdActDisRC,
    storeMotifDisRCAdg
} from "../../../store/actions/CasePageAction";
import {fetchAndStoreCase, storeCase} from "../../../store/actions/CaseActions"
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import {fetchRecentCases, lookForMatchingCaseQualifications, setIsMatchingCaseModalDisplayed, setIsRecentCasesListDisplayed, setMatchingCase} from "../../../store/actions/RecentCasesActions";
import {BlockingContext} from "../../App";
import ExistingCasesByMotifTable from "./Elements/ExistingCasesByMotifTable";
import CasesListDetails from "./Forms/CasesListDetails";
import Loading from "../../../components/Loading";
import {fetchAndStoreAuthorizations} from "../../../store/actions";
import SessionService from "../../../service/SessionService";
import ServiceUtils from "../../../utils/ServiceUtils";
import CreateCasePage, {Payload} from "../Create/CreateCasePage";
import ViewCasePage from "../View/ViewCasePage";
import {setPayload} from "../../../store/PayloadSlice";
import {fetchActivationFlags} from "../../../store/ActivationFlagSlice";
import {fetchAndStoreIsServiceInLists} from "../../../store/actions/v2/client/ClientActions";

export interface State {
    eligibilityToReCreateExistingCase: boolean;
    modal: boolean
}

interface Props extends RouteComponentProps<void> {
    toggleBlockingUI: () => void
    blockingUI: boolean
    setPayload: (payload) => void
    setIsRecentCasesListDisplayed: (state) => void
    setDisplayGridADGForDISRC: (state) => void
    setMatchingCase: (matchingCase) => void
    setIsMatchingCaseModalDisplayed: (isDisplayed) => void
    storeCase: (casetoSave) => void
    setAdditionalData: (data) => void
    isRecentCasesListDisplayed: boolean
    fetchRecentCases: (idClient: string, idService: string, fromDisrc?: boolean) => void
    retrievedCases: Array<Case>
    loadingCases
    fetchAndStoreClient
    lookForMatchingCaseQualifications
    loadingClient
    matchingCaseFound
    setCaseMotif
    setQualificationLeaf
    setCaseQualification
    setQualifWasGivenInThePayload
    payload
    from: string
    fetchAndStoreCase
    fetchAndStoreAuthorizations: (sessionId: string) => {}
    fetchActivationFlags: () => void
    authorizations
    service,
    storeMotifDisRCAdg,
    storeIdActDisRC,
    isMatchingCaseModalDisplayed,
    fetchAndStoreIsServiceInLists: (clientId: string, serviceId: string) => {},
    inCreateCaseBlacklist?: boolean
}

export const FastTabContext = React.createContext('');

class ListRecentCasesPage extends FastrPayloadPage<Props, State, Payload, void> {
    public static contextType = BlockingContext;
    private caseService: CaseService = new CaseService(true);

    constructor(props: Props) {
        super({...props}); // fails if no payload in url

        if (this.props.payload) {
            this.payload = this.props.payload
        }

        this.state = {
            eligibilityToReCreateExistingCase: true,
            modal: false
        }
    }

    public async componentWillMount() {
        const eligibility: boolean = await this.caseService.getEligibilityToDuplicateCase();
        this.setState({eligibilityToReCreateExistingCase: eligibility})

        await this.getRecentCasesListFromFastrCases();
        await this.props.fetchAndStoreIsServiceInLists(this.payload.idClient, this.payload.idService)
        let currentSessionId = SessionService.getSession();
        if (currentSessionId === undefined) {
            currentSessionId = ""
        }
        await this.props.fetchActivationFlags()
        await this.props.fetchAndStoreAuthorizations(currentSessionId)

        if (this.payload.motif) {
            this.props.setCaseMotif(this.payload.motif)
            this.props.setQualificationLeaf(await this.caseService.getCaseQualifSettings(this.payload.motif.code))
            this.props.setCaseQualification(this.payload.motif)
            this.props.setQualifWasGivenInThePayload(true)
        }
        await this.props.fetchAndStoreClient(this.payload.idClient, this.payload.idService, DataLoad.ALL_SERVICES)
        await this.props.lookForMatchingCaseQualifications(this.payload.idClient, this.payload.idService)
        if (this.payload.idAct) { // ADG quick access
            if (this.props.matchingCaseFound) {
                if (this.props.from !== "TabContainer") {
                    const url: string = "/cases/" + this.props.matchingCaseFound.caseId + "/view" + this.props.location.search + "&edit";
                    await FastService.postRedirectMessage({
                        urlUpdate: url,
                        idCase: this.props.matchingCaseFound.caseId,
                        fastTabId: this.payload.fastTabId
                    });
                    if (process.env.NODE_ENV === "development" || this.payload.fromdisrc) {
                        this.props.history.push(url)
                    }
                } else {
                    this.props.fetchAndStoreCase(this.props.matchingCaseFound.caseId)
                }
            } else {
                this.createDuplicateCase()
            }
        }
        /*if (!this.props.retrievedCases || this.props.retrievedCases.length <= 0 && this.props.from !== "TabContainer") {
            this.props.history.push("/cases/create" + this.props.location.search)
        }*/
        if (!this.payload.fromdisrc) {
            await this.setIdCase();
        }
    }

    public async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (!prevProps.isRecentCasesListDisplayed && this.props.isRecentCasesListDisplayed) { // list got re-displayed
            // refresh list
            await this.getRecentCasesListFromFastrCases();
        }

    }

    public getRecentCasesListFromFastrCases = async () => {
        try {
            this.props.toggleBlockingUI();
            /*Get cases list*/
            await this.props.fetchRecentCases(this.payload.idClient, this.payload.idService, this.payload.fromdisrc);

            // do not use updateCaseEli of URL anymore
            // Replaced by Authorization isActiviteBeB
            const {retrievedCases} = this.props

            if (retrievedCases && retrievedCases.length > 0) {
                /*Get eligibility*/
                const eligibility: boolean = await this.caseService.getEligibilityToDuplicateCase();
                this.setState({
                    eligibilityToReCreateExistingCase: eligibility // current user eligibility
                });
            }
        } catch (error) {
            console.error(error);
            return error.then((element: ErrorModel) => {
                NotificationManager.error(element.message);
            });
        } finally {
            this.props.toggleBlockingUI();
        }
    };

    public createDuplicateCase = async () => {
        const {history, location} = this.props;
        if (this.props.matchingCaseFound) {
            if (this.state.eligibilityToReCreateExistingCase) {
                history.push("/cases/create" + this.props.location.search + "&force")
            } else {
                this.toggleAlertModal()
            }
        } else {
            if (this.props.from !== "TabContainer") {
                history.push("/cases/create" + location.search)
            }
        }
    };

    public renderNotEligibleWarningModal = (): JSX.Element => {
        if (this.props.matchingCaseFound) {
            return (
                <Modal isOpen={this.state.modal} toggle={this.toggleAlertModal}>
                    <ModalBody>
                        <div className="w-100 text-danger text-justify"><h6><strong> <FormattedMessage
                            id="cases.create.duplicate.eligibility.error"/></strong></h6></div>
                        <ExistingCasesByMotifTable casesList={[this.props.matchingCaseFound]}
                                                   fastTabId={this.payload.fastTabId}/>
                    </ModalBody>
                </Modal>
            )
        } else {
            return <React.Fragment/>
        }
    };

    public toggleAlertModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    };

    public openNewFastTab = (mode) => {
        const {service} = this.props;
        const isLineFixe = ServiceUtils.isLandedService(service)
        const category = isLineFixe ? "FIXE" : "MOBILE"
        FastService.postOpenNewTabMessage({
            serviceId: this.payload.idService,
            clientId: this.payload.idClient,
            mode: mode,
            category: category
        });
    }

    private evaluateNextAction = async () => {
        if (this.payload.fromdisrc) {
            if (this.props.blockingUI) {
                this.props.toggleBlockingUI();
            }
            // open in current tab, new case
            this.props.storeMotifDisRCAdg(undefined); // reset motif disrc
            this.props.storeIdActDisRC(""); // reset disrcIdAct
            this.props.setMatchingCase(undefined);
            this.props.setIsMatchingCaseModalDisplayed(false);
            this.props.setIsRecentCasesListDisplayed(false);
            this.props.setDisplayGridADGForDISRC(true);// resets adg tab display state

            // for createCasePage, in case we opened a case before
            this.props.storeCase(undefined);
            this.props.setCaseQualification(undefined);
            this.props.setCaseMotif(undefined);
            this.props.setQualificationLeaf(undefined);
            // AdditionalData too ?;
            await this.setIdCase();

        } else {
            this.openNewFastTab('CREATION');
        }
    }

    private backToCasesList = () => {
        this.props.setIsRecentCasesListDisplayed(true);
    }

    private renderDISRCComponents = () => {
        if (this.payload.fromdisrc &&
            !this.props.isRecentCasesListDisplayed &&
            this.props.retrievedCases && this.props.retrievedCases.length
        ) {
            if (this.props.matchingCaseFound && !this.props.isMatchingCaseModalDisplayed) {
                return <section>
                    <section className="list-recent-cases-back btn btn-primary"
                             onClick={this.backToCasesList}>
                        <FormattedMessage id="cases.list.recent.back"/>
                    </section>
                    <ViewCasePage/>
                </section>
            } else {
                return <CreateCasePage/>
            }
        }
        return <React.Fragment/>
    }

    private setIdCase = async () => {
        let seqNum = '0'
        try {
            seqNum = await this.caseService.getNextCaseNumberSequence()
        } finally {
            this.props.setPayload({...this.payload, idCase: seqNum})
        }
    }

    public render(): JSX.Element {
        const {retrievedCases, loadingCases, loadingClient, inCreateCaseBlacklist, authorizations, isRecentCasesListDisplayed} = this.props;
        const {fastTabId, idService, fromdisrc} = this.payload;
        const isLoading = loadingCases || loadingClient;

        return (
            <FastTabContext.Provider value={fastTabId}>
                {isLoading ?
                    <Loading/>
                    :
                    <div>
                        {this.renderNotEligibleWarningModal()}
                        <Navbar className={fromdisrc ? "" : "sticky-top" + " p-1 border-bottom pl-3 pr-3"}
                                style={{backgroundColor: "rgba(255,255,255,0.6)"}}>
                            {!fromdisrc &&
                                <Button id="listRecentCases.historic.id" size="sm" type="button"
                                        color={"primary"}
                                        onClick={() => this.openNewFastTab('All_Historique')}>
                                    <FormattedMessage id="cases.list.recent.historic.button"/>
                                </Button>
                            }

                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    {inCreateCaseBlacklist === undefined &&
                                        <Button type="button" size="sm" color={"primary"} disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                                        </Button>
                                    }
                                    {inCreateCaseBlacklist === false && ((isRecentCasesListDisplayed && fromdisrc) || !fromdisrc) &&
                                        <Button id="listRecentCases.duplicate.id" size="sm" type="button"
                                                color={"primary"}
                                                onClick={this.evaluateNextAction}>
                                            <FormattedMessage id="cases.list.recent.create.button"/>
                                        </Button>
                                    }
                                    {inCreateCaseBlacklist === true &&
                                        <p className="font-weight-bold text-primary">
                                            <FormattedMessage id="dossiers.actifs.v2.creation.forbidden"/>
                                        </p>
                                    }
                                </NavItem>
                            </Nav>
                        </Navbar>
                        <Container fluid>
                            {this.props.isRecentCasesListDisplayed &&
                                <CasesListDetails casesList={retrievedCases !== undefined && retrievedCases.length > 0 ? retrievedCases : []}
                                                  idService={idService}
                                                  authorizations={authorizations}/>
                            }
                        </Container>
                    </div>
                }
                {this.renderDISRCComponents()}
            </FastTabContext.Provider>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    retrievedCases: state.recentCases.casesList,
    loadingCases: state.recentCases.loading,
    loadingClient: state.store.clientContext.loading,
    matchingCaseFound: state.recentCases.matchingCaseFound,
    authorizations: state.authorization.authorizations,
    service: state.client.service,
    payload: state.payload.payload,
    isRecentCasesListDisplayed: state.recentCases.isRecentCasesListDisplayed,
    blockingUI: state.ui.blockingUI,
    isMatchingCaseModalDisplayed: state.recentCases.isMatchingCaseModalDisplayed,
    inCreateCaseBlacklist: state.store.client.isServiceInLists?.inCreateCaseBlacklist
})

export default connect(mapStateToProps, {
    toggleBlockingUI,
    setPayload,
    fetchRecentCases,
    lookForMatchingCaseQualifications,
    fetchAndStoreClient,
    setCaseMotif,
    setQualificationLeaf,
    setCaseQualification,
    setQualifWasGivenInThePayload,
    fetchAndStoreCase,
    fetchAndStoreAuthorizations,
    setIsRecentCasesListDisplayed,
    setMatchingCase,
    storeMotifDisRCAdg,
    storeIdActDisRC,
    setDisplayGridADGForDISRC,
    setIsMatchingCaseModalDisplayed,
    fetchActivationFlags,
    storeCase,
    setAdditionalData,
    fetchAndStoreIsServiceInLists
})(ListRecentCasesPage)
