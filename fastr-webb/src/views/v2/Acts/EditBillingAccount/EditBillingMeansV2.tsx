import * as React from "react";
import {connect} from "react-redux";
import {Button, ButtonGroup, Card, CardBody, CardHeader, Col, ListGroup, Row} from "reactstrap";
import Collapse from "reactstrap/lib/Collapse";
import {FormattedMessage} from "react-intl";
import {RouteComponentProps} from "react-router";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import {AppState} from "../../../../store";
import ServiceUtils from "../../../../utils/ServiceUtils";
import {Service} from "../../../../model/service";
import ResultServiceLine from "../../../Search/ResultServiceLine";
import FormHiddenInput from "../../../../components/Form/FormHiddenInput";
import ChangingBillingMeansV2 from "./ChangingBillingMeansV2";

interface Props extends RouteComponentProps {
    adg
    // tslint:disable-next-line:no-any
    authorizations: any
    client: ClientContextSliceState
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
                <p className="mb-0">
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
        this.setState({
            collapseLinkedServices: this.getLinkedServices().length < 2
        });
    }

    public renderOtherBillingMethod(): JSX.Element {
        const hiddenIban = this.hideIban(this.props.client.service!.billingAccount.otherMethod.iban)
        const {billingAccount: {billingMethod, otherMethod: {owner, bic, bankName}}} = this.props.client.service!;
        return (
            <Col>
                <p className="mb-0">
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
        const {billingAccount: {billingMethod}} = this.props.client?.service! ? this.props.client?.service! : {billingAccount:{billingMethod:''}};
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
            return <ResultServiceLine client={this.props.client!.clientData!} key={e.id} service={e}/>
        })
    }

    public getLinkedServices = (): Service[] => {
        return !this.props.client?.clientData ? [] : this.props.client?.clientData?.services.filter(
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
                            <Row onClick={this.toggleBillingMethod}>
                                <Col md={10}>
                                    Moyen de paiement actuel
                                </Col>
                                <Col md={2}>
                                    <i id="editBillingMeans.toggleEditCurrentBillingMethod.button.id"
                                       className={"p-0 icon float-right " + (collapseBillingMethod ? "icon-down" : "icon-up")}/>
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
                            <Row onClick={this.toggleLinkedServices}>
                                <Col md={10}>
                                    <div>Services impactés du CF : <span> {this.props.client?.service && this.props.client?.service?.billingAccount?.id} </span> </div>
                                    {/* <div></div> */}
                                </Col>
                                <Col md={2}>
                                    <i id="editBillingMeans.toggleLinkedService.button.id"
                                       className={"p-0 icon float-right " + (collapseLinkedServices ? "icon-down" : "icon-up")}/>
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
        return (<ChangingBillingMeansV2 required={this.state.required}/>)
    }

    public render(): JSX.Element {
        const {required} = this.state;
        const isAuthorized: boolean = this.props.authorizations.indexOf("PAY_OTHER") > -1;
        return (
            <React.Fragment>
                {this.renderServicesData()}
                <ButtonGroup className={"d-flex justify-content-center align-items-center mt-3 mb-3"}>
                    <Button size={"sm"} color={"primary"} outline={!required} onClick={this.displayPaymentsByRIB} active={required}>
                        Prélèvement IBAN
                    </Button>
                    <Button size={"sm"} color={"primary"} outline={required} onClick={this.displayPaymentsOther} active={!required}
                            disabled={!isAuthorized}>
                        Autre / Chèque / TIP
                    </Button>
                </ButtonGroup>
                {this.renderBillingMeansAct()}
                <FormHiddenInput name="actType" id="actType"
                                 classNameToProps={"m-0"}
                                 value={required ? EditBillingType.IBAN.toString() : EditBillingType.OTHER.toString()}/>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    client: state.store.client.currentClient,
    authorizations: state.store.applicationInitialState.authorizations
});

export default connect(mapStateToProps)(EditBillingAccount)
