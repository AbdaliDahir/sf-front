
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Badge, Button, CardHeader, CardTitle, Col, Row} from "reactstrap";
import Card from "reactstrap/lib/Card";

import {CaseAmountIndicators} from "../../../model/Tray/CaseAmountIndicators";
import {connect} from "react-redux";
import {AppState} from "../../../store";
import {Activity} from "../../../model/Activity";
import {ApplicationInitialState} from "../../../model/ApplicationInitialState";

interface Props {
    caseAmountIndicators: CaseAmountIndicators
    assignCase: () => void
    userActivity: Activity
    appInitialState?: ApplicationInitialState
}

const DetailedHeader: React.FunctionComponent<Props> = (props: Props) => {
    const {assignCase, caseAmountIndicators, userActivity, appInitialState} = props;

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

    return (
        <React.Fragment>
        <Row>
            <Col>
                <div className="m-1 ml-2">
                    <Button
                        id="detailedHeader.assignCase.button.id"
                        color="primary"
                        size="sm"
                        onClick={assignCase}
                        disabled={caseAmountIndicators.qualifiedCases === 0}
                    >
                        <FormattedMessage id={"tray.assigned.cases.button.label"}/>
                    </Button>
                </div>
            </Col>

            <Col>
                <Card className="text-center">
                    <CardHeader><FormattedMessage id={"tray.todo.cases.amount.label"}/></CardHeader>
                    <CardTitle>{caseAmountIndicators.qualifiedCases}</CardTitle>
                </Card>
            </Col>

            <Col>
                <Card className="text-center">
                    <CardHeader><FormattedMessage id={"tray.assigned.cases.amount.label"}/></CardHeader>
                    <CardTitle>{caseAmountIndicators.onGoingCases}</CardTitle>
                </Card>
            </Col>

            <Col>
                <Card className="text-center">
                    <CardHeader><FormattedMessage id={"tray.cases.reopenedCases.label"}/></CardHeader>
                    <CardTitle>{caseAmountIndicators.reopenedCases}</CardTitle>
                </Card>
            </Col>

            <Col>
                <div className="text-center p-1">
                    <h6 className="text-nowrap">
                        <FormattedMessage id={"tray.current.activity.label.synthetic"}/>
                    </h6>
                    { displayActivity() }
                </div>
            </Col>
        </Row>

        </React.Fragment>
    )

}

const mapStateToProps = (state: AppState) => ({
    userActivity: state.session.userActivity
})

export default connect(mapStateToProps)(DetailedHeader);