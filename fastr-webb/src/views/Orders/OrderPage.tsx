import React from "react";
import {RouteProps} from "react-router";
import {Alert, Button, Card, CardBody, CardHeader, Col, Container, Navbar, NavbarBrand, Row} from "reactstrap";
import OrderProductLine from "./Components/OrderProductLine";
import redbysfr from "src/img/redbysfr.svg"
import sfr from "src/img/sfr-red.svg"
import OrderPlan from "./Components/OrderPlan";
import OrderBillingLine from "./Components/OrderBillingLine";
import OrderStatus from "./Components/OrderStatus";
import {AppState} from "../../store";
import {connect} from "react-redux";
import {fetchAndStoreOrder} from "../../store/actions/OrderActions";
import OrderContextProps from "../../store/types/OrderContext";
import * as queryString from "querystring";
import {ParsedUrlQuery} from "querystring";
import Loading from "../../components/Loading";
import Order from "../../model/orders/Order";
import {OrderContainers, coli} from "../../model/orders/OrderContainers";
import OrderProduct from "../../model/orders/OrderProduct";
import OrderColisCardToggle from "./Components/OrderColisCardToggle";
import OrderColisDelivery from "./Components/OrderColisDelivery"
import "./OrderPage.scss"
import {OrderDeliveryDetails} from "../../model/orders/OrderDelivery";
import FdpLoan from "../../model/orders/FdpLoan";

interface State {
    color: string
    containersArr?: any[]
    error?: string
    opened?: boolean
    openedStatus?: string[]
    isFirstTime: boolean
}


class OrderPage extends React.Component<RouteProps & OrderContextProps, State> {

    constructor(props: OrderContextProps) {
        super(props);
        this.state = {
            color: "primary",
            opened: false,
            openedStatus: [],
            isFirstTime: true
        }
    }

    public getOrderId(queryParams: string): string | undefined {
        const query: ParsedUrlQuery = queryString.parse(queryParams.replace("?", ""));
        if (query === undefined || query.orderNumber === undefined) {
            return undefined;
        }
        return query.orderNumber.toString()
    }

    public componentDidMount(): void {
        const orderId = this.getOrderId(this.props.location!.search);
        if (orderId) {
            this.props.loadOrder(orderId)
        } else {
            this.setState({
                error: "Le numéro de commande est manquant. "
            })
        }
        this.setState({
            openedStatus: this.renderInitialOpenedStatus()
        })
    }

    public getColor() {
        if (this.props.order.data) {
            if (this.props.order?.data?.plan?.brand === "RED") {
                return "redbysfr";
            } else {
                return "primary";
            }
        } else {
            return "primary";
        }
    }

    public getBrand() {
        if (this.props.order.data && this.props.order.data.plan) {
            if (this.props.order.data.plan.brand === "RED") {
                return redbysfr;
            } else {
                return sfr;
            }
        }
    }

    public close() {
        window.close();
    }

    public toggleOpened = (bool, i) => {
        this.setState({
            openedStatus: this.renderInitialOpenedStatus()
        })
        let openedStatusArr = this.state.openedStatus!
        openedStatusArr[i] = bool.toString()
        const isIdentical = openedStatusArr.every((val, index, arr) => val === arr[0])
        const includesTrue = openedStatusArr.includes('true')
        const openedStatus = isIdentical && includesTrue ? false : true;
        this.setState({
            opened: openedStatus,
            openedStatus: openedStatusArr,
            isFirstTime: false
        })
    };

    public renderInitialOpenedStatus() {
        const deliveryContainer: OrderContainers | undefined = this.props.order.data?.deliveryContainer;
        const colis: coli[] | undefined = deliveryContainer?.containers;
        let statusArr: string[] = []
        if (colis) {
            for (let i = 0; i < colis?.length; i++) {
                statusArr.push("false")
            }
        }
        return statusArr
    }

    public getDeliveryModeLabel(deliverytype) {
        let deliveryModeLabel = ""
        switch (deliverytype) {
            case "SHOP":
                deliveryModeLabel = "Livraison en Espace SFR"
                break;
            case "HOME":
                deliveryModeLabel = "Livraison à domicile"
                break;
            case "PDP":
                deliveryModeLabel = "Livraison en point relais"
                break;
            case "rdv":
                deliveryModeLabel = "Rendez-vous"
                break;
        }
        return deliveryModeLabel;
    }

    public getCommandeTotalPrice() {
        const deliveryContainer: OrderContainers | undefined = this.props.order.data?.deliveryContainer;
        const colis: coli[] | undefined = deliveryContainer?.containers;
        let colisTotalPrices: number[] = [];
        let commandeTotalPrice: number = 0;

        if (colis) {
            colis.forEach(col => {
                const coliTotalPrice: number = this.getColisTotalPrice(col.items) + Number(col.deliveryPrice);
                colisTotalPrices.push(coliTotalPrice)
            })
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            commandeTotalPrice = colisTotalPrices.reduce(reducer)
        }
        return commandeTotalPrice
    }

    public getColisTotalPrice(items) {
        let prices: number[] = []
        let colisTotalPrice: number = 0
        if (items) {
            items.map(item => {
                prices.push(Number(item.itemPrice))
            })
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            colisTotalPrice = prices.reduce(reducer)
        }
        return colisTotalPrice
    }

    public getColisDeliveryDetails(container) {
        let details: OrderDeliveryDetails = {};
        if (container) {
            details["address"] = container.deliveryAddress;
            details["name"] = container.deliveryZone?.name;
            details["openingHours"] = container.deliveryZone?.openingHours?.description;
            details["type"] = container.deliveryZone?.type;
            details["deliveryPointId"] = container.deliveryPointId;
            details["trackingId"] = container.trackingId;
            details["trackingUrl"] = container.trackingUrl;
            details["deliveryExpirationDate"] = container.deliveryExpirationDate;
        }
        return details
    }

    public getLoanDatas(items, orderProducts) {
        let loanDatas: OrderProduct = {};
        let dataFromsProducts = items && orderProducts ? orderProducts.filter(product => {
            return JSON.stringify(items.codeSap).includes(product.sapCode)
        }) : null;
        if (dataFromsProducts.length) {
            loanDatas["type"] = dataFromsProducts[0].type ? dataFromsProducts[0].type : "";
            loanDatas["description"] = dataFromsProducts[0].description ? dataFromsProducts[0].description : "";
            loanDatas["loanPrice"] = dataFromsProducts[0].loanPrice ? dataFromsProducts[0].loanPrice : "";
            loanDatas["immediatePrice"] = dataFromsProducts[0].immediatePrice ? dataFromsProducts[0].immediatePrice : "";
            loanDatas["price"] = dataFromsProducts[0].price ? dataFromsProducts[0].price : "";
        }
        return loanDatas
    }

    private formatCurrency(amountInEuro:string):string{
        const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
        return amountInEuro && currencyFormatter.format(JSON.parse(amountInEuro));
    }

    private formatCurrencyCents(amountInCents:string):string{
        const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
        return amountInCents && currencyFormatter.format(JSON.parse(amountInCents)/100);
    }

    public render(): JSX.Element {
        if (this.state.error || this.props.order.error) {
            return (
                <Container className="bg-light h-100" fluid>
                    <Row className="h-100 d-flex align-items-center">
                        <Col md={{size: 6, offset: 3}}>
                            <Alert className="text-center" color="danger">
                                <h4 className="alert-heading">Erreur</h4>
                                {this.state.error}
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            )
        } else if (this.props.order.loading) {
            return <Container className="bg-light h-100" fluid>
                <Row className="h-100">
                    <Loading/>
                </Row>
            </Container>
        } else {
            const order: Order = this.props.order.data!;
            const deliveryContainer: OrderContainers | undefined = this.props.order.data?.deliveryContainer;
            const colis: coli[] | undefined = deliveryContainer?.containers ? deliveryContainer.containers : undefined;
            const orderProductMobile: OrderProduct | undefined = order.products.find(value => value.type === "MOBILE");
            const faciliteDePaiement = this.getFdpLoanFromOrderProduct(orderProductMobile, order.fdpLoan)

            return (
                <React.Fragment>
                    <Navbar className="bg-white" color="faded" light>
                        <NavbarBrand className="mr-auto">
                            <img alt="brand" className="img-responsive" width={50} src={this.getBrand()}/>
                            <span className="pl-2">Commande n°{order.id}</span>
                        </NavbarBrand>
                        <Button onClick={this.close} color={this.getColor()}>Fermer</Button>
                    </Navbar>
                    <Container fluid style={{minHeight: "100%"}} className="orderPage bg-light">
                        <Row>
                            <Col lg={{size: 8, offset: 2}}>
                                {/*Client + Forfait + steps*/}
                                <Row className="ml-1 mr-1">
                                    <Col md={12}>
                                        {this.state.isFirstTime || this.state.opened ?
                                            <Card style={{borderBottomRightRadius: 0, borderBottomLeftRadius: 0}}>
                                                <CardHeader>
                                                    <div className="d-flex justify-content-sm-between">
                                                        <div>
                                                            <i className="icon-gradient icon-user mr-2"/>
                                                            Commande N°{order.id}
                                                        </div>
                                                        <div>
                                                            <div style={{fontSize: "1.25rem"}}>
                                                                <span
                                                                    className="font-weight-light">Total commande : </span>
                                                                <span
                                                                    className="font-weight-bold mr-3">{this.formatCurrencyCents((this.getCommandeTotalPrice()).toString())}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardBody>
                                                    <Row className="d-flex">

                                                        <Col md={this.props.order.data?.plan ? 6 : 12}
                                                             className={this.props.order.data?.plan ? "" : "d-flex justify-content-between"}>
                                                            <div
                                                                className={this.props.order.data?.plan ? "contact-info mb-3" : "contact-info col-md-4 pl-0"}>
                                                                <div>
                                                                    <span className=""><i
                                                                        className="icon icon-user"/></span>
                                                                    <span className="font-weight-bold">Client</span>
                                                                </div>
                                                                <span>{order.user.civility} {order.user.firstName} {order.user.lastName}</span>
                                                            </div>
                                                            <div
                                                                className={this.props.order.data?.plan ? "contact-info mb-3" : "contact-info col-md-4 d-flex flex-column align-items-center justify-content-center"}>
                                                                <div
                                                                    className="d-flex flex-column justify-content-start">
                                                                    <div>
                                                                        <span className="pr-1"><i
                                                                            className="icon icon-email"/></span>
                                                                        <span className="font-weight-bold">Adresse e-mail</span>
                                                                    </div>
                                                                    <span>{order.user.email}</span>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={this.props.order.data?.plan ? "contact-info mb-3" : "contact-info col-md-4 d-flex flex-column align-items-end justify-content-end pr-3"}>
                                                                <div
                                                                    className="d-flex flex-column justify-content-start">
                                                                    <div>
                                                                        <span className="pr-1"><i
                                                                            className="icon icon-phone"/></span>
                                                                        <span
                                                                            className="font-weight-bold">Téléphone</span>
                                                                    </div>
                                                                    <span>{order.user.phoneNumber}</span>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <OrderPlan color={this.getColor()}/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <OrderStatus color={this.getColor()}/>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                            : <Card style={{borderBottomRightRadius: 0, borderBottomLeftRadius: 0}}>
                                                <CardHeader>
                                                    <div className="d-flex justify-content-sm-between">
                                                        <div>
                                                            <i className="icon-gradient icon-user mr-2"/>
                                                            Commande N°{order.id}
                                                        </div>
                                                        <div>
                                                            <div style={{fontSize: "1.25rem"}}>
                                                                <span
                                                                    className="font-weight-light">Total commande : </span>
                                                                <span
                                                                    className="font-weight-bold mr-3">{this.formatCurrency((this.getCommandeTotalPrice()).toString())}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardBody>
                                                    <Row className="d-flex">
                                                        <Col md={4}>
                                                            <div className="contact-info">
                                                                <dt className=""><i className="icon icon-user"/>Client
                                                                </dt>
                                                                <dd>{order.user.civility} {order.user.firstName} {order.user.lastName}</dd>
                                                            </div>
                                                        </Col>
                                                        <Col md={4} className="d-flex justify-content-center">
                                                            <div className="contact-info">
                                                                <dt className="pr-3"><i
                                                                    className="icon icon-email"/> Adresse e-mail
                                                                </dt>
                                                                <dd>{order.user.email}</dd>
                                                            </div>
                                                        </Col>
                                                        <Col md={4} className="d-flex justify-content-end">
                                                            <div className="contact-info">
                                                                <dt className="pr-3"><i
                                                                    className="icon icon-phone"/> Téléphone
                                                                </dt>
                                                                <dd>{order.user.phoneNumber}</dd>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        }
                                    </Col>
                                </Row>

                                {/*Colis*/}
                                {colis && colis.map((col, index) =>
                                    <Row className="ml-1 mr-1">
                                        <Col md={12}>
                                            <OrderColisCardToggle title={`COLIS ${col.olNumber ? col.olNumber : ''}`}
                                                                  key={index}
                                                                  index={index}
                                                                  deliveryModeLabel={this.getDeliveryModeLabel(col.deliveryZone?.type)}
                                                                  colisTotalPrice={(this.getColisTotalPrice(col.items) + Number(col.deliveryPrice)).toString()}
                                                                  isExpanded={index === 0 ? this.state.isFirstTime : this.state.opened}
                                                                  handleToggleOpened={this.toggleOpened}>
                                                {/*Livraison*/}
                                                <Row className="ml-1 mr-1 mb-3 mt-3 border-bottom">
                                                    <Col md={12}>
                                                        <OrderColisDelivery
                                                            delivery={this.getColisDeliveryDetails(col)}/>
                                                    </Col>

                                                </Row>

                                                {/*Produit*/}
                                                <Row className="ml-1 mr-1 mb-3 mt-3">
                                                    {col.items.map((item, i) => (
                                                        <Col key={i} md={12}>
                                                            <OrderProductLine
                                                                product={item}
                                                                loanInfos={this.getLoanDatas(item, order.products)}
                                                                buyBackRecord={order.buyBackRecord}
                                                            />
                                                        </Col>)
                                                    )}
                                                </Row>


                                                {/*Frais de livraison*/}
                                                <Row className="col-md-12 mb-3 mt-3">
                                                    <Col md={6} className="d-flex flex-column justify-content-between h-100  pl-4">
                                                        {order?.deferredPayment && orderProductMobile &&
                                                        <span>
                                                            {order?.deferredPayment.futureMonthAmount && order?.deferredPayment.totalAmountFinancedWithFees &&
                                                            <div>
                                                                Dont financement 4X CB
                                                                : {this.formatCurrencyCents(order.deferredPayment.futureMonthAmount)}/mois<br/>
                                                                (montant total
                                                                : {this.formatCurrencyCents(order.deferredPayment.totalAmountFinancedWithFees)})
                                                            </div>
                                                            }
                                                            </span>
                                                        }

                                                        {order.cclLoan && orderProductMobile &&
                                                        <div style={{marginTop: order?.deferredPayment ? "5px" : ""}}>
                                                            <div>Dont
                                                                financement {order.cclLoan?.nbPayment ? order.cclLoan.nbPayment : ''} mois
                                                                :
                                                                {order.cclLoan?.monthlyFeeWithDiscount ? this.formatCurrencyCents(order.cclLoan.monthlyFeeWithDiscount) : ''}/mois<br/>
                                                                (montant total
                                                                : {order.cclLoan?.loanWithFees ? this.formatCurrencyCents(order.cclLoan.loanWithFees) : ''} dont {order.cclLoan?.totalFees ? this.formatCurrencyCents(order.cclLoan.totalFees) : ''} de
                                                                frais)
                                                            </div>
                                                        </div>
                                                        }

                                                        {faciliteDePaiement && orderProductMobile &&
                                                        <span>
                                                                <div 
                                                                    style={{marginTop: order?.deferredPayment || order.cclLoan ? "5px" : ""}}>Dont facilité de paiement : {this.formatCurrency(faciliteDePaiement.loanPrice!.toString())}</div>
                                                                <div>Prix réellement payé : {this.formatCurrency(faciliteDePaiement.price!.toString())}</div>
                                                            </span>
                                                        }
                                                    </Col>
                                                    <Col md={6} className="d-flex justify-content-end no-gutters pr-1 pb-3">
                                                        <div className="border-bottom d-flex">
                                                            <div>
                                                                <span className="mr-5">Frais de livraison </span>
                                                            </div>
                                                            <div>
                                                                <span>{this.formatCurrencyCents(col?.deliveryPrice!)}</span>
                                                            </div>
                                                        </div>

                                                    </Col>
                                                </Row>

                                                {/*Total Colis*/}
                                                <Row className="col-md-12 mb-3 mt-3 justify-content-end no-gutters">
                                                    <Col md={3} className="d-flex justify-content-between pr-1">
                                                        <div className="">
                                                            <span className="font-weight-bold">TOTAL</span>
                                                        </div>
                                                        <div className="">
                                                            <span
                                                                className="">{this.formatCurrencyCents((this.getColisTotalPrice(col.items) + Number(col.deliveryPrice)).toString())}</span>
                                                        </div>
                                                    </Col>
                                                </Row>

                                            </OrderColisCardToggle>
                                        </Col>
                                    </Row>
                                )}

                                {/*Informations de facturation*/}
                                <Row className="ml-1 mr-1">
                                    <Col md={12}>
                                        <OrderBillingLine/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </React.Fragment>)
        }
    }

    private getFdpLoanFromOrderProduct(orderProduct: OrderProduct | undefined, fdpLoans: FdpLoan[] | undefined): FdpLoan | undefined {
        return fdpLoans?.filter(fdpLoan => orderProduct?.sapCode?.includes(fdpLoan.sapCode)).shift()
    }
}

const mapStateToProps = (state: AppState) => ({
    order: {
        data: state.order.data,
        loading: state.order.loading,
        error: state.order.error,
    },
});
const mapDispatchToProps = {
    loadOrder: fetchAndStoreOrder
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderPage);
