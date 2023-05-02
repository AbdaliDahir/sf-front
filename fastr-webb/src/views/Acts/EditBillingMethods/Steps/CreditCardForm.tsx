import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, Container, FormGroup, Label, Row} from "reactstrap";
import Cards, {Focused} from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import FormCreditCardDateInput from "../../../../components/Form/Bank/FormCreditCardDateInput";
import FormCreditCardInput from "../../../../components/Form/Bank/FormCreditCardInput";
import FormTextInput from "../../../../components/Form/FormTextInput";
import Payment from "payment";
import CreditCard from "../../../../model/billing/CreditCard";
import {PassDownProps} from "formsy-react/dist/Wrapper";

type PropType = PassDownProps

interface Props extends PropType {
    defaultValue: { creditCard: CreditCard }
}

interface State {
    number: string
    owner: string
    expiry: string
    focused: Focused
}

export default class CreditCardForm extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        const {defaultValue: {creditCard: {name: nameFormProps, expiry: expiryFormProps, number: numberFormProps}}} = this.props;
        this.state = {
            owner: nameFormProps,
            number: numberFormProps,
            expiry: expiryFormProps,
            focused: "number"
        }
    }

    public componentDidMount() {
        const numberElement: HTMLInputElement | null = document.querySelector('[name="number"]');
        const cardExpiry: HTMLInputElement | null = document.querySelector('[name="expiry"]');
        if (numberElement !== null) {
            Payment.formatCardNumber(numberElement);
        }
        if (cardExpiry !== null) {
            Payment.formatCardExpiry(cardExpiry);
        }
    }

    public changeCardNumber = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            number: event.currentTarget.value.replace(/ /g, '')
        })
    };

    public changeCardOwner = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            owner: event.currentTarget.value
        })
    };

    public changeCardExpiry = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            expiry: event.currentTarget.value.replace(/ |\//g, '')
        })
    };

    public changeFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        switch (event.currentTarget.name) {
            case "number":
                this.setState({
                    focused: "number"
                });
                break;
            case "expiry":
                this.setState({
                    focused: "expiry"
                });
                break;
            case "owner":
                this.setState({
                    focused: "name"
                });
                break;
            default:
                this.setState({
                    focused: "number"
                });
        }
    };


    public render(): JSX.Element {
        const {owner, number: numberFromState, expiry: expiryFromState, focused: focusedFromState} = this.state;

        return (
            <Container>
                <Row>
                    <Col md={6}>
                        <Cards
                            cvc={""}
                            name={owner}
                            number={numberFromState}
                            expiry={expiryFromState}
                            focused={focusedFromState}
                        />
                    </Col>

                    <Col md={6}>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="creditCard.number">
                                        <FormattedMessage id="acts.billing.methods.cardNumber"/>
                                    </Label>
                                    <FormCreditCardInput onFocus={this.changeFocus}
                                                         onChange={this.changeCardNumber}
                                                         name="creditCard.number" id="creditCard.number"
                                                          defaultValue={numberFromState}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={8}>
                                <Label for="creditCard.name">
                                    <FormattedMessage id="acts.billing.methods.owner"/>
                                </Label>
                                <FormGroup>
                                    <FormTextInput onFocus={this.changeFocus}
                                                   onChange={this.changeCardOwner}
                                                   name="creditCard.name" id="creditCard.name"
                                                   value={owner}/>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="creditCard.expiry">
                                        <FormattedMessage id="acts.billing.methods.expiration"/>
                                    </Label>
                                    <FormCreditCardDateInput onFocus={this.changeFocus}
                                                             onChange={this.changeCardExpiry}
                                                             name="creditCard.expiry" id="creditCard.expiry"
                                                              defaultValue={expiryFromState}/>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}
