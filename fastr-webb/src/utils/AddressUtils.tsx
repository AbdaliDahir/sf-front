import {Address} from "../model/person";
import React from "react";
import Skeleton from "react-loading-skeleton";

export default class AddressUtils {

    public static isZipcode = (value: string): boolean => {
        if (isNaN(+value)) {
            return false;

        } else {
            return value.length === 5
        }
    };

    public static displaySimpleAddress(address?: Address): JSX.Element {
        if (address) {
            return (
                <React.Fragment>
                    <span>{address?.address1}</span>
                    <br/>
                    <span>{address?.zipcode} {address?.city}</span>
                    <br/>
                    <span>{address?.country ? address?.country : ''}</span>
                </React.Fragment>)
        } else {
            return <Skeleton count={3}/>
        }
    }
}