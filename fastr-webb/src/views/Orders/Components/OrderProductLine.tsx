import React from "react";
import {Col, Row} from "reactstrap";
import OrderProduct from "../../../model/orders/OrderProduct";
import {Item} from "../../../model/orders/OrderContainers";
import * as moment from "moment";
import {BuyBackRecord} from "../../../model/orders/Order";
import { FormattedMessage } from "react-intl";


interface Props {
    product: Item,
    loanInfos: OrderProduct,
    buyBackRecord?: BuyBackRecord,
}

export default class OrderProductLine extends React.Component<Props> {

    constructor(props: Props) {
        super(props)
    }

    public getImage(): JSX.Element | null {
        if (this.props.product.smallPic) {
            return <div className=" d-flex device-container align-items-center border-right bg-gradient-pink radial h-100">
                <img alt={this.props.product.label}
                     src={this.props.product.smallPic}
                     className=""/>
            </div>
        } else {
            switch (this.props.loanInfos?.type) {
                case "MOBILE":
                    return (
                        <div className="h-100 border-right device-container bg-gradient-pink radial align-self-center">
                            <span className="d-flex p-3 h-100 justify-content-center">
                                <span className="icon-white w-100 icon-phone"/>
                            </span>
                        </div>
                    );
                case "ACCESSORY":
                    return (
                        <div className="h-100 border-right device-container bg-gradient-pink radial align-self-center">
                            <span className="d-flex p-3 h-100 justify-content-center">
                                <span className="icon-white w-100 icon-headphones"/>
                            </span>
                        </div>
                    );
                case "LAPTOP":
                    return (
                        <div className="h-100 border-right device-container bg-gradient-pink radial align-self-center">
                            <span className="d-flex p-3 h-100 justify-content-center">
                                <span className="icon-white w-100 icon-computer"/>
                            </span>
                        </div>
                    );
                case "MODEM":
                    return (
                        <div className="h-100 border-right device-container bg-gradient-pink radial align-self-center">
                            <span className="d-flex p-3 h-100 justify-content-center">
                                <span className="icon-white w-100 icon-fiber-modem"/>
                            </span>
                        </div>
                    );
                case "TV_DECODER":
                    return (
                        <div className="h-100 border-right device-container bg-gradient-pink radial align-self-center">
                            <span className="d-flex p-3 h-100 justify-content-center">
                                <span className="icon-white w-100 icon-tv"/>
                            </span>
                        </div>
                    );
                case "KEY":
                    return (
                        <div className="h-100 border-right device-container bg-gradient-pink radial align-self-center">
                            <span className="d-flex p-3 h-100 justify-content-center">
                                <span className="icon-white w-100 icon-modem"/>
                            </span>
                        </div>
                    );
                case "SIM_CARD":
                    return (
                        <div className="h-100 border-right device-container bg-gradient-pink radial align-self-center">
                            <span className="d-flex p-3 h-100 justify-content-center">
                                <span className="icon-white w-100 icon-sim-card"/>
                            </span>
                        </div>
                    );
                case "TABLET":
                    return (
                        <div className="h-100 border-right device-container bg-gradient-pink radial align-self-center">
                            <span className="d-flex p-3 h-100 justify-content-center">
                                <span className="icon-white w-100 icon-tablet"/>
                            </span>
                        </div>
                    );
                case "UNKNOWN":
                default:
                    return (
                        <div className="h-100 border-right device-container bg-gradient-pink radial align-self-center">
                            <span className="d-flex p-3 h-100 justify-content-center">
                                <span className="icon-white w-100 icon-help"/>
                            </span>
                        </div>
                    );
            }
        }
    }

    public render() {
        const product = this.props.product;
        const buyBackRecord = this.props.buyBackRecord;
        const logisticStatusDate = product.logisticStatusDate ? moment(product.logisticStatusDate).format("DD/MM/YYYY") : ""
        return (
            <Row className="pb-2 mt-1 mb-1 flex-row align-items-center no-gutters border-bottom">
                <Col md={1} style={{
                    minHeight: "100%"
                }}>
                    {this.getImage()}
                </Col>
                <Col md={6} className="d-flex flex-column justify-content-between h-100 pl-4">
                    <span><h6>{product.label}</h6></span>
                    { buyBackRecord && buyBackRecord.purchasedDeviceSapCode === this.props.product.codeSap &&
                    <span className="font-size-xs">
                        <span className="font-size-m font-weight-bolder">
                           <FormattedMessage id={"buy.back.title"}/>
                        </span>
                        <span className="d-flex justify-content-between pr-3 font-weight-bolder">
                            <span>- <FormattedMessage id={"buy.back.mobile"}/>: {buyBackRecord?.brandLabel} {buyBackRecord?.modelLabel}</span>
                            <span>-{this.formatCurrencyCents(buyBackRecord?.evaluatedPriceIncludingTaxes?buyBackRecord.evaluatedPriceIncludingTaxes.toString():"0")}</span>
                        </span>
                        <span className="pl-3">
                            <FormattedMessage id={"buy.back.status"}/>: { buyBackRecord?.status? <FormattedMessage id={buyBackRecord?.status}/> : <FormattedMessage id={"BUY_BACK_STATUS_MISSING"}/>}
                        </span>
                        { buyBackRecord.bonusPriceIncludingTaxes != null && buyBackRecord.bonusPriceIncludingTaxes > 0 &&
                        <span>
                            <span className="d-flex justify-content-between pr-3 font-weight-bolder">
                                <span>- <FormattedMessage
                                    id={"buy.back.bonus.title"}/> {buyBackRecord?.bonusDeviceBrandLabel}</span>
                                <span>-{this.formatCurrencyCents(buyBackRecord?.bonusPriceIncludingTaxes + "")}</span>
                            </span>
                            { buyBackRecord?.bonusStatus &&
                            <span className="pl-3">
                                <FormattedMessage id={"buy.back.bonus.status"}/>: <FormattedMessage id={buyBackRecord?.bonusStatus}/>
                                {buyBackRecord?.bonusCancellationReason &&
                                <span> (<FormattedMessage id={"buy.back.bonus.cancellation.motif"}/>: "<FormattedMessage id={buyBackRecord?.bonusCancellationReason}/>")</span>}
                            </span>
                            }
                        </span>
                        }
                    </span>}
                </Col>
                <Col md={5} className="d-flex justify-content-between h-100 pl-4">
                        <span className="font-weight-normal">{product?.logisticStatusLabel} {logisticStatusDate ? `- ${logisticStatusDate}` : ""}</span>
                        <span className="ml-2" style={{minWidth:"60px"}}>{this.formatCurrencyCents(product?.itemPrice!)}</span>
                </Col>
            </Row>
        )
    }

    private formatCurrencyCents(amountInCents:string):string{
        const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
        return amountInCents && currencyFormatter.format(JSON.parse(amountInCents)/100);
    }
}
