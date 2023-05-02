import React, { useEffect, useState } from "react";
import moment from "moment";

import { ExternalEvent } from "src/model/externalEvent/ExternalEvent";
import { ServiceType } from "src/model/ServiceType";
import ExternalEventService from "src/service/ExtrenalEventService";
import { ClientContextSliceState } from "src/store/ClientContextSlice";
import MailPicto from '../../../../img/mail.svg';

const externalEventService = new ExternalEventService(true);

interface Props {
    clientContext?: ClientContextSliceState
}

const VEGAS = "VEGAS";

const LastLetterCard = (props: Props) => {
    const {clientContext} = props;
    const service  = clientContext?.service;


    const [courrier, setCourrier] = useState<ExternalEvent|undefined>(undefined)
    useEffect(() => {
        const getCourriers = async (serviceId) => {
            const response  = service?.serviceType === ServiceType.MOBILE ?  await externalEventService.getMobileExternalEvents(serviceId, VEGAS) : 
            await externalEventService.getFixeExternalEvents(serviceId, VEGAS) ;
            if (response && response.length > 0) {
                setCourrier(response.sort((a, b) => {
                    const aa = new Date(a.creationDate).getTime();
                                const bb = new Date(b.creationDate).getTime()
                                return aa > bb ? -1 : aa < bb ? 1 : 0;
                })[0]);
            }
        }
        
        if (service?.id) {
            getCourriers(service?.serviceType === ServiceType.MOBILE ? service?.id : service.siebelAccount);
        }
    }, [service?.id]);
    

    return <div className="summary-card-container">
        <div className="title">
            <div className="text">LE DERNIER COURRIER</div>
            
            <div className="picto">
                <img src={MailPicto} />
            </div>
        </div>
        <div className="details d-flex flex-column">
            {courrier ? <div className="date-container d-flex justify-content-between font-weight-bold w-100">
                <div className="date">{moment(courrier?.creationDate).format("DD/MM/YYYY")}</div>
                <div className="time">{moment(courrier?.creationDate).format("hh:mm")}</div>
            </div> : <></>}
            <div className={"content w-100 text-align-left"}>
                {courrier ? courrier?.eventDetail.cartLabel : 'Aucun courrier' }
            </div>
        </div>
    </div>
}

export default LastLetterCard;