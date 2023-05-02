import * as React from "react";
import {NotificationManager} from "react-notifications";
import {Col, Label, Row} from "reactstrap";
import {FormattedMessage} from "react-intl";
import * as _ from "lodash";
import {connect} from "react-redux";
import {UIProps} from "src/store/actions/UIActions";
import {Address} from "../../../../model/person";
import {BillingAccount, BillingAccountDetails} from "../../../../model/person/billing";
import ClientService from "../../../../service/ClientService";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {AppState} from "../../../../store";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import LocaleUtils from "../../../../utils/LocaleUtils";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";
import Loading from "../../../../components/Loading";
import {setFormCompleteV2, setFormIncompleteV2} from "../../../../store/actions/v2/case/CaseActions";
import BillingAddressForm from "../../../Acts/EditBillingAddress/components/BillingAddressForm";
import NextPayerStatus from "../../../Acts/EditBillingAddress/components/NextPayerStatus";

interface Props extends UIProps {
    idService: string
    setAddressToChecked
    setAddressToUnchecked
    // idActDisRC: string
    payload
    client: ClientContextSliceState
}

interface FormData {
    act: { address: Address }
}

interface State {
    disabled: boolean
    sameAsOwnerAddress: boolean
    billingAccountDetails: BillingAccountDetails | undefined
    act?: FormData
    alreadySameAsOwnerAddress: boolean
    nextPayerStatus: "CORPORATION" | "PERSON"
}

class EditBillingAddressV2 extends React.Component<Props, State> {

    private clientService: ClientService = new ClientService();

    constructor(props: Props) {
        super(props);
        this.state = {
            disabled: true,
            billingAccountDetails: undefined,
            sameAsOwnerAddress: false,
            act: undefined,
            nextPayerStatus: "PERSON", alreadySameAsOwnerAddress: false,
        };
    }

    /*Before load*/
    public async componentDidMount() {
        this.getBillingInfos();
    }

    private async getBillingInfos() {
        if (this.props.client?.clientData?.services) {
            /* const billingAccountDetails = !this.props.idActDisRC ? await this.clientService.getBillingDetailsByServiceId(this.props.client?.clientData, this.props.idService)
                 : await this.clientService.getBillingDetailsByServiceId(this.props.client?.clientData, this.props.payload.idService)
 */
            const billingAccountDetails = await this.clientService.getBillingDetailsByServiceId(this.props.client?.clientData, this.props.idService);
            if (billingAccountDetails) {
                const billingAccountByService = billingAccountDetails.billingAccountDataFromPayer;

                if (billingAccountByService && billingAccountDetails.billingAccountDataFromOwner) {
                    const actualData = {act: {address: {}}};
                    actualData.act.address = billingAccountByService.payer.address;
                    this.setState({
                        billingAccountDetails,
                        act: actualData,
                        sameAsOwnerAddress: billingAccountByService.billingAddressSameAsOwner,
                        nextPayerStatus: billingAccountDetails.billingAccountDataFromPayer!.businessName ? "CORPORATION" : "PERSON"
                    })
                }
            } else {
                NotificationManager.error(translate.formatMessage({id: "global.error.no.service"}))
            }
        } else {
            NotificationManager.error(translate.formatMessage({id: "global.error.no.service"}))
        }
    }

    // Convert country code to country name
    public getCountryCode(initialBillingAccountInForm: BillingAccount | undefined) {
        if (initialBillingAccountInForm) {
            const initialCountryCode: string | undefined = initialBillingAccountInForm.payer.address.countryCode;
            if (initialCountryCode) {
                initialBillingAccountInForm.payer.address.countryCode = LocaleUtils.getCountry(initialCountryCode);
            } else {
                // TODO: Throw error, the country code is not setted in the address (should not happen normally)
                NotificationManager.error({id: "error.no.country.code"})
            }
        }
    }

    public catchFormChanges = (formWasChanged: React.FormEvent<HTMLInputElement>) => {
        if (formWasChanged && formWasChanged.currentTarget) {
            const fieldName = formWasChanged.currentTarget.name;
            const fieldValue = formWasChanged.currentTarget.value;

            // @ts-ignore
            this.setState((prevState: State) => {
                if (prevState.act) {
                    this.props.setAddressToUnchecked();
                    return {
                        addressChanged: !!formWasChanged,
                        act: _.set<FormData>(prevState.act, fieldName, fieldValue)
                    };
                } else {
                    return prevState as State;
                }
            });
            this.props.setAddressToUnchecked();
        }
    };

    public setSameAsOwnerAddress = () => {
        if (this.state.billingAccountDetails && this.state.billingAccountDetails.billingAccountDataFromPayer && this.state.billingAccountDetails.billingAccountDataFromPayer.billingAddressSameAsOwner && !this.state.sameAsOwnerAddress) {
            this.setState({alreadySameAsOwnerAddress: true})
        } else {
            this.setState({alreadySameAsOwnerAddress: false})
        }
        this.setState((prevState: State) => ({sameAsOwnerAddress: !prevState.sameAsOwnerAddress}))
    };

    public handleNextPayerStatusStatus = (status: 'CORPORATION' | 'PERSON') => {
        this.setState({nextPayerStatus: status})
    };

    public render(): JSX.Element {
        const {sameAsOwnerAddress, billingAccountDetails, nextPayerStatus, alreadySameAsOwnerAddress} = this.state

        if (this.props.client?.clientData && billingAccountDetails) {
            return (
                <React.Fragment>
                    <Label className="ml-1">
                        <FormattedMessage id="global.form.address.sameAsOwner"/><span className="text-danger">*</span>
                    </Label>
                    <Row>
                        <Col>
                            <FormSwitchInput color="primary"
                                             value={sameAsOwnerAddress}
                                             valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                             valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                             name="sameAddrAsOwner"
                                             onClick={this.setSameAsOwnerAddress}
                                             thickness={"sm"}
                                             id="sameAddrAsOwner"/>
                            <label className={"m-0 p-0 text-center text-primary text-sm"}
                                   hidden={!alreadySameAsOwnerAddress}> <FormattedMessage
                                id="act.billing.address.sameAsOnwer.warning"/></label>
                        </Col>
                        <Col>
                            <NextPayerStatus billingAccountDetails={billingAccountDetails}
                                             handleNextPayerStatusStatus={this.handleNextPayerStatusStatus}/>
                        </Col>
                    </Row>
                    <BillingAddressForm billingAccountDetails={billingAccountDetails}
                                        title={translate.formatMessage({id: "global.address"})}
                                        catchFormChanges={this.catchFormChanges}
                                        nextPayerStatus={nextPayerStatus} sameAsOwnerAddress={sameAsOwnerAddress}/>
                </React.Fragment>
            )
        } else {
            return (<Loading/>)
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient,
    // idActDisRC: state.casePage.idActDisRC,        payload: state.payload.payload,
})

const mapDispatchToProps = {
    setAddressToUnchecked: setFormIncompleteV2,
    setAddressToChecked: setFormCompleteV2,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBillingAddressV2)
