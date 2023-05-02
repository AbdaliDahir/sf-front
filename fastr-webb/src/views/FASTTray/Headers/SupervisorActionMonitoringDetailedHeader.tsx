import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Badge, Button, CardHeader, CardTitle, Col, FormGroup, Row } from "reactstrap";
import Card from "reactstrap/lib/Card";
import { translate } from "../../../components/Intl/IntlGlobalProvider";
import { Activity } from "../../../model/Activity";
import TrayTypeahead from "../Elements/TrayTypeahead";
import { AppState } from "../../../store";
import {connect, useDispatch} from "react-redux";
import {setTrayHeaderFilter, updateSite} from "../../../store/actions";
import { TrayHeaderFilterEnum } from "../../../model/Tray/TrayHeaderFilterEnum";
import { ActionMonitoringAmountIndicators } from "../../../model/Tray/ActionMonitoringAmountIndicators";
import { Site } from "src/model/Site";
import LogicalSiteFilter from "../Filters/LogicalSiteFilter";

interface Props {
    isAssignDisable: boolean
    actionMonitoringAmountIndicators: ActionMonitoringAmountIndicators
    trayHeaderFilter: TrayHeaderFilterEnum
    onChangeTypeahead?: (selected) => void
    assignAction: () => void
    setTrayHeaderFilter: (value) => void
    userActivity: Activity,
    authorizations: string[];
    site?: Site;
    onSiteFilterChange: (value: string) => void;
}

const SupervisorActionMonitoringDetailedHeader: React.FunctionComponent<Props> = (props: Props) => {
    const dispatch = useDispatch()
    const { isAssignDisable, onChangeTypeahead, assignAction, actionMonitoringAmountIndicators, trayHeaderFilter, userActivity, site } = props;

    const setOrUnsetTrayHeaderFilter = (filter: TrayHeaderFilterEnum) => async () => {
        props.setTrayHeaderFilter(props.trayHeaderFilter !== filter ? filter : TrayHeaderFilterEnum.NONE);
    }

    const accessToSiteFilter = () => {
        const FILTER_BANNETTE_SITE_HABILITE = "BANNETTE_FILTRE_SITE_LOGIQUE"
        return props.authorizations.includes(FILTER_BANNETTE_SITE_HABILITE);
    };
    const onSiteChange = (site: Site) => {
        dispatch(updateSite(site))
        props.onSiteFilterChange(site.code)
    };

    return (
        <Row>
            <Col sm={2}>
                <div className="m-1 ml-2">
                    <FormGroup>
                        <Button
                            id="supervisorActionDetailedHeader.assignCase.button.id"
                            color="primary"
                            size="sm"
                            onClick={assignAction}
                            disabled={isAssignDisable}
                        >
                            <FormattedMessage id={"tray.assign.multiple.cases.button.label"} />
                        </Button>

                        <div className="mt-1">
                            <TrayTypeahead id="assign-typeahead"
                                activityCodeSelected={userActivity ? userActivity.code : ""}
                                placeholder={translate.formatMessage({ id: "tray.login.typeahead.placeholder" })}
                                onChange={onChangeTypeahead} />
                        </div>
                    </FormGroup>
                </div>
            </Col>
            <Col sm={6} className="d-flex">
                <Col>
                    <Card
                        className={`text-center h-100 cursor-pointer`}
                        style={{ boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.TO_MONITOR ? '#343a40 0 0 1rem' : '' }}
                        onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.TO_MONITOR)}>
                        <CardHeader style={{ height: "66%" }}><FormattedMessage
                            id={"tray.tomonitor.actions.amount.label"} /></CardHeader>
                        <CardTitle>{actionMonitoringAmountIndicators.toMonitorActions}</CardTitle>
                    </Card>
                </Col>

                <Col>
                    <Card className={`text-center h-100 cursor-pointer`}
                        style={{ boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.MONITORED ? '#343a40 0 0 1rem' : '' }}
                        onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.MONITORED)}>
                        <CardHeader style={{ height: "66%" }}><FormattedMessage
                            id={"tray.monitored.actions.amount.label"} /></CardHeader>
                        <CardTitle>{actionMonitoringAmountIndicators.monitoredActions}</CardTitle>
                    </Card>
                </Col>

                <Col>
                    <Card className={`text-center h-100 cursor-pointer`}
                        style={{ boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.MONITORING_TO_FINALIZE ? '#343a40 0 0 1rem' : '' }}
                        onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.MONITORING_TO_FINALIZE)}>
                        <CardHeader style={{ height: "66%" }}><FormattedMessage
                            id={"tray.monitoringtofinalize.actions.amount.label"} /></CardHeader>
                        <CardTitle>{actionMonitoringAmountIndicators.monitoringToFinalizeActions}</CardTitle>
                    </Card>
                </Col>
            </Col>
            <Col sm={2}>
                <div className="text-center p-1">
                    <h6 className="text-nowrap"><FormattedMessage
                        id={"tray.current.activity.label.synthetic"} /></h6>
                    {
                        userActivity ?
                            <Badge color="secondary">{userActivity.label}</Badge>
                            : <React.Fragment />
                    }
                </div>
            </Col>
            {accessToSiteFilter() && userActivity &&
                <Col sm={2}>
                    <LogicalSiteFilter selected={site?.label}
                        value={site?.label}
                        activity={userActivity?.code}
                        onChange={onSiteChange} />
                </Col>}
        </Row>
    )
}


const mapStateToProps = (state: AppState) => ({
    trayHeaderFilter: state.tray.trayHeaderFilter,
    userActivity: state.store.applicationInitialState.user?.activity,
    authorizations: state.store.applicationInitialState.authorizations,
    site: state.tray.site?? state.store.applicationInitialState?.user?.site
})

const mapDispatchToProps = {
    setTrayHeaderFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(SupervisorActionMonitoringDetailedHeader);