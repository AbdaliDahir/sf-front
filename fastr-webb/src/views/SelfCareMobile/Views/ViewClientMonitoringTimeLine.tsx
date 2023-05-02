import * as React from "react"
import {NotificationManager} from "react-notifications"
import Alert from "reactstrap/lib/Alert";
import {GesteCommercialBios} from "../../../model/TimeLine/GesteCommercialBios"
import {SOCO} from "../../../model/TimeLine/SOCO";
import ClientService from "../../../service/ClientService"
import SelfCareService from "../../../service/SelfCareService";
import {fetchAndStoreAuthorizations} from "../../../store/actions";
import TimeLineSynthetic from "../TimeLines/TimeLineSynthetic"
import {AppState} from "../../../store";
import {connect} from "react-redux";
import Loading from "../../../components/Loading";
import SessionService from "../../../service/SessionService";
import ActService from "../../../service/ActService";
import ActionService from "../../../service/ActionService";
import {ActiviteRegul} from "src/model/service";
import {isAllowedAutorisation} from "../../../utils/AuthorizationUtils";
import { ClientContextSliceState } from "src/store/ClientContextSlice";


// TODO Pas de SCS, PAS DE CSU
interface State {
    refSiebel: string | null
    csuCode: string | null,
    csuNumeroIntra: string | null,
    discountMobile: GesteCommercialBios[]
    commercialSolicitation: SOCO | undefined
    adgRegul
    gcoGcu
    actionRegul,
    activRegul: ActiviteRegul[]
}



interface Props extends React.Component<Props, State> {
    showGCO: boolean
    showSOCO: boolean
    showREGUL: boolean
    fetchAndStoreAuthorizations: (sessionId) => void
    authorizations: Array<string>
    clientContext?: ClientContextSliceState
}
const THREE_MONTH_BY_DAY_DEPTH = '90';
class ViewClientMonitoringTimeLine extends React.Component<Props, State> {
    private clientService: ClientService = new ClientService();
    private selfCareService: SelfCareService = new SelfCareService()
    private actService: ActService = new ActService(true)
    private actionService: ActionService = new ActionService(true)

    constructor(props: Props) {
        super(props);
        const urlSearchParams = new URLSearchParams(window.location.search);
        this.state = {
            refSiebel: this.props.clientContext?.service?.siebelAccount ?  this.props.clientContext.service?.siebelAccount: urlSearchParams.get("refSiebel"),
            csuCode: this.props.clientContext?.service ? this.props.clientContext?.service.offerTypeId : urlSearchParams.get("scs"),
            csuNumeroIntra: this.props.clientContext?.service ? this.props.clientContext?.service?.additionalData?.offerId : urlSearchParams.get("csu"),
            discountMobile: [],
            commercialSolicitation: undefined,
            adgRegul: undefined,
            actionRegul: undefined,
            gcoGcu: undefined,
            activRegul: []
        }

    }

    public getDiscounts = async () => {
        try {
            if (this.state.csuCode !== null && this.state.csuNumeroIntra !== null && !this.isFixedLine()) {
                // TODO: faire le typage
                const discountMobile = await this.clientService.getDiscountMobile(this.state.csuCode, this.state.csuNumeroIntra);
                this.setState({
                    discountMobile
                });
            }
        } catch (e) {
            NotificationManager.error(await e.error);
            console.error(e);
        }
    };

    public retrieveCommercialSolicitation = async () => {
        if (this.state.commercialSolicitation) return;

        let emails;
        let smss;
        const emailsPromise = this.isFixedLine() ?
            this.selfCareService.retrieveSOCOFixe(this.state.refSiebel?this.state.refSiebel:"", "3") :
            this.selfCareService.retrieveSOCOMobile(this.getCsuGcuCode(), "3");
        const smsPromise = this.selfCareService.retrieveSOCOSMS(this.getCsuGcuCode(), "90");
        try {
            emails = await emailsPromise;
        } catch (e) {
            NotificationManager.error("L'information des sollicitations commerciales n'est pas disponible actuellement");
        }
        try {
            smss = await smsPromise;
        } catch (e) {
            NotificationManager.error("L'information des sollicitations commerciales n'est pas disponible actuellement");
        }
        const commercialSolicitation: SOCO = { status: emails?.status, emails: emails?.emails, sms: smss };
        this.setState({
            commercialSolicitation
        });
    }

    public retrieveADGRegul = async () => {
        try {
            if (!this.state.adgRegul) {
                const adgRegul = this.isFixedLine() && !!this.state.refSiebel ?
                    await this.actService.getListActRegularisationFixeForLastThreeMonths(this.state.refSiebel)
                    : [];

                this.setState({
                    adgRegul
                });
            }
        } catch (e) {
            NotificationManager.error("L'information des ADG de régularisation n'est pas disponible actuellement");
        }
    };

    public retrieveActionRegul = async () => {
        try {
            if (!this.state.actionRegul) {
                const actionRegul = this.isFixedLine() && !!this.state.refSiebel?
                    await this.actionService
                    .getRegulFixeActionsBySiebelAccountWithDepthInDays(
                        this.state.refSiebel,
                        THREE_MONTH_BY_DAY_DEPTH)
                    : [];

                this.setState({
                    actionRegul
                });
            }
        } catch (e) {
            NotificationManager.error("L'information des actions de régularisation n'est pas disponible actuellement");
        }
    };

    public retrieveGcoGcu = async () => {
        try {
            if (!this.state.gcoGcu) {
                const gcoGcu = this.isFixedLine() && !!this.state.refSiebel?
                    await this.clientService.findAllGcuGcoByRefSiebelForLastThreeMonths(this.state.refSiebel)
                    : [];

                this.setState({
                    gcoGcu
                });
            }
        } catch (e) {
            NotificationManager.error("L'information des gestes commerciaux n'est pas disponible actuellement");
        }
    };

    public retrieveActiveRegul = async () => {
        try {
            if (!this.state.adgRegul) {
                const activRegul = this.isFixedLine() && !!this.state.refSiebel ?
                    await this.clientService.findAllActiviteRegularisationByRefAndDepthInMonth(this.state.refSiebel, '3')
                    : [];

                this.setState({
                    activRegul
                });
            }
        } catch (e) {
            NotificationManager.error("L'information des Activite de régularisation n'est pas disponible actuellement");
        }
    };
    public getRegulAndGestesCommerciaux = async () => {
        this.retrieveADGRegul();
        this.retrieveGcoGcu();
        this.retrieveActionRegul();
        this.retrieveActiveRegul();
    };

    public getADGRegulDetails = async (transactionId) => {
        try {
            return this.isFixedLine() && this.state.refSiebel && transactionId ?
                await this.actService.getActRegularisationFIxe(transactionId, this.state.refSiebel)
                : new Promise(() => []);

        } catch (e) {
            NotificationManager.error("Pas de détails sur l'acte de régularisation");
        }
    };

    public componentWillMount = async () => {
        await this.getDiscounts()
        const sessionId = SessionService.getSession();
        if (this.props.authorizations.length === 0) {
            await this.props.fetchAndStoreAuthorizations(sessionId)
        }
        if (this.props.showREGUL && isAllowedAutorisation(this.props.authorizations, "is_access_regul_suivi_commercial")) {
            this.getRegulAndGestesCommerciaux();
        }
    };

    public render(): JSX.Element {

        const { discountMobile, commercialSolicitation, adgRegul, gcoGcu, actionRegul, activRegul } = this.state

        if (!discountMobile) {
            return (<Loading />)
        } else {
            if (this.state.csuCode && this.props.authorizations && this.props.authorizations.indexOf('is_access_SOCO') > -1) {
                return (
                    <div className={"hideOverflow"}>
                        <TimeLineSynthetic discountMobile={this.props.showGCO ? discountMobile : []}
                            commercialSolicitation={commercialSolicitation && this.props.showSOCO ? commercialSolicitation : undefined}
                            retrieveCommercialSolicitation={this.retrieveCommercialSolicitation}
                            adgRegul={adgRegul}
                            actionRegul={actionRegul}
                            activRegul={activRegul}
                            gcoGcu={gcoGcu}
                            getAdgDetails={this.getADGRegulDetails}
                            retrieveData={this.getRegulAndGestesCommerciaux}
                            isFixe={this.isFixedLine()}
                        />
                    </div>
                )
            } else if (!this.isFixedLine()) {
                return (
                    <div className={"hideOverflow"}>
                        <TimeLineSynthetic discountMobile={this.props.showGCO ? discountMobile : []}
                            commercialSolicitation={commercialSolicitation && this.props.showSOCO ? commercialSolicitation : undefined}
                            retrieveCommercialSolicitation={this.retrieveCommercialSolicitation}
                            adgRegul={adgRegul}
                            retrieveADGRegul={this.retrieveADGRegul}
                            isFixe={this.isFixedLine()}
                        />
                    </div>
                )
            } else {
                return (<Alert color="danger" className={"text-center"}>Utilisateur non habilité</Alert>)
            }
        }
    }

    private isFixedLine() {
        return this.state.csuCode === "06";
    }

    private getCsuGcuCode() {
        if (!!this.state.csuCode && !!this.state.csuNumeroIntra) {
            return this.state.csuCode?.concat("-").concat(this.state.csuNumeroIntra);
        }
        return ""
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        showGCO: state.persisted.showGCO,
        showSOCO: state.persisted.showSOCO,
        showREGUL: state.persisted.showREGUL,
        authorizations: state.authorization.authorizations
    }
}

export default connect(mapStateToProps, { fetchAndStoreAuthorizations })(ViewClientMonitoringTimeLine)
