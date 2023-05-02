import * as React from "react";
import {CaseResource} from "../../../../model/CaseResource";
import ActService from "../../../../service/ActService";
import {RetourEquipementActDetail} from "../../../../model/service/RetourEquipementActDetail";
import Modal from "react-bootstrap/Modal";
import {FormattedMessage} from "react-intl";
import {Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import {ReturnEquipmentDataSummary} from "../../List/Elements/ReturnEquipmentDataSummary";
import * as moment from "moment";
import {RegularisationFixeSummary} from "../../List/Elements/RegularisationFixeSummary";
import RenvoiEquipementDataSummary from "../../List/Elements/RenvoiEquipementDataSummary";
import {
    RenvoiEquipementActDetailHeader,
    RenvoiEquipementActResponse
} from "../../../../model/service/RenvoiEquipementActResponse";
import {ActDetailHeader} from "../../../../model/service/ActDetailHeader";
import Loading from "src/components/Loading";

interface Props {
    resource: CaseResource
    siebelAccount: string
    openModal: boolean
    shutModal: (openModal: boolean) => void
}

interface State {
    historyModalIsOpen: boolean,
    adgFixeDetails: RetourEquipementActDetail,
    adgFixeRenvoiEquipementDetails: RenvoiEquipementActResponse,
    errorFetching: string,
    isCleaned: boolean,
    loading: boolean,
    fastAct?: FASTADG,
}

interface FASTADG {
    transactionId : string,
    refSeibel : string,
    actCode : string,
}

interface match<Params extends { [K in keyof Params]?: string } = {transactionId : string, refSeibel : string, actCode : string}> {
    params: Params;
    isExact: boolean;
    path: string;
    url: string;
}
interface RouteComponentProps<Params extends { [K in keyof Params]?: string } = {transactionId: string,refSeibel : string, actCode : string}> {
    match?: match<Params>;
}

export default class ActsHistoryAdgFixeModal extends React.Component<Props & RouteComponentProps, State> {

    private actService: ActService = new ActService(true);
    private DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
    actDescription: string | undefined;

    constructor(props: Props) {
        super(props);
        this.state = {
            historyModalIsOpen: this.props.openModal,
            adgFixeDetails: {},
            adgFixeRenvoiEquipementDetails: {},
            errorFetching: "",
            fastAct: {
                transactionId: this.props.match?.params.transactionId || "",
                refSeibel: this.props.match?.params.refSeibel || "",
                actCode: this.props.match?.params?.actCode || ""
            },
            isCleaned: false,
            loading: true
        }
        this.actDescription = this.props.resource?.description || this.state.fastAct?.actCode;
    }

    public async componentDidMount() {
        this.updateActDetails()
    }

    public async componentDidUpdate(prevProps: Props, prevState: State) {

        if (prevProps.resource !== this.props.resource || prevState.isCleaned) {
            this.setState({
                isCleaned: false,
            })
            this.updateActDetails();
        }
    }

    public async updateActDetails() {
        try {
            let result;
            let resultRenvoiEqt;
            switch (this.actDescription) {
                case "CHG_STATUT_EQT":
                case "CHG_STATUT_EQT_FASTR":
                case "RV_ETIQUETTE_FASTR":
                case "ADG_FIXE_RV_ETIQUETTE_FASTR":
                case "RV_ETIQUETTE":
                    result = await this.actService.getActReturnEquipment(this.state.fastAct?.actCode ? this.state.fastAct.transactionId : this.props.resource.id, this.state.fastAct?.actCode ?  this.state.fastAct.refSeibel : this.props.siebelAccount)
                    break;
                case "REGULARISATION":
                    result = await this.actService.getActRegularisationFIxe(this.state.fastAct?.actCode ?  this.state.fastAct.transactionId : this.props.resource.id, this.state.fastAct?.actCode ?  this.state.fastAct.refSeibel : this.props.siebelAccount)
                    break;
                case "RENVOI_EQT":
                case "ADG_RENVOI_EQT":
                    resultRenvoiEqt = await this.actService.getActRenvoiEquipement(this.state.fastAct?.actCode ? this.state.fastAct.transactionId : this.props.resource.id, this.state.fastAct?.actCode ?  this.state.fastAct.refSeibel : this.props.siebelAccount)
                    break;
                default:
                    break;
            }
            if (result) {
                this.setState({
                    adgFixeDetails: result,
                    historyModalIsOpen: this.props.openModal,
                    errorFetching: "",
                    loading: false
                })
            }
            if (resultRenvoiEqt) {
                this.setState({
                    adgFixeRenvoiEquipementDetails: resultRenvoiEqt,
                    historyModalIsOpen: this.props.openModal,
                    errorFetching: "",
                    loading: false
                })
            }
        } catch (e) {
            const error = await e;
            console.error(error)
            this.setState({
                errorFetching: error.message,
                loading: false
            })
        }
    }

    public toggle = () => {
        this.setState({
            adgFixeDetails:{},
            adgFixeRenvoiEquipementDetails: {},
            isCleaned: true
        });
        this.props.shutModal(!this.props.openModal)
    }

    public renderActsGenericHeader = () => {
        // @ts-ignore
        const {header} : ActDetailHeader | RenvoiEquipementActDetailHeader = ['ADG_RENVOI_EQT', 'RENVOI_EQT'].includes(this.actDescription) ? this.state.adgFixeRenvoiEquipementDetails : this.state.adgFixeDetails;
        const HexColor = header?.status === "OK" ? '#55AF27' : (header?.status === "KO" ? '#da3832' : '#999999');
        const styleStatus = {
            background: HexColor,
            fontSize: '0.8rem',
            padding: '4px 9px',
            color: '#fff',
            borderRadius: '40%'
        };
        if (header) {
            return <div>
                <Row className={"pb-3"}>
                    <Col md={6}>
                        <div className={"text-left font-weight-bold"}>
                            <FormattedMessage id={"acts.history.adg.fixe.modal.act.number"}/>
                        </div>
                        {header?.adgNumber}

                    </Col>
                    <Col md={6}>
                        <div className={"text-left font-weight-bold d-inline"}>
                            <FormattedMessage id={"acts.history.adg.fixe.modal.act.status"}/>
                        </div>
                        <span style={styleStatus}>{header?.status}</span>
                    </Col>
                </Row>
                <Row className={"pb-3"}>
                    <Col md={6}>
                        <div className={"text-left font-weight-bold"}>
                            <FormattedMessage id={"acts.history.adg.fixe.modal.act.creation.date"}/>
                        </div>
                        {header?.creationDate}
                    </Col>

                    <Col md={6}>
                        <div className={"text-left font-weight-bold"}>
                            <FormattedMessage id={"acts.history.adg.fixe.modal.act.execution.date"}/>
                        </div>
                        {header?.executionDate ? header?.executionDate : header?.endDate}
                    </Col>
                </Row>
            </div>
        } else {
            return <React.Fragment/>
        }
    }

    public renderActSpecificContent = () => {
        const {adgFixeDetails, adgFixeRenvoiEquipementDetails} = this.state
        // const {resource} = this.props

        if (!adgFixeDetails) {
            return <React.Fragment/>
        }
        switch (this.actDescription) {
            case "CHG_STATUT_EQT":
            case "CHG_STATUT_EQT_FASTR":
                return <ReturnEquipmentDataSummary adgFixeDetails={adgFixeDetails}/>
            case "REGULARISATION":
                return <RegularisationFixeSummary adgFixeDetails={adgFixeDetails}/>
            case "ADG_RENVOI_EQT":
            case "RENVOI_EQT":
                return (
                    <>
                        <Row>
                            <Col md={6}>
                                <div className={"text-left font-weight-bold"}>
                                    <FormattedMessage id={"acts.history.adg.fixe.modal.act.renvoi.eqt.delivery.adress"}/>
                                </div>
                                {adgFixeRenvoiEquipementDetails.header?.deliveryAddress}
                            </Col>
                            <Col md={6}>
                                <div className={"text-left font-weight-bold"}>
                                    <FormattedMessage id={"acts.history.adg.fixe.modal.act.renvoi.eqt.delivery.code"}/>
                                </div>
                                {adgFixeRenvoiEquipementDetails.header?.deliveryCode}
                            </Col>
                        </Row>
                        <RenvoiEquipementDataSummary adgFixeDetails={adgFixeRenvoiEquipementDetails} />
                    </>
                )
            default:
                return <React.Fragment/>
        }
    }

    public handleErrorMsg() {
        const {errorFetching} = this.state;
        const {resource} = this.props;
        if (!resource?.valid && !this.state.fastAct?.actCode) {
            return <div className={"text-left font-weight-bold error-text"}>
                <FormattedMessage
                    id={"acts.history.adg.fixe.modal.act.creation.error"}/> {resource.failureReason } ({moment(resource.creationDate).format(this.DATETIME_FORMAT)})
            </div>
        } else if (errorFetching || this.state.fastAct?.actCode) {
            return <div className={"text-left font-weight-bold error-text"}>
                <FormattedMessage id={"acts.history.adg.fixe.modal.act.consultation.error"}/>
            </div>
        } else {
            return <React.Fragment/>
        }
    }

    public renderModalBody = (header) => {
        return this.state.loading ? 
            <Loading />
            : header ?
                <div style={{padding:"1rem"}}>
                    <div>
                        {this.renderActsGenericHeader()}
                    </div>
                    <div>
                        {this.renderActSpecificContent()}
                    </div>
                </div>
                : <div>
                    {this.handleErrorMsg()}
                </div>
    }

    public render() {
        // @ts-ignore
        const {header} : ActDetailHeader | RenvoiEquipementActDetailHeader = ['ADG_RENVOI_EQT', 'RENVOI_EQT'].includes(this.actDescription) ? this.state.adgFixeRenvoiEquipementDetails : this.state.adgFixeDetails;
        return this.state.fastAct?.actCode ? this.renderModalBody(header) : (<Modal show={this.props.openModal} onHide={this.toggle} dialogClassName="lg" className={"text-smaller"}>
                <Modal.Header onHide={this.toggle} className={"text-center font-weight-bold test-width bg-light"}
                              closeButton>
                    <div className={"text-center font-weight-bold"}>
                        {header?.adgName}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {this.renderModalBody(header)}
                </Modal.Body>
            </Modal>)
    }

}
