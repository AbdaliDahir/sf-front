import React from "react";

interface Props {
    color: "gradient" | "black" | "white"
    name: string
    className?: string
}

const Icon = (props: Props) => {

    if (props.color === "gradient") {
        return <span className={`icon-gradient ${props.name} ${props.className ? props.className : ''}`}/>
    } else if (props.color === "black") {
        return <span className={`icon ${props.name} ${props.className ? props.className : ''}`}/>
    } else {
        return <span className={`icon-white ${props.name} ${props.className ? props.className : ''}`}/>
    }
}

export default Icon
