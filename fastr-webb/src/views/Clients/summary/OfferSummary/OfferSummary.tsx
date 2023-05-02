import React, { useEffect, useState } from "react";
import { ClientContextSliceState } from "src/store/ClientContextSlice";
import "./OfferSummary.scss";
import offerIcon from "../../../../img/offer-icon.svg";
import redBySfrIcon from "../../../../img/redbysfr.svg";
import sfrIcon from "../../../../img/sfrIcon.svg";
import agentCCIcon from "../../../../img/agent_cc.svg";
import LoadableText from "src/components/LoadableText";
import RecommandationsV2 from "../Recommandations/RecommandationV2";
import SelfCareService from "../../../../service/SelfCareService";
import { GesteCommercialBios } from "src/model/TimeLine/GesteCommercialBios";
interface Props {
    clientContext?: ClientContextSliceState
}

const selfcareService: SelfCareService = new SelfCareService();

const OfferSummary = (props: Props) => {
    const { clientContext } = props;
    const service  = clientContext?.service;
    const [discounts, setDiscounts] = useState<GesteCommercialBios[]>([]);

    const getOfferName = (service) : string => {
        if (service.category === "MOBILE") {
            return service.offerName;
        }  else if (service.category === "FIXE") {
            if (service.landedPlan?.offerName) {
                return service.landedPlan?.offerName
            }
        }
        return service.offerName;
    }
    
    useEffect(() => {
        const getDiscounts = async (csuCode, CsuNumeroIntra) => {
            const response  = await selfcareService.retrieveDiscounts(csuCode, CsuNumeroIntra);
            setDiscounts(response);
        }
        if (service?.additionalData?.offerId && service?.offerTypeId) {
             getDiscounts(service?.offerTypeId, service?.additionalData?.offerId);
        }
    }, [service?.id]);

    
    return <>
    { service && <div className="offer-container">
        <div className="title pt-2 pl-3 d-flex vertical-align-center" >
            <img src={offerIcon} /> <div className="title-label">  {getOfferName(service)}</div>
        </div>
        <div className="offer-details d-flex p-2">
            <div className="offer-logo p-3">
                { service?.brand === "SFR" ? <img src={sfrIcon} width={40}/> : <img src={redBySfrIcon} width={45}/>}
            </div>
            <div className="offer-infos d-flex flex-column justify-content-center"> 
                <span className="offer-date">Offre soumise depuis le {service?.activationDate}</span>
                <span className="contract-id">Contrat n°{service?.id} </span>
                <span className="offer-engagment">
                    <LoadableText isLoading={service}>
                        <span>{service?.engagementCurrentStatus?.currentEngagementStatusLabel}</span>
                    </LoadableText>
                </span>
            </div>
        </div>
        <div className="commercial-container">
            <div className="geste-commerciel d-flex">
                <div className="icon d-flex justify-content-center align-items-center">
                    <img src={agentCCIcon} />
                </div>
                <div className="gestes-en-cours d-flex flex-column justify-content-center p-1 pl-3">
                    <strong>Geste Commercial en cours</strong>
                    <span> {discounts && discounts.length > 0 ? discounts[0]?.libelle : 'Aucun geste commercial en cours'} </span>
                </div>
            </div>
            <RecommandationsV2 idCsu={`${service?.offerTypeId}-${service?.additionalData?.offerId}`}/>
        </div>
        
    </div>}
    </>
    

}

export default OfferSummary;