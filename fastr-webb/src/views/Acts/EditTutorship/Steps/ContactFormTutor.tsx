import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, Container, FormGroup, Label, Row} from "reactstrap";
import FormPhoneInput from "../../../../components/Form/Phone/FormPhoneInput";
import FormTextInput from "../../../../components/Form/FormTextInput";
import ValidationUtils from "../../../../utils/ValidationUtils";

interface Props {
    title: string,
    // tslint:disable-next-line:no-any TODO: typage
    defaultValue?: any
}

export default class ContactForm extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props);
    }

    public render(): JSX.Element {
        const {defaultValue: {phone, cellphone, email}, } = this.props;
        return (
            <Container>
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="phone"><FormattedMessage id="global.phone"/><span className="text-danger">*</span></Label>
                            <FormPhoneInput
                                id={"phone"}
                                name={"phone"}
                                value={phone}
                                validations={{isRequired: ValidationUtils.notEmpty}}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="cellphone"><FormattedMessage id="global.cellphone"/><span className="text-danger">*</span></Label>
                            <FormPhoneInput
                                id={"cellphone"}
                                name={"cellphone"}
                                value={cellphone}
                                validations={{isRequired: ValidationUtils.notEmpty}}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="email"><FormattedMessage id="EMAIL"/><span className="text-danger">*</span></Label>

                            <FormTextInput id={"email"} name={"email"}  value={email}
                                           validations={{isEmail: true, isRequired: ValidationUtils.notEmpty}}
                                           validationErrors={{
                                               isEmail: 'Veuillez renseigner une adresse email correcte',
                                           }}/>
                        </FormGroup>
                    </Col>
                </Row>
            </Container>
        )
    }
}
