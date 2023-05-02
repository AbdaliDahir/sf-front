import React, { useEffect, useState } from 'react'   
import { ClientContextSliceState } from 'src/store/ClientContextSlice'
import './Historique.scss'
import { Card, Nav, Tab } from 'react-bootstrap';
import courriersIcon from "../../../img/courriers-icon.svg"
import historiqueIcon from "../../../img/historique-icon.svg"
import actionsIcon from "../../../img/actions-icon.svg"
import { useTypedSelector } from 'src/components/Store/useTypedSelector';
import { Spinner } from 'reactstrap';
import HistoriqueService from 'src/service/HistoriqueService';
import HistoriqueDisplay from 'src/model/historique/HistoriqueDisplay';
import {NotificationManager} from "react-notifications";
import {FormattedMessage} from "react-intl";  
import { FIXE_TYPE, LOCATION_TYPE, MOBILE_TYPE } from './utils/historique-constants';
import HistoriqueContainer from './Card/HistoriqueContainer';
import Loading from 'src/components/Loading';
import ErrorBoundary from 'src/poc/ErrorBoundary';
import VegasCouriers from '../VegasCouriers/VegasCouriers';


const Historique = () => {
	const currentClient: ClientContextSliceState | undefined = useTypedSelector(state => state.store.client.currentClient);
  const historiqueService: HistoriqueService = new HistoriqueService();
  const [historiqueData, setHistoriqueData] = useState<[HistoriqueDisplay] | []>([]);
  const [historiqueType, setHistoriqueType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => { 

    // TODO :: ONLY FOR MOBILE AND LOCATION FOR NOW 
    if(checkMobileorLocation()) {
      setIsLoading(true);
      fetchData(currentClient?.service?.category.toLowerCase());
    } else {
      setHistoriqueType(FIXE_TYPE);
    }
  }, [currentClient]);

  const fetchData = async (dataType) => {
    try {
      const request = {
        idLigne: currentClient?.serviceId,
        idTitulaire: currentClient?.clientData?.id,
        idTechSigc: currentClient?.service?.additionalData?.idTechSigc,
        dataType: dataType,
        codeScs: currentClient?.service?.offerTypeId,
        numeroCsu: currentClient?.service?.additionalData?.offerId 
      }
      const historique: any = await historiqueService.getMobileHistorique(request);
      if(historique.length > 0) {   
        setHistoriqueData(historique); 
      } 
      setIsLoading(false);
    } catch (error) { 
      // const err = await error;
      NotificationManager.error(<FormattedMessage id="offer.equipements.box.error"/>, null, 5000);
      setIsLoading(false);
    }
  }; 

  const checkMobileorLocation = () => currentClient?.service?.category.toLowerCase() == MOBILE_TYPE.toLowerCase() || currentClient?.service?.category.toLowerCase() == LOCATION_TYPE.toLowerCase();

  return (
    <Card className='historique historique--border h-100 w-100'>
      <Tab.Container id="left-tabs-example" defaultActiveKey="historique">
        <Card.Header className='historique__header historique__header--back-grey'>
          <Nav className='historique__nav'>
            <Nav.Item className='historique__nav__button'>
              <Nav.Link eventKey="historique">
                <img src={historiqueIcon} alt="image historique"/>
                  <FormattedMessage id={"historique.menu.historique"}/>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className='historique__nav__button'>
              <Nav.Link eventKey="courriers">
                <img src={courriersIcon} alt="image historique"/>
                <FormattedMessage id={"historique.menu.courriers"}/>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className='historique__nav__button'>
              <Nav.Link eventKey="actions" className='button--padding--xs'>
                <img src={actionsIcon} alt="image historique"/>
                <FormattedMessage id={"historique.menu.actions"}/>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body className='historique__body historique__body--padding h-100 p-0 overflow-hidden'>
          <Tab.Content className="h-100">
            <Tab.Pane eventKey="historique" className="h-100">
              <ErrorBoundary>
              { isLoading ?
                    <div className="my-5"><Loading /></div>
                    :  historiqueType && <HistoriqueContainer data={historiqueData} /> 
              }
              </ErrorBoundary>
            </Tab.Pane>
            <Tab.Pane eventKey="courriers">
              <VegasCouriers />
            </Tab.Pane>
            <Tab.Pane eventKey="actions">
              <main id="loading-zone" aria-busy="true" className='py-5 mx-auto my-5 d-block text-center'>
                <p className='text-center'>Loading Level</p>
                <Spinner animation="border" role="status" className='mx-auto'>
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </main>
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Tab.Container>
    </Card>
  )
}

export default Historique
