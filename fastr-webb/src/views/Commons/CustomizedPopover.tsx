import React from "react";
import {OverlayTrigger, Popover} from "react-bootstrap";

const CustomizedPopover = ({text}) => {
    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                {text}
            </Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement="left" overlay={popover}>
            <span style={{cursor: "context-menu"}} className="icon icon-conversation ml-2 icon-popover-note"/>
        </OverlayTrigger>
    )
}
export default CustomizedPopover;