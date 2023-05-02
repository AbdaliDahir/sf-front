import Formsy from "formsy-react";
import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalHeader from "reactstrap/lib/ModalHeader";
import Row from "reactstrap/lib/Row";
import {FormattedMessage} from "react-intl";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {ACT_ID} from "../../../model/actId";
import {formatDataForAddressChange} from "../../Acts/EditAddresses/AddressFormat";
import {formatDataForContactChange} from "../../Acts/EditContactData/ContactFormat";
import {formatDataForAdministrativeDataChange} from "../../Acts/EditAdministrativeData/AdministrativeDataFormat";
import {formatDataForDeclaProDataChange} from "../../Acts/EditDeclaPro/DeclaProDataFormat";
import {formatDataForHolderDataChange} from "../../Acts/EditOwner/OwnerFormat";
import {formatDataForServiceUser} from "../../Acts/Leonard/EditServiceUser/ServiceUserFormat";
import {formatDataForProfessionalChange} from "../../Acts/EditProfessionalData/ProfessionalFormat";
import {formatDataForTutorshipChange} from "../../Acts/EditTutorship/TutorshipFormat";
import {formatDataForDeathStatus} from "../../Acts/EditDeathAssumption/DeathAssumptionFormat";
import {formatDataForBillingDayChange} from "../../Acts/EditBillingDay/BillingDayFormat";
import {formatDataForBillingAddressChange} from "../../Acts/EditBillingAddress/BillingAddressFormat";
import {formatDataForPasswordSCChange} from "../../Acts/EditPasswordSC/PasswordSCFormat";
import {formatBillingAccountData} from "../../Acts/EditBillingAccount/BillingAccountFormat";
import {formatDataCommunication} from "../../Acts/SendCommunication/CommunicationFormat";
import {formatDuplicateBilling} from "../../Acts/DuplicateBillings/DuplicateBillingFormat";
import {formatBillingMeansData} from "../../Acts/EditBillingAccount/BillingMeansFormatAndSend";
import {formatClientCategory} from "../../Acts/EditClientCategory/formatAndSendClientCategory";
import {formatDataForWebsapChange} from "../../Acts/Websap/WebsapFormat";
import {Case} from "../../../model/Case";
import {AppState} from "../../../store";
import {EditBillingType} from "../../Acts/EditBillingAccount/EditBillingAccount";
import {ClientCategory} from "../../../model/acts/client-category/ClientCategory";
import ADGWrapperV2 from "./ADGWrapperV2";
import CaseService from "../../../service/CaseService";
import {CaseState} from "../../../store/reducers/v2/case/CasesPageReducerV2";
import {Contact} from "../../../model/Contact";
import {CardHeader} from "reactstrap";
import Card from "reactstrap/lib/Card";
import GridForADGInsideCaseV2 from "./GridForADGInsideCaseV2";
import {
    setBoucleADGV2,
    setDisplayCancelButtonV2,
    setFormCompleteV2,
    storeCaseV2
} from "../../../store/actions/v2/case/CaseActions";
import {setBlockingUIV2} from "../../../store/actions/v2/ui/UIActions";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {formatDataForFioriChange} from "../../Acts/Fiori/FioriFormat";
import {formatDataForRvEtiquetteFastr} from "./RenvoiEtiquette/RenvoiEtiquetteFormat";
import { formatDataForDischargeCodeEdit } from "./EditDischargeCodeV2/DischargeCodeFormat";
import { formatDataForReturnBox4G } from "./EditReturnBox4G/ReturnBox4GFormat";
import {Payload} from "../../../model/case/CaseActPayload";
import { formatDataForVegasCouriers } from "./ToggleVegasCouriers/VegasCouriersFormat";
import { formatDataForRenvoiEquipement } from "./RenvoiEquipement/RenvoiEquipementFormat";



// TODO: a typer
interface Props {
    client: ClientContextSliceState
    caseId: string
    currentCases: any // eq to Map<caseId,CaseState>
    payload
    getValuesFromFields
    context: string
    storeCaseV2
    setBlockingUIV2
    setBoucleADGV2
    setDisplayCancelButtonV2
    currentContact: Contact | undefined
    isExpanded: boolean
    isExpandable: boolean
    isEditable: boolean
    setHeaderContent: (content) => void
    setFormCompleteV2: (caseId) => void
    codeAction?: string
    actionLabel?: string
    boucleADG?: boolean
    refreshCase
    adgQuickAccessPayload: Payload
}

interface State {
    showGridADG: boolean
    idAct: string | undefined
    actLabel?: string
    isAction?: boolean
    ADGOK: boolean
    openModal: boolean
}

class CardForADGInsideCaseV2 extends Component<Props, State> {

    // tslint:disable-next-line:no-any
    private refToFormsy?: React.RefObject<any> = React.createRef()

    constructor(props: Props) {
        super(props)
        this.state = {
            showGridADG: this.props.isExpanded,
            idAct: undefined,
            actLabel: undefined,
            isAction: false,
            ADGOK: false,
            openModal: false
        }
    }
    public componentDidMount() {
        const quickAccessPayload = this.props.adgQuickAccessPayload;
        if (quickAccessPayload?.fromQA === true &&
            quickAccessPayload?.idCase === this.currentCase()?.caseId) {
            if (quickAccessPayload.idAct) {
                this.setState({ showGridADG: true })
                this.setIdAct(quickAccessPayload.idAct)
            }
        }
    }

    private currentCaseState = (): CaseState => {
        return this.props.currentCases[this.props.caseId]
    }

    private currentCase = (): Case | undefined => {
        return this.currentCaseState().currentCase
    }

    private setIdAct = async (idAct: string) => {
        this.setState({idAct})
        this.props.setBoucleADGV2(this.props.caseId, true)
    }

    private setActLabel = async (actLabel: string) => {
        this.setState({actLabel})
    }

    private setIsAction = async (action: boolean) => {
        this.setState({isAction: action})
    }

    private cancelADG = (closeADG = true) => {
        this.setState({idAct: undefined, showGridADG: closeADG})
        this.props.setBoucleADGV2(this.props.caseId, false)
        this.props.setFormCompleteV2(this.props.caseId);
    }

    // tslint:disable-next-line:no-any
    private startWorking = (form: any, adg: string, clientContext: ClientContextSliceState, caseId: string) => {
        const payload = this.props.payload ? this.props.payload :
            {
                idClient: this.props.client?.clientData?.id,
                idService: this.props.client?.serviceId,
                idCase: this.props.caseId
            };

        switch (adg) {// !_! last thing to change but interconnected with v1 components
            case (ACT_ID.ADG_ADR_PRINC):
                return formatDataForAddressChange(form, payload);
            case (ACT_ID.ADG_CONTACT):
                return formatDataForContactChange(form, payload);
            case (ACT_ID.ADG_ETAT_CIVIL):
                return formatDataForAdministrativeDataChange(form, payload);
            case (ACT_ID.ADG_GESTION_DECLA_PRO):
                return formatDataForDeclaProDataChange(form, payload);
            case(ACT_ID.ADG_CTI):
                return formatDataForHolderDataChange(form, payload, clientContext.clientData!, caseId);
            case(ACT_ID.ADG_UTIL):
                return formatDataForServiceUser(form, payload, caseId);
            case(ACT_ID.ADG_CHGT_CAT):
                return formatDataForProfessionalChange(form, payload, clientContext.clientData!);
            case(ACT_ID.ADG_TUTELLE):
                return formatDataForTutorshipChange(form, payload, caseId, clientContext.clientData);
            case(ACT_ID.ADG_RESP_LEGAL):
                return formatDataForTutorshipChange(form, payload, caseId, clientContext.clientData, true);
            case(ACT_ID.ADG_CODE_DECHARGE):
                return formatDataForDischargeCodeEdit(form, payload);
            case(ACT_ID.ADG_RETOUR_BOX4G):
                return formatDataForReturnBox4G(form, payload);
            case(ACT_ID.ADG_ASSOCIATION_COURRIERS):
                return formatDataForVegasCouriers(form, payload);
            case (ACT_ID.ADG_RENVOI_EQT):
                return formatDataForRenvoiEquipement(form, payload);
            case(ACT_ID.ADG_DCD):
                return formatDataForDeathStatus(form, payload);
            case(ACT_ID.ADG_JPP):
                return formatDataForBillingDayChange(form, payload, caseId);
            case(ACT_ID.ADG_ADR_FACT):
                return formatDataForBillingAddressChange(form, payload, clientContext.clientData!, caseId);
            case(ACT_ID.ADG_MDP):
                return formatDataForPasswordSCChange(form, payload);
            case(ACT_ID.ADG_PUK):
            case(ACT_ID.ADG_SUIVI_SAV):
            case(ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FASTR):
                return {}
            case(ACT_ID.ADG_CHGT_CF):
                return formatBillingAccountData(form, payload, clientContext.service!);
            case(ACT_ID.ADG_COMM_MANUEL):
                return formatDataCommunication(form, payload);
            case (ACT_ID.ADG_DUPL_FACT):
                return formatDuplicateBilling(form, payload);
            case (ACT_ID.ADG_MOY_PAY):
                return formatBillingMeansData(form, payload, clientContext.service!);
            case (ACT_ID.ADG_CAT_CLIENT):
                return formatClientCategory(form, payload, clientContext.clientData!);
            case (ACT_ID.ADG_WEBSAP_ECHEANCIER):
            case (ACT_ID.ADG_WEBSAP_AVANCE_FACTURE):
            case (ACT_ID.ADG_WEBSAP_DEMANDE_SURENDETTEMENT):
            case (ACT_ID.ADG_WEBSAP_GEL_RELANCE):
            case (ACT_ID.ADG_WEBSAP_AVOIR_MANUEL):
                return formatDataForWebsapChange(form, payload);
            case (ACT_ID.ADG_FIORI_ECHEANCIER):
            case (ACT_ID.ADG_FIORI_AVANCE_FACTURE):
            case (ACT_ID.ADG_FIORI_DEMANDE_SURENDETTEMENT):
            case (ACT_ID.ADG_FIORI_GEL_RELANCE):
            case (ACT_ID.ADG_FIORI_AVOIR_MANUEL):
                return formatDataForFioriChange(form, payload);
            case (ACT_ID.ADG_FIXE_RV_ETIQUETTE_FASTR):
                return formatDataForRvEtiquetteFastr(form, payload, clientContext.service?.siebelAccount);
            default:
                throw Error("ACT functionnal ID does not exist");
        }
    }


    private submit = async (form) => {
        const caseService: CaseService = new CaseService(true)
        const specificAction = this.props.codeAction && this.props.codeAction !== "";
        if(!this.state.isAction && !specificAction) {
            try {
                // tslint:disable-next-line:no-any
                this.props.setBlockingUIV2(true)
                const valuesFromTheParentForm = this.props.getValuesFromFields()
                const idCase = this.currentCase() ? (this.currentCase()!.caseId ? this.currentCase()!.caseId : this.props.caseId) : this.props.caseId

                const act = await this.startWorking(form, this.state.idAct!, this.props.client, idCase)
                if (this.state.idAct === ACT_ID.ADG_CHGT_CF) {
                    if (form.actType === EditBillingType.UNGROUP.toString()) {
                        act.actName = ACT_ID.ADG_CHGT_CF
                    } else {
                        act.actName = ACT_ID.ADG_GROUP_BILL_ACC
                    }
                } else {
                    act.actName = this.state.idAct!
                }
                act.caseId = idCase
                valuesFromTheParentForm.qualification = this.currentCaseState().motif
                // Do not add note when submitting acts
                delete valuesFromTheParentForm.comment

                // tslint:disable-next-line:no-any
                act.pro = this.props.client.clientData?.clientCategory === ClientCategory.CORPORATION;
                act.contactId = this.props.currentContact?.contactId;
                const savedCase: Case = await caseService.executeADG(act);
                const reducer = (accumulator, currentValue) => {
                    if (accumulator > currentValue.creationDate) {
                        return currentValue;
                    }
                }
                const lastADG = savedCase.resources.reduce(reducer);
                this.setState({idAct: undefined, showGridADG: false, ADGOK: false});
                this.props.setBoucleADGV2(this.props.caseId, false);
                this.props.storeCaseV2(this.getUpdatedCaseWithUnsavedChanges(savedCase));
                this.props.setBlockingUIV2(false);
                this.props.setDisplayCancelButtonV2(this.props.caseId, false);
                if (lastADG.failureReason) {
                    NotificationManager.error(lastADG.failureReason)
                } else {
                    NotificationManager.success(translate.formatMessage({id: "boucle.adg.success"}))
                }
            } catch (exp) {
                NotificationManager.error(translate.formatMessage({id: "boucle.adg.failure"}))
                console.error(exp)
                this.props.setBlockingUIV2(false)
            }
        }
    }

    private getUpdatedCaseWithUnsavedChanges(savedCase: Case) {
        return {
            ...savedCase,
            clientRequest: this.currentCase()!.clientRequest,
            status: this.currentCase()!.status,
            processingConclusion: this.currentCase()!.processingConclusion
        };
    }

    private inva = (form) => {
        NotificationManager.error(translate.formatMessage({id: "boucle.adg.incomplet"}))
    }

    private onFormsyValid = () => {
        this.setState({ADGOK: true})
    }
    private onFormsyInValid = () => {
        this.setState({ADGOK: false})
    }

    private getValuesFromFields = () => this.refToFormsy!.current.getModel()

    private changeSwitchStatus = valueOfPreviousshowGridADG => {
        if (!valueOfPreviousshowGridADG) {
            this.setShowGridADG(true)
            this.props.setBoucleADGV2(this.props.caseId, true)
        } else {
            this.setShowGridADG(false)
            this.setState({actLabel: undefined})
            this.props.setBoucleADGV2(this.props.caseId, false)
        }
    }

    private setShowGridADG = (value) => {
        if (this.state.idAct !== undefined) {
            this.setState({openModal: true})
        }
        this.setState({showGridADG: value})
    }

    private toggle = () => {
        this.setState((prevState) => ({openModal: !prevState.openModal, showGridADG: true}))
    }

    private closeGrid = () => {
        this.setState({showGridADG: false, openModal: false, idAct: undefined})
        this.props.setBoucleADGV2(this.props.caseId, false)
    }

    private eventChangeSwitchStatus = valueOfPreviousshowGridADG => event => {
        this.changeSwitchStatus(valueOfPreviousshowGridADG)
    }

    public render() {
        const {showGridADG} = this.state
        const specificAction = this.props.codeAction && this.props.codeAction !== "";
        return (
            <div>
                {!this.state.idAct && !this.props.codeAction && // adg not selected yet
                    <Card className="my-2">
                        <CardHeader className={"justify-between-and-center"}
                            onClick={this.currentCase() && this.props.isExpandable ?
                                this.eventChangeSwitchStatus(showGridADG) : undefined}>
                        <i className={'icon-gradient icon-applications mr-2'}/>
                        <FormattedMessage id={"boucle.adg.add"}/>
                            {this.state.showGridADG &&
                                <span className="p-1 ml-2 mb-2 bg-warning text-dark"><FormattedMessage
                            id={"boucle.adg.add.warning"}/></span>
                            }
                            {!this.currentCase() &&
                                <span className="p-1 ml-2 mb-2 bg-warning text-dark"><FormattedMessage
                            id={"boucle.adg.case.not.exists"}/></span>
                            }
                            {this.currentCase() && this.props.isExpandable &&
                                <i id={"tglgridadg"}
                           className={`icon icon-black float-right  ${!this.state.showGridADG ? 'icon-down' : 'icon-up'}`}/>
                            }
                        </CardHeader>
                        {this.state.showGridADG && this.props.isEditable &&
                            <GridForADGInsideCaseV2 setIdAct={this.setIdAct}
                                setActLabel={this.setActLabel}
                                setIsAction={this.setIsAction}
                                cancelADG={this.cancelADG}
                                hideGridADG={this.changeSwitchStatus}
                                caseId={this.props.caseId}
                                currentCase={this.currentCaseState()}
                                getValuesFromFields={this.props.getValuesFromFields}
                                            fastTabId={this.props.payload?.fastTabId}/>
                        }
                    </Card>
                }

                {((this.state.idAct && this.props.isEditable) || this.props.codeAction)  && // hide grid & display specific adg
                    <Formsy onValidSubmit={this.submit} onInvalidSubmit={this.inva} onValid={this.onFormsyValid}
                        onInvalid={this.onFormsyInValid} ref={this.refToFormsy}>
                        <Modal isOpen={this.state.openModal} centered
                            toggle={this.toggle}
                            onEscapeKeyDown={this.toggle}>
                            <ModalHeader toggle={this.toggle} className={"border-bottom>"}>
                            <h5><FormattedMessage id={"boucle.adg.giveup"}/></h5>
                            </ModalHeader>
                            <ModalBody>
                                <Row>
                                <Col md={3}/>
                                    <Col md={3}>
                                        <Button color="primary" id="closeBoucleADG"
                                            onClick={this.closeGrid}>Oui</Button>
                                    </Col>
                                    <Col md={3}>
                                        <Button color="primary" id="cancelCloseBoucleADG"
                                            onClick={this.toggle}>Non</Button>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </Modal>

                        <ADGWrapperV2 ADGOK={this.state.ADGOK}
                            caseId={this.props.caseId}
                            idAct={this.state.idAct || this.props.codeAction}
                            actLabel={this.state.actLabel || this.props.actionLabel}
                            isAction={this.state.isAction || specificAction}
                            refreshCase={this.props.refreshCase}
                            specificAction={specificAction}
                            cancelADG={this.cancelADG}
                            showGridADG={this.state.showGridADG}
                            setShowGridADG={this.setShowGridADG}
                            getValuesFromFields={this.getValuesFromFields}
                                  closeGrid={this.closeGrid}/>
                    </Formsy>
                }
            </div>
        );
    }
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    client: state.store.client.currentClient,
    currentCases: state.store.cases.casesList,
    currentContact: state.store.contact.currentContact,
    codeAction: state.store.cases.casesList[ownProps.caseId]?.caseAction.codeAction,
    actionLabel: state.store.cases.casesList[ownProps.caseId]?.caseAction.actionLabel,
    boucleADG: state.store.cases.casesList[ownProps.caseId]?.boucleADG,
    adgQuickAccessPayload: state.store.cases.adgQuickAccessPayload
});

const mapDispatchToProps = {
    setBlockingUIV2,
    setBoucleADGV2,
    setDisplayCancelButtonV2,
    storeCaseV2,
    setFormCompleteV2
};

export default connect(mapStateToProps, mapDispatchToProps)(CardForADGInsideCaseV2);
