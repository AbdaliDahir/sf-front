import * as React from "react";
import BlockUi from "react-block-ui";
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Col, Container, FormGroup, Label, Row} from "reactstrap";
import FormBICInput from "src/components/Form/Bank/FormBICInput";
import FormIBANInput from "src/components/Form/Bank/FormIBANInput";
import FormTextInput from "src/components/Form/FormTextInput";
import ValidationUtils from "src/utils/ValidationUtils";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {Service} from "../../../model/service";
import {CheckIbanBicResponseDTO} from "../../../model/service/CheckIbanBicResponseDTO";
import {RibOnlineResponseDTO} from "../../../model/service/RibOnlineResponseDTO";
import ActService from "../../../service/ActService";
import {AppState} from "../../../store";
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import ClientContextProps, {ClientContext} from "../../../store/types/ClientContext";
import ServiceUtils from "../../../utils/ServiceUtils";
import Loading from "../../../components/Loading";
import {Client} from "../../../model/person";
import FormHiddenInput from "../../../components/Form/FormHiddenInput";
import moment from "moment";

interface State {
    selected: string
    disabled: boolean
    checkIbanBic?: Partial<CheckIbanBicResponseDTO>
    validateRibOnline?: RibOnlineResponseDTO
    errorMsg?: string
    bankNameToDisplay?: string
    eligibleServices: Service[]
    ribValid: boolean
    isBlocked: boolean
    withPreviousIban: boolean
}

class BillingAccountUngroup extends React.Component<ClientContextProps<Service>, State> {
    private actService: ActService = new ActService(true);

    constructor(prop: ClientContextProps<Service>) {
        super(prop);
        this.state = {
            selected: "newIBAN",
            disabled: false,
            errorMsg: "",
            bankNameToDisplay: translate.formatMessage({id: "unknown"}),
            eligibleServices: [],
            ribValid: true,
            isBlocked: false,
            withPreviousIban: false
        }

    }


    public componentDidMount = async () => {
        const currentService = this.props.client.service!;
        const filteredServices: Service[] = this.props.client.data!.services.filter(
            e => e.id !== currentService.id && e.billingAccount.id === currentService.billingAccount.id);

        this.setState({eligibleServices: filteredServices});

        if (this.props.client.service!.billingAccount.sepaMethod !== undefined && !!this.props.client.service!.billingAccount.sepaMethod.bankName) {
            this.setState({bankNameToDisplay: this.props.client.service!.billingAccount.sepaMethod.bankName})

        } else {
            const req = {
                iban: this.props.client.service!.billingAccount.sepaMethod !== undefined ? this.props.client.service!.billingAccount.sepaMethod.iban : "",
                bic: ""
            }
            if (req.iban !== "") {
                const result: CheckIbanBicResponseDTO = await this.actService.checkIbanBicEntries(req);
                if (result && result.errorMessage == null && !!result.bankName) {
                    this.setState({bankNameToDisplay: result.bankName})
                }
            }
        }

    }

    // TODO :A voir si on peut factoriser cette partie  car elle est faite aussi dans l'ADG moyen de paiement.
    public changeBankName = (e) => {
        const value = e.currentTarget.value.trim();
        if (this.state.checkIbanBic) {
            this.setState(prevState => {
                return {
                    checkIbanBic: {
                        ...prevState.checkIbanBic,
                        bankName: value
                    }
                }
            });
        }
    }

    public getIbanBicDetails = async (e) => {
        this.setState({ribValid: false, isBlocked: true})

        let value = e.currentTarget.value.trim();
        if (value) {
            value = value.replace(/\s/g, '');
        }
        if (value && value !== "" && true === ValidationUtils.isValidIban([], value)) {
            try {
                const result: CheckIbanBicResponseDTO = await this.actService.checkIbanBicEntries({
                    iban: value,
                    bic: ""
                });
                if (result) {
                    this.setState({checkIbanBic: result}, () => this.forceUpdate())
                    if (result.errorMessage != null) {
                        this.setState({
                            errorMsg: "L'IBAN saisi n’est pas reconnu dans référenciel SWIFT.",
                            ribValid: false,
                            isBlocked: false
                        });
                    } else {
                        this.setState({errorMsg: ""});
                        this.validateRibOnline(value);
                    }
                    this.forceUpdate();
                } else {
                    this.setState({checkIbanBic: undefined, ribValid: false, isBlocked: false})
                }

            } catch (e) {
                console.error(e)
                this.setState({errorMsg: "", ribValid: false, checkIbanBic: undefined, isBlocked: false});
                NotificationManager.error(<FormattedMessage
                    id="act.edit.billing.means.technicalErrorIBAN"/>, null, 200000);
            }
        } else {
            this.setState({errorMsg: "", ribValid: false, checkIbanBic: undefined, isBlocked: false});
        }

    }

    public validateRibOnline = async (value: string) => {
        const storeData: ClientContext<Service> | undefined = this.props.client;

        let personInformation = {}
        if (!this.props.client.data!.corporation) {
            if (storeData.data!.ownerPerson) {
                personInformation = {
                    firstName: storeData.data!.ownerPerson.firstName,
                    lastName: storeData.data!.ownerPerson.lastName,
                    birthdate: storeData.data!.ownerPerson.birthDate,
                    address: storeData.data!.ownerPerson.address.address1,
                    zipCode: storeData.data!.ownerPerson.address.zipcode,
                    siren: storeData.data!.siren
                }
            }
        } else {
            if (storeData.data!.ownerCorporation) {
                personInformation = {
                    address: storeData.data!.ownerCorporation.address.address1,
                    zipCode: storeData.data!.ownerCorporation.address.zipcode,
                    siren: storeData.data!.siren
                }
            }
        }

        try {
            const result: RibOnlineResponseDTO = await this.actService.validateRibOnline({
                ...personInformation,
                email: storeData.data!.contactEmail,
                iban: value,
                futureRecurrentPaymentIban: value,
                codePdv: "null",
                idService: storeData.serviceId,
                frontConsummer: "FASTR",
                idSequence: "null"
            });
            this.setState({validateRibOnline: result})
            if (result.code != null && result.code !== "VALIDEE" && result.code !== "VALIDEE_PASSLIST_OK") {
                this.setState({
                    errorMsg: "Erreur de validation : Le RIB que vous avez saisi n'est pas valide.",
                    ribValid: false,
                    isBlocked: false
                });
            } else {
                this.setState({errorMsg: "", ribValid: true, isBlocked: false});
            }

        } catch (e) {
            console.error(e)
            NotificationManager.error(<FormattedMessage id="act.edit.billing.means.technicalErrorRIB"/>, null, 200000);
            this.setState({ribValid: false, isBlocked: false});
        }
    }

    // Fin des contôles sur les IBAN/BIC

    public initialState() {
        return {selected: "newIBAN", disabled: false, withPreviousIban: false}
    };

    public handleSelect = event => {
        this.setState({
            selected: event.currentTarget.value,
            disabled: event.currentTarget.value === "ibanPreviousCF",
            withPreviousIban: event.currentTarget.value === "ibanPreviousCF"
        })
    };

    public initiateBankName() {
        const data: Service | undefined = this.props.client.service;
        let bankName: string | undefined = "";
        let oldBankName: string | undefined = "";

        oldBankName = data!.billingAccount.sepaMethod !== undefined ? data!.billingAccount.sepaMethod.bankName : "";

        if (this.state.checkIbanBic) {
            bankName = this.state.checkIbanBic.bankName !== "" ? this.state.checkIbanBic.bankName : oldBankName;
        }
        return bankName;
    }

    public resetErrorMessage = () => {
        this.setState({errorMsg: ""});
    }

    public getTitulaireNameForCorporation(){
        const {billingAccount: {billingMethod}} = this.props.client.service!;
        const data = this.props.client.service!.billingAccount;
        switch (billingMethod) {
            case "SEPA" :
                return data.sepaMethod!.owner;

            case "CREDIT_CARD" :
                return data.creditCardMethod!.owner;

            case "OTHER" :
                return data.otherMethod!.owner;

            default:
                return "";
        }
    }

    public render(): JSX.Element {

        const dataClient: Client = this.props.client.data!;
        const data: Service | undefined = this.props.client.service;
        const impactedLine = data!.label;
        let titulaireName = "";
        if(dataClient.corporation){
            titulaireName = this.getTitulaireNameForCorporation();
        }else{
            titulaireName = data!.billingAccount.payer !== undefined ? data!.billingAccount.payer.civility +
                ' ' + data!.billingAccount.payer.firstName + ' ' + data!.billingAccount.payer.lastName :"";
        }

        const currentBillingAccount = this.props.client.service!.billingAccount;
        let hiddenIban = ""
        if (data!.billingAccount.sepaMethod) {
            hiddenIban = ServiceUtils.hideIban(data!.billingAccount.sepaMethod.iban);
        } else {
            hiddenIban = ""
        }
        const bankName = this.initiateBankName();
        const {eligibleServices} = this.state;
        const nextCutOffDate = this.props.client.service?.billingAccount.nextCutOffDate ? moment(this.props.client.service?.billingAccount.nextCutOffDate).format('DD/MM/YYYY') : "";

        if (currentBillingAccount.haveUnPaid || currentBillingAccount.status.toString() !== "ACTIVE") {
            return (<div className="mt-4 text-center">Le groupement est impossible car le compte de facturation de la
                ligne est en impayé ou n'est pas au
                statut ACTIF</div>)

        } else if (eligibleServices.length === 0) {
            return (<div className="mt-4 text-center">Le compte de facturation ne contient qu'un seul service, l'ADG ne peut être effectué.</div>)

        } else {
            return (
                <BlockUi blocking={this.state.isBlocked} keepInView={true}
                         loader={<Loading />} tag="div">
                    <Container>
                        <Row>
                            {/*SELECT*/}
                            {currentBillingAccount && currentBillingAccount.billingMethod !== "OTHER" ?
                                <Col md={12} className="mt-3">
                                    <div className="pt-3 pb-3">Un nouveau compte de facturation va être créé pour le service {impactedLine}, merci de préciser son mode de paiement</div>
                                    <div className="d-flex align-items-center">
                                        <div className="col-5 pl-0">
                                            <Label for="paymentMeansSelect">
                                                <FormattedMessage id="acts.billing.methods.paymentMeansSelect"/><span
                                                className="text-danger">*</span>
                                            </Label>
                                            <FormGroup>
                                                <select id="paymentSelectedMethod"
                                                        name="paymentSelectedMethod"
                                                        value={this.state.selected}
                                                        onChangeCapture={this.handleSelect} className="form-control">
                                                    <option value="newIBAN">{translate.formatMessage({id: "acts.billing.methods.newIBAN"})}</option>
                                                    <option value="ibanPreviousCF">{translate.formatMessage({id: "acts.billing.methods.ibanPreviousCF"})}</option>
                                                    <option value="otherPaymentMethod">{translate.formatMessage({id: "acts.billing.methods.otherPaymentMethod"})}</option>
                                                </select>
                                            </FormGroup>
                                        </div>
                                        {this.state.selected === "otherPaymentMethod" &&
                                        <div className="mt-2">Le client devra payer sa facture par CB, chèque ou TIP</div>}
                                    </div>
                                </Col> : <React.Fragment/>
                            }
                        </Row>
                        <Row>
                            <Col md={4}>
                                {/*Titulaire du compte bancaire*/}
                                <Label for="bankDetails.accountOwner">
                                    <FormattedMessage id="acts.billing.methods.accountOwner"/><span
                                    className="text-danger">*</span>
                                </Label>
                                <FormGroup>
                                    {this.state.selected === "ibanPreviousCF" ?
                                        <FormTextInput name="bankDetails.accountOwner" id="bankDetails.accountOwner"
                                                       value={titulaireName}
                                                       validations={{isRequired: ValidationUtils.notEmpty}}
                                                       disabled={this.state.disabled} readOnly={this.state.disabled}/> :
                                        <FormTextInput name="bankDetails.accountOwner"
                                                       id="bankDetails.accountOwner"
                                                       validations={{isRequired: ValidationUtils.notEmpty}}/>}
                                </FormGroup>
                            </Col>

                            {this.state.selected !== "otherPaymentMethod" &&
                            <Col md={8}>
                                {/*IBAN*/}
                                <FormGroup>
                                    <Label for="bankDetails.iban">
                                        <FormattedMessage id="acts.billing.methods.iban"/><span
                                        className="text-danger">*</span>
                                    </Label>
                                    {this.state.selected === "ibanPreviousCF" ? <FormTextInput name="bankDetails.iban" id="bankDetails.iban"
                                                                                               value={data!.billingAccount.sepaMethod !== undefined ? hiddenIban : ""}
                                                                                               validations={{isRequired: ValidationUtils.notEmpty}}
                                                                                               disabled={this.state.disabled}
                                                                                               readOnly={this.state.disabled}
                                                                                               onBlur={this.getIbanBicDetails}
                                    /> : this.state.selected === "newIBAN" &&
                                        <FormIBANInput name="bankDetails.iban"
                                                       id="bankDetails.iban"
                                                       validations={{
                                                           isRequired: ValidationUtils.notEmpty,
                                                           isValidIban: ValidationUtils.isValidIban
                                                       }}
                                                       onBlur={this.getIbanBicDetails}
                                                       forceInvalid={!this.state.ribValid}
                                                       onFocus={this.resetErrorMessage}
                                        />}
                                    {this.state.checkIbanBic &&
                                    <div className={"error-text"}>
                                        {this.state.errorMsg}
                                    </div>
                                    }

                                </FormGroup>
                            </Col>}

                            {this.state.selected === "otherPaymentMethod" &&
                            <Col md={4}>
                                {/*Date d'effet*/}
                                <FormGroup>
                                    <Label for="bankDetails.effectDate">
                                        <FormattedMessage id="acts.billing.methods.effectDate"/>
                                    </Label>
                                    <br/>
                                    <Label
                                        id="effectDateLabel" >
                                        {nextCutOffDate}
                                    </Label>
                                    <FormHiddenInput
                                        name="effectDate" id="effectDate" value={this.props.client.service?.billingAccount.nextCutOffDate}/>

                                </FormGroup>
                            </Col>}
                        </Row>
                        <Row>
                            <Col md={4}>
                                {/*BIC*/}
                                {this.state.selected !== "otherPaymentMethod" &&
                                <Label for="bankDetails.bic">
                                    <FormattedMessage id="acts.billing.methods.bic"/><span
                                    className="text-danger">*</span>
                                </Label>}
                                <FormGroup>
                                    {this.state.selected === "ibanPreviousCF" ? <FormBICInput name="bankDetails.bic" id="bankDetails.bic"
                                                                                              value={data!.billingAccount.sepaMethod !== undefined ? data!.billingAccount.sepaMethod.bic : ""}
                                                                                              validations={{isRequired: ValidationUtils.notEmpty}}
                                                                                              disabled={this.state.disabled}
                                                                                              readOnly={this.state.disabled}/> : this.state.selected === "newIBAN" &&
                                        <FormBICInput name="bankDetails.bic"
                                                      id="bankDetails.bic"
                                                      validations={{isRequired: ValidationUtils.notEmpty}}/>}
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                {/*Etablissement*/}
                                <FormGroup>
                                    {this.state.selected !== "otherPaymentMethod" &&
                                    <Label for="bankDetails.ets">
                                        <FormattedMessage id="acts.billing.methods.ets"/><span
                                        className="text-danger">*</span>
                                    </Label>}
                                    {this.state.selected === "ibanPreviousCF" ?
                                        <FormTextInput name="bankDetails.bankName" id="bankDetails.bankName"
                                                       value={this.state.bankNameToDisplay}
                                                       validations={{isRequired: ValidationUtils.notEmpty}}
                                                       disabled={true} readOnly={true}/> : this.state.selected === "newIBAN" &&
                                        <FormTextInput name="bankDetails.bankName"
                                                       id="bankDetails.bankName"
                                                       value={bankName}
                                                       onChange={this.changeBankName}
                                                       validations={{isRequired: ValidationUtils.notEmpty}}/>}
                                </FormGroup>
                            </Col>
                            {this.state.selected !== "otherPaymentMethod" &&
                            <Col md={4}>
                                {/*Date d'effet*/}
                                <FormGroup>
                                    <Label for="bankDetails.effectDate">
                                        <FormattedMessage id="acts.billing.methods.effectDate"/>
                                    </Label>
                                    <br/>
                                    <Label
                                        id="effectDateLabel" >
                                        {nextCutOffDate}
                                    </Label>
                                    <FormHiddenInput
                                        name="effectDate" id="effectDate" value={this.props.client.service?.billingAccount.nextCutOffDate}/>

                                </FormGroup>
                            </Col>}
                            {/*withPreviousIban*/}
                            {this.state.selected !== "otherPaymentMethod" &&
                            <FormHiddenInput name="withPreviousIban" id="withPreviousIban" value={this.state.withPreviousIban}/>}
                        </Row>

                    </Container>
                </BlockUi>)
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: {
        data: state.client.data,
        loading: state.client.loading,
        error: state.client.error,
        service: state.client.service,
        serviceId: state.client.serviceId
    }
});

const mapDispatchToProps = {
    loadClient: fetchAndStoreClient
};

export default connect(mapStateToProps, mapDispatchToProps)(BillingAccountUngroup)
