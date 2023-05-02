import * as React from "react";
import "./CasePicto.scss";
import {renderTheRightPicto} from "../../../List/pictoHandler";

interface Props {
    iconType: string
    counts?: string | number
    timeSinceLastUpdate? : string
    bgColor?: string
    cursor?: string
    textColor: string
    onClick?
    id?:string
    className?:string
}

const CasePicto = (props: Props) => {
    const {iconType, counts, timeSinceLastUpdate, bgColor, cursor, textColor,onClick, id,className} = props
    return (
        <div className={"d-flex justify-content-center align-items-center casePicto "+className}
             id={id}
             onClick={onClick}
             style={{background: bgColor, color: textColor, cursor: cursor}}>
            {iconType && <div className="mr-1">{renderTheRightPicto(iconType)}</div>}
            {counts && <div>{counts}</div>}
            {timeSinceLastUpdate && <div>timeSinceLastUpdate</div>}
        </div>
    )
}
export default CasePicto