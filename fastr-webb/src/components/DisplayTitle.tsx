import React from "react";
import {FormattedMessage} from "react-intl";
import Skeleton from 'react-loading-skeleton';
import LoadableIcon from "./LoadableIcon";

interface Props {
    fieldName?: string,
    icon?: string,
    isLoading: any,
    optional?: boolean
    children?: any
    uppercase?: boolean
    imgSrc?: string
}

const DisplayTitle = (props: Props) => {

    const {fieldName, icon, isLoading, uppercase, children, imgSrc} = props;


    if (!fieldName) {
        return (
            <div>
                <h5 className={`m-0 d-flex ${uppercase ? 'text-uppercase' : ''}`}>
                    {!!imgSrc && <img className="img-responsive mr-2" width={40} src={imgSrc}/>}
                    {!!icon && <div className="d-flex flex-middle">
                        <LoadableIcon isLoading={isLoading} color="gradient" name={icon} className={`mr-3`}/>
                    </div>
                    }
                    <div className="d-flex flex-align-middle">
                        <div className={"w-100"}>
                            {children}
                        </div>
                    </div>
                </h5>
            </div>
        )
    } else if (!isLoading) {
        return (
            <div>
                <h5 className={`m-0 d-flex ${uppercase ? 'text-uppercase' : ''}`}>
                    {!!imgSrc && <img className="img-responsive mr-2" width={30} src={imgSrc}/>}
                    {!!icon && <span className="d-flex flex-middle">
                            <LoadableIcon isLoading={isLoading} color="gradient" name="icon" className={`mr-3`}/>
                        </span>
                    }
                    <span className="d-flex flex-align-middle">
                            <div>
                                <Skeleton/>
                            </div>
                        </span>
                </h5>
            </div>
        )

    } else {
        return (
            <div>
                <h5 className={`m-0 d-flex ${uppercase ? 'text-uppercase' : ''}`}>
                    {!!imgSrc && <img className="img-responsive mr-2" width={30} src={imgSrc}/>}
                    {!!icon && <span className="d-flex flex-middle">
                            <LoadableIcon isLoading={isLoading} color="gradient" name={icon} className={`mr-3`}/>
                        </span>
                    }
                    <span className="d-flex flex-align-middle">
                            <div>
                        <FormattedMessage id={fieldName}/>
                            </div>
                        </span>
                </h5>
            </div>
        )
    }

}

export default DisplayTitle
