import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, Container, FormGroup, Label, Row} from "reactstrap";

// Components
import FormBICInput from "../../../../components/Form/Bank/FormBICInput";
import FormIBANInput from "../../../../components/Form/Bank/FormIBANInput";
import FormTextInput from "../../../../components/Form/FormTextInput";

interface Props {

    defaultValue: { oldBillingMethods: { bankDetails: { iban, bic, ets } } }
}


export default class BankDetailsForm extends React.Component<Props> {
    public render(): JSX.Element {
        const { defaultValue: {oldBillingMethods: {bankDetails: {iban, bic, ets}}}} = this.props;
        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="bankDetails.iban">
                                <FormattedMessage id="acts.billing.methods.iban"/>
                            </Label>
                            <FormIBANInput name="bankDetails.iban" id="bankDetails.iban"
                                           defaultValue={iban}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Label for="bankDetails.bic">
                            <FormattedMessage id="acts.billing.methods.bic"/>
                        </Label>
                        <FormGroup>
                            <FormBICInput name="bankDetails.bic" id="bankDetails.bic"
                                          defaultValue={bic}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="bankDetails.ets">
                                <FormattedMessage id="acts.billing.methods.ets"/>
                            </Label>
                            <FormTextInput name="bankDetails.ets" id="bankDetails.ets"
                                           value={ets}/>
                        </FormGroup>
                    </Col>
                </Row>
            </Container>
        )
    }
}
