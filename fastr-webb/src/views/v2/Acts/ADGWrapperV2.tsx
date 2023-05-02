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
import {AppState} from "../../../store";
import {CTIActionsProps} from "../../../store/actions/CTIActions";
import Loading from "../../../components/Loading";
import {CaseState} from "../../../store/reducers/v2/case/CasesPageReducerV2";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {fetchAndStoreClientV2, selectClientV2} from "../../../store/actions/v2/client/ClientActions";
import {isAllowedAdgToDisplayValidationButton} from "../../Commons/Acts/ActsUtils";
import {actFioriOpenedInExternalApps} from "../../../store/actions/ExternalAppsAction";
import {EMaxwellCallOrigin} from "../../../model/maxwell/enums/EMaxwellCallOrigin";
import EditDischargeCodeV2 from "./EditDischargeCodeV2/EditDischargeCodeV2";
import EditReturnBox4G from "./EditReturnBox4G/EditReturnBox4G";
import {DataLoad} from "../../../context/ClientContext";
import ToggleVegasCouriers from "./ToggleVegasCouriers/ToggleVegasCouriers";
import RenvoiEquipement from "./RenvoiEquipement/RenvoiEquipement";

type PropType = CTIActionsProps

interface Props extends PropType {
    authorizations
    idAct: string,
    actLabel: string,
    isAction: boolean,
    // tslint:disable-next-line:no-any Ici on met any car les données renvoyées dépendent du formulaire
    getValuesFromFields: () => any
    // tslint:disable-next-line:no-any
    cancelADG?: any
    ADGOK?: boolean
    toggleGridADG?
    showGridADG?
    setShowGridADG?
    fetchAndStoreClientV2
    currentCases
    caseId: string
    client: ClientContextSliceState
    blockingUI
    closeGrid?: () => void
    fioriActOpenedInExternalApps: boolean
    actFioriOpenedInExternalApps: (value: boolean | undefined) => void
    isFormCompleted: boolean
    specificAction?: boolean
    refreshCase,
    selectClientV2
}

interface State {
    hide: boolean,
    title: string,
    disableButton: boolean
    disableEditBillingAccount: boolean,
    toggleVegasCouriersIsDisabled: boolean,
    loadingServices: boolean
}

class ADGWrapperV2 extends React.Component<Props, State> {

    private EditAddressesV2 = lazy(() => import("../Acts/EditAddresses/EditAddressesV2"));
    private EditContactDataV2 = lazy(() => import("../Acts/EditContactData/EditContactDataV2"));
    private EditAdministrativeDataV2 = lazy(() => import("../Acts/EditAdministrativeData/EditAdministrativeDataV2"));
    private EditDeclaProV2 = lazy(() => import("../Acts/EditDeclaPro/EditDeclaProV2"));
    private EditProfessionalDataV2 = lazy(() => import("../Acts/EditProfessionalData/EditProfessionalDataV2"));
    private EditTutorshipV2 = lazy(() => import("../Acts/EditTutorship/EditTutorshipV2"));
    private EditDeathAssumptionV2 = lazy(() => import("../Acts/EditDeathAssumption/EditDeathAssumptionV2"));
    private EditBillingDayV2 = lazy(() => import("../Acts/EditBillingDay/EditBillingDayV2"));
    private EditServiceUserV2 = lazy(() => import("../Acts/Leonard/EditServiceUser/EditServiceUserV2"));
    private GetPUKV2 = lazy(() => import("../Acts/GetPUK/GetPUKV2"));
    private SendCommunicationV2 = lazy(() => import("../Acts/SendCommunication/SendCommunicationV2"));
    private EditBillingMeansV2 = lazy(() => import("../Acts/EditBillingAccount/EditBillingMeansV2"));
    private SavOmnicanal = lazy(() => import("../../Acts/SavOmnicanal/SavOmnicanal")); // no store access
    private EditPasswordSCV2 = lazy(() => import("../Acts/EditPasswordSC/EditPasswordSCV2"));
    private DuplicateBillingsV2 = lazy(() => import("../Acts/DuplicateBillings/DuplicateBillingsV2"));
    private EditBillingAccountV2 = lazy(() => import("../Acts/EditBillingAccount/EditBillingAccountV2"));
    private WebsapV2 = lazy(() => import("../Acts/Websap/WebsapFormV2"));
    private FioriV2 = lazy(() => import("../Acts/Fiori/FioriFormV2"));
    private EditBillingAddressV2 = lazy(() => import("../Acts/EditBillingAddress/EditBillingAddressV2"));
    private EditClientCategoryV2 = lazy(() => import("../Acts/EditClientCategory/EditClientCategoryV2"));
    private EditOwnerV2 = lazy(() => import("../Acts/EditOwner/EditOwnerV2"));
    private RetourEquipment = lazy(() => import("../../Acts/RetourEquipment/RetourEquipment"));
    private MaxwellSectionV2 = lazy(() => import("../Acts/Maxwell/MaxwellSectionV2"));
    private RenvoiEtiquette = lazy(() => import("../Acts/RenvoiEtiquette/RenvoiEtiquette"));
    private ActionPage = lazy(() => import("../Actions/ActionPage"));

    constructor(prop: Props) {
        super(prop);

        this.state = {
            hide: true,
            title: `Acte de gestion:  ${this.props.actLabel}`,
            disableButton: true,
            disableEditBillingAccount: false,
            toggleVegasCouriersIsDisabled: false,
            loadingServices: false
        }
    }

    public async componentDidMount() {
        if (!this.props.client?.loading) {
            await this.props.fetchAndStoreClientV2(this.props.client?.clientData!.id, this.props.client?.serviceId!, DataLoad.ALL_SERVICES_LIGHT);
            this.props.selectClientV2(this.props.client?.clientData!.id, this.props.client?.serviceId!)
            this.setState({loadingServices: true});
        }
    }

    public render() {
        if (this.props?.client?.loading) {
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
            if (this.props.fioriActOpenedInExternalApps) {
                this.props.cancelADG();
                this.props.actFioriOpenedInExternalApps(undefined);
            }

            const actionLabel = this.props.actLabel ? `${translate.formatMessage({id: "cases.actions.consult.action"})} ${this.props.actLabel}` : ""
            return (
                <Card className="mt-3 mb-3">
                    {this.currentCaseState().boucleADG ?
                        <CardHeader className={"justify-between-and-center"}
                                    onClick={this.currentCaseState().disableCancelADG ? undefined : this.changeSwitchStatus(this.props.showGridADG)}>
                            <i className={'icon-gradient icon-applications mr-2'}/>
                            {this.props.isAction ? actionLabel : this.state.title}
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
                    {this.currentCaseState().boucleADG && !this.props.isAction &&
                        <CardFooter className="text-center">
                            <Button size={"sm"} color="primary" className="m-1" id="cancelADG"
                                    onClick={this.props.cancelADG} disabled={this.currentCaseState().disableCancelADG}>Retour
                                liste
                                action</Button>
                            {isAllowedAdgToDisplayValidationButton(this.props.idAct) &&
                                <Button size={"sm"} color="primary" type="submit" className="m-1" id={"submitADG"}
                                        disabled={((!this.props.isFormCompleted || !this.props.ADGOK) && this.props.idAct !== ACT_ID.ADG_PUK)
                                            || this.state.disableEditBillingAccount
                                            || this.props.blockingUI
                                            || this.state.toggleVegasCouriersIsDisabled
                                        }>{translate.formatMessage({id: "act.validate"})}</Button>
                            }
                        </CardFooter>

                    }
                </Card>
            )
        }
    }

    private currentCaseState = (): CaseState => {
        return this.props.currentCases[this.props.caseId]
    }

    private enableSubmitButton = () => (this.setState({disableButton: false}));

    private disableEditBillingAccount = (disable: boolean) => (this.setState({disableEditBillingAccount: disable}));

    private disableToggleVegasCouriers = (disable: boolean) => (this.setState({toggleVegasCouriersIsDisabled: disable}));

    private loadADG = () => {
        // if client service is loading;
        if (!this.state.loadingServices)  {
            return <Loading/>
        }
        const adaptedIdAct = this.props.idAct;
        if (this.props.isAction) {
            return <this.ActionPage actionThemeType={this.props.idAct}
                                    actionLabel={this.props.actLabel}
                                    caseId={this.props.caseId}
                                    specificAction={this.props.specificAction}
                                    refreshCase={this.props.refreshCase}
                                    closeGrid={this.props.cancelADG}/>
        }
        switch (adaptedIdAct) {
            case (ACT_ID.ADG_RENVOI_EQT):
                return <RenvoiEquipement closeAdgGrid={this.props.cancelADG} clientData={this.props.client?.clientData} />;
            case(ACT_ID.ADG_ASSOCIATION_COURRIERS):
                return <ToggleVegasCouriers disableSubmit={this.disableToggleVegasCouriers} caseId={this.props.caseId} />;
            case(ACT_ID.ADG_RETOUR_BOX4G):
                return <EditReturnBox4G/>;
            case(ACT_ID.ADG_CODE_DECHARGE):
                return <EditDischargeCodeV2/>;
            case(ACT_ID.ADG_ADR_PRINC):
                return <this.EditAddressesV2/>;
            case(ACT_ID.ADG_CONTACT):
                return <this.EditContactDataV2/>;
            case(ACT_ID.ADG_ETAT_CIVIL):
                return <this.EditAdministrativeDataV2/>;
            case(ACT_ID.ADG_GESTION_DECLA_PRO):
                return <this.EditDeclaProV2/>;
            case(ACT_ID.ADG_CHGT_CAT):
                return <this.EditProfessionalDataV2/>;
            case(ACT_ID.ADG_CTI):
                return <this.EditOwnerV2 client={this.props.client}
                                         caseId={this.props.caseId}
                                         idService={this.props.client?.serviceId}
                                         unlockEligibility={this.enableSubmitButton}
                                         getValuesFromFields={this.props.getValuesFromFields}
                                         name="editOwnerAct"/>;
            case(ACT_ID.ADG_TUTELLE):
                return <this.EditTutorshipV2/>;
            case(ACT_ID.ADG_RESP_LEGAL):
                return <this.EditTutorshipV2 isMoralPerson={true}/>;
            case(ACT_ID.ADG_DCD):
                return <this.EditDeathAssumptionV2 disableButton={this.state.disableButton}/>;
            case(ACT_ID.ADG_JPP):
                return <this.EditBillingDayV2/>;
            case(ACT_ID.ADG_UTIL):
                return <this.EditServiceUserV2/>;
            case(ACT_ID.ADG_ADR_FACT):
                return <this.EditBillingAddressV2 idService={this.props.client?.serviceId}/>;
            case(ACT_ID.ADG_MDP):
                return <this.EditPasswordSCV2/> ;
            case(ACT_ID.ADG_PUK):
                return <this.GetPUKV2/>;
            case(ACT_ID.ADG_CHGT_CF):
                return <this.EditBillingAccountV2 disableSubmit={this.disableEditBillingAccount}/>;
            case(ACT_ID.ADG_DUPL_FACT):
                return <this.DuplicateBillingsV2
                    enableBillingDuplicates={this.props.authorizations.includes(ACT_ID.ADG_DUPL_FACT_GRATIS)}/>;
            case (ACT_ID.ADG_COMM_MANUEL):
                return <this.SendCommunicationV2 name="adgCommManuel" caseId={this.props.caseId}/>;
            case(ACT_ID.ADG_MOY_PAY):
                return <this.EditBillingMeansV2/>;
            case (ACT_ID.ADG_CAT_CLIENT):
                return <this.EditClientCategoryV2 client={this.props.client}/>;
            case (ACT_ID.ADG_SUIVI_SAV):
                return <this.SavOmnicanal fromFastrCase={true} idClient={this.props.client?.clientData?.id}/>;
            case(ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FASTR):
                return <this.RetourEquipment refClient={this.props.client?.service?.siebelAccount!}
                                             closeGrid={this.props.closeGrid}/>;
            case (ACT_ID.ADG_WEBSAP_ECHEANCIER):
            case (ACT_ID.ADG_WEBSAP_AVOIR_MANUEL):
            case (ACT_ID.ADG_WEBSAP_GEL_RELANCE):
            case (ACT_ID.ADG_WEBSAP_DEMANDE_SURENDETTEMENT):
            case (ACT_ID.ADG_WEBSAP_AVANCE_FACTURE):
                return <this.WebsapV2 actionTitle={"act.external.link.label." + this.props.idAct}
                                      adgCode={this.props.idAct}
                                      caseId={this.props.caseId}/>;
            case (ACT_ID.ADG_FIORI_ECHEANCIER):
            case (ACT_ID.ADG_FIORI_AVOIR_MANUEL):
            case (ACT_ID.ADG_FIORI_GEL_RELANCE):
            case (ACT_ID.ADG_FIORI_DEMANDE_SURENDETTEMENT):
            case (ACT_ID.ADG_FIORI_AVANCE_FACTURE):
                return <this.FioriV2 actionTitle={"act.external.link.label." + this.props.idAct}
                                     adgCode={this.props.idAct}
                                     caseId={this.props.caseId}/>;
            case (ACT_ID.ADG_MAXWELL):
                return <this.MaxwellSectionV2 name="MaxwellData" key="MaxwellDataSection"
                                              closeGrid={this.props.cancelADG}
                                              setShowGridADG={this.props.setShowGridADG}
                                              caseId={this.props.caseId}
                                              currentSelectedTheme={this.currentCaseState().themeSelected}
                                              readOnly={false}
                                              callOrigin={EMaxwellCallOrigin.FROM_ADG}
                />
            case (ACT_ID.ADG_FIXE_RV_ETIQUETTE_FASTR):
                return <this.RenvoiEtiquette clientService={this.props.client?.service}
                                             clientData={this.props.client?.clientData}
                                             closeFunction={this.props.cancelADG}/>
            default:
                return (<React.Fragment/>)
        }
    };

    private changeSwitchStatus = valueOfPreviousShowGridADG => event => {
        if (!valueOfPreviousShowGridADG) {
            this.props.setShowGridADG(true)
        } else {
            this.props.setShowGridADG(false)
        }
    };
}

const mapStateToProps = (state: AppState, ownProps: Props) => ({
    client: state.store.client.currentClient,
    authorizations: state.store.applicationInitialState.authorizations,
    currentCases: state.store.cases.casesList,
    blockingUI: state.store.ui.blockingUI,
    isFormCompleted: state.store.cases.casesList[ownProps.caseId].isFormCompleted
});

const mapDispatchToProps = {
    fetchAndStoreClientV2,
    actFioriOpenedInExternalApps,
    selectClientV2
};

export default connect(mapStateToProps, mapDispatchToProps)(ADGWrapperV2)
