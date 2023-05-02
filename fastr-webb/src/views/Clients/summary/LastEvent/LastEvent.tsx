import React from "react";
import { ClientContextSliceState } from "src/store/ClientContextSlice";
import AssignementPicto from '../../../../img/assignement.svg';



interface Props {
    clientContext?: ClientContextSliceState
}

const LastEventCard = (props: Props) => {
    

    return <div className="summary-card-container">
        <div className="title">
            <div className="picto-2" style={{color: '#C00404'}}>
                0<sup><img src={AssignementPicto} /></sup>
            </div>
        </div>
        <div className="highlight">
             ÉVÈNEMENT LIÉ A L'OFFRE    
        </div>
    </div>
}

export default LastEventCard;