import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {CaseResource} from "../../../../model/CaseResource";
import {RetentionActResponseDTO} from "../../../../model/acts/retention/RetentionActResponseDTO";
import {FormattedMessage} from "react-intl";
import RetentionDataSummary from "../../List/Elements/RetentionDataSummary";
import ActService from "../../../../service/ActService";
import {ACT_ID} from "../../../../model/actId";
import DuplicateBillingsSummary from "../../List/Elements/DuplicateBillingsSummary";
import {
    DuplicateBillingsActResponseDto
} from "../../../../model/acts/duplicate-billing/DuplicateBillingsActResponseDto";
import AntichurnDataSummary from "../../List/Elements/AntichurnDataSummary";
import {AntiChurnActResponseDTO} from "../../../../model/acts/antichurn/AntiChurnActResponseDTO";
import "../../List/Elements/DuplicateBillingsSummary.scss"
import ArbeoDiagDataSummary from "../../List/Elements/ArbeoDiagDataSummary";
import {ArbeoActDetailData} from "../../../../model/ArbeoActDetailData";
import FioriActDataSummary from "../../List/Elements/FioriActDataSummary";
import {isNotAdgFiori} from "../../../Commons/Acts/ActsUtils";
import MaxwellActDataSummary from "./MaxwellActDataSummary";
import * as moment from "moment";
import DischargeCodeActDataSummary from "src/views/v2/Acts/EditDischargeCodeV2/DischargeCodeActDataSummary";
import VegasCouriersActDataSummary from "src/views/v2/Acts/ToggleVegasCouriers/VegasCouriersActDataSummary";

interface Props {
    resource: CaseResource
    openModal: boolean
    shutModal: (openModal: boolean) => void
    caseId?: string
}

interface State {
    historyModalIsOpen: boolean,
    actDetail?
}


export class ActsHistoryFastrModal extends React.Component<Props, State> {

    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            historyModalIsOpen: this.props.openModal
        }

    }

    public async componentDidMount() {
        this.updateActInformation();
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevProps.resource.id !== this.props.resource.id) {
            this.setState({actDetail: undefined})
            this.updateActInformation();
        }
        if (prevProps.openModal !== this.props.openModal) {
            this.setState({historyModalIsOpen: this.props.openModal});
        }
    }

    public async updateActInformation() {
        let result;
        switch (this.props.resource.description) {
            case ACT_ID.ADG_RETENTION:
                result = await this.actService.getActRetention(this.props.resource.id)
                break;
            case ACT_ID.ADG_DUPL_FACT:
                result = await this.actService.getActDuplicateBillings(this.props.resource.id)
                break;
            case ACT_ID.ADG_ANTICHURN:
                result = await this.actService.getActAntiChurn(this.props.resource.id)
                break;
            case ACT_ID.RETOUR_ARBEO:
                const actDetail = await this.actService.getActById(this.props.resource.id)
                result = actDetail.actDetail
            case ACT_ID.ADG_FIORI_ECHEANCIER:
            case ACT_ID.ADG_FIORI_AVOIR_MANUEL:
            case ACT_ID.ADG_FIORI_GEL_RELANCE:
            case ACT_ID.ADG_FIORI_DEMANDE_SURENDETTEMENT:
            case ACT_ID.ADG_FIORI_AVANCE_FACTURE:
            case ACT_ID.ADG_CODE_DECHARGE:
            case ACT_ID.ADG_ASSOCIATION_COURRIERS:
                if (this.props.resource.valid) {
                    result = await this.actService.getActById(this.props.resource.id)
                }
                break;
            case ACT_ID.ADG_MAXWELL:
                result = await this.actService.getMaxwellAct(this.props.resource.id)
                break;
            default:
                break;
        }
        this.setState({actDetail: result})
    }


    public toggle = () => {
        this.props.shutModal(!this.props.openModal)
    };    



public renderModalHeader = () => {
        const {resource} = this.props
         switch (resource.description){
             case ACT_ID.ADG_DUPL_FACT:
                 return  <Modal.Header onHide={this.toggle} className={"text-center font-weight-bold test-width duplicate-billings-summary-header"} closeButton>
                     <div className={"text-center font-weight-bold"}><FormattedMessage id={"act.history.label.ADG_DUPL_FACT"}/>
                     </div>
                 </Modal.Header>

             case ACT_ID.ADG_FIORI_ECHEANCIER:
             case ACT_ID.ADG_FIORI_AVOIR_MANUEL:
             case ACT_ID.ADG_FIORI_GEL_RELANCE:
             case ACT_ID.ADG_FIORI_DEMANDE_SURENDETTEMENT:
             case ACT_ID.ADG_FIORI_AVANCE_FACTURE:
             case ACT_ID.ADG_CODE_DECHARGE:
             case ACT_ID.ADG_ASSOCIATION_COURRIERS:
                 return  <Modal.Header onHide={this.toggle} className={"text-center font-weight-bold test-width duplicate-billings-summary-header"} closeButton>
                     <div className={"text-center font-weight-bold"}><FormattedMessage id={"act.history.label.".concat(resource.description)}/>
                     </div>
                 </Modal.Header>

             case ACT_ID.ADG_MAXWELL:
                 const creationDate = this.state.actDetail?.maxwellAct?.incident?.creationDate
                 const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
                 return  <Modal.Header onHide={this.toggle} className={"text-center font-weight-bold test-width duplicate-billings-summary-header"} closeButton>
                     <div className={"text-center font-weight-bold"}><FormattedMessage id={"act.history.modal.header.label.".concat(resource.description)}/> {moment(creationDate).format(DATETIME_FORMAT)}
                     </div>
                 </Modal.Header>
             default:
                 return <Modal.Header onHide={this.toggle} className={"text-center font-weight-bold test-width"} closeButton>
                     <div className={"text-center font-weight-bold"}><FormattedMessage id={"acts.history.act.title"}/>
                     </div>
                 </Modal.Header>
         }
    }

   
              
 public renderModalBody = () => {
        const {actDetail} = this.state
        const {resource} = this.props
        if (!actDetail && isNotAdgFiori(resource.description)) {
            return <React.Fragment/>
        }
        switch (resource.description) {
            case ACT_ID.ADG_RETENTION:
                return <RetentionDataSummary retentionResponse={actDetail as RetentionActResponseDTO}
                                             retentionCreationDate={resource.creationDate}/>
            case ACT_ID.ADG_ANTICHURN:
                return <AntichurnDataSummary actDetail={actDetail as AntiChurnActResponseDTO} caseResource={resource}/>

            case ACT_ID.ADG_DUPL_FACT:
                return <DuplicateBillingsSummary
                    duplicateBillingsResponse={actDetail as DuplicateBillingsActResponseDto}
                    duplicateBillingsCreationDate={resource.creationDate}
                    caseId={this.props.caseId}/>
            case ACT_ID.RETOUR_ARBEO:
                return <ArbeoDiagDataSummary actDetail={actDetail as ArbeoActDetailData}
                                             actCreator={resource?.creator}
                                             actDescription={resource?.description}/>
            case ACT_ID.ADG_FIORI_ECHEANCIER:
            case ACT_ID.ADG_FIORI_AVOIR_MANUEL:
            case ACT_ID.ADG_FIORI_GEL_RELANCE:
            case ACT_ID.ADG_FIORI_DEMANDE_SURENDETTEMENT:
            case ACT_ID.ADG_FIORI_AVANCE_FACTURE:
                return <FioriActDataSummary resource={resource} act={actDetail}/>

            case ACT_ID.ADG_CODE_DECHARGE:
                return <DischargeCodeActDataSummary act={actDetail}/>

            case ACT_ID.ADG_ASSOCIATION_COURRIERS:
                return <VegasCouriersActDataSummary act={actDetail}/>

            case ACT_ID.ADG_MAXWELL:
                return <MaxwellActDataSummary caseId={this.props.caseId} act={actDetail}/>
            default:
                return <React.Fragment/>
        }
    }
    
     public render() {
        return (
            <Modal show={this.props.openModal} onHide={this.toggle} dialogClassName="lg" className={"text-smaller"}>
                {this.renderModalHeader()}
                <Modal.Body>
                    {this.renderModalBody()}
                </Modal.Body>
            </Modal>
        )
    }
}
