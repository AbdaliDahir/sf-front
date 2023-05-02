import React, {useEffect} from "react";
import {Card, CardBody, CardHeader, CardText, Col, FormGroup, Row} from "reactstrap";
import * as moment from "moment";

import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import DisplayTitle from "../../../../../components/DisplayTitle";
import DisplayField from "../../../../../components/DisplayField";

import sfrIcon from "../../../../../img/sfrIcon.svg";
import ClientService from "../../../../../service/ClientService";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {OfferLocation} from "../../../../../model/OfferLocation";
import { renderRunningOptionsOrDiscounts } from "../Utils/OffersUtils";
import LocationHistoryV2 from "./LocationHistoryV2";
import { FormattedMessage } from "react-intl";
import StringUtils from "../../../../../utils/StringUtils";


interface Props {
    clientContext?: ClientContextSliceState
}

const clientService: ClientService = new ClientService();

const OfferLocation = (props: Props) => {
    const { clientContext } = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const serviceId = clientContext ? clientContext.serviceId : client.serviceId;
    const [currentOffer, setCurrentOffer] = React.useState<OfferLocation>();
    const [offers, setOffers] = React.useState<OfferLocation[]>([]);

    useEffect(() => {
        if (serviceId) {
            clientService.getOfferLocationMobile(serviceId).then((response) => {
                // @ts-ignore
                setCurrentOffer(response.find((offer : OfferLocation) => offer.statut === "Active"));
                setOffers(response.sort((a, b) => {
                    const date1 = new Date(a.dateDebutEngagement).getTime();
                    const date2 = new Date(b.dateDebutEngagement).getTime();
                    return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
                }));
            })
        }
    }, [serviceId]);
   
    return (
        <>
            <FormGroup>
                <Card>
                    <CardHeader className="d-flex justify-content-between">
                        <div className="d-flex justify-content-between w-100">
                            <DisplayTitle imgSrc={sfrIcon} fieldName="offer.location.title"
                                          isLoading={currentOffer} />
                        </div>
                    </CardHeader>
                    <CardBody>
                        <CardText tag={"div"}>
                            <Row>
                                <Col md={6}>
                                    <DisplayField fieldName="offer.location.status"
                                                  fieldValue={currentOffer?.statut}
                                                  isLoading={currentOffer}/>

                                    <DisplayField
                                        isLoading={true}
                                        fieldName={"offer.location.month.price"}
                                        fieldValue={currentOffer?.montant ? StringUtils.formatPrice(currentOffer?.montant) : ""}
                                    />

                                    <DisplayField
                                        isLoading={true}
                                        fieldName={"offer.location.equipment"}
                                        fieldValue={currentOffer?.libelleEquipement}
                                    />


                                </Col>
                                <Col md={6}>

                                    <DisplayField
                                        isLoading={true}
                                        fieldName={"offer.location.linked.line"}
                                        fieldValue={`${currentOffer?.numeroTelephone} (statut ${currentOffer?.statutAbonnement})`}
                                    />
                                    <DisplayField
                                        isLoading={true}
                                        fieldName={"offer.location.next.renewal.date"}
                                        fieldValue={moment(currentOffer?.dateRenouvellementLocation).format(process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT)}
                                    />
                                    {currentOffer?.dateDebutEngagement && currentOffer?.dateFinEngagement && moment(currentOffer.dateFinEngagement).isAfter(moment(new Date())) &&
                                        <>
                                        <FormattedMessage  id="offer.location.engagement.label"/> :
                                         {renderRunningOptionsOrDiscounts(new Date(currentOffer?.dateDebutEngagement), new Date(currentOffer?.dateFinEngagement)) }
                                        </>
                                     }
                                </Col>
                            </Row>

                        </CardText>
                    </CardBody>
                </Card>
            </FormGroup>
            <FormGroup>
                <Card>
                    <CardHeader className="d-flex justify-content-between">
                        <div className="d-flex justify-content-between w-100">
                            <DisplayTitle icon={"icon-clock"} fieldName="offer.location.history.title"
                                          isLoading={currentOffer} />
                        </div>
                    </CardHeader>
                    <CardBody>
                        <LocationHistoryV2 history={offers}/>
                    </CardBody>
                </Card>
            </FormGroup>
        </>
    )
}

export default OfferLocation;