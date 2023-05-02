import * as React from 'react';
import "../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

import { NotificationManager } from "react-notifications";
import { connect } from 'react-redux';
import { translate } from "src/components/Intl/IntlGlobalProvider";
import { Activity } from 'src/model/Activity';
import { Case } from 'src/model/Case';
import {
    assignAndStoreCaseToTray,
    assignMultipleCasesToTray,
    fetchAndStoreAuthorizations,
    fetchAndStoreSessionUserActivity,
    fetchAndStoreTrayCases,
    fetchAndStoreSyntheticTrayCases,
    fetchAndStoreTrayCaseAmountIndicators,
    updatePagination, updateSite,
} from 'src/store/actions';
import { AppState } from "../../store";
import { Pagination} from "../../store/types/Pagination"


import { dispatchAndStoreThemesSelection } from "../../store/actions";
import ThemeFilter from "./Filters/ThemeFilter"


import CaseTrayTable from "./Tables/cases/CaseTrayTable"
import TrayHeader from "./Headers"
import { CaseAmountIndicators } from "../../model/Tray/CaseAmountIndicators";
import Loading from "../../components/Loading";
import { Site } from "../../model/Site";
import {isAuthorizedSuperviseur} from "../../utils";


interface CaseTrayProps {
    cases: Case[]
    stock: number
    pagination: Pagination
    caseAmountIndicators: CaseAmountIndicators
    userActivity: Activity

    fetchCaseAmount: (activityCodeSelected: string) => void
    fetchSyntheticTrayCases: (activityCodeSelected: string, isSupervisor: boolean, isCCMaxwell) => void
    fetchTrayCases: (activityCodeSelected: string, pagination: Pagination, site?: string | null, isAgent?:boolean) => void
    fetchStock: (activityCodeSelected: string, themeSelection: string) => void
    assignCase: (activityCodeSelected: string, themeSelection: string, isCCMaxwell: boolean) => void
    assignMultipleCasesByLogin: (activitySelected: Activity, caseIds: string[], login: string) => void
    fetchAndStoreAuthorizations: (sessionId: string) => void
    fetchAndStoreTrayCaseAmountIndicators: (activityCodeSelected: string, themeSelection: string, isSupervisor: boolean, isCCMaxwell: boolean, site?: string | null) => void
    fetchAndStoreSessionUserActivity: (sessionId: string) => void
    updatePagination: (pagination: Pagination) => void

    // If not Detailed, those are undefined because we don't need them
    detailed?: boolean
    onSelectCase?: (row, isSelect) => void
    onChangeTypeahead?: (selected) => void
    onAssignSupervisor?: (activitySelected: Activity) => Promise<Array<Case>>
    selectedCases?: string[]
    selectedLogin?: string
    sessionId?: string

    // Themes Selection
    storeCurrentThemesSelection: (selection: string[]) => void
    themeSelection: string[]
    authorizations: Array<string>
    isCCMaxwell: boolean
    site: Site
    loggedUser: string
    updateSite
}

interface CaseTrayState {
    activitySelected: string
    isSupervisor: boolean
    isSynthetic: boolean
    site?: string | null
}

class CaseTrayContainer extends React.Component<CaseTrayProps, CaseTrayState> {

    constructor(props: CaseTrayProps) {
        super(props);
        this.state = {
            activitySelected: "",
            isSupervisor: false,
            isSynthetic: false,
            site: null
        }
    }

    public async componentDidMount() {
        if (location.pathname.includes("synthetic")) {
            this.setState({
                isSynthetic: true
            })
        }
        await this.fetchData();
        const activitySelected = this.props.userActivity && this.props.userActivity.code ?
            this.props.userActivity.label
            : translate.formatMessage({ id: "tray.activity.none" });
        this.setState({
            activitySelected
        })
    }
    public componentDidUpdate(prevProps: CaseTrayProps) {
        if(JSON.stringify(prevProps.authorizations) !==JSON.stringify(this.props.authorizations) ){
            if (isAuthorizedSuperviseur(this.props.authorizations)) {
                this.setState({
                    isSupervisor: true
                })
            }
        }

    }

    public formatThemeSelection = (themeSelection: string[]): string => {
        const placeHolderOption: string = translate.formatMessage({ id: "tray.cases.filter.themes.all" });
        return themeSelection.filter(themeSelected => themeSelected !== placeHolderOption).join(",");
    }

    public assignCase = async () => {
        const activityCodeSelected = this.getActivityCode();
        const { selectedLogin, selectedCases, onAssignSupervisor, cases } = this.props;
        const { isSupervisor, isSynthetic } = this.state;
        const isCCMaxwell = this.props.isCCMaxwell;

        try {
            const placeHolderOption: string = translate.formatMessage({ id: "tray.cases.filter.themes.all" });

            if (!isSynthetic && isSupervisor && selectedCases && selectedLogin && onAssignSupervisor) {
                const eligibleCases: string[] = cases.filter(item =>
                    selectedCases.find(id => id === item.caseId && item.caseOwner?.login !== selectedLogin))
                    .map(eligibleAction => eligibleAction.caseId);
                if (eligibleCases.length > 0) {
                    await this.props.assignMultipleCasesByLogin(this.props.userActivity, eligibleCases, selectedLogin);
                    NotificationManager.success(translate.formatMessage(
                        { id: "tray.success.multiple.assign.login" },
                        {
                            nbOfCases: eligibleCases.length,
                            login: selectedLogin
                        }));

                    await this.props.storeCurrentThemesSelection([placeHolderOption]);
                    await this.fetchData(this.state.activitySelected, this.state.site);
                } else {
                    NotificationManager.success(translate.formatMessage(
                        { id: "tray.multiple.login.already.assign" },
                        {
                            login: selectedLogin
                        }));
                    await this.props.storeCurrentThemesSelection([placeHolderOption]);
                    await this.fetchData(this.state.activitySelected, this.state.site);
                }
            } else {
                await this.props.assignCase(activityCodeSelected, this.getThemeSelection(), isCCMaxwell);
                await this.props.storeCurrentThemesSelection([placeHolderOption]);
                await this.props.fetchAndStoreTrayCaseAmountIndicators(this.getActivityCode(), '', isSupervisor, this.props.isCCMaxwell, this.state.site);
                await this.fetchData(this.state.activitySelected)
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
            this.fetchData(this.state.activitySelected)
        }
    };

    public getActivityCode() {
        return this.props.userActivity ? this.props.userActivity.code : "";
    }

    public async fetchData(activityLabelSelected?: string, site?: string | null) {
        try {
            if (!activityLabelSelected) {
                if (this.props.sessionId) {
                    if (!this.props.authorizations.length) {
                        await this.props.fetchAndStoreAuthorizations(this.props.sessionId)
                    }
                    await this.props.fetchAndStoreSessionUserActivity(this.props.sessionId);
                }
            }
            const activityCode: string = this.getActivityCode();
            const isSV: boolean = this.state.isSupervisor;
            const isSynthetic: boolean = this.state.isSynthetic;
            if (isSynthetic) {
                await this.props.fetchSyntheticTrayCases(activityCode, isSV, this.props.isCCMaxwell);
            }/* else {
                if(this.props.pagination?.filters &&this.props.pagination?.filters.length > 0 ){
                    await this.props.fetchTrayCases(activityCode, {
                        ...this.props.pagination,
                        filters: formatThemeSelection(this.props.pagination.filters, this.props.themeSelection),
                        page: this.props.pagination.page - 1
                    }, site)
                }

            }
            const themeSelection = this.formatThemeSelection(this.props.themeSelection);
            await this.props.fetchAndStoreTrayCaseAmountIndicators(activityCode, themeSelection, isSV, this.props.isCCMaxwell, this.state.site);
       */ } catch (e) {
            console.error(e);
            NotificationManager.error(e.message)
        }
    }

    public getThemeSelection() {
        const { themeSelection } = this.props
        return themeSelection.toString()
    }

    public async changeSiteFilter(site: string) {
        if (site !== this.state.site) {
            this.setState({ site });
        }
        /*const { isSupervisor, isSynthetic } = this.state;
        const actCode = this.getActivityCode();
        const themeSelection = isSupervisor && !isSynthetic ? this.formatThemeSelection(this.props.themeSelection) : '';
        await this.props.fetchAndStoreTrayCaseAmountIndicators(actCode, themeSelection, isSupervisor, this.props.isCCMaxwell, site);
         */
    }


    public render(): JSX.Element {
        const { detailed, cases, onChangeTypeahead, onSelectCase, selectedCases, caseAmountIndicators } = this.props;
        const { isSupervisor, site } = this.state;
        const isAssignDisable = !(this.props.selectedLogin && this.props.selectedCases && this.props.selectedCases.length);

        const actCode = this.getActivityCode();
        const accessBannetteDossiers = this.props.authorizations && this.props.authorizations.length > 0 && this.props.authorizations.includes("ACCESS_BANNETTE_DOSSIERS");
        if (this.props.authorizations.length === 0) {
            return <Loading />
        }

        return accessBannetteDossiers ?
            (
                <div className={this.props.isCCMaxwell ? "tray tray_extended" : "tray"}>
                    <TrayHeader
                        detailed={detailed}
                        isSupervisor={isSupervisor}
                        isAssignDisable={isAssignDisable}
                        caseAmountIndicators={caseAmountIndicators}
                        onChangeTypeahead={onChangeTypeahead}
                        onSiteFilterChange={(site) => this.changeSiteFilter(site)}
                        assignCase={this.assignCase}
                    />

                    {detailed &&
                        this.props.authorizations.indexOf("BEB_TRAY_THEME_SELECTION") !== -1 &&
                        <ThemeFilter
                            activityCode={actCode}
                            isSupervisor={isSupervisor} site={site}
                        />
                    }
                    <CaseTrayTable
                        detailed={detailed}
                        isSupervisor={isSupervisor}
                        onSelectCase={onSelectCase}
                        selectedCases={selectedCases}
                        activitySelected={this.state.activitySelected}
                        site={site}
                        cases={cases}
                    />
                </div>
            ) :
            (
                <div className='d-flex justify-content-center align-items-center font-weight-bold mt-5'>Activité non habilitée</div>
            )
    }
}

const mapStateToProps = (state: AppState) => ({
    cases: state.tray.cases,
    client: state.client,
    pagination: state.tray.pagination,
    loading: state.tray.loading,
    themeSelection: state.tray.themeSelection,
    authorizations: state.authorization.authorizations,
    caseAmountIndicators: state.tray.caseAmountIndicators,
    userActivity: state.session.userActivity,
    isCCMaxwell: state.store.applicationInitialState.authorizations.indexOf("ADG_MAXWELL") !== -1,
    loggedUser:state.store.applicationInitialState.user?.login
})

const mapDispatchToProps = dispatch => (
    {
        storeCurrentThemesSelection: (themeSelection: string[]) => dispatch(dispatchAndStoreThemesSelection(themeSelection)),
        fetchSyntheticTrayCases: (activityCodeSelected: string, isSupervisor: boolean, isCCMaxwell: boolean) => dispatch(fetchAndStoreSyntheticTrayCases(activityCodeSelected, isSupervisor, isCCMaxwell)),
        fetchTrayCases: (activityCodeSelected: string, pagination: Pagination, site?: string, isAgent?:boolean) => dispatch(fetchAndStoreTrayCases(activityCodeSelected, pagination, site, isAgent)),
        assignCase: (activityCodeSelected: string, themeSelection: string, isCCMaxwell: boolean) => dispatch(assignAndStoreCaseToTray(activityCodeSelected, themeSelection, isCCMaxwell)),
        assignMultipleCasesByLogin: (activitySelected: Activity, caseIds: string[], login: string) => dispatch(assignMultipleCasesToTray(activitySelected, caseIds, login)),
        fetchAndStoreAuthorizations: (sessionId: string) => dispatch(fetchAndStoreAuthorizations(sessionId)),
        fetchAndStoreTrayCaseAmountIndicators: (activityCodeSelected: string, themeSelection: string, isSupervisor: boolean, isCCMaxwell: boolean, site?: string) => dispatch(fetchAndStoreTrayCaseAmountIndicators(activityCodeSelected, themeSelection, isSupervisor, isCCMaxwell, site)),
        fetchAndStoreSessionUserActivity: (sessionId: string) => dispatch(fetchAndStoreSessionUserActivity(sessionId)),
        updatePagination: (pagination) => dispatch(updatePagination(pagination)),
        updateSite: (site) => dispatch(updateSite(site)),
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(CaseTrayContainer)