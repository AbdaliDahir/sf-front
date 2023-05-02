import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, Label, Row} from "reactstrap";
import FormTextInput from "../../../../components/Form/FormTextInput";
import ValidationUtils from "../../../../utils/ValidationUtils";
import FormSelectInput from "../../../../components/Form/FormSelectInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {Service} from "../../../../model/service";
import {BillingAccount, BillingAccountDetails} from "../../../../model/person/billing";
import ServicesListByBillingAccountId from "./ServicesListByBillingAccountId";
import BillingAddressFormWhenPayerSameAsOwner from "./BillingAddressFormWhenPayerSameAsOwner";
import AddressInput from "../../../../components/Form/Address/AddressInput";
import Loading from "../../../../components/Loading";

interface Props {
    catchFormChanges: (formWasChanged: React.FormEvent<HTMLInputElement>) => void,
    billingAccountDetails: BillingAccountDetails
    sameAsOwnerAddress: boolean
    title: string
    nextPayerStatus: "CORPORATION" | "PERSON"
}

interface State {
    billingAccountInForm: Partial<BillingAccount>,
    collapse: boolean;
    readOnlyForm: boolean,
    servicesByBillingAccountId: Service[] | undefined,
    nextPayerStatus: "CORPORATION" | "PERSON"
}

export default class BillingAddressForm extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            readOnlyForm: this.props.sameAsOwnerAddress,
            billingAccountInForm: this.props.billingAccountDetails.billingAccountDataFromPayer ? this.props.billingAccountDetails.billingAccountDataFromPayer : {},
            collapse: true,
            servicesByBillingAccountId: this.props.billingAccountDetails!.servicesByBillingAccount,
            nextPayerStatus: this.props.nextPayerStatus
        }
    }

    public componentWillUpdate = (prevProps: Props, prevState: State) => {

        if (prevProps.billingAccountDetails && prevProps.billingAccountDetails.servicesByBillingAccount && prevProps.billingAccountDetails.servicesByBillingAccount !== this.state.servicesByBillingAccountId) {
            this.setState({servicesByBillingAccountId: prevProps.billingAccountDetails.servicesByBillingAccount})
        }

        if (prevProps.nextPayerStatus !== this.state.nextPayerStatus) {
            this.setState({nextPayerStatus: prevProps.nextPayerStatus})
        }

        if (prevProps.sameAsOwnerAddress !== this.state.readOnlyForm) {
            this.setState({readOnlyForm: prevProps.sameAsOwnerAddress})
            if (prevProps.billingAccountDetails) {
                if (prevProps.sameAsOwnerAddress) {
                    this.setState({billingAccountInForm: prevProps.billingAccountDetails.billingAccountDataFromOwner!})
                } else {
                    this.setState({billingAccountInForm: prevProps.billingAccountDetails.billingAccountDataFromPayer!})
                }
            }
        }
    };

    public catchFormChanges = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.catchFormChanges(event)
    };

    public renderCompanyName(): JSX.Element {
        const {billingAccountInForm: {businessName}, readOnlyForm, nextPayerStatus} = this.state;

        if (nextPayerStatus === "CORPORATION" && !readOnlyForm) {
            return (
                <Row>
                    <Col>
                        <Label for="act.businessName"><FormattedMessage
                            id={"acts.editProfessionaldata.businessName"}/><span className="text-danger">*</span></Label>
                        <FormTextInput id={"act.businessName"} name={"act.businessName"}
                                       validations={{isRequired: ValidationUtils.notEmpty, "inputMaxLength": 38}}
                                       bsSize={"sm"}
                                       value={businessName} readOnly={readOnlyForm}/>
                    </Col>
                </Row>
            )
        } else {
            if (this.state.billingAccountInForm && this.state.billingAccountInForm.payer) {
                const {billingAccountInForm: {payer: {civility, firstName, lastName}}} = this.state;
                return (
                    <Row>
                        {/*Payer info : civility, firstName, lastName mandatory only if it is NOT a CORPORATION */}
                        <Col sm={2}>
                            <Label for="act.payer.civility">
                                <FormattedMessage id="global.form.civility"/><span className="text-danger">*</span>
                            </Label>
                            <FormSelectInput name="act.civility" id="act.civility"
                                             validations={{isRequired: ValidationUtils.notEmpty}}
                                             bsSize={"sm"}
                                             value={civility} disabled={readOnlyForm}>
                                <option selected disabled value=""/>
                                <option
                                    value="MR">{translate.formatMessage({id: "global.form.civility.mr"})}</option>
                                <option
                                    value="MME">{translate.formatMessage({id: "global.form.civility.mrs"})}</option>
                                <option
                                    value="MLLE">{translate.formatMessage({id: "global.form.civility.miss"})}</option>
                            </FormSelectInput>
                        </Col>
                        <Col sm={5}>
                            <Label for="act.payer.firstName">
                                <FormattedMessage id="global.form.firstname"/><span className="text-danger">*</span>
                            </Label>
                            <FormTextInput name="act.firstName" id="act.firstName"
                                           validations={{
                                               respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,20}$/),
                                               isRequired: ValidationUtils.notEmpty, "inputMaxLength": 38
                                           }}
                                           bsSize={"sm"}
                                           value={firstName} readOnly={readOnlyForm}/>
                        </Col>
                        <Col sm={5}>
                            <Label for="act.payer.lastName">
                                <FormattedMessage id="global.form.lastname"/><span className="text-danger">*</span>
                            </Label>
                            <FormTextInput name="act.lastName" id="act.lastName"
                                           validations={{
                                               respectPattern: ValidationUtils.respectPattern(/^[a-zA-Z\u00C0-\u00FF-.' ]{0,25}$/),
                                               isRequired: ValidationUtils.notEmpty,
                                               "inputMaxLength": 38
                                           }}
                                           bsSize={"sm"}
                                           value={lastName} readOnly={readOnlyForm}/>
                        </Col>
                    </Row>
                )
            } else {
                return <React.Fragment/>
            }
        }
    }

    public getAddressComplementary(): JSX.Element {
        const {billingAccountDetails: {corporation}} = this.props;
        if (this.state.billingAccountInForm && this.state.billingAccountInForm.payer) {
            const {billingAccountInForm: {payer: {address}}, readOnlyForm} = this.state;
            if (corporation) {
                return (<React.Fragment/>)
            } else {
                return (<Col>
                    <Label for="address.identityComplement">
                        <FormattedMessage id="global.address.appartEtageCouloirEscalier"/>
                    </Label>
                    <FormTextInput name="act.address.identityComplement"
                                   id="act.address.identityComplement"
                                   value={address.identityComplement}
                                   onChangeCapture={this.catchFormChanges} readOnly={readOnlyForm}/>
                </Col>)
            }
        } else {
            return <React.Fragment/>
        }
    }

    public render(): JSX.Element {
        const {billingAccountInForm, readOnlyForm, servicesByBillingAccountId} = this.state;
        if (billingAccountInForm && billingAccountInForm.payer) {
            const {address} = this.state.billingAccountInForm.payer!;
            if (!readOnlyForm) {
                return (
                    <div>
                        {this.renderCompanyName()}
                        <AddressInput value={address} name="act.address"/>
                        <ServicesListByBillingAccountId servicesByBillingAccountId={servicesByBillingAccountId}/>
                    </div>
                )
            } else {
                return (
                    <div>
                        {this.renderCompanyName()}
                        {this.props.billingAccountDetails && this.props.billingAccountDetails.billingAccountDataFromOwner ?
                            <BillingAddressFormWhenPayerSameAsOwner
                                corporation={this.props.billingAccountDetails!.corporation!}
                                billingAccountInForm={this.props.billingAccountDetails!.billingAccountDataFromOwner!}/> :
                            <React.Fragment/>
                        }
                        <ServicesListByBillingAccountId servicesByBillingAccountId={servicesByBillingAccountId}/>
                    </div>
                )
            }
        } else {
            return <Loading/>
        }
    }
}
