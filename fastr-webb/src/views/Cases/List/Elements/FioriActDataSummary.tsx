import * as React from "react";

import {FormattedMessage} from "react-intl";
import * as moment from "moment";
import OKIcon from "../../../Commons/Icons/OKIcon";
import KOIcon from "../../../Commons/Icons/KOIcon";

const FioriActDataSummary = ({resource, act}) => {
    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;

    const actOkSummary = () => {
        return (
            <div>
                <div className="row mb-2">
                    <div className="col">
                    <span className="font-weight-bold"><FormattedMessage
                        id="contactData.summary.creationDate"/></span>
                        <br/>
                        {moment(resource?.creationDate).format(DATETIME_FORMAT)}
                    </div>
                    <div className="col">                            <span
                        className="font-weight-bold"><FormattedMessage
                        id="contactData.summary.contactCreator"/></span>
                        <br/>
                        {resource?.creator?.login}
                    </div>
                    <div className="col">
                    <span className="font-weight-bold"><FormattedMessage
                        id="fiori.summary.status"/></span>
                        <br/>
                        <OKIcon/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col">
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    {act?.actDetail?.data &&
                        act.actDetail.data.map(dataAct =>
                            <div key={dataAct.id} className="col-sm">
                                <span className="font-weight-bold">{dataAct.keyLabel}</span>
                                <br/>
                                {dataAct.value}
                            </div>)}
                </div>
            </div>);
    }

    const actKoSummary = () => {
        return (
            <div className="row">
                <div className="col">
                            <span className="font-weight-bold"><FormattedMessage
                                id="contactData.summary.creationDate"/></span>
                    <br/>
                    {moment(resource?.creationDate).format(DATETIME_FORMAT)}
                </div>
                <div className="col">
                            <span className="font-weight-bold"><FormattedMessage
                                id="fiori.summary.status"/></span>
                    <br/>
                    <KOIcon/>
                </div>
                <div className="col">
                        <span className="font-weight-bold"><FormattedMessage
                            id="fiori.summary.failureReason"/></span>
                    <br/>
                    {resource?.failureReason}
                </div>

            </div>);
    }

    return (
        <React.Fragment>
            {resource?.valid ? actOkSummary() : actKoSummary()}
        </React.Fragment>
    )
}
export default FioriActDataSummary;