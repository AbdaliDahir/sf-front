import * as React from "react";
import {connect} from "react-redux";
import {NotificationManager} from "react-notifications";
import Alert from "reactstrap/lib/Alert";
import {GesteCommercialBios} from "../../../model/TimeLine/GesteCommercialBios";
import {SOCO} from "../../../model/TimeLine/SOCO";
import SelfCareService from "../../../service/SelfCareService";
import {AppState} from "../../../store";
import {fetchAndStoreAuthorizations} from "../../../store/actions/AuthorizationActions";
import BiosDiscountsTable from "../BiosDiscountsTable";
import SOCOTable from "../EventTable/SOCOTable";
import Loading from "../../../components/Loading";
import SessionService from "../../../service/SessionService";
import RegularisationContainer from "../SocoRegularisation/RegularisationContainer";

/**
 * scs code
 * 06 means this is a fixed phone line
 * 09/01 means a mobile phone line
 */
interface State {
    csuCode: string | null
    csuNumeroIntra: string | null
    refSiebel: string | null
    discountMobile: GesteCommercialBios[]
    commercialSolicitation: SOCO | undefined
}

interface Props extends React.Component {
    fetchAndStoreAuthorizations: (sessionId) => void
    // tslint:disable-next-line:no-any
    authorization: any
    showRegul: boolean
}

// TODO A supprimer à terme
class ViewClientMonitoringPage extends React.Component<Props, State> {
    private selfCareService: SelfCareService = new SelfCareService();

    constructor(props: Props) {
        super(props);
        // TODO: Le nom des paramètres à changer et à traduire
        const urlSearchParams = new URLSearchParams(window.location.search);

        this.state = {
            refSiebel: urlSearchParams.get("refSiebel"),
            csuCode: urlSearchParams.get("scs"),
            csuNumeroIntra: urlSearchParams.get("csu"),
            discountMobile: [],
            commercialSolicitation: undefined
        }
    }

    public async componentDidMount() {
        this.retrieveDiscounts();
        const sessionId = SessionService.getSession();
        if (this.props.authorization.authorizations.length === 0) {
            await this.props.fetchAndStoreAuthorizations(sessionId)
        }
        this.retrieveCommercialSolicitation();
    }


    public retrieveDiscounts = async () => {
        try {
            if (this.state.csuCode !== null && this.state.csuNumeroIntra !== null && !this.isFixedLine()) {
                const discountMobile = await this.selfCareService.retrieveDiscounts(this.state.csuCode, this.state.csuNumeroIntra);
                this.setState({
                    discountMobile
                });
            }
        } catch (e) {
            NotificationManager.error(await e.error);
        }
    };

    public retrieveCommercialSolicitation = async () => {
        if (this.state.commercialSolicitation) return;

        let emails;
        let smss;

        const emailsPromise = this.isFixedLine() && this.props.authorization.authorizations.indexOf("is_access_SOCO") > -1 ?
            this.selfCareService.retrieveSOCOFixe(this.state.refSiebel ? this.state.refSiebel : "", "3") :
            this.selfCareService.retrieveSOCOMobile(this.getCsuGcuCode(), "3");
        const smsPromise = this.selfCareService.retrieveSOCOSMS(this.getCsuGcuCode(), "730");
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

    public render(): JSX.Element {
        const { discountMobile, commercialSolicitation } = this.state
        if (!discountMobile || this.props.authorization.loading) {
            return (<Loading />)
        } else {
            if (this.isFixedLine()) {
                if (this.props.authorization.authorizations && this.props.authorization.authorizations.indexOf('is_access_SOCO') > -1) {
                    return (
                        <React.Fragment>
                            <div className={"goUpForSoco"}>
                                {this.props.authorization.authorizations.indexOf('is_access_regul_suivi_commercial') > -1 ?
                                    <RegularisationContainer refSiebel={this.state.refSiebel}/> : <></>}
                                <SOCOTable commercialSolicitation={commercialSolicitation} />
                            </div>
                        </React.Fragment>
                    )
                } else {
                    return (<Alert color="danger" className={"text-center"}>Utilisateur non habilité</Alert>)
                }
            } else {
                return (
                    <React.Fragment>
                        <div className={"goUpForBiosSoco"}>
                            <BiosDiscountsTable discountMobile={discountMobile} />
                            <SOCOTable commercialSolicitation={commercialSolicitation} />
                        </div>
                    </React.Fragment>
                );
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
        authorization: state.authorization,
        showRegul: state.persisted.showREGUL,
    }
}

export default connect(mapStateToProps, { fetchAndStoreAuthorizations })(ViewClientMonitoringPage);
