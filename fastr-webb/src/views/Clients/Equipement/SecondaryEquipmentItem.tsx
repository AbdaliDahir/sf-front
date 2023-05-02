import * as React from "react";
import {useState} from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import LoadableIcon from "../../../components/LoadableIcon";
import LoadableText from "../../../components/LoadableText";
import Button from "reactstrap/lib/Button";
import {FormattedMessage} from "react-intl";
import {format} from "date-fns";
import {HistoStatut, SecondaryDevice} from "../../../model/service/Devices";
import {MdCancel, MdCheckCircle} from "react-icons/all";

import DisplayField from "../../../components/DisplayField";
import LocaleUtils from "../../../utils/LocaleUtils";

interface Props {
    device: SecondaryDevice
}

const SecondaryEquipmentItem = ({device}: Props) => {
    const [expandedDevice, setExpandedDevice] = useState(false);
    const toggleDeviceDetails = () => {
        setExpandedDevice(!expandedDevice);
    };
    return (
        <React.Fragment>
            <Row className={"mb-2"}>
                <Col sm={6} className="d-flex">
                    <span className="d-flex flex-middle">
                    <LoadableIcon name={"icon-box-four-g-plus"}
                                  className="font-size-xl mr-3"
                                  color="gradient"
                                  isLoading={true}/>
                </span>
                    <span className="d-flex flex-align-middle">
                    <div>
                        <LoadableText isLoading={true}>
                            <h6 className="mb-0">
                            {device.libelle}
                            </h6>
                        </LoadableText>
                    </div>
                       </span>
                </Col>
                <Col sm={3}/>
                <Col sm={2}>
                    <Button style={{cursor: "default"}} className="btn btn-dark rounded-sm float-right" size="sm">
                        <span> {device.statutLogistique}</span>
                    </Button>
                </Col>

                <Col sm={1} className="px-1 d-flex float-right">
                    <i className={`icon icon-black float-right  ${expandedDevice ? 'icon-up' : 'icon-down'}`}
                       onClick={toggleDeviceDetails}/>
                </Col>
            </Row>

            {expandedDevice ? renderSecondaryDeviceDetail(device) : renderSecondaryDeviceSummary(device)}

        </React.Fragment>
    )
};





export const renderDeviceDate = (date: string, label: string) => {
    // @ts-ignore
    const separator = " : ";
    return (
        <React.Fragment>
            <span>
                <FormattedMessage id={label}/>
            </span>
            {separator + format(new Date(date), 'dd/MM/yyyy')}
        </React.Fragment>
    )
}


const renderFlag = (flag: boolean, label: string) => {
    return (
        <React.Fragment>
            <span>
                <FormattedMessage id={label}/>
            </span>
            {flag ? <span className="font-size-l"><MdCheckCircle color="#55AF27"/></span> :
                <span className="font-size-l"><MdCancel color="#da3832"/></span>}
        </React.Fragment>
    )
}


const renderSecondaryDeviceSummary = (device: SecondaryDevice) => {
    // @ts-ignore
    const separator = " : ";
    return (
        <React.Fragment>
            <Row className="mb-2  border-bottom-2 ml-4">
                <Col sm={6}>
                    {device.dateFinGarantie ? renderDeviceDate(device.dateFinGarantie, "offer.equipements.landed.secondary.end.penalty.date") :
                        <React.Fragment/>}
                </Col>
                <Col sm={6}>
                    {renderFlag(device.flagFdp, "offer.equipements.landed.secondary.payment.facility")}
                </Col>
            </Row>

        </React.Fragment>)
}

const renderSecondaryDeviceDetail = (device: SecondaryDevice) => {
    return (
        <React.Fragment>
            {renderMaterialDetail(device)}
            {renderFinanceDetail(device)}
            {renderTransportDetail(device)}
            {renderSavDetail(device)}
            {renderRetractationDetail(device)}
            {renderLogisticHistoryDetail(device)}
        </React.Fragment>
    )
};


const renderFinanceDetail = (device: SecondaryDevice) => {
    return (
        <React.Fragment>
            <h6 className="border-top pt-2 pl-5 pb-2 align-items-center" style={{backgroundColor: "#e7e7e7"}}><FormattedMessage
                id={"offer.equipements.landed.secondary.finance"}/></h6>
            <Row className="ml-4">
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.paid.amount"}
                        fieldValue={LocaleUtils.formatCurrency(device.montantPaye, true, true)}
                    />

                </Col>
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.price.net"}
                        fieldValue={LocaleUtils.formatCurrency(device.prixNu, true, true)}
                    />
                </Col>
            </Row>
            <Row className="ml-4">
                <Col sm={6}>
                    {Number(device.odrPrice) == 0 ? renderFlagDetailed(false, "offer.equipements.landed.secondary.odr.offer") :
                        <DisplayField
                            isLoading={true}
                            fieldName={"offer.equipements.landed.secondary.odr.offer"}
                            fieldValue={LocaleUtils.formatCurrency(Number(device.odrPrice), true, true)}
                        />}
                </Col>
                <Col sm={6}>
                    {renderFlagDetailed(!!device.facturationPrixNu, "offer.equipements.landed.secondary.client.factured.net.price")}
                </Col>
            </Row>
            <Row className="ml-4">
                <Col sm={6}>
                    {renderFlagDetailed(device.flagFdp, "offer.payment.facility.title")}
                </Col>
                <Col sm={6}>
                    {renderFlagDetailed(device.flagEqtSubventionne, "offer.equipements.landed.secondary.subvention")}
                </Col>
            </Row>
        </React.Fragment>
    )
};

const renderFlagDetailed = (flag: boolean, label: string) => {
    return (
        <React.Fragment>
            <h6 className="pl-2">
                <FormattedMessage id={label}/>
            </h6>
            {flag ? <span className="font-size-l pl-2"><MdCheckCircle color="#55AF27"/></span> :
                <span className="font-size-l pl-2"><MdCancel color="#da3832"/></span>}
        </React.Fragment>
    )
}


const returnLineHistory = (histoStatut: HistoStatut) => {
    return (
        <React.Fragment>
            <Row className="ml-4">
                <Col sm={6}>
                    {histoStatut.dateStatut ? <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.logistical.history.date"}
                        fieldValue={format(new Date(histoStatut.dateStatut), 'dd/MM/yyyy')}/> : <React.Fragment/>}
                </Col>
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.logistique.statut"}
                        fieldValue={histoStatut.statutLogistique}
                    />
                </Col>
            </Row>
        </React.Fragment>
    )
};


const renderLogisticHistoryDetail = (device: SecondaryDevice) => {
    return (
        <React.Fragment>
            <h6 className="border-top pt-2 pl-5 pb-2 align-items-center" style={{backgroundColor: "#e7e7e7"}}><FormattedMessage
                id={"offer.equipements.landed.secondary.logistical.history"}/></h6>
            {device.histoStatut?.map(e => returnLineHistory(e))}
        </React.Fragment>
    )
};


const renderRetractationDetail = (device: SecondaryDevice) => {
    return (
        <React.Fragment>
            {device.centreRetourRetract ? <React.Fragment>
                <h6 className="border-top pt-2 pl-5 pb-2 align-items-center" style={{backgroundColor: "#e7e7e7"}}><FormattedMessage
                    id={"offer.equipements.landed.secondary.retractation"}/></h6>
                <Row className="ml-4" >
                    <Col sm={6}>
                        <DisplayField
                            isLoading={true}
                            fieldName={"offer.equipements.landed.secondary.retractation.center"}
                            fieldValue={device.centreRetourRetract}
                        />
                    </Col>
                    <Col sm={6}/>
                </Row>
            </React.Fragment> : <React.Fragment/>}
        </React.Fragment>
    )
};

const renderSavDetail = (device: SecondaryDevice) => {
    return (
        <React.Fragment>
            <h6 className="border-top pt-2 pl-5 pb-2 align-items-center" style={{backgroundColor: "#e7e7e7"}}><FormattedMessage id={"offer.equipements.landed.secondary.sav"}/></h6>
            <Row className="ml-4 mb-1">
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.sav.manager"}
                        fieldValue={device.gestionnaireSav}
                    />
                </Col>
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.call.number"}
                        fieldValue={device.numAppelSav}
                    />
                </Col>
            </Row>
            <Row className="ml-4">
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.sav.condition"}
                        fieldValue={device.conditionSav}
                    />
                </Col>
                <Col sm={6}/>
            </Row>
        </React.Fragment>
    )
};


const renderTransportDetail = (device: SecondaryDevice) => {
    return (
        <React.Fragment>
            <h6 className="border-top pt-2 pl-5 pb-2 align-items-center" style={{backgroundColor: "#e7e7e7"}}>Logistique</h6>
            <Row className="ml-4">
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.logistique.statut"}
                        fieldValue={device.statutLogistique}
                    />
                </Col>
                <Col sm={6}>
                    {device.dateModif ?
                        <DisplayField
                            isLoading={true}
                            fieldName={"offer.equipements.landed.secondary.logistique.date"}
                            fieldValue={format(new Date(device.dateModif), 'dd/MM/yyyy')}
                        />
                        : <React.Fragment/>}
                </Col>
            </Row>
            <Row className="ml-4">
                <Col sm={6}>
                    {device.dateFinGarantie ?

                        <DisplayField
                            isLoading={true}
                            fieldName={"offer.equipements.landed.send.date"}
                            fieldValue={format(new Date(device.dateFinGarantie), 'dd/MM/yyyy')}
                        />
                        : <React.Fragment/>
                    }
                </Col>
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.logistique.cmd.number"}
                        fieldValue={device.numCommandeEcom}/>
                </Col>
            </Row>
            <Row className="ml-4">
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.transporter.name"}
                        fieldValue={device.transporteur}/>
                </Col>
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.transporter.ref"}
                        fieldValue={device.numColisExpedition}/>
                </Col>
            </Row>
            <Row className="ml-4">
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.logistique.sap.code"}
                        fieldValue={device.codeSap}/>
                </Col>
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.logistique.sap.cmd.number"}
                        fieldValue={device.numCommandeSap}/>
                </Col>
            </Row>

        </React.Fragment>)
};


const renderMaterialDetail = (device: SecondaryDevice) => {
    return (
        <React.Fragment>
            <h6 className="border-top pt-2 pl-5 pb-2 align-items-center" style={{backgroundColor: "#e7e7e7"}}>Matériel</h6>
            <Row className="ml-4">
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.type"}
                        fieldValue={device.typeEqt}/>
                </Col>
                <Col sm={6}>

                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.brand"}
                        fieldValue={device.marque}/>
                </Col>
            </Row>
            <Row className="ml-4">
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.model"}
                        fieldValue={device.modele}/>
                </Col>
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.secondary.serial"}
                        fieldValue={device.numSerie}/>
                </Col>
            </Row>
        </React.Fragment>
    )
};

export default SecondaryEquipmentItem;