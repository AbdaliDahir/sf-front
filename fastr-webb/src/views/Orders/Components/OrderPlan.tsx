import {Col, Row} from "reactstrap";
import React from "react";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import OrderContextProps from "../../../store/types/OrderContext";
import {FormattedDate} from "react-intl";

interface Props {
    color: string
}

class OrderPlan extends React.Component<Props & OrderContextProps> {

    public renderField(title: string, value: JSX.Element | string) {
        if (value) {
            return (
                <React.Fragment>
                    <h6>{title}</h6>
                    <p>{value}</p>
                </React.Fragment>)
        } else {
            return undefined;
        }
    }

    public renderPortability() {
        const plan = this.props.order!.data!.plan;
        if (plan.portabilityDate || plan.portabilityHour || plan.portabilityMsisdn) {
            return (<Col md={5}>
                {this.renderField("Date de portabilité", <FormattedDate
                    value={new Date(plan.portabilityDate)}
                    year="numeric"
                    month="long"
                    day="2-digit"
                />)}
                {this.renderField("Heure de portabilité", plan.portabilityHour)}
                {this.renderField("MSISDN porté", plan.portabilityMsisdn)}
            </Col>)
        } else {
            return undefined;
        }
    }

    public render(): JSX.Element {
        if (this.props.order.data && this.props.order.data.plan) {
            const order = this.props.order.data;
            const plan = this.props.order.data.plan;
            return (
                <Row className="m-3 ml-5">
                    <Col
                        className={`ml-5 price-screen price-screen-lg price-screen-${this.props.color}`}>
                        <div className="price-screen-content">
                            <div className="price-screen-shadow"/>
                            <div className="price-screen-head">{plan.offerName} {plan.offerDetails}</div>

                            {order.recurrentPrice !== 0 &&
                            <div className="price-screen-price-content">
                                <div className="price">
                                    <div className="price-content">
                                        <div className="price-value">{order.recurrentPrice}</div>
                                        <div className="price-detail">
                                            <div className="price-cents">{order.currency}</div>
                                            <div className="price-period">/Mois</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }
                            {plan.commitmentMonths > 0 ?
                                <div className="price-screen-baseline">
                                    Pendant {plan.commitmentMonths} mois <br/>
                                </div>
                                : ""}
                        </div>
                    </Col>
                    {this.renderPortability()}
                </Row>
            )
        } else {
            return <React.Fragment/>;
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
    mapStateToProps
)(OrderPlan);
