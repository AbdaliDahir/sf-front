import * as React from "react";
import {connect} from "react-redux";
import {Button, ButtonGroup, Card, CardBody, CardHeader, Col, ListGroup, Row} from "reactstrap";
import Collapse from "reactstrap/lib/Collapse";
import Container from "reactstrap/lib/Container";
import FormHiddenInput from "../../../components/Form/FormHiddenInput";
import {Service} from "../../../model/service";
import {AppState} from "../../../store";
import {fetchAndStoreClient} from "../../../store/actions/ClientContextActions";
import ClientContextProps from "../../../store/types/ClientContext";
import ServiceUtils from "../../../utils/ServiceUtils";
import ResultServiceLine from "../../Search/ResultServiceLine";
import BillingAccountUngroup from "./BillingAccountUngroup";
import GroupBillingAccount from "./GroupBillingAccount";
import {FormattedMessage} from "react-intl";
import {translate} from "../../../components/Intl/IntlGlobalProvider";

interface State {
    billingMethod?: string
    group: boolean
    ungroup: boolean
    collapseBillingMethod: boolean
    collapseLinkedServices: boolean
}

export enum EditBillingType {
    GROUP, UNGROUP
}

interface Props extends ClientContextProps<Service> {
    disableSubmit: (disable: boolean) => void
}

class EditBillingAccount extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            billingMethod: undefined,
            group: false,
            ungroup: false,
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
        return <React.Fragment/>;
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
                return this.renderSEPABillingMethod();

            case "CREDIT_CARD" :
                return this.renderCreditCardBillingMethod();

            case "OTHER" :
                return this.renderOtherBillingMethod();

            default:
                return <span/>
        }
    }

    public renderLinkedServices(): JSX.Element | JSX.Element[] {
        const linkedServices: Service[] = this.props.client.data!.services.filter(
            e => !ServiceUtils.isFixe(e) && e.billingAccount.id === this.props.client.service!.billingAccount.id)

        if (linkedServices.length === 0) {
            return (<span>Aucun</span>)
        }

        return linkedServices.map(e => {
            return <ResultServiceLine client={this.props.client!.data!} key={e.id} service={e}/>
        })
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
            <Row>
                <Col md={6}>
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col md={11}>
                                    Moyen de paiement actuel
                                </Col>
                                <Col md={1}>
                                    <Button id="editBillingAccount.toggleBillingMethod.button.id" color="primary"
                                            className="btn-sm  p-1" onClick={this.toggleBillingMethod}>
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


                <Col md={6}>
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col md={11}>
                                    Services actuels du CF {this.props.client.service!.billingAccount.id}
                                </Col>
                                <Col md={1}>
                                    <Button id="editBillingAccount.toggleLinkedServices.button.id" color="primary"
                                            className="btn-sm  p-1" onClick={this.toggleLinkedServices}>
                                        <span className="icon-white icon-down m-0 p-0"/>
                                    </Button>
                                </Col>
                            </Row>
                        </CardHeader>

                        <Collapse isOpen={!collapseLinkedServices}>
                            <CardBody>
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

    public getGroupEligibleServices = () => {
        return this.props.client.data!.services.filter(e => !ServiceUtils.isFixe(e)
            && e.billingAccount.id !== this.props.client.service!.billingAccount.id && !e.billingAccount.haveUnPaid);
    }

    public displayGroupAct = () => {
        this.props.disableSubmit(false);
        this.setState({group: true, ungroup: false})
    }

    public displayUngroupAct = () => {
        this.props.disableSubmit(false);
        this.setState({group: false, ungroup: true})
    }

    public renderAct(): JSX.Element {
        if (this.state.group) {
            return <GroupBillingAccount/>
        } else if (this.state.ungroup) {
            return <BillingAccountUngroup/>
        }
        return <React.Fragment/>
    }

    public render(): JSX.Element {
        const {group, ungroup} = this.state
        if (!group && !ungroup) {
            this.props.disableSubmit(true);
        }
        return (
            <Container id="EditBillingAccountADG.container.id">

                {this.renderServicesData()}
                <Row>
                    <div className="d-flex mb-3 mt-4 ml-4">
                        <h6>{translate.formatMessage({id: "act.edit.billing.account.groupOrUngroup"})}</h6>
                    </div>
                </Row>
                <ButtonGroup className={"d-flex justify-content-center align-items-center"}>
                    <Button id="editBillingAccount.displayGroupAct.button.id" color="primary" active={group}
                            onClick={this.displayGroupAct}>Grouper</Button>
                    <Button id="editBillingAccount.displayUngroupAct.button.id" color="primary" active={ungroup}
                            onClick={this.displayUngroupAct}>Dégrouper</Button>
                </ButtonGroup>
                {this.renderAct()}

                <FormHiddenInput name="actType" id="actType"
                                 value={group ? EditBillingType.GROUP.toString() : EditBillingType.UNGROUP.toString()}/>
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
    }
});

const mapDispatchToProps = {
    loadClient: fetchAndStoreClient
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBillingAccount)
