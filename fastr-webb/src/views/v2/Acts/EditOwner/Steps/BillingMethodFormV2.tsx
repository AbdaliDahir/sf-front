import * as React from "react";
import 'react-credit-cards/es/styles-compiled.css';
import {FormattedMessage} from "react-intl";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {Col, Label, Row} from "reactstrap";
import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import {setCTIToFinishedV2, setCTIToOngoingV2} from "../../../../../store/actions/v2/case/CaseActions";
import {CheckIbanBicResponseDTO} from "../../../../../model/service/CheckIbanBicResponseDTO";
import {RibOnlineResponseDTO} from "../../../../../model/service/RibOnlineResponseDTO";
import ActService from "../../../../../service/ActService";
import ValidationUtils from "../../../../../utils/ValidationUtils";
import FormTextInput from "../../../../../components/Form/FormTextInput";
import FormIBANInput from "../../../../../components/Form/Bank/FormIBANInput";
import FormBICInput from "../../../../../components/Form/Bank/FormBICInput";
import {AppState} from "../../../../../store";
import {CaseState} from "../../../../../store/reducers/v2/case/CasesPageReducerV2";

interface Props {
    saveData?: <T extends string | Date | boolean>(key: string, value: T) => void
    defaultValue?: { oldBillingMethods: { lastName, firstName, civility, bankDetails: { iban, bic, ets } } }
    title?: string
    forCTI?: boolean
    // tslint:disable-next-line:no-any TODO: To correct
    getValuesFromFields: () => { form: any }
    // tslint:disable-next-line:no-any
    authorization: any
    setOnGoingCheckIban?: () => void
    setFinishedCheckIban?: () => void
    client: ClientContextSliceState
    caseId: string
    setCTIToOngoingV2: (caseId: string) => void
    setCTIToFinishedV2: (caseId: string) => void
    currentCases
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
            errorMsg: "",
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

    private currentCaseState = (): CaseState => {
        return this.props.currentCases[this.props.caseId]
    }

    private changeBankName = (e) => {
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

    private getIbanBicDetails = async (e) => {
        this.setState({ribValid: false})
        if (this.props.setOnGoingCheckIban) {
            this.props.setOnGoingCheckIban();
        }

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
                            ribValid: false
                        });
                        this.notifyCheckIbanFinished()
                    } else {
                        this.setState({errorMsg: ""});
                        this.validateRibOnline(value);
                    }
                    this.forceUpdate();
                } else {
                    this.setState({checkIbanBic: undefined, ribValid: false})
                    this.notifyCheckIbanFinished()
                }

            } catch (e) {
                console.error(e)
                this.setState({errorMsg: "", ribValid: false, checkIbanBic: undefined});
                this.notifyCheckIbanFinished()

                NotificationManager.error(<FormattedMessage
                    id="act.edit.billing.means.technicalErrorIBAN"/>, null, 200000);
            }
        } else {
            this.setState({errorMsg: "", ribValid: false, checkIbanBic: undefined});
            this.notifyCheckIbanFinished()
        }

    }

    private validateRibOnline = async (value: string) => {
        const storeData: ClientContextSliceState | undefined = this.props.client;

        let personInformation = {}
        if (this.props.client !== undefined) {

            if (!this.props.client.clientData?.corporation) {
                if (storeData.clientData!.ownerPerson) {
                    personInformation = {
                        firstName: storeData.clientData!.ownerPerson.firstName,
                        lastName: storeData.clientData!.ownerPerson.lastName,
                        birthdate: storeData.clientData!.ownerPerson.birthDate,
                        address: storeData.clientData!.ownerPerson.address.address1,
                        zipCode: storeData.clientData!.ownerPerson.address.zipcode,
                        siren: storeData.clientData!.siren
                    }
                }
            } else {
                if (storeData.clientData!.ownerCorporation) {
                    personInformation = {
                        address: storeData.clientData!.ownerCorporation.address.address1,
                        zipCode: storeData.clientData!.ownerCorporation.address.zipcode,
                        siren: storeData.clientData!.siren
                    }
                }
            }
        }

        try {
            const result: RibOnlineResponseDTO = await this.actService.validateRibOnline({
                ...personInformation,
                email: storeData.clientData!.contactEmail,
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
                    ribValid: false
                });
                this.notifyCheckIbanFinished()

            } else {
                this.setState({errorMsg: "", ribValid: true});
                this.notifyCheckIbanFinished()
            }

        } catch (e) {
            console.error(e)
            NotificationManager.error(<FormattedMessage id="act.edit.billing.means.technicalErrorRIB"/>, null, 200000);
            this.setState({ribValid: false});
            this.notifyCheckIbanFinished()
        }
    }

    private notifyCheckIbanFinished = () => {
        if (this.props.setFinishedCheckIban) {
            this.props.setFinishedCheckIban();
        }
    }

    private resetErrorMessage = () => {
        this.setState({errorMsg: ""});
    }

    private getBillingAccountOwner() {
        const {corporation, ownerPerson, ownerCorporation} = this.props.client.clientData!;
        return corporation ? ownerCorporation.name : `${ownerPerson.civility} ${ownerPerson.firstName} ${ownerPerson.lastName}`;
    }

    private notifyCTIFinished = () => {
        if (!this.props.forCTI) {
            return;
        }

        // tslint:disable-next-line:no-any TODO: To correct
        const form: any = this.props.getValuesFromFields();

        if (form === undefined || undefined === form.oldBillingMethods || undefined === form.oldBillingMethods.bankDetails) {
            return;
        }
        const {bankDetails} = form.oldBillingMethods;

        if (this.currentCaseState().isCTIFinished && (!bankDetails.bic || !bankDetails.ets || !bankDetails.iban)) {
            this.props.setCTIToOngoingV2(this.props.caseId)
            return;
        }

        if (!this.currentCaseState().isCTIFinished && bankDetails.bic && bankDetails.ets && bankDetails.iban) {
            this.props.setCTIToFinishedV2(this.props.caseId)
            return;
        }
    }

    public render(): JSX.Element {
        const bankName = this.state.checkIbanBic ? this.state.checkIbanBic.bankName : '';
        return (
            <React.Fragment>
                <Row className="d-flex justify-content-center mb-3">
                    <h6>Moyen de paiement du repreneur
                    </h6>
                </Row>
                <Row>
                    <Col md={6}>
                        <Label for="bankDetails.accountOwner">
                            <FormattedMessage id="acts.billing.methods.accountOwner"/>
                        </Label>
                        <FormTextInput name="bankDetails.accountOwner"
                                       id="bankDetails.accountOwner"
                                       bsSize={"sm"}
                                       validations={ValidationUtils.canBeEmpty}
                                       value={this.getBillingAccountOwner()}
                        />
                    </Col>
                    <Col md={6}>
                        <Label for="oldBillingMethods.bankDetails.iban">
                            <FormattedMessage id="acts.billing.methods.iban"/><span className="text-danger">*</span>
                        </Label>
                        <FormIBANInput name="oldBillingMethods.bankDetails.iban"
                                       id="oldBillingMethods.bankDetails.iban"
                                       small
                                       validations={{
                                           isRequired: ValidationUtils.notEmpty,
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
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Label for="oldBillingMethods.bankDetails.bic">
                            <FormattedMessage id="acts.billing.methods.bic"/><span className="text-danger">*</span>
                        </Label>
                        <FormBICInput name="oldBillingMethods.bankDetails.bic"
                                      id="oldBillingMethods.bankDetails.bic"
                                      small
                                      value={this.props.defaultValue ? this.props.defaultValue.oldBillingMethods.bankDetails.bic : ""}
                                      validations={{isRequired: ValidationUtils.notEmpty}}
                        />
                    </Col>
                    <Col md={6}>
                        <Label for="oldBillingMethods.bankDetails.ets">
                            <FormattedMessage id="acts.billing.methods.ets"/><span className="text-danger">*</span>
                        </Label>
                        <FormTextInput name="oldBillingMethods.bankDetails.ets"
                                       id="oldBillingMethods.bankDetails.ets"
                                       bsSize={"sm"}
                                       validations={{isRequired: ValidationUtils.notEmpty}}
                                       onChange={this.changeBankName}
                                       value={bankName}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    currentCases: state.store.cases.casesList
});

const mapDispatchToProps = {
    setCTIToOngoingV2,
    setCTIToFinishedV2

};

export default connect(mapStateToProps, mapDispatchToProps)(BillingMethodForm)
