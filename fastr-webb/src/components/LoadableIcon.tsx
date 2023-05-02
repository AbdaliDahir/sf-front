import React from "react";
import Skeleton from 'react-loading-skeleton';
import Icon from "./Bootstrap/Icon";

interface Props {
    isLoading: any,
    name: string
    color: "gradient" | "black" | "white"
    className?: string
}

const LoadableIcon = (props: Props) => {

    const {isLoading, color, name, className} = props;

    if (!isLoading) {
        return <Skeleton circle/>
    } else {
        return <Icon color={color} name={name} className={className}/>
    }

}

export default LoadableIcon
