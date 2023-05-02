import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import React, {useEffect,useState} from 'react';
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import {FormattedMessage} from "react-intl";
import ClientService from "../../../service/ClientService";
import {NotificationManager} from "react-notifications";
import "./RetourEquipment.scss";
import EquipmentsTable from "./EquipmentsTable";
import {Button} from "reactstrap";
import ActService from "../../../service/ActService";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import {translate} from "../../../components/Intl/IntlGlobalProvider";

interface Props {
    refClient: string
    closeGrid?: () => void
}

const RetourEquipment = (props:Props) => {
    const clientService = new ClientService();
    const actService = new ActService(true);
    const payload = useTypedSelector(state => state.payload.payload);
    const storeV2 = useTypedSelector(state => state.store)
    const devices = useTypedSelector(state => state.landedDevice.data);
    const [tableData, setTableData] = useState();
    const [rawData, setRawData] = useState();
    const [nonSelectableRowsIds, setNonSelectableRowsIds] = useState([]);
    const [selectedEquipments, setSelectedEquipments] = useState([]);
    const [disabled, setDisabled] = useState(true);


    useEffect(() => {
        getEquipments()
    }, [])


    const formatDevicesData = (list) => {
        return list.map((item, index) => {
            const obj = Object.assign({}, item)
            obj["id"] = index;
            obj["typeEqpt"] = [obj["name"], obj["typeEqpt"]]
            return obj
        })
    }


    const getEquipments = async () => {
        try {
            let equipments;
            if(devices) {
                equipments = devices
            } else {
                equipments = await clientService.getAllLandedDevices(props.refClient)
            }
            const formattedDevicesData = formatDevicesData(equipments?.devicesToReturn)
            const nonSelectableRowsData = formattedDevicesData?.filter(x => !(x.status === "Client" && x.returnRequest))
            setRawData(equipments?.devicesToReturn)
            setTableData(formattedDevicesData)
            setNonSelectableRowsIds(nonSelectableRowsData?.map(row => row.id))
        } catch (e) {
            const error = await e;
            NotificationManager.error(error.message)
        }
    }

    const enableButton = () => (setDisabled(false))
    const disableButton = () => (setDisabled(true))

    const saveSelectedEquipments = selected => {
        setSelectedEquipments(selected)
    }

    const requestDeviceReturn = async () => {
        const {refClient} = props;
        const idCase = payload.idCase;
        const idContact = payload.fromdisrc? storeV2.contact.currentContact?.contactId : payload.idContact;
        try {
            if(selectedEquipments?.length && refClient && idCase && idContact) {
                const returnEquipments = await actService.retourEquipment(selectedEquipments, refClient, idCase, idContact);
                if(returnEquipments.result === "OK") {
                    NotificationManager.success(translate.formatMessage({id: "boucle.adg.success"}))
                } else {
                    NotificationManager.error(returnEquipments.result.message)
                }
            }
        } catch (e) {
            const error = await e;
            console.error(error)
            NotificationManager.error(translate.formatMessage({id: "boucle.adg.failure"}))
        }
        if(props.closeGrid) {
            props.closeGrid()
        }
    }

    return (
        <React.Fragment>
            <Card className="mt-1">
                <CardHeader>
                    <span className="icon-gradient icon-multi-apps mr-2"/>
                    <FormattedMessage id="return.equipment.table.title"/>
                </CardHeader>
                <CardBody>
                    {tableData ?
                        <React.Fragment>
                            <EquipmentsTable
                                devices={tableData}
                                rawData={rawData}
                                nonSelectable={nonSelectableRowsIds}
                                enableButton={enableButton}
                                disableButton={disableButton}
                                saveSelectedEquipments={saveSelectedEquipments}/>
                            <div className="d-flex justify-content-end">
                                <Button onClick={requestDeviceReturn} color="primary" size={"sm"} disabled={disabled}><FormattedMessage id="declare.equipment.return"/></Button>
                            </div>
                        </React.Fragment>
                        : ""
                    }
                </CardBody>
            </Card>
        </React.Fragment>
    )
};


export default RetourEquipment;
