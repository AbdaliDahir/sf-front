import {Col, Row} from "reactstrap";
import React from "react";
import {OrderDeliveryDetails} from "../../../model/orders/OrderDelivery";
import {Address} from "../../../model/person";
import { FormattedDate } from "react-intl";

interface Props {
    delivery: OrderDeliveryDetails
}

export default class OrderColisDelivery extends React.Component<Props> {

    public renderAddress(address: Address) {
        if (address) {
            return (<React.Fragment>
                    {this.renderIfPresent(address.identityComplement)}
                    {this.renderIfPresent(address.address1)}
                    {this.renderIfPresent(address.address2)}
                    {address.zipcode} {address.city}<br/>
                </React.Fragment>
            )
        } else {
            return <React.Fragment/>
        }
    }

    public renderTrackingNumber() {
        if (this.props.delivery.trackingUrl?.startsWith("http")) {
            return <a target="_blank" rel="noopener noreferrer"
                      href={this.props.delivery.trackingUrl}>{this.props.delivery.trackingId}</a>
        } else {
            return <React.Fragment>{this.props.delivery.trackingId}</React.Fragment>
        }
    }


    public render(): JSX.Element {
        return (
            <Row>
                <Col md={this.props.delivery.openingHours ? 4 : 6}>
                    <div>
                        <div className="contact-info mb-4" style={{minHeight:"40px"}}>
                            <div className="d-flex">
                                <span className="mr-1"><i className="icon icon-document"/></span>
                                <span><h6>N° de suivi de colis</h6></span>
                            </div>
                            {this.renderTrackingNumber()}
                        </div>
                        {this.props.delivery.deliveryPointId &&
                            <div className="contact-info">
                                <div className="d-flex">
                                    <span className="mr-1"><i className="icon icon-computer"/></span>
                                    <span><h6>Code point de vente</h6></span>
                                </div>
                                {this.props.delivery.deliveryPointId}
                            </div>
                        }
                    </div>
                </Col>
                <Col md={this.props.delivery.openingHours ? 4 : 6}>
                    <dl>
                        {this.props.delivery.name &&
                            <div className="contact-info mb-4" style={{minHeight:"40px"}}>
                                <div className="d-flex">
                                    <span className="mr-1"><i className="icon icon-document"/></span>
                                    <span><h6>Nom</h6></span>
                                </div>
                                {this.props.delivery.name}
                            </div>
                        }
                        <div className="contact-info">
                            <div className="d-flex">
                                <span className="mr-1"><i className="icon icon-home"/></span>
                                <span><h6>Adresse de livraison</h6></span>
                            </div>
                            {this.renderAddress(this.props.delivery?.address!)}
                        </div>

                    </dl>
                </Col>
                {this.props.delivery.openingHours &&
                    <Col md={4}>
                        <dl>
                            <div className="contact-info">
                                <div className="d-flex">
                                    <span className="mr-1"><i className="icon icon-clock"/></span>
                                    <span><h6>Horaires</h6></span>
                                </div>
                                {this.props.delivery.openingHours}
                            </div>

                            {this.props.delivery.deliveryExpirationDate && <div className="contact-info mt-2">
                                <div className="d-flex">
                                    <span className="mr-1"><i className="icon icon-warning"/></span>
                                    <span><h6>Date limite de retrait</h6></span>
                                </div>
                                    <FormattedDate
                                        value={new Date(this.props.delivery.deliveryExpirationDate)}
                                        year="numeric"
                                        month="long"
                                        day="2-digit"
                                    />
                            </div>}
                        </dl>
                    </Col>
                }
            </Row>
        )
    }

    private renderIfPresent(element?: string): JSX.Element | null {
        if (element !== undefined && element !== null && element !== "") {
            return (<span>{element}<br/></span>)
        } else {
            return null
        }
    }

}
