import * as moment from "moment";
import * as React from 'react'
import {Component} from 'react'
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
import {ACT_ID} from "../../../model/actId";
import {Client} from "../../../model/person";
import {Service} from "../../../model/service";
import FastService from "../../../service/FastService";
import {AppState} from "../../../store";
import {fetchAndStoreAuthorizations} from "../../../store/actions";
import {DataLoad, fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import ClientContextProps from "../../../store/types/ClientContext";
import {BlockingContextInterface} from "../../App";
import {ADGButtonConfig} from "../ADGButtonsConfigurationForSuperQuickAccess";
import {ActQualification, qualification} from "./qualification";
import {CaseQualification} from "../../../model/CaseQualification";
import {
    setCaseQualification, setDisplayGridADGForDISRC,
    setQualificationLeaf,
    storeIdActDisRC,
    storeMotifDisRCAdg
} from "../../../store/actions/CasePageAction";
import {CasesQualificationSettings} from "../../../model/CasesQualificationSettings";
import CaseService from "../../../service/CaseService";
import {setIsRecentCasesListDisplayed, setMatchingCase} from "../../../store/actions/RecentCasesActions";

interface State {
    idActEliListState: ACT_ID[],
    dataForTheForm?: Client,
    clientError: boolean,
    buttonList
}

interface Props extends RouteComponentProps<void> {
    client
    block: BlockingContextInterface,
    authorizations: Array<string>,
    fetchAndStoreAuthorizations: (sessionId: string) => {},
    fetchAndStoreClient: (clientId: string, serviceId: string, howToLoad: DataLoad) => {},
    storeMotifDisRCAdg: (motifAdgDisRc: CaseQualification) => {},
    storeIdActDisRC: (idActDisRC: string) => {},
    authorizationLoading: boolean
    payload
    clientFastr
    setIdADG
    setMotifForADG
    setCaseQualification
    setQualificationLeaf
    setDisplayGridADGForDISRC
    setIsRecentCasesListDisplayed
    setMatchingCase
    updateMode: boolean
}

type PropType = ClientContextProps<Service>

class DISRCGridPage extends Component<Props & PropType, State> {

    private caseService: CaseService = new CaseService(true);

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
            await this.props.fetchAndStoreClient(this.props.payload.idClient, this.props.payload.idService, DataLoad.ALL_SERVICES)
        } catch (err) {
            this.setState({clientError: true});
        }
        const data = {dueDate: moment().toISOString(), notification: true};
        const dataForTheForm = Object.assign(data, this.props.client.clientData);
        this.setState({dataForTheForm});
    };

    public redirectMeOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
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
            case ACT_ID.ADG_COMM_MANUEL: {
                motifByActId = qualification.ADG_COMM_MANUEL;
                idActByAct = ACT_ID.ADG_COMM_MANUEL;
                break;
            }
            default:
                throw new Error("L'acte selectionné n'existe pas");
        }
        const caseQualifSettings = await this.caseService.getCaseQualifSettings(motifByActId.code);
        this.props.setQualificationLeaf(caseQualifSettings)

        this.props.setMatchingCase(undefined);
        this.props.setIdADG(idActByAct)
        this.props.storeIdActDisRC(idActByAct)
        this.props.setMotifForADG(motifByActId)
        this.props.storeMotifDisRCAdg(motifByActId)
        this.props.setCaseQualification(motifByActId)
        this.props.setDisplayGridADGForDISRC(false)
        if(!this.props.updateMode){ // is in creation
            this.props.setIsRecentCasesListDisplayed(true);// reset recent cases tab display state
        }

    };

    public quitGrid = () => {
        FastService.postAbortMessage({
            idCase: this.props.payload.idCase,
            serviceId: this.props.payload.idService
        });
    };

    public checkArrayContainsEveryElementOfOtherArray = (arr, target) => target.every(v => arr.includes(v));

    public renderButtonList() {
        let mode = ""
        mode += this.props.client.service!.category === "MOBILE" ? "M" : "F"
        mode += this.props.client.clientData!.ownerPerson ? "P" : "M"
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
        const chunk = 4
        while (it < j) {
            temparray = buttonListForRendering.slice(it, it + chunk);
            it += chunk
            content.push(temparray)
        }

        while (content[content.length - 1].length < 4) {
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
    storeMotifDisRCAdg: (motifAdgDisRC: CaseQualification) => dispatch(storeMotifDisRCAdg(motifAdgDisRC)),
    storeIdActDisRC: (idActDisRC: string) => dispatch(storeIdActDisRC(idActDisRC)),
    setCaseQualification: (qualification: CasesQualificationSettings) => dispatch(setCaseQualification(qualification)),
    setQualificationLeaf: (qualificationLeaf) => dispatch(setQualificationLeaf(qualificationLeaf)),
    setDisplayGridADGForDISRC: (value) => dispatch(setDisplayGridADGForDISRC(value)),
    setIsRecentCasesListDisplayed: (value) => dispatch(setIsRecentCasesListDisplayed(value)),
    setMatchingCase: (value) => dispatch(setMatchingCase(value)),
})

const mapStateToProps = (state: AppState) => ({
    authorizations: state.authorization.authorizations,
    authorizationLoading: state.authorization.loading,
    client: state.store.clientContext,
    updateMode: state.casePage.updateMode,
})

export default connect(mapStateToProps, mapDispatchToProps)(DISRCGridPage)
