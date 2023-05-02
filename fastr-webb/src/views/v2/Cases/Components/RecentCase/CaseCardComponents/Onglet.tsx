import * as React from "react";
import {RefObject, useRef} from "react";
import "./Onglet.scss"
import {UncontrolledTooltip} from "reactstrap";
import {FormattedMessage} from "react-intl";
import {User} from "src/model/User";
import moment from "moment";
import {renderTheRightPicto} from "../../../List/pictoHandler";

interface Props {
    title: string
    lastModifier?: User
    lastUpdateDate
    alerting?: boolean,
    fullHeight: boolean
}

const Onglet = (props: Props) => {
    const {title, lastModifier, lastUpdateDate, alerting, fullHeight} = props;

    const divRef: RefObject<HTMLDivElement> = useRef(null)
    const MOMENT_DATE_FORMAT = process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT;
    const momentDate = moment(lastUpdateDate);
    const timeElapsedSinceLastUpdate: string = momentDate.fromNow(true)
    const alertingPicto = alerting ? renderTheRightPicto("ACTION_YELLOW") : undefined;

    return (
        <div>
            <div className={`${fullHeight? "full-height" : "partial-height"} timeElapsedBadge d-flex flex-column justify-content-center align-items-center`} ref={divRef}>
                <div className="pb-3 font-size-xxs">
                    {title}
                </div>
                <div className="font-weight-bold font-size-12">
                    {timeElapsedSinceLastUpdate}
                </div>
                {
                    divRef.current && lastModifier &&
                    <UncontrolledTooltip target={divRef.current}>
                        <FormattedMessage id={"cases.get.details.modifier.date"} />
                        <label className={"mr-1 ml-1"}>{momentDate.format(MOMENT_DATE_FORMAT)}</label>
                        <FormattedMessage id={"essensial.engagment.by"}/>
                        <label>{lastModifier.login} ({lastModifier.activity?.label} - {lastModifier.activity?.code})</label>
                    </UncontrolledTooltip>
                }

            </div>

            <div className="d-flex justify-content-center mt-3">
                {alertingPicto && <div className={"generic-card-toggle__picto action-waiting ml-2"}>
                    <div id={"actionPicto"}>
                        {alertingPicto}
                    </div>
                    <UncontrolledTooltip  target={"actionPicto"}>
                        <FormattedMessage id={"cases.actions.consult.yellow.picto"}/>
                    </UncontrolledTooltip>
                </div>}
            </div>
        </div>
    )
}
export default Onglet