import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Badge, Button, CardHeader, CardTitle, Col, Row} from "reactstrap";
import Card from "reactstrap/lib/Card";
import {connect} from "react-redux";
import {ActionAmountIndicators} from "../../model/Tray/ActionAmountIndicators";
import {Activity} from "../../model/Activity";
import {AppState} from "../../store";
import { setTrayHeaderFilter } from "../../store/actions";
import { TrayHeaderFilterEnum } from "src/model/Tray/TrayHeaderFilterEnum";


interface Props {
    actionAmountIndicators: ActionAmountIndicators
    assignAction: () => void
    userActivity: Activity
    trayHeaderFilter: TrayHeaderFilterEnum;
    setTrayHeaderFilter: (value) => void;
}

const DetailedHeader: React.FunctionComponent<Props> = (props: Props) => {
    const {assignAction, actionAmountIndicators, userActivity, trayHeaderFilter} = props;

    const setOrUnsetTrayHeaderFilter = (filter: TrayHeaderFilterEnum) => async () => {
        props.setTrayHeaderFilter(props.trayHeaderFilter !== filter ? filter : TrayHeaderFilterEnum.NONE);
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
                        onClick={assignAction}
                        disabled={actionAmountIndicators.qualifiedActions === 0}
                    >
                        <FormattedMessage id={"tray.assigned.cases.button.label"}/>
                    </Button>
                </div>
            </Col>

            <Col>
                <Card className="text-center">
                    <CardHeader><FormattedMessage id={"tray.todo.actions.amount.label"}/></CardHeader>
                    <CardTitle>{actionAmountIndicators.qualifiedActions}</CardTitle>
                </Card>
            </Col>

            <Col>
                <Card className="text-center">
                    <CardHeader><FormattedMessage id={"tray.assigned.actions.amount.label"}/></CardHeader>
                    <CardTitle>{actionAmountIndicators.onGoingActions}</CardTitle>
                </Card>
            </Col>
            <Col>
            
                <Card className="text-center"
                 style={{ boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.NOT_UPDATED_IN_5_DAYS ? '#343a40 0 0 1rem' : '' }}
                 onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.NOT_UPDATED_IN_5_DAYS)}>
                    <CardHeader><FormattedMessage id={"tray.actions.notupdated.label"}/></CardHeader>
                    <CardTitle>{actionAmountIndicators.notUpdatedInLastFiveDays}</CardTitle>
                </Card>
            </Col>
            <Col>
            <Card className="text-center"
            style={{ boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.ASSIGNMENT_EXCEED ? '#343a40 0 0 1rem' : '' }}
            onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.ASSIGNMENT_EXCEED)}>
                    <CardHeader><FormattedMessage id={"tray.actions.assignement.exceed.label"}/></CardHeader>
                    <CardTitle>{actionAmountIndicators.assignmentExceed}</CardTitle>
                </Card>
            </Col>
            <Col>
            <Card className="text-center"
                        style={{ boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.NOT_BEFORE_EXCEED ? '#343a40 0 0 1rem' : '' }}
                        onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.NOT_BEFORE_EXCEED)}>
                    <CardHeader><FormattedMessage id={"tray.actions.notbefore.exceed.label"}/></CardHeader>
                    <CardTitle>{actionAmountIndicators.notBeforeExceed}</CardTitle>
                </Card>
            </Col>


            <Col>
                <div className="text-center p-1">
                    <h6 className="text-nowrap"><FormattedMessage
                        id={"tray.current.activity.label.synthetic"}/></h6>
                    {
                        userActivity ?
                            <Badge color="secondary">{userActivity.label}</Badge>
                            : <React.Fragment/>
                    }
                </div>
            </Col>
        </Row>

        </React.Fragment>
    )

}

const mapStateToProps = (state: AppState) => ({
    trayHeaderFilter: state.tray.trayHeaderFilter,
    userActivity: state.store.applicationInitialState.user?.activity
})

const mapDispatchToProps = {
    setTrayHeaderFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailedHeader);