import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Col, FormGroup, Label, Row} from "reactstrap";
import FormSwitchInput from "../../components/Form/FormSwitchInput";
import {translate} from "../Intl/IntlGlobalProvider";
import FormDateInput from "../../components/Form/Date/FormDateInput";

interface Props {
    defaultValue: { dueDate: Date, notification: boolean }

    title: string
}

export default class ActOptions extends React.Component<Props> {

    public render(): JSX.Element {
        const {defaultValue: {dueDate, notification}} = this.props;
        return (
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label for="dueDate">
                            <FormattedMessage id="global.dueDate"/>
                            <FormDateInput peekNextMonth showMonthDropdown showYearDropdown
                                           name="dueDate" id="dueDate" minDate={new Date()}
                                           value={dueDate}/>
                        </Label>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="notification">
                            <FormattedMessage id="global.notificationclient"/>
                        </Label>
                        <FormSwitchInput color="primary"
                                         valueOn={translate.formatMessage({id: "global.dialog.yes"})}
                                         valueOff={translate.formatMessage({id: "global.dialog.no"})}
                                         name="notification"

                                         id="notification"
                                         value={notification}/>
                    </FormGroup>
                </Col>
            </Row>
        )
    }
}
