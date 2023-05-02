import React from "react";
import { ClientContextSliceState } from "src/store/ClientContextSlice";
import Assignement from '../../../../img/assignement.svg';



interface Props {
    clientContext?: ClientContextSliceState
}

const LastContactCard = (props: Props) => {
    

    return <div className="summary-card-container">
        <div className="title">
            <div className="picto-2">
                0<sup><img src={Assignement} /></sup>
            </div>
        </div>
        <div className="highlight">
            COMMANDES DEPUIS LES 7 DERNIERS JOURS     
        </div>
    </div>
}

export default LastContactCard;