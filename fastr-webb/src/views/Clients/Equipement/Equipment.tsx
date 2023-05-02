import React, { useEffect } from "react";
import { ClientContextSliceState, fetchClient } from "../../../store/ClientContextSlice";
import { useTypedSelector } from "../../../components/Store/useTypedSelector";
import { FormGroup } from "reactstrap";
import ServiceUtils from "../../../utils/ServiceUtils";
import BlockMobileEquipements from "./BlockMobileEquipements";
import BlockLandedEquipements from "./BlockLandedEquipements";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { DataLoad } from "src/context/ClientContext";

interface Props {
    clientContext?: ClientContextSliceState,
    forIframeView?: boolean
}
interface PropsRequest {
    idTitulaire: string,
    csuLigne: string,
}
const Equipment = (props: Props) => {

    const dispatch = useDispatch();
    const { csuLigne, idTitulaire } = useParams<PropsRequest>();
    const { clientContext } = props;

    const clientFromContext = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const currentClient = useTypedSelector(state => state.store.client.currentClient);
    const client: ClientContextSliceState | undefined = clientFromContext ? clientFromContext : currentClient;
    
    const service = client?.service;

    useEffect(() => {
        if (csuLigne && idTitulaire && !client?.serviceId) {
            dispatch(fetchClient(idTitulaire, csuLigne, DataLoad.ONE_SERVICE, false, true));
        }
    }, []);

    if (service && service.category) {
        return (
            <React.Fragment>
                <FormGroup>
                    {ServiceUtils.isMobileService(service) ?
                        <BlockMobileEquipements clientContext={clientContext} fastrView={true} forIframeView={props.forIframeView}/>
                        :
                        <BlockLandedEquipements clientContext={clientContext} />
                    }
                </FormGroup>
            </React.Fragment>
        );
    } else {
        return <React.Fragment />
    }
}

export default Equipment
