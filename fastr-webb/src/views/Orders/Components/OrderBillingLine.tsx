import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import React from "react";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import OrderContextProps from "../../../store/types/OrderContext";
import {BillingAccountMethod, CreditCardMethod, SEPAMethod} from "../../../model/person/billing";
import ServiceUtils from "../../../utils/ServiceUtils";

class OrderBillingLine extends React.Component<OrderContextProps> {

    public renderCreditCard(method: CreditCardMethod) {
        if (method) {
            return <React.Fragment>
                <dl>
                    <div className="contact-info">
                        <dt className="pr-3"><i className="icon icon-user"/>
                        </dt>
                        <dd>
                            <h6>Payeur</h6>
                            {method.owner}
                        </dd>
                    </div>
                    <div className="contact-info">
                        <dt className="pr-3"><i className="icon icon-euro"/>
                        </dt>
                        <dd>
                            <h6>Numéro de carte</h6>
                            {method.cardNumber}
                        </dd>
                    </div>
                    <div className="contact-info">
                        <dt className="pr-3"><i className="icon icon-document"/>
                        </dt>
                        <dd>
                            <h6>Type</h6>
                            {method.type}
                        </dd>
                    </div>
                </dl>
            </React.Fragment>
        } else {
            return <React.Fragment>Pas d'informations</React.Fragment>
        }

    }

    public renderSepa(method: SEPAMethod) {
        if (method) {
            return <React.Fragment>
                <dl>
                    <div className="contact-info">
                        <dt className="pr-3"><i className="icon icon-user"/>
                        </dt>
                        <dd>
                            <h6>Payeur</h6>
                            {method.owner}
                        </dd>
                    </div>
                    <div className="contact-info">
                        <dt className="pr-3"><i className="icon icon-document"/>
                        </dt>
                        <dd>
                            <h6>Banque</h6>
                            {method.bankName}
                        </dd>
                    </div>
                    <div className="contact-info">
                        <dt className="pr-3"><i className="icon icon-euro"/>
                        </dt>
                        <dd>
                            <h6>IBAN</h6>
                            {ServiceUtils.hideIban(method.iban)}
                        </dd>
                    </div>
                    <div className="contact-info">
                        <dt className="pr-3"><i className="icon icon-euro"/>
                        </dt>
                        <dd>
                            <h6>BIC</h6>
                            {method.bic}
                        </dd>
                    </div>
                </dl>
            </React.Fragment>
        } else {
            return <React.Fragment>Pas d'informations</React.Fragment>
        }
    }

    public renderBillingMethod(method: BillingAccountMethod, title: string) {
        if (method === "CREDIT_CARD") {
            return (
                <Col>
                    <h5>{title}</h5>
                    {this.renderCreditCard(this.props.order.data!.billingInformation.creditCard)}
                </Col>
            )
        } else if (method === "SEPA") {
            return (
                <Col>
                    <h5>{title}</h5>
                    {this.renderSepa(this.props.order.data!.billingInformation.sepa)}
                </Col>
            )
        } else {
            return <React.Fragment>Pas d'informations</React.Fragment>
        }
    }


    public render(): JSX.Element {
        if (this.props.order.data && this.props.order.data.billingInformation) {
            const billingInfo = this.props.order.data.billingInformation;
            return (
                <Card style={{
                    borderTopRightRadius: 0,
                    borderTopLeftRadius: 0,
                    boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.15)"
                }}>
                    <CardHeader style={{
                        borderRadius: "initial",
                        backgroundColor: "#f1f1f1",
                        borderTop: 'none',
                        borderBottom: 'none'
                    }}>
                        <i className="icon-gradient icon-bill mr-2"/>
                        Informations de facturation
                    </CardHeader>
                    <CardBody>
                        <Row>
                            {billingInfo.recurrentBilling &&
                            <Col>
                                {this.renderBillingMethod(billingInfo.recurrentBilling, "Paiement mensuel")}
                            </Col>
                            }
                            {billingInfo.punctualBilling &&
                            <Col>
                                {this.renderBillingMethod(billingInfo.punctualBilling, "Paiement de la commande")}
                            </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>
            )
        } else {
            return <React.Fragment/>
        }
    }
}

const mapStateToProps = (state: AppState) => ({
    order: {
        data: state.order.data,
        loading: state.order.loading,
        error: state.order.error,
    },
});

export default connect(
    mapStateToProps,
)(OrderBillingLine);
