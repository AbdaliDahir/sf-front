import React, {useState} from "react";
import {FormattedMessage} from "react-intl";
import {SimCard} from "../../../../../model/service/SimCard";


interface Props {
    simCard: SimCard
}


const BlockMobileSimPin = (props: Props) => {

    const [isCollapsed, setCollapsed] = useState(false)

    const togglePin = () => {
        setCollapsed((state) => {
            return !state;
        })
    }

    return (
        <React.Fragment>
            <h6><FormattedMessage id="offer.equipements.sim.pin"/></h6>
            {isCollapsed ? props.simCard?.pin : <FormattedMessage id="offer.equipements.sim.pin.hidden"/>}
            <span className="icon-gradient icon-eye ml-3 cursor-pointer" onMouseDown={togglePin}/>
        </React.Fragment>)
}


export default BlockMobileSimPin