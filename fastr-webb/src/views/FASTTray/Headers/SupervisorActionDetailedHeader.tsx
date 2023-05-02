import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Badge, Button, CardHeader, CardTitle, Col, FormGroup, Row } from "reactstrap";
import Card from "reactstrap/lib/Card";
import { translate } from "../../../components/Intl/IntlGlobalProvider";
import { Activity } from "../../../model/Activity";
import TrayTypeahead from "../Elements/TrayTypeahead";
import { AppState } from "../../../store";
import {connect, useDispatch} from "react-redux";
import {setTrayHeaderFilter, updatePagination, updateSite} from "../../../store/actions";
import { TrayHeaderFilterEnum } from "../../../model/Tray/TrayHeaderFilterEnum";
import { Pagination } from "../../../store/types/Pagination";
import { ActionAmountIndicators } from "../../../model/Tray/ActionAmountIndicators";
import LogicalSiteFilter from "../Filters/LogicalSiteFilter";
import { Site } from "src/model/Site";

interface Props {
    isAssignDisable: boolean;
    actionAmountIndicators: ActionAmountIndicators;
    trayHeaderFilter: TrayHeaderFilterEnum;
    pagination: Pagination;
    themeSelection: string[];
    onChangeTypeahead?: (selected) => void;
    assignAction: () => void;
    setTrayHeaderFilter: (value) => void;
    updatePagination: (pagination: Pagination) => void;
    userActivity: Activity;
    authorizations: string[];
    site?: Site;
    onSiteFilterChange: (value: string) => void;
}

const SupervisorDetailedHeader: React.FunctionComponent<Props> = (props: Props) => {
    const dispatch = useDispatch()
    const { isAssignDisable, onChangeTypeahead, assignAction, actionAmountIndicators, trayHeaderFilter, userActivity, site } = props;

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
            <Col sm={7} className="d-flex">
                <Col>
                    <Card
                        className={`text-center h-100 cursor-pointer`}
                        style={{ boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.QUALIFIED ? '#343a40 0 0 1rem' : '' }}
                        onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.QUALIFIED)}>
                        <CardHeader className="h-75"><FormattedMessage
                            id={"tray.todo.actions.amount.label"} /></CardHeader>
                        <CardTitle>{actionAmountIndicators.qualifiedActions}</CardTitle>
                    </Card>
                </Col>

                <Col>
                    <Card className={`text-center h-100 cursor-pointer`}
                        style={{ boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.ONGOING ? '#343a40 0 0 1rem' : '' }}
                        onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.ONGOING)}>
                        <CardHeader className="h-75"><FormattedMessage
                            id={"tray.actions.ongoing.label"} /></CardHeader>
                        <CardTitle>{actionAmountIndicators.onGoingActions}</CardTitle>
                    </Card>
                </Col>
                <Col>
                    <Card className={`text-center h-100 cursor-pointer`}
                        style={{ boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.NOT_UPDATED_IN_5_DAYS ? '#343a40 0 0 1rem' : '' }}
                        onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.NOT_UPDATED_IN_5_DAYS)}>
                        <CardHeader className="h-75"><FormattedMessage
                            id={"tray.actions.notupdated.label"} /></CardHeader>
                        <CardTitle>{actionAmountIndicators.notUpdatedInLastFiveDays}</CardTitle>
                    </Card>
                </Col>
                <Col>
                    <Card className={`text-center h-100 cursor-pointer`}
                        style={{ boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.ASSIGNMENT_EXCEED ? '#343a40 0 0 1rem' : '' }}
                        onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.ASSIGNMENT_EXCEED)}>
                        <CardHeader className="h-75">
                            <FormattedMessage id={"tray.actions.assignement.exceed.label"} />
                        </CardHeader>
                        <CardTitle>{actionAmountIndicators.assignmentExceed}</CardTitle>
                    </Card>
                </Col>
                <Col>
                    <Card className={`text-center h-100 cursor-pointer`}
                        style={{ boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.NOT_BEFORE_EXCEED ? '#343a40 0 0 1rem' : '' }}
                        onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.NOT_BEFORE_EXCEED)}>
                        <CardHeader className="h-75">
                            <FormattedMessage id={"tray.actions.notbefore.exceed.label"} />
                        </CardHeader>
                        <CardTitle>{actionAmountIndicators.notBeforeExceed}</CardTitle>
                    </Card>
                </Col>
            </Col>
            <Col sm={1}>
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
    themeSelection: state.tray.themeSelection,
    pagination: state.tray.pagination,
    userActivity: state.store.applicationInitialState.user?.activity,
    authorizations: state.store.applicationInitialState.authorizations,
    site: state.tray.site?? state.store.applicationInitialState?.user?.site
})

const mapDispatchToProps = {
    setTrayHeaderFilter,
    updatePagination
}

export default connect(mapStateToProps, mapDispatchToProps)(SupervisorDetailedHeader);