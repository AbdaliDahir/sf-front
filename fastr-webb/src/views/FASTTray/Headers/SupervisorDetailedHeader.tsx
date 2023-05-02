import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Badge, Button, CardHeader, CardTitle, Col, FormGroup, Row} from "reactstrap";
import Card from "reactstrap/lib/Card";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {Activity} from "../../../model/Activity";
import TrayTypeahead from "../Elements/TrayTypeahead";
import {AppState} from "../../../store";
import {connect, useDispatch} from "react-redux";
import {setTrayHeaderFilter, updatePagination, updateSite} from "../../../store/actions/TrayActions";
import {CaseAmountIndicators} from "../../../model/Tray/CaseAmountIndicators";
import {TrayHeaderFilterEnum} from "../../../model/Tray/TrayHeaderFilterEnum";
import {Pagination} from "../../../store/types/Pagination";
import LogicalSiteFilter from "../Filters/LogicalSiteFilter";
import {Site} from "../../../model/Site";
import {ApplicationInitialState} from "../../../model/ApplicationInitialState";

interface Props {
    isAssignDisable: boolean
    caseAmountIndicators: CaseAmountIndicators
    trayHeaderFilter: TrayHeaderFilterEnum
    pagination: Pagination
    themeSelection: string[]
    onChangeTypeahead?: (selected) => void
    assignCase: () => void
    setTrayHeaderFilter: (value) => void
    updatePagination: (pagination: Pagination) => void
    userActivity: Activity
    appInitialState?: ApplicationInitialState
    onSiteFilterChange: (value) => void,
    authorizations: string [],
    site?: Site
}

const SupervisorDetailedHeader: React.FunctionComponent<Props> = (props: Props) => {
    const {isAssignDisable, onChangeTypeahead, assignCase, caseAmountIndicators, trayHeaderFilter, userActivity, appInitialState, site} = props;
    const dispatch = useDispatch()
    const setOrUnsetTrayHeaderFilter = (filter: TrayHeaderFilterEnum) => async () => {
        props.setTrayHeaderFilter(props.trayHeaderFilter !== filter ? filter : TrayHeaderFilterEnum.NONE);
    }

    const accessToSiteFilter = () => {
        const FILTER_BANNETTE_SITE_HABILITE = "BANNETTE_FILTRE_SITE_LOGIQUE"
        return props.authorizations.includes(FILTER_BANNETTE_SITE_HABILITE);
    };

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
    const onSiteChange = (site: Site) => {
        dispatch(updateSite(site))
        props.onSiteFilterChange(site.code)
    }

    return (
        <Row>
            <Col sm={2}>
                <div className="m-1 ml-2">
                    <FormGroup>
                        <Button
                            id="supervisorDetailedHeader.assignCase.button.id"
                            color="primary"
                            size="sm"
                            onClick={assignCase}
                            disabled={isAssignDisable}
                        >
                            <FormattedMessage id={"tray.assign.multiple.cases.button.label"}/>
                        </Button>

                        <div className="mt-1">
                            <TrayTypeahead id="assign-typeahead"
                                           activityCodeSelected={getActivity()?.code || ""}
                                           placeholder={translate.formatMessage({id: "tray.login.typeahead.placeholder"})}
                                           onChange={onChangeTypeahead}/>
                        </div>
                    </FormGroup>
                </div>
            </Col>
            <Col sm={accessToSiteFilter() ? 6 : 8} className="d-flex">

                <Col>
                    <Card
                        className={`text-center h-100 cursor-pointer`}
                        style={{boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.QUALIFIED ? '#343a40 0 0 1rem' : ''}}
                        onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.QUALIFIED)}>
                        <CardHeader style={{height:"66%"}}><FormattedMessage id={"tray.todo.cases.amount.label"}/></CardHeader>
                        <CardTitle>{caseAmountIndicators.qualifiedCases}</CardTitle>
                    </Card>
                </Col>

                <Col>
                    <Card className={`text-center h-100 cursor-pointer`}
                          style={{boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.ONGOING ? '#343a40 0 0 1rem' : ''}}
                          onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.ONGOING)}>
                        <CardHeader style={{height: "66%"}}><FormattedMessage
                            id={"tray.cases.ongoing.label"}/></CardHeader>
                        <CardTitle>{caseAmountIndicators.onGoingCases}</CardTitle>
                    </Card>
                </Col>

                    <Col>
                        <Card
                            className={`text-center h-100 cursor-pointer`}
                            style={{boxShadow: trayHeaderFilter === TrayHeaderFilterEnum.REOPENED ? '#343a40 0 0 1rem' : ''}}
                            onClick={setOrUnsetTrayHeaderFilter(TrayHeaderFilterEnum.REOPENED)}>
                            <CardHeader style={{height:"66%"}}><FormattedMessage
                                id={"tray.cases.reopenedCases.label"}/></CardHeader>
                            <CardTitle>{caseAmountIndicators.reopenedCases}</CardTitle>
                        </Card>
                    </Col>
                </Col>
            <Col sm={2}>
                <div className="text-center p-1">
                    <h6 className="text-nowrap">
                        <FormattedMessage id={"tray.current.activity.label.synthetic"}/>
                    </h6>
                    { displayActivity() }
                </div>
            </Col>

            <Col sm={2}>
                {  accessToSiteFilter() && userActivity && <LogicalSiteFilter  selected={site?.label}
                                                               value={site?.label}
                                                               activity={userActivity?.code}
                                                               onChange={onSiteChange} /> }
            </Col>
        </Row>
    )
}


const mapStateToProps = (state: AppState) => ({
    trayHeaderFilter: state.tray.trayHeaderFilter,
    themeSelection: state.tray.themeSelection,
    pagination: state.tray.pagination,
    userActivity: state.session.userActivity,
    authorizations: state.authorization.authorizations,
    site: state.tray.site?? state.store.applicationInitialState?.user?.site
})

const mapDispatchToProps = {
    setTrayHeaderFilter,
    updatePagination
}

export default connect(mapStateToProps, mapDispatchToProps)(SupervisorDetailedHeader);