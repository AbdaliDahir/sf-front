import React from "react";
import BlockClient from "./BlockClient";
import BlockPayment from "./BlockPayment";
import {FormGroup, Row} from "reactstrap";
import {TabCategory} from "../../../model/utils/TabCategory";
import AlertBlock from "../AlertBloc";
import BlockContract from "./BlockContract";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";

interface Props {
    clientContext?: ClientContextSliceState
}

const Administrative = (props: Props) => {
    const {clientContext} = props;

    return (
        <Row>
            <FormGroup className={"col-12"}>
                <AlertBlock pwd={TabCategory.ADMINISTRATIVE} clientContext={clientContext}/>
            </FormGroup>
            <FormGroup className={"col-12"}>
                <BlockClient clientContext={clientContext}/>
            </FormGroup>
            <FormGroup className={"col-12"}>
                <BlockContract clientContext={clientContext}/>
            </FormGroup>
            <FormGroup className={"col-12"}>
                <BlockPayment clientContext={clientContext}/>
            </FormGroup>
        </Row>
    )
}

export default Administrative
