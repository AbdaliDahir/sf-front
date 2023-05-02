import React from "react";
import {FormGroup} from "reactstrap";
import {FormattedMessage} from "react-intl";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import DisplayField from "../../../components/DisplayField";

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockReference = (props: Props) => {

    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const {service} = client;

    return (
        <FormGroup>
            <h6>
                <FormattedMessage
                id={"contract.reference"}/>
            </h6>
            <DisplayField
                isLoading={service}
                fieldName={"contract.contract.reference"}
                fieldValue={service?.id}
            />
        </FormGroup>
    )
};
export default BlockReference
