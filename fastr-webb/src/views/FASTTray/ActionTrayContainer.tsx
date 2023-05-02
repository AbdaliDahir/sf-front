import * as React from 'react';
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

import { NotificationManager } from "react-notifications";
import { connect } from 'react-redux';
import { translate } from "src/components/Intl/IntlGlobalProvider";
import { Activity } from 'src/model/Activity';
import {
    assignAction,
    assignMultipleActionsByLogin,
    dispatchAndStoreThemesSelection,
    fetchAndStoreAgentTrayActions,
    fetchAndStoreTrayActions,
    fetchAndStoreTrayActionAmountIndicators, updateSite,
} from 'src/store/actions';
import { AppState } from "../../store";
import { Pagination } from "../../store/types/Pagination"
import { Action } from "../../model/actions/Action";
import ActionTrayTable from "./Tables/actions/ActionTrayTable";
import ActionTrayHeader from "./ActionTrayHeader";
import ThemeFilter from "./Filters/ActionThemeFilter";
import "./tray.scss";
import {isAuthorizedSuperviseur} from "../../utils";
import {SessionStorageKeys} from "../../model/TableFilters/SessionStorageKeys";
import {Base64} from "js-base64";
import {ActionFilters} from "../../model/TableFilters/actions/ActionFilters";

interface ActionTrayProps {
    actions: Action[]
    pagination: Pagination
    userActivity: Activity

    fetchAndStoreAgentTrayActions: (activityCodeSelected: string, themeSelection: string) => void,
    fetchAndStoreTrayActions: (activityCodeSelected: string, pagination: Pagination, site?: string) => void
    sessionId?: string
    authorizations: Array<string>
    actionAmountIndicators
    onChangeTypeahead?: (selected) => void
    selectedActions?: string[]
    selectedLogin?: string
    themeSelection: string[]
    assignAction
    dispatchAndStoreThemesSelection
    assignMultipleActionsByLogin
    fetchAndStoreTrayActionAmountIndicators
    onAssignSupervisor?: (activitySelected: Activity) => Promise<Array<Action>>
    onSelectAction?: (row, isSelect) => void
    userLogin: string
    updateSite
}

interface ActionTrayState {
    activitySelected: string;
    isSupervisor: boolean;
    site?: string;
}

class ActionTrayContainer extends React.Component<ActionTrayProps, ActionTrayState> {

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
            const encodedSessionStorageFilters = sessionStorage.getItem(this.props.userActivity!.code+SessionStorageKeys.ACTIONS)
            if(encodedSessionStorageFilters !== null) {
                const sessionStorageFilters: ActionFilters = JSON.parse(Base64.decode(encodedSessionStorageFilters))
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
            await this.props.fetchAndStoreTrayActionAmountIndicators(actCode, themeSelection, this.state.isSupervisor);
        }
    }

    public async onSiteChange(site: string) {
        if (this.state.site !== site) {
            this.setState({ site });
        }
        // await this.fetchData( site);

    }
    public getActivityCode() {
        return this.props.userActivity ? this.props.userActivity.code : "";
    }

    public formatThemeSelection = (themeSelection: string[]) => {
        const placeHolderOption: string = translate.formatMessage({ id: "tray.cases.filter.themes.all" });
        return themeSelection.filter(themeSelected => themeSelected !== placeHolderOption).join(",");
    }

    public async fetchData(site?: string) {
        try {
            const activityCode: string = this.getActivityCode();
            const themeSelection = this.formatThemeSelection(this.props.themeSelection);
            await this.props.fetchAndStoreTrayActions(activityCode, {
                ...this.props.pagination,
                filters: this.props.pagination.filters?? [],
                page: this.props.pagination.page - 1
            }, site)
            await this.props.fetchAndStoreTrayActionAmountIndicators(activityCode, themeSelection, this.state.isSupervisor, site);
        } catch (e) {
            console.error(e);
            NotificationManager.error(e.message)
        }
    }


    public assignAction = async () => {
        const activityCodeSelected = this.getActivityCode();
        const { selectedLogin, selectedActions, onAssignSupervisor, actions } = this.props;
        const { isSupervisor } = this.state;

        try {
            const placeHolderOption: string = translate.formatMessage({ id: "tray.cases.filter.themes.all" });
            if (isSupervisor && selectedActions && selectedLogin && onAssignSupervisor) {
                let eligibleActions: (string | undefined)[] = actions.filter(action =>
                    selectedActions.find(id => id === action.actionId && action.processCurrentState?.assignee.login !== selectedLogin))
                    .map(eligibleAction => eligibleAction.actionId);
                if (eligibleActions.length > 0) {
                    await this.props.assignMultipleActionsByLogin(this.props.userActivity, eligibleActions, selectedLogin);
                    NotificationManager.success(translate.formatMessage(
                        { id: "tray.success.multiple.action.assign.login" },
                        {
                            nbOfActions: eligibleActions.length,
                            login: selectedLogin
                        }));

                    await this.props.dispatchAndStoreThemesSelection([placeHolderOption]);
                    await this.fetchData( this.state.site);
                } else {
                    NotificationManager.success(translate.formatMessage(
                        { id: 'tray.multiple.action.login.already.assign' },
                        { login: selectedLogin }));
                    await this.props.dispatchAndStoreThemesSelection([placeHolderOption]);
                    await this.fetchData( this.state.site);
                }
            } else {

                await this.props.assignAction(activityCodeSelected, this.props.themeSelection.toString());
                await this.props.dispatchAndStoreThemesSelection([placeHolderOption]);
                await this.fetchData(this.state.site)
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

    public render(): JSX.Element {
        const { actionAmountIndicators, onChangeTypeahead } = this.props;

        const isAssignDisable = !(this.props.selectedLogin && this.props.selectedActions && this.props.selectedActions.length);
        const actCode = this.getActivityCode();

        return (
            <div className={"tray"}>

                <ActionTrayHeader detailed={true} isSupervisor={this.state.isSupervisor}
                    isAssignDisable={isAssignDisable}
                    actionAmountIndicators={actionAmountIndicators}
                    onChangeTypeahead={onChangeTypeahead}
                    assignAction={this.assignAction}
                    onSiteFilterChange={(site) => this.onSiteChange(site)} />

                {this.props.authorizations.indexOf("BEB_TRAY_THEME_SELECTION") !== -1 &&
                    <ThemeFilter activityCode={actCode} isSupervisor={this.state.isSupervisor} />}

                <ActionTrayTable
                    onSelectAction={this.props.onSelectAction}
                    selectedActions={this.props.selectedActions}
                    isSupervisor={this.state.isSupervisor}
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
    actionAmountIndicators: state.tray.actionAmountIndicators,
    themeSelection: state.tray.themeSelection,
    userLogin: state.store.applicationInitialState.user?.login
})

const mapDispatchToProps = {
    fetchAndStoreAgentTrayActions,
    fetchAndStoreTrayActions,
    fetchAndStoreTrayActionAmountIndicators,
    assignAction,
    assignMultipleActionsByLogin,
    dispatchAndStoreThemesSelection,
    updateSite
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionTrayContainer)