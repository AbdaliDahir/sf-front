import * as React from "react";
import ServiceUtils from "../../../utils/ServiceUtils";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import SecondaryEquipmentItem from "./SecondaryEquipmentItem";
import {SecondaryDevice} from "../../../model/service/Devices";

interface Props {
    filter: string
}

const SecondaryEquipments = ({filter}: Props) => {
    const devices = useTypedSelector(state => state.landedDevice.data);
    if (!devices) {
        return <React.Fragment/>
    }

    let deviceTodisplay: SecondaryDevice[];
    if (filter == "old") {
        deviceTodisplay = devices.secondaryEquipments.filter(e => e.statutLogistique == "RETOURNE");
    } else {
        deviceTodisplay = devices.secondaryEquipments
    }

    if (!deviceTodisplay || !deviceTodisplay.length) {
        return ServiceUtils.renderEmptyDataMsg("equipement.landed.empty", false)
    }
    return (
        <React.Fragment>
            { deviceTodisplay.map((element, i) => (
                <React.Fragment key={i}>
                    <SecondaryEquipmentItem device={element}/>
                </React.Fragment>
            ))}
        </React.Fragment>
    )
}

export default SecondaryEquipments;