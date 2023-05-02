import React from "react"
import {Progress} from "reactstrap";
import {progressBackgroundByValue, valueToPercentage} from "../../utils/ProgressUtils";

class Props {
    value: number
    total: number
    size?: "progress-xs" | "progress-sm" | "progress-md" | "progress-lg" | "progress-xl"
}
const ProgressBackgroundStatus = (props: Props) => {
    const size = props.size ? props.size : ""
    const value = valueToPercentage(props.value, props.total)
    return (
        <Progress className={size} barClassName={progressBackgroundByValue(value)} value={value}/>
    )
}

export default ProgressBackgroundStatus;