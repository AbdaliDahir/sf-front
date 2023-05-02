import * as React from 'react';
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

import { NotificationManager } from "react-notifications";
import { connect } from 'react-redux';
import { translate } from "src/components/Intl/IntlGlobalProvider";
import { Activity } from 'src/model/Activity';
import {
    assignActionMonitoring, assignMultipleActionMonitoringsByLogin,
    dispatchAndStoreThemesSelection,
    fetchAndStoreSVTrayActionMonitorings,
    fetchAndStoreTrayActionMonitoringAmountIndicators, updateSite,
} from 'src/store/actions';
import { AppState } from "../../store";
import { Pagination } from "../../store/types/Pagination"
import { Action } from "../../model/actions/Action";
import ActionThemeFilter from "./Filters/ActionMonitoringThemeFilter";
import ActionsSuiviesTrayTable from "./Tables/actionsSuivies/ActionsSuiviesTrayTable";
import ActionsSuiviesTrayHeader from "./ActionsSuiviesTrayHeader";
import {isAuthorizedSuperviseur} from "../../utils";
import {SessionStorageKeys} from "../../model/TableFilters/SessionStorageKeys";
import {ActionsSuiviesFilters} from "../../model/TableFilters/actionsSuivies/ActionsSuiviesFilters";
import {Base64} from "js-base64";


interface ActionTrayProps {
    actions: Action[]
    pagination: Pagination
    userActivity: Activity
    fetchAndStoreSVTrayActionMonitorings: (activityCodeSelected: string, pagination: Pagination, site?: string) => void
    sessionId?: string
    authorizations: Array<string>
    actionMonitoringAmountIndicators
    onChangeTypeahead?: (selected) => void
    selectedActions?: string[]
    selectedLogin?: string
    themeSelection: string[]
    assignActionMonitoring
    dispatchAndStoreThemesSelection
    assignMultipleActionMonitoringsByLogin
    fetchAndStoreTrayActionMonitoringAmountIndicators
    onAssignSupervisor?: (activitySelected: Activity) => Promise<Array<Action>>

    onSelectAction?: (row, isSelect) => void;
    userLogin: string
    updateSite
}

interface ActionTrayState {
    activitySelected: string
    isSupervisor: boolean,
    site?: string;
}

class ActionsSuiviesTrayContainer extends React.Component<ActionTrayProps, ActionTrayState> {

    constructor(props: ActionTrayProps) {
        super(props);
        this.state = {
            activitySelected: "",
            isSupervisor: false,
            site: undefined
        }
    }

    public async componentWillMount() {
        if (isAuthorizedSuperviseur(this.props.authorizations)) {
            this.setState({
                isSupervisor: true
            })
        }
        const activitySelected = this.props.userActivity && this.props.userActivity.code ?
            this.props.userActivity.label
            : translate.formatMessage({ id: "tray.activity.none" });
        this.setState({
            activitySelected
        })
        if(this.props.userActivity!.code){
            const encodedSessionStorageFilters = sessionStorage.getItem(this.props.userActivity!.code+SessionStorageKeys.ACTIONS_SUIVIES)
            if(encodedSessionStorageFilters !== null) {
                const sessionStorageFilters: ActionsSuiviesFilters = JSON.parse(Base64.decode(encodedSessionStorageFilters))
                if(sessionStorageFilters.site){
                    this.props.updateSite(sessionStorageFilters.site)
                    this.setState({
                        site:sessionStorageFilters.site.code
                    })
                }
            }
        }
    }

    public async componentWillReceiveProps(nextProps: Readonly<ActionTrayProps>) {
        if (this.props.themeSelection.join(",") !== nextProps.themeSelection.join(",")) {
            const actCode = this.getActivityCode();
            const themeSelection = this.formatThemeSelection(nextProps.themeSelection);
            await this.props.fetchAndStoreTrayActionMonitoringAmountIndicators(actCode, themeSelection, this.state.isSupervisor);
        }
    }

    public getActivityCode() {
        return this.props.userActivity ? this.props.userActivity.code : "";
    }

    public formatThemeSelection = (themeSelection: string[]) => {
        const placeHolderOption: string = translate.formatMessage({ id: "tray.cases.filter.themes.all" });
        return themeSelection.filter(themeSelected => themeSelected !== placeHolderOption).join(",");
    }

    public async fetchData( site?: string) {
        try {
            const activityCode: string = this.getActivityCode();
            await this.props.fetchAndStoreSVTrayActionMonitorings(activityCode, {
                ...this.props.pagination,
                filters: this.props.pagination.filters,
                page: this.props.pagination.page - 1
            }, site ?? this.state.site)
            const themeSelection = this.formatThemeSelection(this.props.themeSelection);
            await this.props.fetchAndStoreTrayActionMonitoringAmountIndicators(activityCode, themeSelection, this.state.isSupervisor, site ?? this.state.site);
        } catch (e) {
            console.error(e);
            NotificationManager.error(e.message)
        }
    }


    public assignActionMonitoring = async () => {
        const activityCodeSelected = this.getActivityCode();
        const { selectedLogin, selectedActions, onAssignSupervisor, actions } = this.props;
        const { isSupervisor } = this.state;

        try {
            const placeHolderOption: string = translate.formatMessage({ id: "tray.cases.filter.themes.all" });
            let themeSelection = this.formatThemeSelection(this.props.themeSelection);
            if (isSupervisor && selectedActions && selectedLogin && onAssignSupervisor) {
                let eligibleActions: (string | undefined)[] = actions.filter(action =>
                    selectedActions.find(id => id === action.actionId && action.monitoringCurrentState?.assignee.login !== selectedLogin))
                    .map(eligibleAction => eligibleAction.actionId);
                if (eligibleActions.length > 0) {
                    await this.props.assignMultipleActionMonitoringsByLogin(this.props.userActivity, eligibleActions, selectedLogin);
                    NotificationManager.success(translate.formatMessage(
                        { id: "tray.success.multiple.action.assign.login" },
                        {
                            nbOfActions: eligibleActions.length,
                            login: selectedLogin
                        }));

                    await this.props.dispatchAndStoreThemesSelection([placeHolderOption]);
                    await this.fetchData()
                } else {
                    NotificationManager.success(translate.formatMessage(
                        { id: 'tray.multiple.action.login.already.assign' },
                        { login: selectedLogin }));
                    await this.props.dispatchAndStoreThemesSelection([placeHolderOption]);
                    await this.fetchData()
                }
            } else {
                if (!themeSelection) {
                    themeSelection = "Tous";
                }
                await this.props.assignActionMonitoring(activityCodeSelected, themeSelection);
                await this.props.dispatchAndStoreThemesSelection([placeHolderOption]);
                await this.fetchData()
            }
        } catch (e) {
            console.error(e);
            if (e?.exceptionName === "ConflictException") {
                NotificationManager.error(translate.formatMessage(
                    { id: "tray.error.assign" },
                    {
                        login: selectedLogin,
                        activity: this.state.activitySelected
                    }));
            } else {

                NotificationManager.error(translate.formatMessage(
                    { id: e.message },
                    {
                        login: selectedLogin,
                        activity: this.state.activitySelected
                    }));
            }
            // refresh data
            this.fetchData(this.state.site).then()
        }
    };

    public onSiteFilterChange = (site: string) => {
        this.setState({ site });
    }
    public render(): JSX.Element {
        const { actionMonitoringAmountIndicators, onChangeTypeahead, selectedActions, selectedLogin } = this.props;
        const { isSupervisor } = this.state;
        const isAssignDisable = !(selectedLogin && selectedActions && selectedActions.length);
        const actCode = this.getActivityCode();

        return (
            <div className={"tray"}>

                <ActionsSuiviesTrayHeader detailed={true} isSupervisor={isSupervisor}
                    isAssignDisable={isAssignDisable}
                    actionMonitoringAmountIndicators={actionMonitoringAmountIndicators}
                    onChangeTypeahead={onChangeTypeahead}
                    assignActionMonitoring={this.assignActionMonitoring} onSiteFilterChange={this.onSiteFilterChange} />

                {this.props.authorizations.indexOf("BEB_TRAY_THEME_SELECTION") !== -1 &&
                    <ActionThemeFilter activityCode={actCode} isSupervisor={isSupervisor} />}

                <ActionsSuiviesTrayTable
                    isSupervisor={isSupervisor}
                    onSelectAction={this.props.onSelectAction}
                    selectedActions={this.props.selectedActions}
                    activitySelected={this.state.activitySelected}
                    userLogin={this.props.userLogin}
                />
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    actions: state.tray.actions,
    pagination: state.tray.pagination,
    loading: state.tray.loading,
    authorizations: state.store.applicationInitialState.authorizations,
    userActivity: state.store.applicationInitialState.user?.activity,
    actionMonitoringAmountIndicators: state.tray.actionMonitoringsIndicators,
    themeSelection: state.tray.themeSelection,
    userLogin: state.store.applicationInitialState.user?.login
})

const mapDispatchToProps = {
    fetchAndStoreSVTrayActionMonitorings,
    fetchAndStoreTrayActionMonitoringAmountIndicators,
    assignActionMonitoring,
    assignMultipleActionMonitoringsByLogin,
    dispatchAndStoreThemesSelection,
    updateSite
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsSuiviesTrayContainer)