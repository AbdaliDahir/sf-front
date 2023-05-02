import React from "react";
import { ClientContextSliceState } from "src/store/ClientContextSlice";
import ViewClientMonitoringTimeLine from "src/views/SelfCareMobile/Views/ViewClientMonitoringTimeLine";
import iconBlock from "../../../../img/sentiment_satisfied.svg";

import "./ClientMonitoringBloc.scss";

interface Props {
    clientContext?: ClientContextSliceState
}

const ClientMonitoringBloc = (props: Props) => {
    const { clientContext } = props;

    return <div className="summary-client-monitoring-container">
        <div className="title d-flex align-items-center">
            <div className="picto p-3">
                <img src={iconBlock} />
            </div>
            <div className="text">SUIVI DU CLIENT</div>
        </div>
        <div className="timeline position-relative">
            {  <ViewClientMonitoringTimeLine clientContext={clientContext} /> } 
        </div>
    </div>
}

export default ClientMonitoringBloc;