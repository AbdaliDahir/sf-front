import * as React from "react";
import comment from "../../../../img/ihmV2/comment.svg";
import affectation from "../../../../img/ihmV2/affectation.svg";
import arrowUp from "../../../../img/ihmV2/arrow-up.svg";
import arrowDown from "../../../../img/ihmV2/arrow-down.svg";
import scalingDark from "../../../../img/ihmV2/scaling-dark.svg";
import scalingLight from "../../../../img/ihmV2/scaling-light.svg";
import contactIn from "../../../../img/ihmV2/In.svg";
import contactOut from "../../../../img/ihmV2/out.svg";
import retentionLight from "../../../../img/ihmV2/retention-light.svg";
import retentionDark from "../../../../img/ihmV2/retention-dark.svg";
import antiChurnLight from "../../../../img/ihmV2/anti-churn-light.svg";
import antiChurnDark from "../../../../img/ihmV2/anti-churn-dark.svg";
import incidentLight from "../../../../img/ihmV2/warning.svg";
import actionInProgressPlain from "../../../../img/ihmV2/action-in-progress-plain-white.svg";
import actionInProgressLight from "../../../../img/ihmV2/action-in-progress-light-white.svg";
import actionInProgressDark from "../../../../img/ihmV2/action-in-progress-dark.svg";
import actionWaiting from "../../../../img/ihmV2/action-waiting-white.svg";
import mail from "../../../../img/ihmV2/mail.png";


const pictosMap = new Map([
    ["ENTRANT", contactIn],
    ["SORTANT", contactOut],
    ["COMMENT", comment],
    ["AFFECTATION", affectation],
    ["ARROW_UP", arrowUp],
    ["ARROW_DOWN", arrowDown],
    ["SCALING_DARK", scalingDark],
    ["SCALING_LIGHT", scalingLight],
    ["RETENTION_LIGHT", retentionLight],
    ["RETENTION_DARK", retentionDark],
    ["ANTI_CHURN_LIGHT", antiChurnLight],
    ["ANTI_CHURN_DARK", antiChurnDark],
    ["INCIDENT_LIGHT", incidentLight],
    ["ACTION_PLAIN", actionInProgressPlain],
    ["ACTION_DARK", actionInProgressDark],
    ["ACTION_LIGHT", actionInProgressLight],
    ["ACTION_YELLOW", actionWaiting],
    ["COURIERS", mail],
])


export const renderTheRightPicto = (pictoName: string) => {
    return (
        <React.Fragment>
            <img className="img-responsive" src={pictosMap.get(pictoName)} alt={pictoName}/>
        </React.Fragment>
    );
}