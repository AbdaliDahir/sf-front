import React, { useEffect, useState } from 'react'
import HistoriqueDisplay from 'src/model/historique/HistoriqueDisplay'
import classnames from 'classnames';
import actionsIcon from "../../../../img/actions-icon.svg";
import chevronIcon from "../../../../img/ihmV2/arrow-down-red.svg";
// import linkIcon from "../../../../img/ihmV2/link-2.svg";
import moment from 'moment';
import { formatDate } from 'src/utils';
import { Badge } from 'reactstrap';
import { Row, Col, Card } from 'react-bootstrap'; 

interface Props {
  element : HistoriqueDisplay,
  index ?: any,
  dataLength ?: number
}
function HistoriqueMobileCard(props: Props) {
  const {element, index, dataLength} = props;
  
  const recentRef: React.RefObject<any> = React.createRef();
  const [detailView, setDetailView] = useState(false);
  const [firstElement, setFirstElement] = useState(false);

  const dateFormatterHours = cell => {
    return (<span>{moment(cell).format('HH:mm:ss')}</span>)
  }

  useEffect(() => {
    if(index === 0) {
      // setDetailView(true);
      setFirstElement(true);
    }
  }, [element])
  

  const updateRef = () => {
    recentRef.current.classList.toggle('active');
    setDetailView(!detailView);
  }
  return (
    <>
    <Card key={index} ref={recentRef} className={` mb-2 cursor-pointer text-left timeline--list ${firstElement ? 'first-card' : ''}`} >
        <Card.Body className={`py-0 position-relative`}>
          {/* status badge */}
          {
            element.lib_statut ? 
            <Badge pill bg="secondary" className="position-absolute timeline__badge--corner d-block">
              <span className="text-primary font-weight-bold">{element.lib_statut}</span>
            </Badge> : null
          }
          <Row className="border-0 py-0">
            <Col xs={2} className="pl-0">
              <div className="text-right pt-4 pb-1">
                <div className='mb-3'>
                  <h6 className='text-center'>
                    <img src={actionsIcon} alt="type"/>
                    <span className="pl-1 historique--text--primary historique--text--medium">{element.type_objet}</span>
                  </h6>
                  <p className='mb-1'>
                    <b>{formatDate(element.date_creation)}</b>
                  </p>
                  <span>{dateFormatterHours(element.date_creation)}</span>
                </div> 
                {
                  element.assigne_a ? 
                  <div className='hidden-part'>
                    <p className="mb-1">
                      Traité par 
                    </p>
                    <b>{element.assigne_a}</b>
                  </div> : null
                } 
              </div> 
            </Col>
            <Col xs="auto" className="text-center px-2">
              <span className={classnames('v-timeline-icon', 'v-not', {'v-last': index === (dataLength)}, {'v-first': firstElement})}/> 
            </Col>
            <Col xs={9}>
              <div className="text-left pt-4 pb-1">
                {
                  element.numero ?  
                  <h6>
                    Référence : <span>{element.numero}</span>
                  </h6>
                  : null
                }
                {
                  element.description ?
                  <Card.Text className="text mb-1 py-1">
                    <b>Description - Motif : </b>
                    <span>
                      {element.description}
                    </span>
                  </Card.Text>
                  : null
                } 
                {
                  element.activite ?
                  <Card.Text className="text mb-1 py-1">
                    <b>Activité : </b>
                    <span>
                      {element.activite}
                    </span>
                  </Card.Text> : null
                }
                  
                {/* <!-- Meida / Canal --> */}
                <Row className="border-0 mb-1 py-0">
                  {
                    element.media_entrant ?
                    <Col>
                      <Card.Text className="text">
                        <b>Média : </b>
                        <span>
                          {element.media_entrant}
                        </span>
                      </Card.Text>
                    </Col> : null
                  }
                  {
                    (element?.type_objet.toLowerCase() != "acte bios" && element?.canal) ?
                      <Col>
                        <Card.Text className="text">
                          {
                            element?.type_objet.trim().toLowerCase() == "commande" ?
                            <b>Canal de Vente : </b>
                            :
                            <b>Canal : </b> 
                          }
                          <span>
                            {element.canal}
                          </span>
                        </Card.Text>
                      </Col> : null
                  }
                </Row>
              <div className='hidden-part'>
                {/* <!-- Demande --> */}
                {
                  element.comment ?
                  <Card.Text className="text mb-1 py-1">
                    <b>Demande Client : </b>
                    <span>
                      {element.comment}
                    </span>
                  </Card.Text> : null
                } 
                {/* <!-- Resultat / Via --> */}
                  {
                    element.processing_conclusion ?  
                    <Row className="border-0 mb-1 py-1">
                      <Col>
                        <Card.Text className="text">
                          <b>Résultat : </b>
                          <span>
                            {element.processing_conclusion?.toLowerCase()}
                          </span>
                        </Card.Text>
                      </Col> 
                    </Row> : null 
                  }
                  {/* {
                    element.canal ? 
                    <Col>
                      <Card.Text className="text">
                        <b>Via : </b>
                        <span>
                          {element.canal}
                        </span>
                      </Card.Text>
                    </Col> : null
                  } */}
                {/* <!-- CodePDV --> */}
                {
                  (element.code_pdv || element.processing_flag) ?
                  <Row className="border-0 mb-1 py-1">
                    { element.code_pdv ?
                      <Col>
                        <Card.Text className="text">
                          <b>CodePDV : </b>
                          <span>
                            {element.code_pdv || null}
                          </span>
                        </Card.Text>
                      </Col> : null
                    }
                    {
                      element.processing_flag ?
                      <Col>
                        <Card.Text className="text">
                          <b>Traité(e) : </b>
                          <span>
                            {element.processing_flag}
                          </span>
                        </Card.Text>
                      </Col> : null
                    }
                  </Row>
                  : null
                }
                {/* COMANDE SHOW */}
                {
                  element?.type_objet.trim().toLowerCase() == "commande" ?
                  <Row className="border-0 mb-1 py-1">
                    {
                      element.description ?
                      <Col xs={6}>
                        <Card.Text className="text">
                          <b>Nature de la commande : </b>
                          <span>
                            {element.description}
                          </span>
                        </Card.Text>
                      </Col> : null
                    }
                    {
                      element.articles ?
                      <Col xs={6}>
                        <Card.Text className="text">
                          <b>Article commandé : </b>
                          <span>
                            {element.articles}
                          </span>
                        </Card.Text>
                      </Col> : null
                    }
                    {
                      element.offres ?
                      <Col>
                        <Card.Text className="text">
                          <b>Offre cible : </b>
                          <span>
                            {element.offres}
                          </span>
                        </Card.Text>
                      </Col> : null
                    }
                    {
                      element.avancement ?
                      <Col>
                        <Card.Text className="text">
                          <b>Etat avancement : </b>
                          <span>
                            {element.avancement}
                          </span>
                        </Card.Text>
                      </Col> : null
                    }
                  </Row> : null
                }
                </div> 
              </div>
            </Col>
          </Row>
        </Card.Body>
        <div className='text-right px-3'> 
          <span className='cursor-pointer' onClick={updateRef}>
              <span className="text-primary font-size-12 font-weight-normal pr-1">
                {detailView ? "Masquer" : "Détails" } 
              </span>
              <img src={chevronIcon} alt="image chevron" style={{transform: detailView ? "rotate(180deg)" : ""}} className='transition'/>
          </span> 
        </div>
      </Card> 
    </>
  )
}

export default HistoriqueMobileCard;
