import React from "react";
import Col from "reactstrap/lib/Col";
import FormGroup from "reactstrap/lib/FormGroup";
import Row from "reactstrap/lib/Row";

import format from "date-fns/format";
import {FormattedMessage} from "react-intl";

const renderPrice = (price: string) => {
    if (price === undefined || price === null || price === "") {
        return (
            <React.Fragment>
                Inconnu
            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            {price} <FormattedMessage
            id="symbol.euro"/>
        </React.Fragment>
    )
}


const DisplayOptionOfferField = (props) => {

    const {label, icon, startDate, endDate, price} = props;

    return (
        <FormGroup className={"grey-background py-1 px-2"}>
            <Row>
                <Col md={6}>
                    {icon ? <span className={`${icon} pr-2`}/> : <span/>} {label}
                </Col>
                <Col md={2} className={"text-center"}>
                    {startDate ? format(new Date(startDate), 'dd/MM/yyyy') : ""}
                </Col>
                <Col md={2} className={"text-center"}>
                    {endDate ? format(new Date(endDate), 'dd/MM/yyyy') : ""}
                </Col>
                <Col md={2} className={"text-center"}>
                    {renderPrice(price)}
                </Col>
            </Row>
        </FormGroup>
    )
}

export default DisplayOptionOfferField
