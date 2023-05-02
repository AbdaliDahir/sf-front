import * as React from "react";
import 'react-credit-cards/es/styles-compiled.css';
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
// Components
import {Col, Container, FormGroup, Label, Row} from "reactstrap";
import FormBICInput from "../../../../components/Form/Bank/FormBICInput";
import FormIBANInput from "../../../../components/Form/Bank/FormIBANInput";
import FormTextInput from "../../../../components/Form/FormTextInput";
import {Service} from "../../../../model/service";
import {CheckIbanBicResponseDTO} from "../../../../model/service/CheckIbanBicResponseDTO";
import {RibOnlineResponseDTO} from "../../../../model/service/RibOnlineResponseDTO";
import ActService from "../../../../service/ActService";
import {AppState} from "../../../../store";
import {CTIActionsProps, setCTIToFinished, setCTIToOngoing} from "../../../../store/actions/CTIActions";
import ClientContextProps, {ClientContext} from "../../../../store/types/ClientContext";
import ValidationUtils from "../../../../utils/ValidationUtils";
import {setFormComplete, setFormIncomplete} from "../../../../store/actions";

type PropType = ClientContextProps<Service>

interface Props extends CTIActionsProps,PropType {
    saveData?: <T extends string | Date | boolean>(key: string, value: T) => void
    defaultValue?: { oldBillingMethods: { lastName, firstName, civility, bankDetails: { iban, bic, ets } } }
    title?: string
    forCTI?: boolean,
    isCTIFinished: boolean
    // tslint:disable-next-line:no-any TODO: To correct
    getValuesFromFields: () => { form: any }
    // tslint:disable-next-line:no-any
    authorization: any
    setOnGoingCheckIban?: () => void
    setFinishedCheckIban?: () => void
    setFormIncomplete: () => void
    setFormComplete: () => void
}

interface State {
    oldBillingMethods: { bankDetails: { iban, bic, ets } }
    checkIbanBic?: Partial<CheckIbanBicResponseDTO>
    validateRibOnline?: RibOnlineResponseDTO
    errorMsg?: string
    ribValid: boolean
}

class BillingMethodForm extends React.Component<Props, State> {
    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            errorMsg:"",
            oldBillingMethods: {
                bankDetails: {
                    iban: "",
                    bic: "",
                    ets: ""
                }
            },
            ribValid: true
        }
    }

    public componentDidUpdate() {
        this.notifyCTIFinished();
    }

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
        this.setState({ribValid: false})
        if (this.props.setOnGoingCheckIban) {
            this.props.setOnGoingCheckIban();
        }

        let value = e.currentTarget.value.trim();
        if (value) {
            value = value.replace(/\s/g, '');
        }
        if(value && value !=="" && true === ValidationUtils.isValidIban([], value)) {
            try {
                const result: CheckIbanBicResponseDTO = await this.actService.checkIbanBicEntries({
                    iban: value,
                    bic: ""
                });
                if (result) {
                    this.setState({checkIbanBic: result}, () => this.forceUpdate())
                    if (result.errorMessage != null) {
                        this.setState({errorMsg:"L'IBAN saisi n’est pas reconnu dans référenciel SWIFT.",
                            ribValid: false});
                        this.notifyCheckIbanFinished()
                    } else {
                        this.setState({errorMsg:""});
                        this.validateRibOnline(value);
                    }
                    this.forceUpdate();
                } else {
                    this.setState({checkIbanBic: undefined, ribValid: false})
                    this.notifyCheckIbanFinished()
                }

            } catch (e) {
                console.error(e)
                this.setState({errorMsg:"", ribValid: false, checkIbanBic: undefined});
                this.notifyCheckIbanFinished()

                NotificationManager.error(<FormattedMessage id="act.edit.billing.means.technicalErrorIBAN"/>, null, 200000);
            }
        }else{
            this.setState({errorMsg:"", ribValid: false, checkIbanBic: undefined});
            this.notifyCheckIbanFinished()
        }

    }

    public validateRibOnline = async (value: string) => {
        const storeData: ClientContext<Service> | undefined = this.props.client;

        let personInformation = {}
        if (this.props.client !== undefined) {

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
                this.setState({errorMsg:"Erreur de validation : Le RIB que vous avez saisi n'est pas valide.",
                    ribValid: false});
                this.notifyCheckIbanFinished()

            }else{
                this.setState({errorMsg:"", ribValid: true});
                this.notifyCheckIbanFinished()
            }

        } catch (e) {
            console.error(e)
            NotificationManager.error(<FormattedMessage id="act.edit.billing.means.technicalErrorRIB"/>, null, 200000);
            this.setState({ribValid: false});
            this.notifyCheckIbanFinished()
        }
    }

    public notifyCheckIbanFinished = () => {
        if (this.props.setFinishedCheckIban) {
            this.props.setFinishedCheckIban();
        }
        if (this.state.ribValid) {
            this.props.setFormComplete()
        } else {
            this.props.setFormIncomplete();
        }
    }

    public resetErrorMessage = () => {
        this.setState({errorMsg: ""});
    }

    public getBillingAccountOwner() {
        const {corporation, ownerPerson, ownerCorporation} = this.props.client.data!;
        return corporation ? ownerCorporation.name : `${ownerPerson.civility} ${ownerPerson.firstName} ${ownerPerson.lastName}`;
    }


    public notifyCTIFinished = () => {
        if (!this.props.forCTI) {
            return;
        }

        // tslint:disable-next-line:no-any TODO: To correct
        const form: any = this.props.getValuesFromFields();

        if (form === undefined || undefined === form.oldBillingMethods || undefined === form.oldBillingMethods.bankDetails) {
            return;
        }
        const {bankDetails} = form.oldBillingMethods;

        if (this.props.isCTIFinished && (!bankDetails.bic || !bankDetails.ets || !bankDetails.iban)) {
            this.props.setCTIToOngoing()
            return;
        }

        if (!this.props.isCTIFinished && bankDetails.bic && bankDetails.ets && bankDetails.iban) {
            this.props.setCTIToFinished()
            return;
        }
    }

    public render(): JSX.Element {
        const bankName = this.state.checkIbanBic ? this.state.checkIbanBic.bankName : '';
        return (
            <Container>
                <Row className="d-flex justify-content-center mb-3">
                    <h6>Moyen de paiement du repreneur
                    </h6>
                </Row>
                <Row>
                    <Col md={6}>
                        <Label for="bankDetails.accountOwner">
                            <FormattedMessage id="acts.billing.methods.accountOwner"/>
                        </Label>
                        <FormGroup>
                            <FormTextInput name="bankDetails.accountOwner"
                                           id="bankDetails.accountOwner"
                                           validations={ValidationUtils.canBeEmpty}
                                           value={this.getBillingAccountOwner()}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="oldBillingMethods.bankDetails.iban">
                                <FormattedMessage id="acts.billing.methods.iban"/><span className="text-danger">*</span>
                            </Label>
                            <FormIBANInput name="oldBillingMethods.bankDetails.iban"
                                           id="oldBillingMethods.bankDetails.iban"
                                           validations={{isRequired: ValidationUtils.notEmpty,
                                                         isValidIban: ValidationUtils.isValidIban
                                                        }}
                                           onBlur={this.getIbanBicDetails}
                                           forceInvalid={!this.state.ribValid}
                                           onFocus={this.resetErrorMessage}
                            />
                            {this.state.checkIbanBic &&
                            <div className={"error-text"}>
                                {this.state.errorMsg}
                            </div>
                            }
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Label for="oldBillingMethods.bankDetails.bic">
                            <FormattedMessage id="acts.billing.methods.bic"/><span className="text-danger">*</span>
                        </Label>
                        <FormGroup>
                            <FormBICInput name="oldBillingMethods.bankDetails.bic"
                                          id="oldBillingMethods.bankDetails.bic"
                                          value={this.props.defaultValue ? this.props.defaultValue.oldBillingMethods.bankDetails.bic : ""}
                                          validations={{isRequired: ValidationUtils.notEmpty}}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="oldBillingMethods.bankDetails.ets">
                                <FormattedMessage id="acts.billing.methods.ets"/><span className="text-danger">*</span>
                            </Label>
                            <FormTextInput name="oldBillingMethods.bankDetails.ets"
                                           id="oldBillingMethods.bankDetails.ets"
                                           validations={{isRequired: ValidationUtils.notEmpty}}
                                           onChange={this.changeBankName}
                                           value={bankName}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    isCTIFinished: state.cti.isCTIFinished
});

const mapDispatchToProps = {
    setCTIToOngoing,
    setCTIToFinished,
    setFormIncomplete,
    setFormComplete
};

export default connect(mapStateToProps, mapDispatchToProps)(BillingMethodForm)
