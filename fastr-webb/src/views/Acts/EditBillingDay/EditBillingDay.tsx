import * as React from "react";
import {FormattedMessage} from "react-intl";

import {connect} from "react-redux";
import {Col, Container, Row, UncontrolledAlert} from "reactstrap";
import {toggleBlockingUI} from "src/store/actions/UIActions";
import FormDayInput from "../../../components/Form/Date/FormDayInput";
import FormHiddenInput from "../../../components/Form/FormHiddenInput";
// Components
import GetBillingDayActRequestDTO from "../../../model/acts/billing-day/GetBillingDayActRequestDTO";
import ActService from "../../../service/ActService";
import {AppState} from "../../../store";
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import ClientContextProps from "../../../store/types/ClientContext";
import ValidationUtils from "../../../utils/ValidationUtils";
import {Payload} from "../../Cases/Create/CreateCasePage";
import {Service} from "../../../model/service";

type PropType = ClientContextProps<Service>

interface Props extends PropType {
    data: Payload
    toggleBlockingUI: () => void
}

interface State {
    disabled: boolean,
    billingDay: GetBillingDayActRequestDTO,
    accountId: string,
    serviceUnavailable: boolean
}

class EditBillingDay extends React.Component<Props, State> {
    private actService: ActService = new ActService(true);

    constructor(props: Props) {
        super(props);
        this.state = {
            disabled: true,
            accountId: '',
            billingDay: {currentPaymentDay: 0, initialPaymentDay: 0, billingDayList: [], error: ''},
            serviceUnavailable: false
        }
    }

    public componentWillMount = async () => {
        this.props.toggleBlockingUI();

        try {
            if (this.props.client.loading || this.props.client.error) {
                throw new Error("Client is not fetch. Mostly a development error")
            }
            const service = this.props.client.service!;
            const response: GetBillingDayActRequestDTO = await this.actService.getEclientBillingDay(service.billingAccount.id);
            this.props.toggleBlockingUI()
            this.setState({billingDay: response, accountId: service.billingAccount.id});

        } catch (error) {
            error = await error;

            this.setState({serviceUnavailable: true})
            this.props.toggleBlockingUI()
        }
    };

    public getAvailableDays = (billingDay: GetBillingDayActRequestDTO) => {
        const availableDays: number[] = [];
        for (const availableDay of billingDay.billingDayList) {
            availableDays.push(availableDay.billingDay);
        }

        return availableDays;
    };

    public render(): JSX.Element {
        const {billingDay, accountId, serviceUnavailable} = this.state;
        const availableDays = this.getAvailableDays(billingDay);
        return (
            <Container>
                <Col md={12}>

                    {(!serviceUnavailable && (!billingDay.billingDayList || billingDay.billingDayList.length === 0)) &&
                    <Row><Col md={12}><UncontrolledAlert color="warning" fade={false}><FormattedMessage
                        id="acts.billing.day.unavailable.list"/>{billingDay.error}</UncontrolledAlert></Col></Row>}

                    {!!serviceUnavailable &&
                    <Row><Col md={12}><UncontrolledAlert color="danger" fade={false}><FormattedMessage
                        id="acts.billing.day.get.ko"/></UncontrolledAlert></Col></Row>}

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
                        <FormHiddenInput name="accountId" id="accountId" value={this.state.accountId}/>
                        <FormHiddenInput name="currentDay" id="currentDay"
                                         value={this.state.billingDay.currentPaymentDay.toString()}/>
                        <FormHiddenInput name="initialDay" id="initialDay"
                                         value={this.state.billingDay.initialPaymentDay.toString()}/>
                    </Row>
                </Col>
            </Container>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    client: {
        data: state.client.data,
        loading: state.client.loading,
        error: state.client.error,
        service: state.client.service
    }
});

const mapDispatchToProps = {
    loadClient: fetchAndStoreClient,
    toggleBlockingUI
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBillingDay)
