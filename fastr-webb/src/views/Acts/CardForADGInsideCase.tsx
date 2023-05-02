import Formsy from "formsy-react";
import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {CardHeader} from "reactstrap";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import Col from "reactstrap/lib/Col";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalHeader from "reactstrap/lib/ModalHeader";
import Row from "reactstrap/lib/Row";
import {translate} from "../../components/Intl/IntlGlobalProvider";
import {ACT_ID} from "../../model/actId";
import {CaseCategory} from "../../model/CaseCategory";
import {Service} from "../../model/service";
import CaseService from "../../service/CaseService";
import {AppState} from "../../store";
import {FormattedMessage} from "react-intl";
import {fetchAndStoreCase, setFormComplete, storeCase, toggleBlockingUI,} from "../../store/actions";
import {
    setADGDoneByBoucleADG,
    setBlockAdgAfterSending,
    setBoucleADG,
    setCaseQualification,
    setDisplayCancelButton,
} from "../../store/actions/CasePageAction";

import {setProcessing} from "../../store/actions/CaseActions"
import {DataLoad, fetchAndStoreClient} from "../../store/actions/ClientContextActions";
import {ClientContext} from "../../store/types/ClientContext";
import ADGWrapper from "../Cases/Components/ADGWrapper";
import {buildEmptyContact, buildFastrContactByPayload} from "../Cases/Create/createCaseFormatAndSend";
import {formatDataForAddressChange} from "./EditAddresses/AddressFormat";
import {formatDataForAdministrativeDataChange} from "./EditAdministrativeData/AdministrativeDataFormat";
import {formatBillingAccountData} from "./EditBillingAccount/BillingAccountFormat";
import {formatBillingMeansData} from "./EditBillingAccount/BillingMeansFormatAndSend";
import {formatDataForBillingAddressChange} from "./EditBillingAddress/BillingAddressFormat";
import {formatDataForBillingDayChange} from "./EditBillingDay/BillingDayFormat";
import {formatClientCategory} from "./EditClientCategory/formatAndSendClientCategory";
import {formatDataForContactChange} from "./EditContactData/ContactFormat";
import {formatDataForDeathStatus} from "./EditDeathAssumption/DeathAssumptionFormat";
import {formatDataForHolderDataChange} from "./EditOwner/OwnerFormat";
import {formatDataForPasswordSCChange} from "./EditPasswordSC/PasswordSCFormat";
import {formatDataForProfessionalChange} from "./EditProfessionalData/ProfessionalFormat";
import {formatDataForTutorshipChange} from "./EditTutorship/TutorshipFormat";
import GridForADGInsideCase from "./GridForADGInsideCase";
import {formatDataForServiceUser} from "./Leonard/EditServiceUser/ServiceUserFormat";
import {formatDataCommunication} from "./SendCommunication/CommunicationFormat";
import {formatDataForWebsapChange} from "./Websap/WebsapFormat";
import {EditBillingType} from "./EditBillingAccount/EditBillingAccount";
import ClientService from "../../service/ClientService";
import {ClientCategory} from "../../model/acts/client-category/ClientCategory";
import {formatDataForDeclaProDataChange} from "./EditDeclaPro/DeclaProDataFormat";
import {formatDuplicateBilling} from "./DuplicateBillings/DuplicateBillingFormat";
import {Case} from "../../model/Case";
import {formatDataForFioriChange} from "./Fiori/FioriFormat";
import {formatDataForRvEtiquetteFastr} from "../v2/Acts/RenvoiEtiquette/RenvoiEtiquetteFormat";


// TODO: a typer
interface Props {
    fetchAndStoreClient
    client
    qualification
    qualificationLeaf
    payload
    setBoucleADG
    getValuesFromFields
    currentCase
    motif
    toggleBlockingUI
    isScalingMode
    isWithAutoAssign
    addContact
    activitySelected
    additionDataOfQualifsAndTheme
    ADGDoneByBoucleADG: boolean
    setADGDoneByBoucleADG
    context: string
    theme
    fetchAndStoreCase,
    storeCase
    setBlockAdgAfterSending: (blockAdg: boolean) => void
    blockAdgAfterSending: boolean
    setProcessing
    qualifWasGivenInThePayload
    setDisplayCancelButton
    currentContactId: string
    setFormComplete: () => void
}

interface State {
    showGridADG: boolean
    idAct: string | undefined
    ADGOK: boolean
    openModal: boolean
    adgAlreadySentInBoucleADG: boolean
}

class CardForADGInsideCase extends Component<Props, State> {

    // tslint:disable-next-line:no-any
    private refToFormsy?: React.RefObject<any> = React.createRef()

    constructor(props: Props) {
        super(props)
        this.state = {
            showGridADG: false,
            idAct: undefined,
            ADGOK: false,
            adgAlreadySentInBoucleADG: false,
            openModal: false
        }
    }

    public setIdAct = async (idAct: string) => {
        // await this.props.fetchAndStoreClient(this.props.payload.idClient, this.props.payload.idService, dataLoad.ALL_SERVICES)
        this.setState({idAct})
        this.props.setBoucleADG(true)
    }

    public cancelADG = () => {
        this.setState({idAct: undefined, showGridADG: true})
        this.props.setBoucleADG(false)
        this.props.setFormComplete()
    }

    public formatCaseAndADG = (caseDTOparam) => {
        const caseDTO = JSON.parse(JSON.stringify(caseDTOparam))
        caseDTO.category = CaseCategory.IMMEDIATE
        caseDTO.caseId = this.props.payload.idCase;
        caseDTO.clientId = this.props.payload.idClient;
        caseDTO.serviceId = this.props.payload.idService;
        caseDTO.offerCategory = this.props.client!.service!.category;
        caseDTO.serviceType = this.props.client!.service!.serviceType ? this.props.client!.service!.serviceType : "UNKNOWN";
        // caseDTO.processing = false;

        if (this.props.qualificationLeaf && this.props.qualificationLeaf.type) {
            caseDTO.qualification.caseType = this.props.qualificationLeaf.type;
        }

        // _____________________Contact Handling __________________

        if (this.props.payload.contactCreatedByFast) {
            caseDTO.contact = buildFastrContactByPayload(this.props.payload)
        } else if (!this.props.addContact) {
            caseDTO.contact = buildEmptyContact(this.props.payload)
        } else {
            caseDTO.contact.contactId = this.props.payload.idContact
            caseDTO.contact.startDate = this.props.payload.contactStartDate
            caseDTO.contact.channel = this.props.payload.contactChannel
        }

        // get Activity of case creator from this.props.payload
        if (this.props.activitySelected) {
            caseDTO.activitySelected = this.props.activitySelected
        }


        if (!caseDTO.clientRequest) {
            caseDTO.clientRequest = translate.formatMessage({id: "boucle.adg.default"})
        }

        if (!caseDTO.processingConclusion) {
            caseDTO.processingConclusion = "NON RESOLU"
        }
        if (!caseDTO.status) {
            caseDTO.status = "UNRESOLVED"
        }

        return caseDTO
    }

// tslint:disable-next-line:no-any
    public startWorking = (form: any, payload: any, adg: string, contextClient: ClientContext<Service>, caseId: string) => {
        switch (adg) {
            case (ACT_ID.ADG_ADR_PRINC):
                return formatDataForAddressChange(form, payload);
            case (ACT_ID.ADG_CONTACT):
                return formatDataForContactChange(form, payload);
            case (ACT_ID.ADG_ETAT_CIVIL):
                return formatDataForAdministrativeDataChange(form, payload);
            case (ACT_ID.ADG_GESTION_DECLA_PRO):
                return formatDataForDeclaProDataChange(form, payload);
            case(ACT_ID.ADG_CTI):
                return formatDataForHolderDataChange(form, payload, contextClient.data!, caseId);
            case(ACT_ID.ADG_UTIL):
                return formatDataForServiceUser(form, payload, caseId);
            case(ACT_ID.ADG_CHGT_CAT):
                return formatDataForProfessionalChange(form, payload, contextClient.data!);
            case(ACT_ID.ADG_TUTELLE):
                return formatDataForTutorshipChange(form, payload, caseId, contextClient.data);
            case(ACT_ID.ADG_DCD):
                return formatDataForDeathStatus(form, payload);
            case(ACT_ID.ADG_JPP):
                return formatDataForBillingDayChange(form, payload, caseId);
            case(ACT_ID.ADG_ADR_FACT):
                return formatDataForBillingAddressChange(form, payload, contextClient.data!, caseId);
            case(ACT_ID.ADG_MDP):
                return formatDataForPasswordSCChange(form, payload);
            case(ACT_ID.ADG_PUK):
            case(ACT_ID.ADG_SUIVI_SAV):
            case(ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FASTR):
                return {}
            case(ACT_ID.ADG_CHGT_CF):
                return formatBillingAccountData(form, payload, contextClient.service!);
            case(ACT_ID.ADG_COMM_MANUEL):
                return formatDataCommunication(form, payload);
            case (ACT_ID.ADG_DUPL_FACT):
                return formatDuplicateBilling(form, payload);
            case (ACT_ID.ADG_MOY_PAY):
                return formatBillingMeansData(form, payload, contextClient.service!);
            case (ACT_ID.ADG_CAT_CLIENT):
                return formatClientCategory(form, payload, contextClient.data!);
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
                return formatDataForRvEtiquetteFastr(form, payload, contextClient.service?.siebelAccount);
            default:
                throw Error("ACT functionnal ID does not exist");
        }
    }


    public submit = async (form) => {
        if (!this.props.blockAdgAfterSending && this.state.idAct !== ACT_ID.ADG_SUIVI_SAV) {
            this.props.setBlockAdgAfterSending(true);
            this.setState({adgAlreadySentInBoucleADG: true});
            const caseService: CaseService = new CaseService(true)
            const clientService: ClientService = new ClientService();
            try {
                // tslint:disable-next-line:no-any
                this.props.toggleBlockingUI()
                const valuesFromTheParentForm = this.props.getValuesFromFields()
                const idCase = this.props.currentCase ? (this.props.currentCase.caseId ? this.props.currentCase.caseId : this.props.payload.idCase) : this.props.payload.idCase
                const act = await this.startWorking(form, this.props.payload, this.state.idAct!, this.props.client, idCase)
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
                valuesFromTheParentForm.qualification = this.props.motif
                // Do not add note when submitting acts
                delete valuesFromTheParentForm.comment
                if (!this.props.ADGDoneByBoucleADG && this.props.context === "CreateCasePage") {
                    if (valuesFromTheParentForm.themeQualification) {
                        delete valuesFromTheParentForm.themeQualification
                    }
                    if (valuesFromTheParentForm.data) {
                        delete valuesFromTheParentForm.data
                    }
                    const caseRequestDTO = this.formatCaseAndADG(valuesFromTheParentForm)
                    caseRequestDTO.qualification = this.props.motif
                    // seulement dans le cas de la qualif FAST
                    if (this.props.qualifWasGivenInThePayload) {
                        await caseService.createCase(caseRequestDTO)
                    }
                    this.props.setADGDoneByBoucleADG(true)
                }
                // tslint:disable-next-line:no-any
                const clientId = this.props.currentCase ? this.props.currentCase.clientId : this.props.payload.idClient;
                const client = await clientService.getClientWithAllServices(clientId);
                act.pro = client.clientCategory === ClientCategory.CORPORATION;
                act.contactId = this.props.currentContactId;
                const savedCase: Case = await caseService.executeADG(act);
                const reducer = (accumulator, currentValue) => {
                    if (accumulator > currentValue.creationDate) {
                        return currentValue;
                    }
                }
                const lastADG = savedCase.resources.reduce(reducer);
                this.setState({idAct: undefined, showGridADG: false, ADGOK: false, adgAlreadySentInBoucleADG: false});
                this.props.setBoucleADG(false);
                this.props.storeCase(this.getUpdatedCaseWithUnsavedChanges(savedCase));
                this.props.toggleBlockingUI();
                this.props.setDisplayCancelButton(false);
                if (lastADG.failureReason) {
                    NotificationManager.error(lastADG.failureReason)
                } else {
                    NotificationManager.success(translate.formatMessage({id: "boucle.adg.success"}))
                }
            } catch (exp) {
                this.setState({adgAlreadySentInBoucleADG: false})
                this.props.setBlockAdgAfterSending(false);
                NotificationManager.error(translate.formatMessage({id: "boucle.adg.failure"}))
                console.error(exp)
                this.props.toggleBlockingUI()
            }
        }
    }

    private getUpdatedCaseWithUnsavedChanges(savedCase: Case) {
        return {...savedCase,
            clientRequest: this.props.currentCase.clientRequest,
            status: this.props.currentCase.status,
            processingConclusion: this.props.currentCase.processingConclusion
        };
    }

    public inva = (form) => {
        NotificationManager.error(translate.formatMessage({id: "boucle.adg.incomplet"}))
    }

    public onFormsyValid = () => {
        this.setState({ADGOK: true})
    }
    public onFormsyInValid = () => {
        this.setState({ADGOK: false})
    }

    public getValuesFromFields = () => this.refToFormsy!.current.getModel()

    public eventChangeSwitchStatus = valueOfPreviousshowGridADG => event => {
        this.changeSwitchStatus(valueOfPreviousshowGridADG)
    }

    public changeSwitchStatus = valueOfPreviousshowGridADG => {
        if (!valueOfPreviousshowGridADG) {
            this.setShowGridADG(true)
            this.props.setBoucleADG(true)
        } else {
            this.setShowGridADG(false)
            this.props.setBoucleADG(false)
        }
    }

    public setShowGridADG = (value) => {
        if (this.state.idAct !== undefined) {
            this.setState({openModal: true})
        }
        this.setState({showGridADG: value})
    }

    public toggle = () => {
        this.setState((prevState) => ({openModal: !prevState.openModal, showGridADG: true}))
    }

    public closeGrid = () => {
        this.setState({showGridADG: false, openModal: false, idAct: undefined})
        this.props.setBoucleADG(false)
    }

    public render() {
        const {showGridADG} = this.state
        return (
            <div>
                {this.state.idAct ?
                    <span/>
                    : <Card>
                        <CardHeader className={"justify-between-and-center"}
                                    onClick={this.props.currentCase ? this.eventChangeSwitchStatus(showGridADG):undefined}>
                            <i className={'icon-gradient icon-applications mr-2'}
                               onClick={this.eventChangeSwitchStatus(showGridADG)}/>
                            <FormattedMessage id={"boucle.adg.add"}/>
                            {this.state.showGridADG &&
                            <span className="p-1 ml-2 mb-2 bg-warning text-dark"><FormattedMessage
                                id={"boucle.adg.add.warning"}/></span>
                            }
                            {!this.props.currentCase &&
                            <span className="p-1 ml-2 mb-2 bg-warning text-dark"><FormattedMessage
                                id={"boucle.adg.case.not.exists"}/></span>
                            }
                            {this.props.currentCase &&
                            <i id={"tglgridadg"}
                               className={`icon icon-black float-right  ${!this.state.showGridADG ? 'icon-down' : 'icon-up'}`}/>
                            }
                        </CardHeader>
                        {this.state.showGridADG ?
                                <GridForADGInsideCase setIdAct={this.setIdAct}
                                                      payload={this.props.payload}
                                                      cancelADG={this.cancelADG}
                                                      hideGridADG={this.changeSwitchStatus}
                                                      getValuesFromFields={this.props.getValuesFromFields}/>
                            : <React.Fragment/>
                        }
                    </Card>
                }

                {this.state.idAct ?
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

                        <ADGWrapper ADGOK={this.state.ADGOK} payload={{...this.props.payload, idAct: this.state.idAct}}
                                    adgAlreadySent={this.state.adgAlreadySentInBoucleADG}
                                    cancelADG={this.cancelADG} showGridADG={this.state.showGridADG}
                                    setShowGridADG={this.setShowGridADG}
                                    getValuesFromFields={this.getValuesFromFields}
                                    closeGrid={this.closeGrid}/>
                    </Formsy>
                    : <span/>

                }
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.client,
    qualification: state.casePage.qualification,
    blockAdgAfterSending: state.casePage.blockAdgAfterSending,
    qualificationLeaf: state.casePage.qualificationLeaf,
    currentCase: state.case.currentCase,
    motif: state.casePage.motif,
    isScalingMode: state.casePage.isScalingMode,
    isWithAutoAssign: state.casePage.isWithAutoAssign,
    addContact: state.casePage.addContact,
    activitySelected: state.casePage.activitySelected,
    additionDataOfQualifsAndTheme: state.casePage.additionDataOfQualifsAndTheme,
    ADGDoneByBoucleADG: state.casePage.ADGDoneByBoucleADG,
    theme: state.casePage.theme,
    qualifWasGivenInThePayload: state.casePage.qualifWasGivenInThePayload,
    currentContactId: state.casePage.currentContactId,
});

const mapDispatchToProps = dispatch => ({
    setBlockAdgAfterSending: (value) => dispatch(setBlockAdgAfterSending(value)),
    setCaseQualification: (value) => dispatch(setCaseQualification(value)),
    setBoucleADG: (qualificationCode) => dispatch(setBoucleADG(qualificationCode)),
    setDisplayCancelButton: (value) => dispatch(setDisplayCancelButton(value)),
    toggleBlockingUI: () => dispatch(toggleBlockingUI()),
    setADGDoneByBoucleADG: (qualificationLeaf) => dispatch(setADGDoneByBoucleADG(qualificationLeaf)),
    fetchAndStoreCase: (idCase) => dispatch(fetchAndStoreCase(idCase)),
    storeCase: (aCase) => dispatch(storeCase(aCase)),
    fetchAndStoreClient: (clientId: string, serviceId: string, howToLoad: DataLoad) => dispatch(fetchAndStoreClient(clientId, serviceId, howToLoad)),
    setProcessing: (value) => dispatch(setProcessing(value)),
    setFormComplete: () => dispatch(setFormComplete())
});

export default connect(mapStateToProps, mapDispatchToProps)(CardForADGInsideCase);
