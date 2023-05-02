import * as React from "react";
import {connect} from "react-redux";
import {Button, ButtonGroup, Card, CardBody, CardHeader, Col, ListGroup, Row} from "reactstrap";
import Collapse from "reactstrap/lib/Collapse";
import Container from "reactstrap/lib/Container";
import {Service} from "../../../model/service/Service";
import {AppState} from "../../../store";
import ClientContextProps from "../../../store/types/ClientContext";
import ServiceUtils from "../../../utils/ServiceUtils";
import ResultServiceLine from "../../Search/ResultServiceLine";
import ChangingBillingMeans from "./ChangingBillingMeans";
import {fetchAndStoreAuthorizations} from "../../../store/actions";
import {RouteComponentProps} from "react-router";
import FormHiddenInput from "../../../components/Form/FormHiddenInput";
import {FormattedMessage} from "react-intl";
import SessionService from "../../../service/SessionService";

type PropType = ClientContextProps<Service>

interface Props extends PropType ,RouteComponentProps{
    adg
    fetchAndStoreAuthorizations: (sessionId) => void
    // tslint:disable-next-line:no-any
    authorization: any
}

interface State {
    billingMethod?: string
    required: boolean
    collapseBillingMethod: boolean
    collapseLinkedServices: boolean
}

export enum EditBillingType {
    IBAN, OTHER
}


class EditBillingAccount extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            billingMethod: undefined,
            required: true,
            collapseBillingMethod: true,
            collapseLinkedServices: true
        }
    }

    public hideIban(iban: string) {
        return ServiceUtils.hideIban(iban);
    }

    public renderSEPABillingMethod(): JSX.Element {
        const hiddenIban = this.hideIban(this.props.client.service!.billingAccount.sepaMethod.iban)
        const {billingAccount: {billingMethod, sepaMethod: {owner, bic, bankName}}} = this.props.client.service!;
        return (
            <Col>
                <p>
                    <Row>
                        <Col md={4}>
                            <strong>Titulaire</strong>
                        </Col>
                        <Col md={8}>
                            {owner}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <strong>Type</strong>
                        </Col>
                        <Col md={8}>
                            <FormattedMessage id={billingMethod}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <strong>IBAN</strong>
                        </Col>
                        <Col md={8}>
                            {hiddenIban}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <strong>BIC</strong>
                        </Col>
                        <Col md={8}>
                            {bic}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <strong>Ets</strong>
                        </Col>
                        <Col md={8}>
                            {bankName}
                        </Col>
                    </Row>
                </p>
            </Col>
        )
    }

    public renderCreditCardBillingMethod(): JSX.Element {
        return <div/>;
    }

    public async componentDidMount() {
        const sessionId = SessionService.getSession();
        if (this.props.authorization.authorizations.length === 0) {
            await this.props.fetchAndStoreAuthorizations(sessionId)
        }
        this.setState({
            collapseLinkedServices: this.getLinkedServices().length >= 2 ? false : true});
    }

    public renderOtherBillingMethod(): JSX.Element {
        const hiddenIban = this.hideIban(this.props.client.service!.billingAccount.otherMethod.iban)
        const {billingAccount: {billingMethod, otherMethod: {owner, bic, bankName}}} = this.props.client.service!;
        return (
            <Col>
                <p>
                    <Row>
                        <Col md={3}>
                            <strong>Titulaire</strong>
                        </Col>
                        <Col md={9}>
                            {owner}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <strong>Type</strong>
                        </Col>
                        <Col md={9}>
                            <FormattedMessage id={billingMethod}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <strong>IBAN</strong>
                        </Col>
                        <Col md={9}>
                            {hiddenIban}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <strong>BIC</strong>
                        </Col>
                        <Col md={9}>
                            {bic}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <strong>Ets</strong>
                        </Col>
                        <Col md={9}>
                            {bankName}
                        </Col>
                    </Row>
                </p>
            </Col>
        )
    }

    public renderBillingMethod(): JSX.Element {
        const {billingAccount: {billingMethod}} = this.props.client.service!;
        switch (billingMethod) {
            case "SEPA" :
                return this.renderSEPABillingMethod()

            case "CREDIT_CARD" :
                return this.renderCreditCardBillingMethod()

            case "OTHER" :
                return this.renderOtherBillingMethod()

            default:
                return <span/>
        }
    }

    public renderLinkedServices(): JSX.Element | JSX.Element[] {
        const linkedServices: Service[] = this.getLinkedServices();

        if (linkedServices.length === 0) {
            return (<span>Aucun</span>)
        }

        return linkedServices.map(e => {
            return <ResultServiceLine client={this.props.client!.data!} key={e.id} service={e}/>
        })
    }

    public getLinkedServices = (): Service[] => {
        return this.props.client.data!.services.filter(
            e => e.billingAccount.id === this.props.client.service!.billingAccount.id)
    }

    public toggleBillingMethod = () => {
        this.setState(prevState => ({collapseBillingMethod: !prevState.collapseBillingMethod}))
    }

    public toggleLinkedServices = () => {
        this.setState(prevState => ({collapseLinkedServices: !prevState.collapseLinkedServices}))
    }

    public renderServicesData(): JSX.Element {
        const {collapseBillingMethod, collapseLinkedServices} = this.state
        return (
            <Row id="editLinkedService.bloc.id">
                <Col md={7}>
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col md={10}>
                                    Moyen de paiement actuel
                                </Col>
                                <Col md={2}>
                                    <Button color="primary" className="btn-sm  p-1" id="editBillingMeans.toggleEditCurrentBillingMethod.button.id" onClick={this.toggleBillingMethod}>
                                        <span className="icon-white icon-down m-0 p-0"/>
                                    </Button>
                                </Col>
                            </Row>
                        </CardHeader>

                        <Collapse isOpen={!collapseBillingMethod}>
                            <CardBody>
                                <Row>
                                    {this.renderBillingMethod()}
                                </Row>
                            </CardBody>
                        </Collapse>
                    </Card>
                </Col>


                <Col md={5}>
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col md={10}>
                                    <div>Services impactés du CF</div>
                                    <div>{this.props.client.service && this.props.client.service.billingAccount.id}</div>
                                </Col>
                                <Col md={2}>
                                    <Button color="primary" className="btn-sm  p-1" id="editBillingMeans.toggleLinkedService.button.id"
                                        onClick={this.toggleLinkedServices}>
                                        <span className="icon-white icon-down m-0 p-0"/>
                                    </Button>
                                </Col>
                            </Row>
                        </CardHeader>

                        <Collapse isOpen={!collapseLinkedServices}>
                            <CardBody id="editBillingMeans.linkedService.list.id">
                                <ListGroup flush>
                                    {this.renderLinkedServices()}
                                </ListGroup>
                            </CardBody>
                        </Collapse>
                    </Card>
                </Col>
            </Row>
        )
    }


    public displayPaymentsByRIB = () => {
        this.setState({required: true})
    }

    public displayPaymentsOther = () => {
        this.setState({required: false})
    }

    public renderBillingMeansAct(): JSX.Element {
        return (<ChangingBillingMeans required={this.state.required}/>)
    }

    public render(): JSX.Element {
        const {required} = this.state;
        const isAuthorized : boolean = this.props.authorization.authorizations.indexOf("PAY_OTHER") > -1;
        return (
            <Container>
                {this.renderServicesData()}
                <ButtonGroup className={"d-flex justify-content-center align-items-center mt-5 mb-3"}>
                    <Button color="primary" onClick={this.displayPaymentsByRIB} active={required}>Prélèvement IBAN</Button>
                    <Button color="primary" onClick={this.displayPaymentsOther} active={!required} disabled={!isAuthorized}>Autre / Chèque / TIP</Button>
                </ButtonGroup>
                {this.renderBillingMeansAct()}
                <FormHiddenInput name="actType" id="actType"
                                 value={required ? EditBillingType.IBAN.toString() : EditBillingType.OTHER.toString()}/>
            </Container>
        )
    }

}

const mapStateToProps = (state: AppState) => ({
    client: {
        data: state.client.data,
        loading: state.client.loading,
        error: state.client.error,
        service: state.client.service,
        serviceId: state.client.serviceId
    },
    authorization: state.authorization
});


export default connect(mapStateToProps, {fetchAndStoreAuthorizations})(EditBillingAccount)