import React, {lazy} from "react"
import {connect} from "react-redux";
import {CardHeader} from "reactstrap";
import Button from "reactstrap/lib/Button";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardFooter from "reactstrap/lib/CardFooter";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {ACT_ID} from "../../../model/actId";
import {Service} from "../../../model/service";
import {AppState} from "../../../store";
import {toggleBlockingUI} from "../../../store/actions";
import {DataLoad, fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import {CTIActionsProps, setCTIToFinished} from "../../../store/actions/CTIActions";
import ClientContextProps from "../../../store/types/ClientContext";
import {setBlockAdgAfterSending} from "../../../store/actions/CasePageAction";
import {get} from "lodash";
import Loading from "../../../components/Loading";
import {FormattedMessage} from "react-intl";
import {isAllowedAdgToDisplayValidationButton} from "../../Commons/Acts/ActsUtils";
import {actFioriOpenedInExternalApps} from "../../../store/actions/ExternalAppsAction";

type PropType = ClientContextProps<Service> & CTIActionsProps

interface Props extends PropType {
    authorizations
    payload,
    // tslint:disable-next-line:no-any Ici on met any car les données renvoyées dépendent du formulaire
    getValuesFromFields: () => any
    // tslint:disable-next-line:no-any
    cancelADG?: any
    isFormCompleted
    ADGOK?: boolean
    boucleADG: boolean
    toggleGridADG?
    showGridADG?
    setShowGridADG?
    adgAlreadySent: boolean
    setBlockAdgAfterSending: (blockAdg: boolean) => void
    isCTIFinished: boolean
    idActDisRC: string
    disableCancelADG: boolean
    closeGrid?: () => void
    fioriActOpenedInExternalApps: boolean
    actFioriOpenedInExternalApps: (value: boolean | undefined) => void
}

interface State {
    hide: boolean,
    title: string,
    disableButton: boolean
    disableEditBillingAccount: boolean
}

class ADGWrapper extends React.Component<Props, State> {

    private EditAddresses = lazy(() => import("../../Acts/EditAddresses/EditAddresses"));
    private EditAdministrativeData = lazy(() => import("../../Acts/EditAdministrativeData/EditAdministrativeData"));
    private EditDeclaPro = lazy(() => import("../../Acts/EditDeclaPro/EditDeclaPro"));
    private EditBillingAccount = lazy(() => import("../../Acts/EditBillingAccount/EditBillingAccount"));
    private EditBillingMeans = lazy(() => import("../../Acts/EditBillingAccount/EditBillingMeans"));
    private EditBillingAddress = lazy(() => import("../../Acts/EditBillingAddress/EditBillingAddress"));
    private EditBillingDay = lazy(() => import("../../Acts/EditBillingDay/EditBillingDay"));
    private DuplicateBillings = lazy(() => import("../../Acts/DuplicateBillings/DuplicateBillings"));
    private EditClientCategory = lazy(() => import("../../Acts/EditClientCategory/EditClientCategory"));
    private EditContactData = lazy(() => import("../../Acts/EditContactData/EditContactData"));
    private EditDeathAssumption = lazy(() => import("../../Acts/EditDeathAssumption/EditDeathAssumption"));
    private EditOwner = lazy(() => import("../../Acts/EditOwner/EditOwner"));
    private EditPasswordSC = lazy(() => import("../../Acts/EditPasswordSC/EditPasswordSC"));
    private EditProfessionalData = lazy(() => import("../../Acts/EditProfessionalData/EditProfessionalData"));
    private EditTutorship = lazy(() => import("../../Acts/EditTutorship/EditTutorship"));
    private GetPUK = lazy(() => import("../../Acts/GetPUK/GetPUK"));
    private EditServiceUser = lazy(() => import("../../Acts/Leonard/EditServiceUser/EditServiceUser"));
    private SendCommunication = lazy(() => import("../../Acts/SendCommunication/SendCommunication"));
    private Websap = lazy(() => import("../../Acts/Websap/WebsapForm"));
    private Fiori = lazy(() => import("../../Acts/Fiori/FioriForm"));
    private SavOmnicanal = lazy(() => import("../../Acts/SavOmnicanal/SavOmnicanal"));
    private RetourEquipment = lazy(() => import("../../Acts/RetourEquipment/RetourEquipment"));
    private RenvoiEtiquette = lazy(() => import("../../v2/Acts/RenvoiEtiquette/RenvoiEtiquette"));


    constructor(prop: Props) {
        super(prop);
        if (!this.props.client.loading) {
            this.props.loadClient(this.props.client.data!.id, this.props.client.serviceId!, DataLoad.ALL_SERVICES);
        }
        this.state = {
            hide: true,
            title: translate.formatMessage({id: "act.title." + this.getAdaptedIdAct()}),
            disableButton: true,
            disableEditBillingAccount: false
        }
    }

    public enableSubmitButton = () => (this.setState({disableButton: false}));

    public disableSubmitButton = () => (this.setState({disableButton: true}));

    public disableEditBillingAccount = (disable: boolean) => (this.setState({disableEditBillingAccount: disable}));


    public loadADG = () => {
        const adaptedIdAct = this.getAdaptedIdAct();
        switch (adaptedIdAct) {
            case(ACT_ID.ADG_ADR_PRINC):
                return <this.EditAddresses idService={this.props.payload.idService}
                                           getValuesFromFields={this.props.getValuesFromFields}/>;
            case(ACT_ID.ADG_CONTACT):
                return <this.EditContactData idService={this.props.payload.idService}
                                             idClient={this.props.payload.idClient}/>;
            case(ACT_ID.ADG_ETAT_CIVIL):
                return <this.EditAdministrativeData idService={this.props.payload.idService}
                                                    idClient={this.props.payload.idClient}/>;
            case(ACT_ID.ADG_GESTION_DECLA_PRO):
                return <this.EditDeclaPro idService={this.props.payload.idService}
                                          idClient={this.props.payload.idClient}/>;
            case(ACT_ID.ADG_CHGT_CAT):
                return <this.EditProfessionalData idService={this.props.payload.idService}
                                                  idClient={this.props.payload.idClient}/>;
            case(ACT_ID.ADG_CTI):
                return <this.EditOwner client={this.props.client}
                                       idService={this.props.payload.idService}
                                       unlockEligibility={this.enableSubmitButton}
                                       getValuesFromFields={this.props.getValuesFromFields}
                                       name="editOwnerAct"/>;
            case(ACT_ID.ADG_TUTELLE):
                return <this.EditTutorship/>;
            case(ACT_ID.ADG_DCD):
                return <this.EditDeathAssumption disableButton={this.state.disableButton}/>;
            case(ACT_ID.ADG_JPP):
                return <this.EditBillingDay data={this.props.payload}/>;
            case(ACT_ID.ADG_UTIL):
                return <this.EditServiceUser idService={this.props.payload.idService}
                                             idClient={this.props.payload.idClient}/>;
            case(ACT_ID.ADG_ADR_FACT):
                return <this.EditBillingAddress idService={this.props.payload.idService}
                                                idClient={this.props.payload.idClient}/>;
            case(ACT_ID.ADG_MDP):
                return <this.EditPasswordSC/>;
            case(ACT_ID.ADG_PUK):
                return <this.GetPUK iccId={this.getServiceIccId()} idService={this.props.payload.idService}/>;
            case(ACT_ID.ADG_CHGT_CF):
                return <this.EditBillingAccount disableSubmit={this.disableEditBillingAccount}/>;
            case(ACT_ID.ADG_DUPL_FACT):
                return <this.DuplicateBillings enableBillingDuplicates={this.props.authorizations.includes(ACT_ID.ADG_DUPL_FACT_GRATIS)}/>;
            case (ACT_ID.ADG_COMM_MANUEL):
                return <this.SendCommunication name="adgCommManuel" payload={this.props.payload}/>;
            case(ACT_ID.ADG_MOY_PAY):
                return <this.EditBillingMeans/>;
            case (ACT_ID.ADG_CAT_CLIENT):
                return <this.EditClientCategory client={this.props.client}/>;
            case (ACT_ID.ADG_SUIVI_SAV):
                return <this.SavOmnicanal fromFastrCase={true} idClient={this.props.payload.idClient}/>;
            case(ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FASTR):
                return <this.RetourEquipment refClient={this.props.client.service?.siebelAccount!} closeGrid={this.props.closeGrid}/>;
            case (ACT_ID.ADG_WEBSAP_ECHEANCIER):
            case (ACT_ID.ADG_WEBSAP_AVOIR_MANUEL):
            case (ACT_ID.ADG_WEBSAP_GEL_RELANCE):
            case (ACT_ID.ADG_WEBSAP_DEMANDE_SURENDETTEMENT):
            case (ACT_ID.ADG_WEBSAP_AVANCE_FACTURE):
                return <this.Websap actionTitle={"act.external.link.label." + this.props.payload.idAct}
                                    payload={this.props.payload} adgCode={this.props.payload.idAct}/>;
            case (ACT_ID.ADG_FIORI_ECHEANCIER):
            case (ACT_ID.ADG_FIORI_AVOIR_MANUEL):
            case (ACT_ID.ADG_FIORI_GEL_RELANCE):
            case (ACT_ID.ADG_FIORI_DEMANDE_SURENDETTEMENT):
            case (ACT_ID.ADG_FIORI_AVANCE_FACTURE):
                return <this.Fiori actionTitle={"act.external.link.label." + this.props.payload.idAct}
                                    payload={this.props.payload} adgCode={this.props.payload.idAct}/>;
            case (ACT_ID.ADG_FIXE_RV_ETIQUETTE_FASTR):
                return <this.RenvoiEtiquette clientService={this.props.client.service}
                                             clientData={this.props.client.data}
                                             closeFunction={this.props.cancelADG}/>
            default:
                return (<React.Fragment/>)
        }
    };


    public getAdaptedIdAct = () => {
        let rightIdAct = this.props.payload.idAct
        if (!rightIdAct) {
            rightIdAct = this.props.idActDisRC
        }
        return rightIdAct;
    };


    public changeSwitchStatus = valueOfPreviousshowGridADG => event => {
        if (!valueOfPreviousshowGridADG) {
            this.props.setShowGridADG(true)
        } else {
            this.props.setShowGridADG(false)
        }
    };

    public getServiceIccId(): string {
        return get(this.props.client.service, "simCard.iccid");
    }

    public render() {
        if (this.props.client.loading) {
            return (
                <Card className="mt-3 mb-3">
                    <CardHeader>
                        <span>{this.state.title}</span>
                    </CardHeader>
                    <CardBody>
                        <Loading/>
                    </CardBody>
                </Card>
            )
        } else {
            if(this.props.fioriActOpenedInExternalApps) {
                this.props.cancelADG();
                this.props.actFioriOpenedInExternalApps(undefined);
            }
            return (
                <Card className="mt-3 mb-3">
                    {this.props.boucleADG ?
                        <CardHeader className={"justify-between-and-center"}
                                    onClick={this.props.disableCancelADG ? undefined : this.changeSwitchStatus(this.props.showGridADG)}>
                            <i className={'icon-gradient icon-applications mr-2'}/>
                            <FormattedMessage id={"boucle.adg.add"}/>
                            <i id={"tglgridadg"}
                               className={`icon icon-black float-right  ${!this.props.showGridADG ? 'icon-down' : 'icon-up'}`}/>
                        </CardHeader>
                        : <CardHeader>
                            <Row>
                                <Col md={9}>
                                    <span>{this.state.title}</span>
                                </Col>
                            </Row>
                        </CardHeader>
                    }
                    <CardBody>
                        <React.Suspense fallback={<Loading/>}>
                            {this.loadADG()}
                        </React.Suspense>
                    </CardBody>
                    {this.props.boucleADG ? <CardFooter className="text-center">
                            <Button color="primary" className="m-1" id="cancelADG"
                                    onClick={this.props.cancelADG} disabled={this.props.disableCancelADG}>{translate.formatMessage({id: "act.cancel"})}</Button>
                        {isAllowedAdgToDisplayValidationButton(this.props.payload.idAct) &&
                            <Button color="primary" type="submit" className="m-1" id={"submitADG"}
                                    disabled={((!this.props.isFormCompleted || !this.props.ADGOK) && this.props.payload.idAct !== ACT_ID.ADG_PUK)
                                    || this.props.adgAlreadySent
                                    || this.state.disableEditBillingAccount}>{translate.formatMessage({id: "act.validate"})}</Button>
                        }
                        </CardFooter>
                        : <span/>
                    }
                </Card>
            )
        }
    }

    public componentWillUnmount(): void {
        this.props.setBlockAdgAfterSending(false);

        if (!this.props.isCTIFinished) {
            this.props.setCTIToFinished();
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    authorizations: state.authorization.authorizations,
    client: state.client,
    isFormCompleted: state.casePage.isFormCompleted,
    boucleADG: state.casePage.boucleADG,
    isCTIFinished: state.cti.isCTIFinished,
    idActDisRC: state.casePage.idActDisRC,
    disableCancelADG: state.casePage.disableCancelADG,
    fioriActOpenedInExternalApps: state.externalApps.fioriActOpenedInExternalApps
});

const mapDispatchToProps = {
    setBlockAdgAfterSending,
    loadClient: fetchAndStoreClient,
    toggleBlockingUI,
    setCTIToFinished,
    actFioriOpenedInExternalApps
};

export default connect(mapStateToProps, mapDispatchToProps)(ADGWrapper)
