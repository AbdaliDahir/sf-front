import React from "react";
import {FormGroup} from "reactstrap"
import {FormattedMessage} from "react-intl";
import Skeleton from 'react-loading-skeleton';

interface Props {
    fieldName: string,
    fieldValue?: any,
    bold?: boolean,
    icon?: string,
    isLoading: any,
    optional?: boolean
    children?: JSX.Element
}

const DisplayField = (props: Props) => {

    const {fieldName, fieldValue, bold, icon, optional, isLoading, children} = props;

    const displayValue = () => {
        if (!isLoading) {
            return <Skeleton/>
        }
        if (!!children) {
            return children
        }
        if (optional && (fieldValue === null || fieldValue === undefined || fieldValue === '')) {
            return <React.Fragment/>;
        } else {
            return fieldValue;
        }
    }

    const displayTitle = () => {
        if (!isLoading) {
            return <h6>
                <Skeleton/>
            </h6>
        }
        return <h6>{icon ? <span className={`${icon} pr-1`}/> : <React.Fragment/>}
            <FormattedMessage id={fieldName}/>
        </h6>
    }

    return (
        <FormGroup className="py-1 px-2 display-field mb-1">
            <div>
                {displayTitle()}
                {children ? children : bold ? <span>
                        {displayValue()}
                    </span>
                    : fieldValue }
            </div>
        </FormGroup>
    )
}

export default DisplayField
