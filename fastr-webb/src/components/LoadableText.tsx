import React from "react";
import Skeleton from 'react-loading-skeleton';

interface Props {
    fieldValue?: any,
    isLoading: any,
    optional?: boolean,
    children?: any
}

const LoadableText = (props: Props) => {

    const {optional, isLoading, fieldValue, children} = props;

    if (!isLoading) {
        return <Skeleton/>
    }
    if (optional && (fieldValue === null || fieldValue === undefined || fieldValue === '' || children == undefined)) {
        return <React.Fragment/>;
    } else {
        if (fieldValue) {
            return fieldValue;
        } else {
            return children
        }
    }

}

export default LoadableText
