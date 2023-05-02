import React, {useEffect} from "react";
import {Card, CardBody, CardHeader, CardText, Col, FormGroup, Row} from "reactstrap";

import {ClientContextSliceState} from "../../../../../store/ClientContextSlice";
import DisplayTitle from "../../../../../components/DisplayTitle";

import sfrIcon from "../../../../../img/sfrIcon.svg";
import ClientService from "../../../../../service/ClientService";
import {useTypedSelector} from "../../../../../components/Store/useTypedSelector";
import {LocationEquipment} from "../../../../../model/mobileLocation/LocationEquipment";
import DisplayField from "../../../../../components/DisplayField";
import * as moment from "moment";
import LocationEquipmentsHistory from "./LocationEquipmentsHistory";

interface Props {
    clientContext?: ClientContextSliceState
}

const clientService: ClientService = new ClientService();

const LocationEquipments = (props: Props) => {
    const {clientContext} = props;
    const client: ClientContextSliceState = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const refSiebel = clientContext?.service?.billingAccount ? clientContext?.service?.billingAccount.id : client.serviceId;
    const [currentEquipment, setCurrentEquipment] = React.useState<LocationEquipment>();
    const [equipments, setEquipments] = React.useState<LocationEquipment[]>([]);

    useEffect(() => {
        if (refSiebel) {
            clientService.getLocationEquipments(refSiebel).then((response) => {
                // @ts-ignore
                setCurrentEquipment(response.find((equipment: LocationEquipment) => equipment.status === "LOUE"));
                setEquipments(response);
            })
        }
    }, [refSiebel]);

    function headerSection(id: string) {
        return <div className="p-2 bg-light">
            <DisplayTitle fieldName={id}
                          isLoading={currentEquipment}/>
        </div>;
    }

    function LogisticSection() {
        return <>
            {headerSection("location.equipment.logistic.header")}
            <Row>
                <Col md={6}>
                    <DisplayField fieldName="location.equipment.subscription.date"
                                  fieldValue={moment(currentEquipment?.subscriptionDate).format(process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT)}
                                  isLoading={currentEquipment}/>
                </Col>
                <Col md={6}>
                    <DisplayField fieldName="location.equipment.location.order.number"
                                  fieldValue={currentEquipment?.locationOrderNumber}
                                  isLoading={currentEquipment}/>
                </Col>
            </Row>
        </>;
    }

    function penaltiesSection() {
        return <>
            {headerSection("location.equipment.penaltiesTypes.header")}
            <Row>
                {currentEquipment?.currentLocationPenalties?.map(penalty =>
                    <Col key={penalty.amount}>
                        <DisplayField fieldName={penalty.type}
                                      fieldValue={penalty?.amount + " € TTC"}
                                      isLoading={currentEquipment}/>
                    </Col>)}
            </Row>
        </>;
    }

    function materialAndInsuranceSection() {
        return <>
            {headerSection("location.equipment.materialAndInsurance.header")}
            <Row>
                <Col md={6}>
                    <DisplayField fieldName="location.equipment.imei"
                                  fieldValue={currentEquipment?.imei}
                                  isLoading={currentEquipment}/>
                </Col>
                <Col md={6}>
                    <DisplayField fieldName="location.equipment.insurance"
                                  fieldValue={currentEquipment?.insurance}
                                  isLoading={currentEquipment}/>
                </Col>
            </Row>
        </>;
    }

    function currentLocation() {
        return <FormGroup>
            <Card>
                <CardHeader className="d-flex justify-content-between">
                    <div className="d-flex justify-content-between w-100">
                        <DisplayTitle imgSrc={sfrIcon} fieldName="location.equipment.title"
                                      isLoading={currentEquipment}/>
                    </div>
                </CardHeader>
                <CardBody>
                    <CardText tag={"div"}>
                        <Row>
                            <Col>
                                    <span
                                        className="font-weight-bold"><i
                                        className="icon icon-phone"/> {currentEquipment?.label} </span>
                            </Col>
                        </Row>
                        <br/>
                        <div className="d-grid gap-3">
                            {materialAndInsuranceSection()}
                            {penaltiesSection()}
                            {LogisticSection()}
                        </div>
                    </CardText>
                </CardBody>
            </Card>
        </FormGroup>;
    }

    return (
        <>
            {currentLocation()}
            <LocationEquipmentsHistory history={equipments}/>
        </>
    )
}

export default LocationEquipments;