import * as React from "react";
import {useState} from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import LoadableIcon from "../../../components/LoadableIcon";
import LoadableText from "../../../components/LoadableText";
import Button from "reactstrap/lib/Button";
import LocaleUtils from "../../../utils/LocaleUtils";
import {FormattedMessage} from "react-intl";
import DisplayField from "../../../components/DisplayField";
import {format} from "date-fns";
import {LandedDevice} from "../../../model/service/Devices";
import {renderDeviceDate} from "./SecondaryEquipmentItem";

interface Props {
    device: LandedDevice
}

const PrincipalEquipmentItem = ({device}: Props) => {

    const [expandedDevice, setExpandedDevice] = useState(false);

    const toggleDeviceDetails = () => {
        setExpandedDevice(!expandedDevice);
    };

    const getIcon = (typeEqpt: string) => {
        switch (typeEqpt) {
            case "Modem DSL":
            case "NB6":
                return "icon-adsl-modem";
            case "64GO GRIS SIDERAL":
            case "Accessoire":
            case "Alimentation":
            case "Anneau":
            case "Boitier ATA" :
            case "Box de Poche" :
            case "Bridge wifi" :
            case "Câble" :
            case "Carte à puce TV" :
            case "Carte PCMCIA" :
            case "Carte SIM" :
            case "CD" :
            case "Clé 3G" :
            case "Clé à partager" :
            case "Clé USB WiFi" :
            case "Clip" :
            case "CPL" :
            case "Domotique Ampoule" :
            case "Domotique Caméra" :
            case "Domotique Pack" :
            case "Domotique Prise" :
            case "Equipement terminaison optique" :
            case "Etiquette" :
            case "Extender" :
            case "Filtre" :
            case "Flyer" :
            case "Guide" :
            case "Home Ampoule LED" :
            case "Home Caméra" :
            case "Home Caméra MAD" :
            case "Home Centrale" :
            case "Home Centrale MAD" :
            case "Home Clavier" :
            case "Home Clé 3G" :
            case "Home Cmde centralisée" :
            case "Home Détect fuite eau" :
            case "Home Détect fumée" :
            case "Home Détect mouvement" :
            case "Home Détect ouverture" :
            case "Home Interrupt connect" :
            case "Home Interrupt volet" :
            case "Home Mini Hub" :
            case "Home Prise connect" :
            case "Home Prise connect Mtre" :
            case "Home Sirène extérieure" :
            case "Home Sirène intérieure" :
            case "Home Télécommande" :
            case "Home Thermo-Hygromètre" :
            case "Homesound L" :
            case "Homesound M" :
            case "Kit WiFi" :
            case "Manette jeu" :
            case "Mediaconverteur" :
            case "Modem SRR" :
            case "Music Player" :
            case "ONT" :
            case "Prise CPL" :
            case "Prise CPL SRR" :
            case "Routeur Mobile" :
            case "SFP" :
            case "Téléphone DECT" :
            case "Téléphone hybride" :
            case "Téléphone mobile" :
            case "Téphone mobile" :
            case "Webcam" :
                return "icon-applications";
            case "Décodeur Cable" :
            case "Décodeur TV" :
            case "Décodeur TV SRR" :
                return "icon-display";
            case "Connect TV" :
                return "icon-connect-tv";
            case "Modem" :
            case "Modem Câble" :
                return "icon-fiber-modem";
            case "Modem Décodeur TV" :
            case "Modem DSL WiFi" :
            case "Modem_NB6V" :
            case "VDSL" :
                return "icon-modem";
            case "Carte SD" :
                return "icon-sd-card";
            case "SIM RED" :
            case "KIT SIM" :
                return "icon-sim-card";
            case "Télécommande" :
                return "icon-tv-remote";
            case "Disque Dur" :
            case "Disque Dur CBL" :
                return "icon-usb";
            default :
                return "icon-box-four-g-plus";
        }
    }

    return (
        <React.Fragment>
            <Row className={"mb-2"}>
                <Col sm={6} className="d-flex">
                    <span className="d-flex flex-middle">
                    <LoadableIcon name={getIcon(device?.typeEqpt)}
                                  className="font-size-xl mr-3"
                                  color="gradient"
                                  isLoading={true}/>
                </span>
                    <span className="d-flex flex-align-middle">
                    <div>
                        <LoadableText isLoading={true}>
                            <h6 className="mb-0">
                            {device.name}
                            </h6>
                        </LoadableText>
                    </div>
                       </span>
                </Col>
                <Col sm={3}/>
                <Col sm={2}>
                    <Button style={{cursor: "default"}} className="btn btn-dark rounded-sm float-right" size="sm">
                        <span> {device.status}</span>
                    </Button>
                </Col>

                <Col sm={1} className="px-1 d-flex float-right">
                    <i className={`icon icon-black float-right  ${expandedDevice ? 'icon-up' : 'icon-down'}`}
                       onClick={toggleDeviceDetails}/>
                </Col>
            </Row>

            {expandedDevice ? renderDeviceDetail(device) : renderDeviceSummary(device)}

        </React.Fragment>
    )
};

const renderDeviceSummary = (device: LandedDevice) => {
    // @ts-ignore
    const separator = " : ";
    const situation = device.situation;
    if (!situation || situation == "SENDING_ONGOING" || situation == "CLIENT_HOLDING") {
        return (
            <React.Fragment>
                <Row className="mb-2 border-bottom-2 pl-5">
                    <Col sm={6}>
                    <span> <FormattedMessage
                        id={"offer.equipements.landed.warranty.amount"}/> </span>
                        {separator + LocaleUtils.formatCurrency(device.warrantyDeposit, true, true)}
                    </Col>
                    <Col sm={6}/>
                </Row>
            </React.Fragment>)
    } else if (situation == "RETURN_ON_TIME") {
        return (
            <React.Fragment>
                <Row className="mb-1 pl-5">
                    <Col sm={6}>
                        {device.sendDate ? renderDeviceDate(device.sendDate, "send.date") : <React.Fragment/>}
                    </Col>
                    <Col sm={6}>
                        {device.returnDate ? renderDeviceDate(device.returnDate, "offer.equipements.landed.return.date") :
                            <React.Fragment/>}
                    </Col>
                </Row>
                <Row className="mb-2 border-bottom-2 pl-5">
                    <Col sm={6}>
                        {renderSyntheticField("offer.equipements.landed.send.date.expected", device.returnRequest)}
                    </Col>
                    <Col/>
                </Row>


            </React.Fragment>)
    } else if (situation == "RETURN_NOT_ON_TIME") {
        return (
            <React.Fragment>
                <Row className="mb-2 border-bottom-2 pl-5">
                    <Col sm={6}>
                        {device.sendDate ? renderDeviceDate(device.sendDate, "send.date") : <React.Fragment/>}
                    </Col>
                    <Col sm={6}>
                        {device.returnDate ? renderDeviceDate(device.returnDate, "offer.equipements.landed.send.date.expected") :
                            <React.Fragment/>}
                    </Col>
                </Row>
                <Row className="mb-2 border-bottom-2 pl-5">
                    <Col sm={6}>
                    <span> <FormattedMessage
                        id={"offer.equipements.landed.warranty.amount"}/> </span>
                        {separator + LocaleUtils.formatCurrency(device.warrantyDeposit, true, true)}
                    </Col>
                    <Col sm={6}>
                    <span> <FormattedMessage
                        id={"offer.equipements.landed.penalty.amount"}/> </span>
                        {separator + LocaleUtils.formatCurrency(device.penaltiesAmount, true, true)}
                    </Col>
                </Row>
                <Row className="mb-2 border-bottom-2 pl-5">
                    <Col sm={6}>
                        {renderSyntheticField("offer.equipements.landed.send.date.expected", device.returnRequest)}
                    </Col>
                    <Col/>
                </Row>

            </React.Fragment>)
    } else if (situation == "RETURN_DONE") {
        return (
            <React.Fragment>
                <Row className="mb-2 border-bottom-2 pl-5">
                    <Col sm={6}>
                    <span> <FormattedMessage
                        id={"offer.equipements.landed.penalty.amount"}/> </span>
                        {separator + LocaleUtils.formatCurrency(device.penaltiesAmount, true, true)}
                    </Col>
                    <Col sm={6}>
                        {device.returnDate ? renderDeviceDate(device.returnDate, "offer.equipements.landed.send.date.expected") :
                            <React.Fragment/>}
                    </Col>
                </Row>
                <Row className="mb-2 border-bottom-2 pl-5">
                    <Col sm={6}>
                        {renderSyntheticField("offer.equipements.landed.send.date.expected", device.returnRequest)}
                    </Col>
                    <Col/>
                </Row>
            </React.Fragment>)
    } else {
        return (
            <React.Fragment>
                <Row className="mb-2 border-bottom-2 pl-5">
                    <Col sm={6}>
                    <span> <FormattedMessage
                        id={"offer.equipements.landed.warranty.amount"}/> </span>
                        {separator + LocaleUtils.formatCurrency(device.warrantyDeposit)}
                    </Col>
                    <Col sm={6}/>
                </Row>
            </React.Fragment>)
    }
}
export const renderSyntheticField = (label: string, val: string) => {
    // @ts-ignore
    const separator = " : ";
    return (
        <React.Fragment>
            <span>
                <FormattedMessage id={label}/>
            </span>
            {separator + val}
        </React.Fragment>
    )
}

const renderDeviceDetail = (device: LandedDevice) => {
    return (
        <React.Fragment>
            {renderGenericDetail(device)}
            {renderDGPenaltyDetail(device)}
            {renderMaterialDetail(device)}
            {renderTransportDetail(device)}
        </React.Fragment>
    )
};

const renderTransportDetail = (device: LandedDevice) => {
    return (
        <React.Fragment>
            <h6 className="border-top pt-2 pl-5 pb-2  align-items-center " style={{backgroundColor: "#e7e7e7"}}>
                <FormattedMessage
                    id={"offer.equipements.landed.transporter"}/></h6>
            <Row className="ml-4">
                <Col sm={6}>

                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.transport.status"}
                        fieldValue={device.transporterStatus && device.transporterStatus !== "" ? device.transporterStatus : "-"}
                    />
                </Col>
                <Col sm={6}>
                    {device.transporterRef && device.transporterUrl && device.transporterUrl !== ""
                        ? <a href={device.transporterUrl} target="_blank">
                            <DisplayField
                                isLoading={true}
                                fieldName={"offer.equipements.landed.transporter.ref"}
                                fieldValue={device.transporterRef}
                            />
                        </a> : <DisplayField
                            isLoading={true}
                            fieldName={"offer.equipements.landed.transporter.ref"}
                            fieldValue={device.transporterRef}
                        />}

                </Col>
            </Row>

            <Row className="ml-4">
                {device.dateStatusTransporter ?
                    <Col sm={6}>
                        <DisplayField
                            isLoading={true}
                            fieldName={"offer.equipements.landed.transport.status.date"}
                            fieldValue={format(new Date(device.dateStatusTransporter), 'dd/MM/yyyy')}
                        /></Col>
                    : <React.Fragment/>}

                <Col sm={6}>
                    {renderDeliveryInfos(device)}
                </Col>
            </Row>
            <Row className="ml-4">
                {device.transporterName ? <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.transporter.name"}
                        fieldValue={device.transporterName}/>
                </Col> : <React.Fragment/>}
                <Col sm={6}>

                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.transport.return"}
                        fieldValue={device.returned && device.returned !== "" ? device.returned : "-"}
                    />
                </Col>
            </Row>
        </React.Fragment>
    )
};

const renderDeliveryInfos = (device: LandedDevice) => {
    if (device.deliveryAtHome) {
        return (

            <DisplayField
                isLoading={true}
                fieldName={"offer.equipements.landed.delivery"}
                fieldValue={"A Domicile"}
            />

        )
    } else if (device.pointRelaisName || (device.firstAdress && device.firstAdress !== "")) {
        const adress = device.pointRelaisName + "," + device.firstAdress + ", " + device.postalCode + " " + device.city
        return (

            <DisplayField
                isLoading={true}
                fieldName={"offer.equipements.landed.delivery"}
                fieldValue={adress}
            />

        )
    }
    return <React.Fragment/>
}

const renderGenericDetail = (device: LandedDevice) => {
    // @ts-ignore
    return (
        <React.Fragment>
            <Row className="ml-4 border-top pt-2">
                {device.sendDate ?
                    <Col sm={6}>
                        <DisplayField
                            isLoading={true}
                            fieldName={"offer.equipements.landed.send.date"}
                            fieldValue={format(new Date(device.sendDate), 'dd/MM/yyyy')}
                        />
                    </Col>
                    :
                    <React.Fragment/>
                }


            </Row>
            <Row className="ml-4">
                {device.returnDate ?
                    <Col sm={6}>
                        <DisplayField
                            isLoading={true}
                            fieldName={"offer.equipements.landed.date.return"}
                            fieldValue={format(new Date(device.returnDate), 'dd/MM/yyyy')}
                        />
                    </Col>
                    : <React.Fragment/>
                }

                {device.returnDeadline ?
                    <Col sm={6}>
                        <DisplayField
                            isLoading={true}
                            fieldName={"offer.equipements.landed.return.request"}
                            fieldValue={format(new Date(device.returnDeadline), 'dd/MM/yyyy')}
                        />
                    </Col>
                    : <React.Fragment/>
                }

            </Row>
        </React.Fragment>
    )
};

const renderDGPenaltyDetail = (device: LandedDevice) => {
    return (
        <React.Fragment>
            <h6 className="border-top pt-2 pl-5 pb-2 align-items-center" style={{backgroundColor: "#e7e7e7"}}>
                <FormattedMessage
                    id={"offer.equipements.landed.dg.penalties"}/></h6>
            <Row className="ml-4">
                <Col sm={6}>

                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.penalty.amount"}
                        fieldValue={LocaleUtils.formatCurrency(device.penaltiesAmount, true, true)}
                    />

                </Col>
                <Col sm={6}>
                    <Row>
                        <Col sm={6}>

                            <DisplayField
                                isLoading={true}
                                fieldName={"offer.equipements.landed.warranty.amount"}
                                fieldValue={LocaleUtils.formatCurrency(device.warrantyDeposit, true, true)}
                            />

                        </Col>
                        <Col sm={6}/>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    )
};

const renderMaterialDetail = (device: LandedDevice) => {
    return (
        <React.Fragment>
            <h6 className="border-top pt-2 pl-5 pb-2  align-items-center" style={{backgroundColor: "#e7e7e7"}}>
                <FormattedMessage
                    id={"offer.equipements.landed.material"}/></h6>
            <Row className="ml-4">
                <Col sm={6}>

                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.model"}
                        fieldValue={device.model && device.model !== "" ? device.model : "-"}
                    />

                </Col>
                <Col sm={6}>

                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.brand"}
                        fieldValue={device.brand && device.brand !== "" ? device.brand : "-"}
                    />

                </Col>
            </Row>
            <Row className="ml-4">
                <Col sm={6}>

                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.model.ref"}
                        fieldValue={device.modelReference && device.modelReference !== "" ? device.modelReference : "-"}
                    />

                </Col>
                <Col sm={6}>
                    <DisplayField
                        isLoading={true}
                        fieldName={"offer.equipements.landed.serial"}
                        fieldValue={device.serialNumber && device.serialNumber !== "" ? device.serialNumber : "-"}
                    />
                </Col>
            </Row>
            <Row className="ml-4">

                {device.addressMac ?
                    <Col sm={6}>
                        <DisplayField
                            isLoading={true}
                            fieldName={"offer.equipements.landed.mac.adress"}
                            fieldValue={device.addressMac}
                        />
                    </Col>
                    : <React.Fragment/>}

                <Col sm={6}/>
            </Row>
        </React.Fragment>
    )
};

export default PrincipalEquipmentItem;
