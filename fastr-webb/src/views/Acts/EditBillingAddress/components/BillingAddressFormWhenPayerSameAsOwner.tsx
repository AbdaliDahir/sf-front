import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, Label, Row} from "reactstrap";
import FormTextInput from "../../../../components/Form/FormTextInput";
import {BillingAccount} from "../../../../model/person/billing";
import LocaleUtils from "../../../../utils/LocaleUtils";

interface Props {
    corporation: boolean
    billingAccountInForm: Partial<BillingAccount>,
}

interface State {
    billingAccountInForm: Partial<BillingAccount>,
}

export default class BillingAddressFormWhenPayerSameAsOwner extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            billingAccountInForm: this.props.billingAccountInForm,
        }
    }

    public componentWillUpdate = (prevProps: Props, prevState: State) => {
        if (prevProps.billingAccountInForm && prevProps.billingAccountInForm !== this.state.billingAccountInForm) {
            this.setState({billingAccountInForm: prevProps.billingAccountInForm})
        }
    };

    public render(): JSX.Element {
        const {billingAccountInForm} = this.state;
        if (billingAccountInForm && billingAccountInForm.payer) {
            const {address} = this.state.billingAccountInForm.payer!;
            return (
                <div>
                    <Row>
                        <Col sm={12} lg={2}>
                            <Label for="address.address1">
                                <FormattedMessage id="global.address1"/>
                            </Label>
                        </Col>
                        <Col sm={12} lg={10}>
                            <FormTextInput name="act.address.address1"
                                           id="act.address.address1"
                                           value={address.address1 + " " + address.zipcode + " " + address.city + " " + LocaleUtils.getCountry(address.countryCode!)}
                                           bsSize={"sm"}
                                           readOnly/>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12} lg={2}>
                            <Label for="address2">
                                <FormattedMessage id="global.address.addressComplement"/>
                            </Label>
                        </Col>
                        <Col sm={12} lg={10}>
                            <FormTextInput uppercase
                                           name="act.address.address2"
                                           id="act.address.address2"
                                           value={address ? address.address2 : ""}
                                           bsSize={"sm"}
                                           readOnly/>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} lg={2}>
                            <Label for="identityComplement">
                                <FormattedMessage id="global.address.identityComplement"/>
                            </Label>
                        </Col>
                        <Col sm={12} lg={10}>
                            <FormTextInput uppercase
                                           name="act.address.identityComplement"
                                           id="act.address.identityComplement"
                                           value={address ? address.identityComplement : ""}
                                           bsSize={"sm"}
                                           readOnly/>
                        </Col>
                    </Row>
                </div>
            )
        } else {
            return <React.Fragment/>
        }
    }
}
