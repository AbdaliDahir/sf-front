import * as React from "react";
import ServiceUtils from "../../../utils/ServiceUtils";
import {useTypedSelector} from "../../../components/Store/useTypedSelector";
import PrincipalEquipmentItem from "./PrincipalEquipmentItem";
import {LandedDevice} from "../../../model/service/Devices";

interface Props {
    filter: string
}

const PrincipalEquipments = ({filter}: Props) => {

    const devices = useTypedSelector(state => state.landedDevice.data);
    if (!devices) {
        return <React.Fragment/>
    }

    let deviceTodisplay: LandedDevice[];
    if (filter == "old") {
        deviceTodisplay = devices.principalEquipments.filter(e => !e.current);
    } else {
        deviceTodisplay = devices.principalEquipments.filter(e => e.current);
    }

    if (!deviceTodisplay || !deviceTodisplay.length) {
        return ServiceUtils.renderEmptyDataMsg("equipement.landed.empty", false)
    }
    return (
        <React.Fragment>
            { deviceTodisplay.map((element, i) => (
                <React.Fragment key={i}>
                    <PrincipalEquipmentItem device={element}/>
                </React.Fragment>
            ))}
        </React.Fragment>
    )
}

export default PrincipalEquipments;