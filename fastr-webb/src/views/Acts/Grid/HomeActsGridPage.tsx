import {Base64} from 'js-base64';
import * as moment from "moment";
import * as queryString from "querystring";
import {ParsedUrlQuery} from "querystring";
import * as React from 'react'
import {FormattedMessage} from 'react-intl'
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";
import {CardBody, Container, Row} from "reactstrap";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardHeader from "reactstrap/lib/CardHeader";
import Col from "reactstrap/lib/Col";
import Label from "reactstrap/lib/Label";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import Loading from "../../../components/Loading";
import ClientErrorModal from "../../../components/Modals/component/ClientErrorModal";
import FastrPayloadPage from "../../../components/Pages/FastrPayloadPage";
import {ClientContextInterface, DataLoad} from "../../../context/ClientContext";
import {ACT_ID} from "../../../model/actId";
import {CaseQualification} from "../../../model/CaseQualification";
import {Channel} from "../../../model/Channel";
import {MediaDirection} from "../../../model/MediaDirection";
import {MediaKind} from "../../../model/MediaKind";
import {Client} from "../../../model/person";
import {Service} from "../../../model/service";
import FastService from "../../../service/FastService";
import {AppState} from "../../../store";
import {fetchAndStoreAuthorizations} from "../../../store/actions";
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import ClientContextProps from "../../../store/types/ClientContext";
import {BlockingContextInterface} from "../../App";
import {ADGButtonConfig} from "../ADGButtonsConfigurationForSuperQuickAccess";
import {ActQualification, qualification} from "./qualification";
import SessionService from "../../../service/SessionService";

/*http://localhost:3000/acts/home?sessionId=dummy&payload=ewoJImlkQ2xpZW50IjogIjEwNjEyNTUxMiIsCgkiaWRTZXJ2aWNlIjogIjA5LURNNjlFNyIsCgkiaWRDYXNlIjogIjEwMDAwMTY2MjAiLAoJIm1vdGlmIjogewoJCSJjYXNlVHlwZSI6IG51bGwsCgkJImNvZGUiOiAiUExURkFWMDFfMDJfMTBfMDEiLAoJCSJsZXZlbEZvdXIiOiAiQ2hhbmdlbWVudCBkJ29mZnJlIGVuIGNvdXJzIiwKCQkibGV2ZWxPbmUiOiAiMS5PRkZSRVMgJiBTRVJWSUNFUyIsCgkJImxldmVsVGhyZWUiOiAiMS5DaGFuZ2VtZW50IGQnb2ZmcmUgZW4gY291cnMiLAoJCSJsZXZlbFR3byI6ICIxLjIgU3VpdnJlIgoJfSwKCSJ0aGVtZSI6IG51bGwsCgkib2ZmZXJDb2RlIjogIjA5IiwKCSJpZENvbnRhY3QiOiAiMjAxNTIiLAoJImNvbnRhY3RNZWRpYVR5cGUiOiAiVk9JWCIsCgkiY29udGFjdE1lZGlhRGlyZWN0aW9uIjogIkVOVFJBTlQiLAoJImNvbnRhY3RDaGFubmVsIjogIkNVU1RPTUVSX0NBUkUiLAoJImNvbnRhY3RTdGFydERhdGUiOiAiMjAxOS0wMi0xM1QxMDowODozNy4wMDAiLAoJImNvbnRhY3RDcmVhdGVkQnlGYXN0IjogZmFsc2UsCgkiZmFzdFRhYklkIjogIjc2NDQ2MDgyXzE1NTAwNDg4ODUwNjRfMzAyMzk0OTUwXzEwMDAwMTY2MjAiLAoJImlkQWN0RWxpTGlzdCI6IFsiQURHX0NPTlRBQ1QiLCAiQURHX0NIR1RfQ0FUIiwgIkFER19BRFJfRkFDVCJdCn0=*/

interface Payload {
    idClient: string
    idService: string
    idCase: string
    idAct: string
    motif: CaseQualification
    idContact: string
    contactCreatedByFast: boolean
    contactMediaType: MediaKind
    contactChannel: Channel
    contactMediaDirection: MediaDirection
    contactStartDate: string
    idActEliList: [ACT_ID]
    fastTabId: string
    iccid: string
    fromQA: boolean
}

interface State {
    idActEliListState: ACT_ID[]
    dataForTheForm?: Client
    clientError: boolean
    buttonList
}

interface Props extends RouteComponentProps<void> {
    client: ClientContextInterface,
    block: BlockingContextInterface,
    authorizations: Array<string>,
    fetchAndStoreAuthorizations: (sessionId: string) => {},
    fetchAndStoreClient: (clientId: string, serviceId: string, howToLoad: DataLoad) => {},
    authorizationLoading: boolean
}

type PropType = ClientContextProps<Service>

class HomeActsGridPage extends FastrPayloadPage<Props & PropType, State, Payload, void> {

    constructor(props: Props & PropType) {
        super(props);
        this.state = {
            idActEliListState: [ACT_ID.ADG_CTI],
            dataForTheForm: undefined,
            clientError: false,
            buttonList: ADGButtonConfig
        }
    }

    public componentWillMount = async () => {
        try {
            await this.props.fetchAndStoreClient(this.payload.idClient, this.payload.idService, DataLoad.ALL_SERVICES)
        } catch (err) {
            this.setState({clientError: true});
        }
        const data = {dueDate: moment().toISOString(), notification: true};
        const dataForTheForm = Object.assign(data, this.props.client.data);
        this.setState({dataForTheForm});
        const sessionId = SessionService.getSession();
        await this.props.fetchAndStoreAuthorizations(sessionId);
    };

    public redirectMeOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        let motifByActId: ActQualification;
        let idActByAct: ACT_ID;
        switch (ACT_ID [event.currentTarget.id]) {
            case (ACT_ID.ADG_CONTACT): {
                motifByActId = qualification.ADG_PERSONAL_QUALIF;
                idActByAct = ACT_ID.ADG_CONTACT;
                break;
            }
            case (ACT_ID.ADG_ADR_PRINC): {
                motifByActId = qualification.ADG_PERSONAL_QUALIF;
                idActByAct = ACT_ID.ADG_ADR_PRINC;
                break;
            }
            case (ACT_ID.ADG_ETAT_CIVIL): {
                motifByActId = qualification.ADG_PERSONAL_QUALIF;
                idActByAct = ACT_ID.ADG_ETAT_CIVIL;
                break;
            }
            case (ACT_ID.ADG_GESTION_DECLA_PRO): {
                motifByActId = qualification.ADG_PERSONAL_QUALIF;
                idActByAct = ACT_ID.ADG_GESTION_DECLA_PRO;
                break;
            }
            case (ACT_ID.ADG_DCD): {
                motifByActId = qualification.ADG_PERSONAL_QUALIF;
                idActByAct = ACT_ID.ADG_DCD;
                break;
            }

            case (ACT_ID.ADG_JPP): {
                motifByActId = qualification.ADG_JPP_QUALIF;
                idActByAct = ACT_ID.ADG_JPP;
                break;
            }
            case (ACT_ID.ADG_CHGT_CAT): {
                motifByActId = qualification.ADG_PERSONAL_QUALIF;
                idActByAct = ACT_ID.ADG_CHGT_CAT;
                break;
            }
            case (ACT_ID.ADG_ADR_FACT): {
                motifByActId = qualification.ADG_PERSONAL_QUALIF;
                idActByAct = ACT_ID.ADG_ADR_FACT;
                break;
            }
            case (ACT_ID.ADG_UTIL): {
                motifByActId = qualification.ADG_PERSONAL_QUALIF;
                idActByAct = ACT_ID.ADG_UTIL;
                break;
            }
            case ACT_ID.ADG_TUTELLE: {
                motifByActId = qualification.ADG_PERSONAL_QUALIF;
                idActByAct = ACT_ID.ADG_TUTELLE;
                break;
            }
            case  ACT_ID.ADG_CHGT_CF: {
                motifByActId = qualification.ADG_CHGT_CF_QUALIF;
                idActByAct = ACT_ID.ADG_CHGT_CF;
                break;
            }
            case  ACT_ID.ADG_CTI: {
                motifByActId = qualification.ADG_CTI_QUALIF;
                idActByAct = ACT_ID.ADG_CTI;
                break;
            }
            case (ACT_ID.ADG_MDP): {
                motifByActId = qualification.ADG_PERSONAL_QUALIF;
                idActByAct = ACT_ID.ADG_MDP;
                break;
            }
            case (ACT_ID.ADG_PUK): {
                motifByActId = qualification.ADG_PUK_QUALIF;
                idActByAct = ACT_ID.ADG_PUK;
                break;
            }
            case  ACT_ID.ADG_DUPL_FACT: {
                motifByActId = qualification.ADG_DUPL_FACT_QUALIF;
                idActByAct = ACT_ID.ADG_DUPL_FACT;
                break;
            }
            case  ACT_ID.ADG_MOY_PAY: {
                motifByActId = qualification.ADG_MOY_PAY_QUALIF;
                idActByAct = ACT_ID.ADG_MOY_PAY;
                break;
            }
            case ACT_ID.ADG_CAT_CLIENT: {
                motifByActId = qualification.ADG_CAT_CLIENT;
                idActByAct = ACT_ID.ADG_CAT_CLIENT;
                break
            }
            case ACT_ID.ADG_COMM_MANUEL:
                motifByActId = qualification.ADG_COMM_MANUEL;
                idActByAct = ACT_ID.ADG_COMM_MANUEL;
                break

            case ACT_ID.ADG_FIXE_RV_ETIQUETTE_FASTR:
                motifByActId = qualification.RV_ETIQUETTE_FASTR;
                idActByAct = ACT_ID.ADG_FIXE_RV_ETIQUETTE_FASTR;
                break

            case ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FASTR:
                motifByActId = qualification.CHG_STATUT_EQT_FASTR;
                idActByAct = ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FASTR;
                break

            default:
                throw new Error("L'acte selectionné n'existe pas");
        }
        const payloadEnrichedWithCustomMotif: Payload = this.payload;

        // New Paylaod
        const newPayload: Payload = new class implements Payload {
            contactChannel: Channel;
            contactCreatedByFast: boolean;
            contactMediaDirection: MediaDirection;
            contactMediaType: MediaKind;
            contactStartDate: string;
            idAct: string;
            idActEliList: [ACT_ID];
            idCase: string;
            idClient: string;
            idContact: string;
            idService: string;
            motif: CaseQualification;
            fastTabId: string
            iccid: string
            fromQA: boolean
        };
        newPayload.contactChannel = payloadEnrichedWithCustomMotif.contactChannel
        newPayload.contactCreatedByFast = payloadEnrichedWithCustomMotif.contactCreatedByFast
        newPayload.contactMediaDirection = payloadEnrichedWithCustomMotif.contactMediaDirection
        newPayload.contactMediaType = payloadEnrichedWithCustomMotif.contactMediaType
        newPayload.contactStartDate = payloadEnrichedWithCustomMotif.contactStartDate
        newPayload.idCase = payloadEnrichedWithCustomMotif.idCase
        newPayload.idClient = payloadEnrichedWithCustomMotif.idClient
        newPayload.idContact = payloadEnrichedWithCustomMotif.idContact
        newPayload.idService = payloadEnrichedWithCustomMotif.idService
        newPayload.motif = payloadEnrichedWithCustomMotif.motif
        newPayload.fastTabId = payloadEnrichedWithCustomMotif.fastTabId
        newPayload.iccid = payloadEnrichedWithCustomMotif.iccid

        // New Vals
        newPayload.motif = motifByActId;
        newPayload.idAct = idActByAct;
        newPayload.idActEliList = [idActByAct];
        newPayload.fromQA = true;

        const encodedPayload = Base64.encode(JSON.stringify(newPayload));
        const query: ParsedUrlQuery = queryString.parse(this.props.location.search.replace("?", ""));
        const sessionId = query.sessionId;
        const updateCaseEli = query.updateCaseEli;
        const act = "/cases/list?sessionId=" + sessionId + "&payload=" + encodedPayload + "&withAdg&updateCaseEli=" + updateCaseEli;
        this.props.history.push(act);
    };

    public quitGrid = () => {
        FastService.postAbortMessage({
            idCase: this.payload.idCase,
            serviceId: this.payload.idService
        });
    };

    public checkArrayContainsEveryElementOfOtherArray = (arr, target) => target.every(v => arr.includes(v));

    public renderButtonList() {
        let mode = ""
        mode += this.props.client.service!.category === "MOBILE" || this.props.client.service!.category === "LOCATION" ? "M" : "F"
        mode += this.props.client.data!.ownerPerson ? "P" : "M"
        let buttonListForRendering = this.state.buttonList.filter(button => {
            if (button.shouldDisplay.indexOf(mode) === -1) {
                return false
            }
            if (button.adgAuthorization && button.adgAuthorization.length > 0 && !this.checkArrayContainsEveryElementOfOtherArray(this.props.authorizations, button.adgAuthorization)) {
                return false
            }
            return true
        })
        buttonListForRendering.sort((a, b) => {
            const textA = translate.formatMessage({id: a.label})
            const textB = translate.formatMessage({id: b.label})
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })

        buttonListForRendering = buttonListForRendering.map((button, i) => {
            return (
                <Col key={i}>
                    <Button id={button.target} color="primary" className="btn-lg"
                            onClick={this.redirectMeOnClick}>
                        <span className={`icon-white ${button.icon}`}/>
                    </Button>
                    <br/>
                    <Label className="m-2 text-center font-weight-bold"> <FormattedMessage
                        id={button.label}/></Label>
                </Col>
            )
        })

        // tslint:disable-next-line:no-any
        const content: any = []
        let it = 0
        const j = buttonListForRendering.length;
        // tslint:disable-next-line:no-any
        let temparray: any = []
        const chunk = 4;
        while (it < j) {
            temparray = buttonListForRendering.slice(it, it + chunk);
            it += chunk
            content.push(temparray)
        }

        while (content[content.length - 1]?.length < 4) {
            content[content.length - 1].push(<Col/>)
        }

        return content.map((row, i) => {
            return (
                <Row key={i}>
                    {row.map(col => {
                        return (col)
                    })}
                </Row>
            )
        })
    }

    public render(): JSX.Element {
        const {authorizationLoading} = this.props;
        if (!authorizationLoading && !this.props.client.loading) {
            return (
                <Container className="p-4 text-center bg-light">
                    {!!this.props.client.error && <ClientErrorModal/>}
                    <Card bordered className={"text-center"}>
                        <CardHeader>
                            <h2><FormattedMessage id="act.grid.access.title"/></h2>
                        </CardHeader>
                        <CardBody>
                            {this.renderButtonList()}
                        </CardBody>
                    </Card>
                </Container>
            )
        } else {
            return (<Loading/>);
        }
    }
}


const mapDispatchToProps = dispatch => ({
    fetchAndStoreAuthorizations: (sessionId: string) => dispatch(fetchAndStoreAuthorizations(sessionId)),
    fetchAndStoreClient: (clientId: string, serviceId: string, howToLoad: DataLoad) => dispatch(fetchAndStoreClient(clientId, serviceId, howToLoad)),
})

const mapStateToProps = (state: AppState) => ({
    authorizations: state.authorization.authorizations,
    authorizationLoading: state.authorization.loading,
    client: state.client,
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeActsGridPage)
