import i5G from "../../../../../img/logos-r-seau-on-5-g.svg";
import i4G from "../../../../../img/4g.png";
import React from "react";


export const renderOfferNetworkInfo = (networkType? : string, debit?: string, unit?: string) => {

    const networkIcon = getNetworkIconSrc(networkType)

    if(networkIcon){
        return (
            <React.Fragment>
                {renderOfferNetworkIcon(networkIcon, networkType!)}
                {networkDetails(debit, unit)}
            </React.Fragment>
        )
    }
    return (<React.Fragment/>);
};

export const is5G = (networkType? : string) => {
    return networkType && networkType.toUpperCase().includes("5G")
}

export const is4G = (networkType? : string) => {
    return networkType && networkType.toUpperCase().includes("4G")
}

const getNetworkIconSrc = (networkType? : string) =>  {

    if(is5G(networkType)){
        return i5G
    }

    if(is4G(networkType)){
        return i4G
    }

    return undefined;
};

const renderOfferNetworkIcon = (networkIcon, alt : string) => {
    return (
        <React.Fragment>
            <img className="img-responsive mr-1 ml-1" width={40} src={networkIcon} alt={alt}/>
        </React.Fragment>
    )
};

const networkDetails = (debit?: string, unit?: string) => {
    if (debit && unit) {
        return <React.Fragment>
            {debit} {" "} {unit}
        </React.Fragment>
    }
    return <React.Fragment/>
}
