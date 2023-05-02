import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Badge, Button} from "reactstrap";
import {CaseAmountIndicators} from "../../../model/Tray/CaseAmountIndicators";
import {connect, useSelector} from "react-redux";
import {AppState} from "../../../store";
import {Activity} from "../../../model/Activity";
import {ApplicationInitialState} from "../../../model/ApplicationInitialState";
import {isAuthorizedSuperviseur} from "../../../utils";

interface Props {
    caseAmountIndicators: CaseAmountIndicators
    assignCase: () => void
    userActivity: Activity
    appInitialState?: ApplicationInitialState
}

const SyntheticHeader: React.FunctionComponent<Props> = (props: Props) => {
    const {assignCase, caseAmountIndicators, userActivity, appInitialState} = props;
    const authorizations  = useSelector((state: AppState) => state.authorization.authorizations)
    const getActivity = () => {
        if (appInitialState && appInitialState.user) {
            return appInitialState.user.activity;
        } else if (userActivity) {
            return userActivity
        } else {
            return undefined
        }
    }

    const displayActivity = () => {
        const activity = getActivity();
        if (activity) {
            return <Badge color="secondary">{activity.label}</Badge>;
        } else {
            return <React.Fragment/>;
        }
    }

    const getViewType = () => {
        return isAuthorizedSuperviseur(authorizations) ?
            <FormattedMessage id={"tray.supervisor.view"}/>
            : <FormattedMessage id={"tray.agent.view"}/>
    }

    return (
        <div className="d-flex flex-row justify-content-around m-1">
            <div className="text-center my-4">
                <Badge color="secondary">{getViewType()}</Badge>
            </div>
            <Button
                id="syntheticHeader.assignCase.button.id"
                color="primary"
                size="sm"
                onClick={assignCase}
                disabled={caseAmountIndicators.qualifiedCases === 0}
                className="px-1 my-3"
            >
                <FormattedMessage id={"tray.assigned.cases.button.label"}/>
            </Button>

            <div className="text-center p-1">
                <h6 className="text-nowrap"><FormattedMessage
                    id={"tray.todo.cases.amount.label.synthetic"}/></h6>
                <Badge color="secondary">{caseAmountIndicators.qualifiedCases}</Badge>
            </div>

            <div className="text-center p-1">
                <h6 className="text-nowrap"><FormattedMessage
                    id={"tray.assigned.cases.amount.label.synthetic"}/></h6>
                <Badge color="secondary">{caseAmountIndicators.onGoingCases}</Badge>
            </div>

            <div className="text-center p-1">
                <h6 className="text-nowrap"><FormattedMessage
                    id={"tray.cases.reopenedCases.label"} /></h6>
                <Badge color="secondary">{caseAmountIndicators.reopenedCases}</Badge>
            </div>

            <div className="text-center p-1">
                <h6 className="text-nowrap"><FormattedMessage
                    id={"tray.current.activity.label.synthetic"}/></h6>
                {displayActivity()}
            </div>
        </div>
    )
}

const mapStateToProps = (state: AppState) => ({
    userActivity: state.session.userActivity
})

export default connect(mapStateToProps)(SyntheticHeader);