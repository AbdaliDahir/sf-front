import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Button, Col, Container, FormGroup, Label, Row} from "reactstrap";
import FormDayInput from "../../../../components/Form/Date/FormDayInput";
import FormDateInput from "../../../../components/Form/Date/FormDateInput";
import FormSwitchInput from "../../../../components/Form/FormSwitchInput";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import ValidationUtils from "../../../../utils/ValidationUtils";
import GetBillingDayActRequestDTO from "../../../../model/acts/billing-day/GetBillingDayActRequestDTO";

interface Props {
    billingDay: GetBillingDayActRequestDTO,
    accountId: string,
    disableSubmit: boolean
}

export default class BillingDayForm extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    public getAvailableDays = (billingDay: GetBillingDayActRequestDTO) => {
        const availableDays: number[] = [];
        for (const availableDay of billingDay.billingDayList) {
            availableDays.push(availableDay.billingDay);
        }
        return availableDays;
    };

    public render(): JSX.Element {
        const {billingDay, accountId} = this.props;
        const availableDays = this.getAvailableDays(billingDay);
        return (
            <Container>
                <Col md={12}>
                    <Row>
                        <Col md={6} className="d-flex align-self-md-center p-2 text-center
                         justify-content-md-center justify-content-sm-between flex-md-column">
                            <p>
                                <dt><FormattedMessage id="acts.billing.day.accountId"/></dt>
                                <dd>{accountId}</dd>
                            </p>
                            <p>
                                <dt><FormattedMessage id="acts.billing.day.currentDay"/></dt>
                                <dd>{billingDay.currentPaymentDay}</dd>
                            </p>
                            <p>
                                <dt><FormattedMessage id="acts.billing.day.initialDay"/></dt>
                                <dd>{billingDay.initialPaymentDay}</dd>
                            </p>
                        </Col>
                        <Col md={6}>
                            <FormDayInput name="newBillingDay" id="newBillingDay" includeDays={availableDays}
                                          validations={{isRequired: ValidationUtils.notEmpty}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{size: 3}}>
                            <FormGroup>
                                <Label for="dueDate">
                                    <FormattedMessage id="global.dueDate"/>
                                    <FormDateInput peekNextMonth showMonthDropdown showYearDropdown
                                                   name="dueDate" id="dueDate" minDate={new Date()}/>
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col md={{size: 2}}>
                            <FormGroup>
                                <Label for="notification">
                                    <FormattedMessage id="global.notificationclient"/>
                                </Label>
                                <FormSwitchInput color="primary"
                                                 valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                                 valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                                 name="notification" id="notification"/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{size: 3}}>
                            <Button id="billingDayForm.submit.id" cols={6} color="primary" size="lg" block type="submit"
                                    disabled={this.props.disableSubmit}>
                                <FormattedMessage id="wizardform.submit"/>
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Container>
        )
    }
}
