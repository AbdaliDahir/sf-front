import React from "react";
import {FormGroup} from "reactstrap";
import {FormattedMessage} from "react-intl";
import {format} from "date-fns";
import {ClientContextSliceState} from "../../../store/ClientContextSlice";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import DisplayField from "../../../components/DisplayField";

interface Props {
    clientContext?: ClientContextSliceState
}

const BlockSubscription = (props: Props) => {

    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const {service} = client;

    return (
        <FormGroup>
            {service?.activationDate && service?.creationDate &&
                <React.Fragment>
                    <h6>
                        <FormattedMessage id="contract.subs"/>
                    </h6>
                    <DisplayField
                        isLoading={service}
                        fieldName="contract.date"
                        fieldValue={format(new Date(service.creationDate), 'dd/MM/yyyy')}
                    />
                </React.Fragment>
            }
        </FormGroup>
    )
};

export default BlockSubscription
