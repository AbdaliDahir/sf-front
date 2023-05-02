import {addDays, addMonths, differenceInCalendarDays, isBefore, setDate} from "date-fns"
import * as React from "react";
import BlockUi from "react-block-ui";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {Col, Label, Row} from "reactstrap";
import FormBICInput from "src/components/Form/Bank/FormBICInput";
import FormIBANInput from "src/components/Form/Bank/FormIBANInput";
import FormTextInput from "src/components/Form/FormTextInput";
import ValidationUtils from "src/utils/ValidationUtils";
import {NotificationManager} from "react-notifications";
import "./text-error.css"
import {CheckIbanBicResponseDTO} from "../../../../model/service/CheckIbanBicResponseDTO";
import {RibOnlineResponseDTO} from "../../../../model/service/RibOnlineResponseDTO";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import ActService from "../../../../service/ActService";
import {AppState} from "../../../../store";
import Loading from "../../../../components/Loading";
import FormDateInputV2 from "../../../../components/Form/Date/FormDateInputV2";

interface State {
    checked: boolean,
    checkIbanBic?: Partial<CheckIbanBicResponseDTO>
    validateRibOnline?: RibOnlineResponseDTO
    errorMsg?: string
    ribValid: boolean
    isBlocked: boolean
}

interface Props {
    required: boolean
    client: ClientContextSliceState
}

class ChangingBillingMeans extends React.Component<Props, State> {
    private actService: ActService = new ActService(true);

    constructor(prop: Props) {
        super(prop);
        this.state = {
            checked: false,
            errorMsg: "",
            ribValid: true,
            isBlocked: false
        }

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
        const storeData: ClientContextSliceState | undefined = this.props.client;

        let personInformation = {}
        if (!this.props.client.clientData!.corporation) {
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

    public initialState() {
        return {checked: true}
    };

    public getBillingAccountOwner() {
        const data = this.props.client?.clientData;
        if (data) {
            return data.corporation ? data.ownerCorporation.name : `${data.ownerPerson.civility} ${data.ownerPerson.firstName} ${data.ownerPerson.lastName}`
        }
        return ""
    }

    public resetErrorMessage = () => {
        this.setState({errorMsg: ""});
    }

    public render(): JSX.Element {

        const mandatory: boolean = this.props.required;

        const bankName = this.state.checkIbanBic ? this.state.checkIbanBic.bankName : '';

        return (
            <BlockUi blocking={this.state.isBlocked} keepInView={true} loader={<Loading/>} tag="div">
                <Row>
                    <Col md={4}>
                        <Label for="bankDetails.accountOwner">
                            <FormattedMessage id="acts.billing.methods.accountOwner"/>{mandatory ?
                            <span className="text-danger">*</span> : <span/>}
                        </Label>
                        <FormTextInput name="bankDetails.accountOwner"
                                       id="bankDetails.accountOwner"
                                       bsSize={"sm"}
                                       classNameToProps="mb-2"
                                       validations={{isRequired: mandatory ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty}}
                                       value={this.getBillingAccountOwner()}/>
                    </Col>
                    <Col md={8}>
                        <Label for="bankDetails.iban">
                            <FormattedMessage id="acts.billing.methods.iban"/>{mandatory ?
                            <span className="text-danger">*</span> : <span/>}
                        </Label>
                        <FormIBANInput name="bankDetails.iban"
                                       id="bankDetails.iban"
                                       validations={{
                                           manualValidation: this.state.errorMsg === "",
                                           isRequired: mandatory ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty,
                                           isValidIban: ValidationUtils.isValidIban
                                       }}
                                       small
                                       onBlur={this.getIbanBicDetails}
                                       forceInvalid={!this.state.ribValid}
                                       onFocus={this.resetErrorMessage}
                        />
                        {this.state.checkIbanBic &&
                            <div className={"error-text mt-minus-1 mb-1"}>
                                {this.state.errorMsg}
                            </div>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Label for="bankDetails.bic">
                            <FormattedMessage id="acts.billing.methods.bic"/>{mandatory ?
                            <span className="text-danger">*</span> : <span/>}
                        </Label>
                        <FormBICInput name="bankDetails.bic"
                                      id="bankDetails.bic"
                                      validations={{
                                          isRequired: mandatory ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty,
                                          isValidBic: mandatory ? ValidationUtils.inputMinMaxLength : ValidationUtils.canBeEmpty
                                      }}
                                      small
                        />
                    </Col>
                    <Col md={4}>
                        <Label for="bankDetails.ets">
                            <FormattedMessage id="acts.billing.methods.ets"/>{mandatory ?
                            <span className="text-danger">*</span> : <span/>}
                        </Label>
                        <FormTextInput name="bankDetails.bankName"
                                       id="bankDetails.bankName"
                                       value={bankName}
                                       validations={{isRequired: mandatory ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty}}
                                       onChange={this.changeBankName}
                                       readOnly
                                       bsSize={"sm"}
                        />
                    </Col>
                    <Col md={4}>
                        <Label for="bankDetails.effectDate">
                            <FormattedMessage id="acts.billing.methods.effectDate"/>{mandatory ?
                            <span className="text-danger">*</span> : <span/>}
                        </Label>
                        <FormDateInputV2 minDate={new Date()}
                                         id="bankDetails.effectDate" name="bankDetails.effectDate"
                                         filterDate={this.effectDateFilter}
                                         small classNameFormGroup="block-date-input"
                                         validations={{isRequired: mandatory ? ValidationUtils.notEmpty : ValidationUtils.canBeEmpty}}/>
                    </Col>
                </Row>
            </BlockUi>)
    }

    private effectDateFilter = (date: Date) => {
        const cutOffDay: number | undefined = this.props.client.service && this.props.client.service.billingAccount.cutOffDay
        if (cutOffDay !== undefined) {
            const getNextCutOffDate = () => {
                const cutOffDateOfThisMonth = setDate(new Date(), cutOffDay)
                if (isBefore(cutOffDateOfThisMonth, new Date())) {
                    return addMonths(cutOffDateOfThisMonth, 1)
                }
                return cutOffDateOfThisMonth
            }

            const cutOffDate: Date = getNextCutOffDate()
            const max = addMonths(addDays(cutOffDate, -3), 1)

            const disableCutOffRange: Array<number> = [-2, -1, 0]
            const isNotInRange: boolean = disableCutOffRange
                .map(position => differenceInCalendarDays(date, cutOffDate) !== position)
                .reduce((accumulator, currentValue) => accumulator && currentValue)
            return isBefore(date, max) && isNotInRange
        }
        return true
    }

}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient
});

export default connect(mapStateToProps)(ChangingBillingMeans)
