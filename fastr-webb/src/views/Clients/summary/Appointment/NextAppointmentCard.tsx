import React from "react";
import { ClientContextSliceState } from "src/store/ClientContextSlice";
import AppointmentPicto from '../../../../img/appointment.svg';

import "./NextAppointment.scss";

interface Props {
    clientContext?: ClientContextSliceState
}

const NextAppointmentCard = (props: Props) => {
    

    return <div className="summary-card-container">
        <div className="title">
            <div className="text">LE PROCHAIN RDV TÉLÉPHONIQUE</div>
                
            <div className="picto">
                <img src={AppointmentPicto} />
            </div>
        </div>
        <div className="details">
            Aucun rendez-vous
        </div>
    </div>
}

export default NextAppointmentCard;