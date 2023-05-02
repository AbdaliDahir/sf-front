import * as React from "react";
import {Card, CardBody, CardHeader, Col, Collapse, Row} from "reactstrap";

interface Props {
    title: string,
    index: number,
    icon?: string,
    cardBodyClass?: string,
    isExpanded?: boolean,
    deliveryModeLabel?: {},
    colisTotalPrice: string,
    handleToggleOpened: (boolean, number) => void | undefined,
}

interface State {
    isExpanded: boolean
}

export default class OrderColisCardToggle extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isExpanded: undefined !== this.props.isExpanded ? this.props.isExpanded : true
        }
    }

    public toggle = () => {
        this.setState({
            isExpanded: !this.state.isExpanded
        })
        this.props.handleToggleOpened(this.state.isExpanded, this.props.index)
    };

    private formatCurrency(amountInCents:string):string{
        const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
        return amountInCents && currencyFormatter.format(JSON.parse(amountInCents)/100);
    }

    public render(): JSX.Element {
        const {isExpanded} = this.state;
        const {title, children, icon, cardBodyClass, deliveryModeLabel, colisTotalPrice} = this.props;
        return (
            <Card style={{borderRadius:"initial", boxShadow:"0 4px 4px 0 rgba(0, 0, 0, 0.15)", borderTop:'none', borderBottom:'none'}}>
                <CardHeader className="justify-between-and-center" style={{borderRadius:"initial", backgroundColor:"#f1f1f1"}}>
                    <Row className="d-flex justify-content-between">
                        {icon && <i className={`icon-gradient ${icon} mr-2`}/>}
                        <Col md={4} className="text-left pr-0">{title}</Col>
                        <Col md={4} className="text-center pr-0 font-weight-normal"><span >{deliveryModeLabel}</span></Col>
                        <Col md={3} className="text-right pr-0"><span className="font-weight-normal">Total colis :</span> <span className="font-weight-bold">{this.formatCurrency(colisTotalPrice)}</span></Col>
                        <Col md={1} className="text-center pl-0 pr-0"><i className={`icon icon-black  ${isExpanded ? 'icon-up' : 'icon-down'}`} onClick={this.toggle}/></Col>
                    </Row>
                </CardHeader>
                <Collapse isOpen={isExpanded}>
                    <CardBody className={cardBodyClass}>
                        {children}
                    </CardBody>
                </Collapse>
            </Card>
        );
    }
}
