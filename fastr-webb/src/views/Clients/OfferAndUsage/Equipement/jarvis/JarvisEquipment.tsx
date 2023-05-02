import React from "react";
import {Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import {FormattedMessage} from "react-intl";

import LoadableText from "../../../../../components/LoadableText";
import LoadableIcon from "../../../../../components/LoadableIcon";

import jarvisEquipmentFrontImg from "../../../../../img/CENTRE_SECURITE_03_WHITE.png";
import jarvisEquipmentBackImg from "../../../../../img/CENTRE_SECURITE_04_WHITE.png";


interface Props {
    collapse: boolean
}

const JarvisEquipment = (props: Props) => {


    return (
        <React.Fragment>
            <Row className="flex-align-middle p-2 border-top">
                <Col sm={10} className="d-flex">
                <span className="d-flex flex-align-middle">
                    <div>
                        <LoadableText isLoading={true}>
                            <LoadableIcon name={"icon-phone"}
                                          className="font-size-xl mr-3"
                                          color="gradient"
                                          isLoading={true}/>
                            <span className="mb-0 font-size-m font-weight-bold">
                                <FormattedMessage id={"offer.equipements.jarvis.accessories"}/>
                            </span>
                        </LoadableText>

                    </div>
                </span>
                </Col>

                <Row className="flex-align-middle p-2 ">
                    <Col sm={1} className="d-flex">
                        <FormattedMessage id={"offer.equipements.jarvis.pricipal.device.name"}/>:
                    </Col>
                    <Col sm={5} className="d-flex">
                        <img src={jarvisEquipmentFrontImg} width={300}/>
                    </Col>
                    <Col sm={6} className="d-flex" width={400}>
                        <img src={jarvisEquipmentBackImg} width={300}/>
                    </Col>
                </Row>
            </Row>

        </React.Fragment>
    )
}

export default JarvisEquipment
