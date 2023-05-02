import * as React from "react";
import {PopoverBody, UncontrolledPopover} from "reactstrap";
import {FormattedMessage} from "react-intl";
import ExternalLinksBlock from "../views/Clients/ExternalLinksBlock";

export function renderHTML(rawHTML: string) {
    return <div dangerouslySetInnerHTML={{__html: rawHTML}} />
}

export function renderLoadingMessage () {
    return (<div className="d-flex justify-content-center align-items-center h-100">
        <span className="icon icon-info mr-1"/>
        <span><FormattedMessage id="recommandations.loading"/></span>
    </div>)
}

export function renderErrorMsg(fetchingRecomnandationsErrorMsg) {
    return (
        <React.Fragment>
            {fetchingRecomnandationsErrorMsg &&
            <UncontrolledPopover
                placement="bottom"
                trigger="hover"
                target={"fetching-error"}>
                <PopoverBody>
                    {fetchingRecomnandationsErrorMsg}
                </PopoverBody>
            </UncontrolledPopover>
            }
            <div id="" className="d-flex justify-content-center align-items-center h-100">
                { fetchingRecomnandationsErrorMsg ?
                    <span id={"fetching-error"}  className={`cursor-pointer mr-1`}>/!\</span>
                    : <span className={`icon icon-info mr-1`}/>
                }
                <span><FormattedMessage id="no.recommandations"/></span>
            </div>
        </React.Fragment>)
}

export function renderEzyExternalLink(externalAppsSettings, recommandations, idParams) {
    if(!!externalAppsSettings?.length) {
        return <ExternalLinksBlock settings={externalAppsSettings} isLoading={recommandations} idParams={idParams} textLink={"VOIR DANS EZY"}/>
    } else {
        return <React.Fragment/>
    }
}