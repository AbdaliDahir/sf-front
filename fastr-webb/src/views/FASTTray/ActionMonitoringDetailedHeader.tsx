import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Badge, Button, CardHeader, CardTitle, Col, Row} from "reactstrap";
import Card from "reactstrap/lib/Card";
import {connect} from "react-redux";
import {Activity} from "../../model/Activity";
import {AppState} from "../../store";
import {ActionMonitoringAmountIndicators} from "../../model/Tray/ActionMonitoringAmountIndicators";
import {TrayHeaderFilterEnum} from "../../model/Tray/TrayHeaderFilterEnum";
import {setTrayHeaderFilter} from "../../store/actions";
import {useEffect, useState} from "react";


interface Props {
    actionMonitoringAmountIndicators: ActionMonitoringAmountIndicators
    assignAction: () => void
    userActivity: Activity
    isAssignDisable: boolean
    setTrayHeaderFilter: (value) => void
    fetchAndStoreAgentTrayActionMonitorings: (activityCodeSelected: string, themeSelection: string, status? : string) => void
    trayHeaderFilter: TrayHeaderFilterEnum
    themeSelection: string[]
}

const ActionMonitoringDetailedHeader: React.FunctionComponent<Props> = (props: Props) => {
    const {assignAction, actionMonitoringAmountIndicators, userActivity, trayHeaderFilter} = props;
    const [assignButtonDisabled, setAssignButtonDisabled] = useState(true);
    const setOrUnsetTrayHeaderFilter = (filter: TrayHeaderFilterEnum) => async () => {
        props.setTrayHeaderFilter(props.trayHeaderFilter !== filter ? filter : TrayHeaderFilterEnum.NONE);
    }

    useEffect(() => {
        setAssignButtonDisabled(actionMonitoringAmountIndicators.toMonitorActions === 0)
    }, [actionMonitoringAmountIndicators.toMonitorActions])

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
                            disabled={assignButtonDisabled}
                        >
                            <FormattedMessage id={"tray.assigned.cases.button.label"}/>
                        </Button>
                    </div>
                </Col>

                <Col>
                    <Card className="text-center">
                        <CardHeader><FormattedMessage id={"tray.tomonitor.actions.amount.label"}/></CardHeader>
                        <CardTitle>{actionMonitoringAmountIndicators.toMonitorActions}</CardTitle>
                    </Card>
                </Col>

                <Col>
                    <Card className="text-center"
                          style={{
                              boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.MONITORED ? '#343a40 0 0 1rem' : '',
                              cursor: "pointer"
                            }}
                          onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.MONITORED)}>
                        <CardHeader><FormattedMessage id={"tray.monitored.actions.amount.label"}/></CardHeader>
                        <CardTitle>{actionMonitoringAmountIndicators.monitoredActions}</CardTitle>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center"
                          style={{
                              boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.MONITORING_TO_FINALIZE ? '#343a40 0 0 1rem' : '',
                              cursor: "pointer"
                            }}
                          onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.MONITORING_TO_FINALIZE)}>
                        <CardHeader><FormattedMessage
                            id={"tray.monitoringtofinalize.actions.amount.label"}/></CardHeader>
                        <CardTitle>{actionMonitoringAmountIndicators.monitoringToFinalizeActions}</CardTitle>
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
    userActivity: state.store.applicationInitialState.user?.activity,
    themeSelection: state.tray.themeSelection
})

const mapDispatchToProps = {
    setTrayHeaderFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionMonitoringDetailedHeader);