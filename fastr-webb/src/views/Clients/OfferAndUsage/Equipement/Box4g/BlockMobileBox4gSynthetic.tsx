import React, { useEffect, useState } from "react";
import {Badge, Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import LoadableText from "../../../../../components/LoadableText";
import DisplayField from "../../../../../components/DisplayField";
import {NotificationManager} from "react-notifications";
import {FormattedMessage} from "react-intl";  
import { BoxEquipment } from "src/model/equipment/BoxEquipment";  
import ClientService from "src/service/ClientService";
import LocaleUtils from "src/utils/LocaleUtils";
import { setEquipmentBox4G } from "src/store/actions/v2/client/ClientActions";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "src/components/Store/useTypedSelector";
import BlockMobileTerminalSynthetic from "../Terminal/BlockMobileTerminalSynthetic";
import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";

interface Props {
  collapse ?: boolean,
  csuLigne ?: string,
  clientContext?: ClientContextSliceState,
  forIframeView?: boolean
}

let mobileOffre: ClientContextSliceState | undefined;

const BlockMobileBox4gSynthetic = (props: Props) => {
  const [dataLoaded, setDataLoaded] = useState(true);
  const dispatch = useDispatch();
  if(props.forIframeView) {
    mobileOffre = useTypedSelector(state => state.store.client.loadedClients[1]);
  } else {
    mobileOffre = useTypedSelector(state => state.store.client.currentClient);
  }
  let currentClient: ClientContextSliceState | undefined = useTypedSelector(state => state.store.client.currentClient);
  const [loading, setLoading] = useState<Boolean>(false);
  const clientService: ClientService = new ClientService();
  const csuLigne = props?.csuLigne;

  const demandeRetourMapping = new Map();
  demandeRetourMapping.set('RELANCE_CLIENT', 'Relance client');
  demandeRetourMapping.set('FACTURE', 'Facturé');
  demandeRetourMapping.set('RETOURNE_LOGISTIQUE', 'Retourné logistique');
  demandeRetourMapping.set('NON_ATTENDU', 'Non attendu');
  demandeRetourMapping.set('REMBOURSE', 'Remboursé');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let offre: [BoxEquipment] = await clientService.getEquipementRestitution(csuLigne);
        if(offre.length > 0) {
          offre[0].serviceId = csuLigne;
          dispatch(setEquipmentBox4G(offre[0]));
        }
        setDataLoaded(true);
      } catch (error) {
        setDataLoaded(false);
        // const err = await error;
        NotificationManager.error(<FormattedMessage id="offer.equipements.box.error"/>, null, 5000);
      } finally {
        setLoading(true);
      }
    };
    if(currentClient?.service?.natureServiceBios === "BOX_4G" && csuLigne == currentClient?.serviceId && !mobileOffre?.equipment?.box4G?.serviceId) {
      fetchData();
    } else if (props.forIframeView && mobileOffre?.service?.natureServiceBios === "BOX_4G") {
      fetchData();
    }
  }, [currentClient?.service, mobileOffre]);

  const mappingDemande = (value) => {
    return demandeRetourMapping.has(value) ? demandeRetourMapping.get(value) : "N/A";
  }

    return ( 
      <>
        { !loading ? <React.Fragment/> :
          (!mobileOffre?.equipment?.box4G && dataLoaded) ?
          <BlockMobileTerminalSynthetic collapse={false} clientContext={props.clientContext}/>
          :
          <React.Fragment>
              <Row className="flex-align-middle p-2">
                <Col sm={6}> 
                  <LoadableText isLoading={loading}>
                    {
                      mobileOffre?.equipment?.box4G ?  
                        <div className="d-flex flex-align-middle">
                          <span className="icon-gradient icon-adsl-modem font-size-l mr-2"/>
                          <span className="mb-0 font-size-m font-weight-bold">
                            <FormattedMessage id={"offer.equipements.box.title"}/>
                          </span>
                        </div> 
                      : null
                    } 
                  </LoadableText>
                </Col>

                <Col sm={6}>
                  <h5><Badge color="dark">{mobileOffre?.equipment?.box4G?.statut}</Badge></h5>
                </Col>
              </Row> 
              <Row className="w-100 ml-1">
                <Col sm={6} className="py-1 px-2">
                  { mobileOffre?.equipment?.box4G?.libelleEquipement 
                    ? 
                      <DisplayField fieldName={"offer.equipements.box.modele"} fieldValue={mobileOffre?.equipment?.box4G?.libelleEquipement}
                                isLoading={loading}/> 
                    : null
                  } 
                </Col>
                <Col sm={6} className="py-1 px-2">
                  { mobileOffre?.equipment?.box4G?.imei
                      ? 
                      <DisplayField fieldName={"offer.equipements.box.imei"} fieldValue={mobileOffre?.equipment?.box4G?.imei}
                      isLoading={loading}/>
                      : null
                    }  
                </Col>
              </Row> 
              <Row className="w-100 ml-1">
                <Col sm={6} className="py-1 px-2">
                  { (!!mobileOffre?.equipment?.box4G?.montantPenalite)
                    ? 
                    <DisplayField fieldName={"offer.equipements.box.montant"} fieldValue={LocaleUtils.formatCurrency(parseFloat(mobileOffre?.equipment?.box4G?.montantPenalite), false, true)}
                              isLoading={loading}/>
                    : null
                  }  
                </Col>
                <Col sm={6} className="py-1 px-2">
                  { mobileOffre?.equipment?.box4G?.demandeRetour
                    ? 
                    <DisplayField fieldName={"offer.equipements.box.retour"} fieldValue={mappingDemande(mobileOffre?.equipment?.box4G?.demandeRetour)}
                                    isLoading={loading}/>
                    : null
                  } 
                  
                </Col>
              </Row>  
          </React.Fragment>
        }
      </>
    )
}

export default BlockMobileBox4gSynthetic
