import * as React from "react";
import {Case} from "../../../../../../model/Case";
import {FormattedMessage} from "react-intl";
import moment from "moment";

interface Props {
    recentCase? : Case
}

const CaseRequestAnswer = (props: Props) => {
    const {recentCase} = props;
    const DATETIME_FORMAT = process.env.REACT_APP_FASTR_DATETIME_FORMAT;
    return (
        <div>

            {recentCase && recentCase.clientRequest &&
                <div className="mb-8 font-size-sm">
                    <span className="mr-1 text-primary text-uppercase"><FormattedMessage id="dossiers.actifs.v2.client.request"/></span>
                    <div className="font-weight-light text-truncate " style={{maxWidth: "200px"}}>
                        {recentCase.clientRequest}
                    </div>
                </div>
            }


            {recentCase && recentCase.notes?.length > 0 &&
                <div className="font-size-sm">
                    <span className="mb-1"><FormattedMessage id="dossiers.actifs.v2.last.answer"/></span>
                    <div className="mb-1 font-weight-light font-size-xs text-grey-light text-truncate" >
                        Le {recentCase.notes[0].creationDate && moment(recentCase.notes[0].creationDate).format(DATETIME_FORMAT)} par {recentCase.notes[0].creator?.login && recentCase.notes[0].creator?.login}
                    </div>
                    <div className="font-weight-light mb-1 text-truncate" style={{maxWidth: "200px"}}>
                        {recentCase.notes[0].description}
                    </div>
                </div>
            }

        </div>
    )
}

export default CaseRequestAnswer