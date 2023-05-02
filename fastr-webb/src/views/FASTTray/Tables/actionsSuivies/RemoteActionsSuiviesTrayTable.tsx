import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../../store";
import {TrayHeaderFilterEnum} from "../../../../model/Tray/TrayHeaderFilterEnum";
import {
    fetchAndExportAgentTrayActionsMonitoring,
    fetchAndExportSVTrayActionsMonitoring,
    fetchAndStoreSVTrayActionMonitorings, fetchAndStoreTrayActionMonitoringAmountIndicators,
    updatePagination
} from "../../../../store/actions";
import {Filter, formatIntoFilterArray, formatThemeSelection} from "../../../../store/types/Pagination";
import {useEffect, useState} from "react";
import DetailedActionsSuiviesTrayTable from "./DetailedActionsSuiviesTrayTable";
import ActionService from "../../../../service/ActionService";
import {ProgressStatus} from "../../../../model/actions/ProgressStatus";
import {TableSort} from "../../../../model/TableFilters/TableSort";
import {SessionStorageKeys} from "../../../../model/TableFilters/SessionStorageKeys";
import {Base64} from "js-base64";
import {ActionsSuiviesTableFilters} from "../../../../model/TableFilters/actionsSuivies/ActionsSuiviesTableFilters";
import {ActionsSuiviesFilters} from "../../../../model/TableFilters/actionsSuivies/ActionsSuiviesFilters";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {checkAndCorrectFilters, fillTableFiltersFromSessionStorage} from "../../../../utils/TrayTableFiltersUtils";

interface Props {
    onSelectAction?: (rows, isSelect) => void
    selected?: string[]
    isSupervisor: boolean
    userLogin?: string
}

const RemoteActionsSuiviesTrayTable: React.FunctionComponent<Props> = (props) => {
    const dispatch = useDispatch();
    const actions=  useSelector((state: AppState) => state.tray.actions)
    const exporting = useSelector((state: AppState) =>state.tray.exporting)
    const pagination = useSelector((state: AppState) =>state.tray.pagination)
    const actionsAmount = useSelector((state: AppState) => state.tray.actionsAmount)
    const themeSelection= useSelector((state: AppState) => state.tray.themeSelection)
    const trayHeaderFilter =  useSelector((state: AppState) =>state.tray.trayHeaderFilter)
    const traySite =  useSelector((state: AppState) =>state.tray.site)
    const userActivity = useSelector((state: AppState) =>state.store.applicationInitialState.user?.activity)
    const [initialTableFilters, setInitialTableFilters] = useState<ActionsSuiviesTableFilters| undefined>()
    const [initialSort, setInitialSort] = useState<TableSort| undefined>()
    const actionService: ActionService = new ActionService(true)
    const [progressStatusOptions, setProgressStatusOptions] = useState({});
    useEffect(() => {
        if(props.isSupervisor){
            const createFilter = () => {
                return actionService.getActionsMonitoringFilterProgressStatus(userActivity!.code);
            }
            createFilter().then(filterList => {
                const filter = {}
                filterList.forEach((val : ProgressStatus) => filter[val.code] = val.label);
                setProgressStatusOptions(filter)
            }).catch(() => {
                console.log("Error when fetching ProgressStatus filter")
            })
        }else{
            const createFilterProgressStatus = async () => {
                return await actionService.getActionsMonitoringFilterProgressStatus(userActivity!.code, props.userLogin)
            }
            if (userActivity!.code && props.userLogin) {
                createFilterProgressStatus().then(filterList => {
                    const filter = {}
                    filterList.forEach((val: ProgressStatus) => filter[val.code] = val.label);
                    setProgressStatusOptions(filter)
                }).catch(() => {
                    console.log("Error when fetching ProgressStatus filter")
                })
            }
        }
        updateIndicators().then();
    }, [])
    useEffect(() => {
        updateIndicators().then();
    }, [traySite])
    useEffect(() => {
        fetchData().then()
    }, [themeSelection,trayHeaderFilter,traySite])
    async function updateIndicators() {
        const placeHolderOption: string = translate.formatMessage({id: "tray.cases.filter.themes.all"})
        const theme = themeSelection.filter(themeSelected => themeSelected !== placeHolderOption).join(",")
        dispatch(fetchAndStoreTrayActionMonitoringAmountIndicators(getActivityCode(), theme, props.isSupervisor, traySite?.code ?? undefined))
    }
    const fetchData = async () => {
        const {storedActionsSuiviesFilters, newPagination} = calculateFilters();
        dispatch(updatePagination(newPagination))
        await dispatch(fetchAndStoreSVTrayActionMonitorings(getActivityCode(), {
            ...newPagination,
            page: newPagination.page - 1
        }, traySite?.code?? undefined))
        if (userActivity?.code && trayHeaderFilter === TrayHeaderFilterEnum.NONE) {
            sessionStorage.setItem(userActivity?.code + SessionStorageKeys.ACTIONS_SUIVIES,
                Base64.encode(JSON.stringify({
                    ...storedActionsSuiviesFilters,
                    themeFilters: themeSelection,
                    site:traySite
                }))
            )
        }
    }
    const getActivityCode = () => {
        return userActivity ? userActivity.code : ""
    }
    const getFilterArrayWithHeaderFilters = (filters) => {
        const filtersFromHeader = {};
        switch (trayHeaderFilter) {
            case TrayHeaderFilterEnum.TO_MONITOR: {
                filtersFromHeader["monitoringCurrentState.assignee.login"] = {
                    filterType: "NULL"
                };
                break;
            }
            case TrayHeaderFilterEnum.MONITORED: {
                filtersFromHeader["monitoringCurrentState.assignee.login"] = {
                    filterType: "NOT_NULL"
                };
                break;
            }
            case TrayHeaderFilterEnum.MONITORING_TO_FINALIZE: {
                filtersFromHeader["monitoringCurrentState.assignee.login"] = {
                    filterType: "NOT_NULL",
                };
                filtersFromHeader["processCurrentState.status"] = {
                    filterVal: "RESOLVED,UNRESOLVED",
                    filterType: "SELECT"
                };
                break;
            }
        }
        filters = filters || {};

        return Object.assign(filters, filtersFromHeader);
    }
    const exportToCsv = () => {
        if(props.isSupervisor) {
            dispatch(fetchAndExportSVTrayActionsMonitoring(getActivityCode()))
        } else {
            dispatch(fetchAndExportAgentTrayActionsMonitoring(getActivityCode()))
        }
    }
    const handleTableChange = async (type, { page, sizePerPage, filters, sortField, sortOrder }) => {
        filters = checkAndCorrectFilters(filters);
        const  {newPagination} = calculateFilters()
        if(userActivity!.code ){
            const encodedStoredActionsSuiviesFilters = sessionStorage.getItem(userActivity!.code+SessionStorageKeys.ACTIONS_SUIVIES)
            if(encodedStoredActionsSuiviesFilters !== null) {
                const  storedActionsSuiviesFilters = JSON.parse(Base64.decode(encodedStoredActionsSuiviesFilters))
                if(storedActionsSuiviesFilters.tableFilters?.["monitoringCurrentState.startDate"]){
                    if(!filters["monitoringCurrentState.startDate"]){
                        filters["monitoringCurrentState.startDate"] = storedActionsSuiviesFilters.tableFilters["monitoringCurrentState.startDate"]
                        filters["monitoringCurrentState.startDate"].filterVal!.date = new Date(filters["monitoringCurrentState.startDate"].filterVal!.date.toString().replace("Z", ""))
                    }
                }
                if(storedActionsSuiviesFilters.tableFilters?.creationDate){
                    if(!filters.creationDate){
                        filters.creationDate = storedActionsSuiviesFilters.tableFilters.creationDate
                        filters.creationDate.filterVal!.date = new Date(filters.creationDate.filterVal!.date.toString().replace("Z", ""))

                    }
                }
                if(storedActionsSuiviesFilters.tableFilters?.["processCurrentState.updateDate"]){
                    if(!filters["processCurrentState.updateDate"]){
                        filters["processCurrentState.updateDate"] = storedActionsSuiviesFilters.tableFilters["processCurrentState.updateDate"]
                        filters["processCurrentState.updateDate"].filterVal!.date = new Date(filters["processCurrentState.updateDate"].filterVal!.date.toString().replace("Z", ""))
                    }
                }
                if(storedActionsSuiviesFilters.tableFilters?.["processCurrentState.doNotResolveBeforeDate"]){
                    if(!filters["processCurrentState.doNotResolveBeforeDate"]){
                        filters["processCurrentState.doNotResolveBeforeDate"] = storedActionsSuiviesFilters.tableFilters["processCurrentState.doNotResolveBeforeDate"]
                        filters["processCurrentState.doNotResolveBeforeDate"].filterVal!.date = new Date(filters["processCurrentState.doNotResolveBeforeDate"].filterVal!.date.toString().replace("Z", ""))
                    }
                }
                filters = fillTableFiltersFromSessionStorage(storedActionsSuiviesFilters!.tableFilters, filters)

            }
        }
        const filtersToRetrieve = filters
        if (trayHeaderFilter !== TrayHeaderFilterEnum.NONE) {
            filters = getFilterArrayWithHeaderFilters(filters)
        }
        let filterArr = formatIntoFilterArray(filters, themeSelection);
        if(themeSelection[0] && themeSelection[0] !== 'Tous' ){
            filterArr = filterArr.filter(value => !(value.field ==='themeQualification.tags' && value.type === "TEXT") );
        }
        if(JSON.stringify(filterArr.filter(value => value.filterValue && value.filterValue !=="").sort()) === JSON.stringify(newPagination.filters.sort())
            && ((sortField === null &&
                    sortOrder === undefined
                ) ||
                (sortField === newPagination.sortField &&
                    sortOrder === newPagination.sortOrder
                ))
            && (page !== 1 && page === newPagination.page)
            && sizePerPage === newPagination.sizePerPage  ){
            return
        }
        dispatch(updatePagination({ page, sizePerPage, sortField, sortOrder, filters: filterArr.filter(value => value.filterValue && value.filterValue !=="") }))

        await dispatch(fetchAndStoreSVTrayActionMonitorings(getActivityCode(), {
            page: page - 1,
            sizePerPage,
            filters: filterArr.filter(value => value.filterValue && value.filterValue !==""),
            sortField,
            sortOrder
        }, traySite?.code?? undefined))
        if (trayHeaderFilter !== TrayHeaderFilterEnum.NONE) {
            delete filtersToRetrieve["monitoringCurrentState.assignee.login"]
            if(trayHeaderFilter === TrayHeaderFilterEnum.MONITORING_TO_FINALIZE) {
                delete filtersToRetrieve["processCurrentState.status"]
            }
        }
        setInitialTableFilters(filtersToRetrieve)
        if(sortField && sortOrder){
            setInitialSort({
                dataField: sortField,
                order: sortOrder
            })
            sessionStorage.setItem(userActivity?.code+SessionStorageKeys.ACTIONS_SUIVIES,
                Base64.encode(JSON.stringify({
                    tableFilters:filters,
                    sort:{
                        dataField: sortField,
                        order: sortOrder
                    },
                    themeFilters:themeSelection,
                    site:traySite
                }))
            )
        } else {
            sessionStorage.setItem(userActivity?.code+SessionStorageKeys.ACTIONS_SUIVIES,
                Base64.encode(JSON.stringify({
                    tableFilters:filters,
                    themeFilters:themeSelection,
                    site:traySite
                }))
            )
        }
    }
    function calculateFilters() {
        const allFilters = pagination.filters;
        let filters: Filter[] =[]
        let filledSessionStorage: boolean = false
        let storedActionsSuiviesFilters: ActionsSuiviesFilters | undefined
        if (userActivity!.code) {
            const encodedStoredActionsFilters = sessionStorage.getItem(userActivity!.code + SessionStorageKeys.ACTIONS_SUIVIES)
            if (encodedStoredActionsFilters !== null) {
                storedActionsSuiviesFilters = JSON.parse(Base64.decode(encodedStoredActionsFilters))
                if (storedActionsSuiviesFilters?.tableFilters?.["monitoringCurrentState.startDate"]) {
                    storedActionsSuiviesFilters?.tableFilters?.["monitoringCurrentState.startDate"]?.filterVal!.date =
                        new Date(storedActionsSuiviesFilters.tableFilters?.["monitoringCurrentState.startDate"]?.filterVal!.date)
                }
                if (storedActionsSuiviesFilters?.tableFilters?.creationDate) {
                    storedActionsSuiviesFilters?.tableFilters?.creationDate?.filterVal!.date =
                        new Date(storedActionsSuiviesFilters.tableFilters?.creationDate?.filterVal!.date)
                }
                if (storedActionsSuiviesFilters?.tableFilters?.["processCurrentState.updateDate"]) {
                    storedActionsSuiviesFilters?.tableFilters?.["processCurrentState.updateDate"]?.filterVal!.date =
                        new Date(storedActionsSuiviesFilters.tableFilters?.["processCurrentState.updateDate"]?.filterVal!.date)
                }
                if (storedActionsSuiviesFilters?.tableFilters?.["processCurrentState.doNotResolveBeforeDate"]) {
                    storedActionsSuiviesFilters?.tableFilters?.["processCurrentState.doNotResolveBeforeDate"]?.filterVal!.date =
                        new Date(storedActionsSuiviesFilters.tableFilters?.["processCurrentState.doNotResolveBeforeDate"]?.filterVal!.date)
                }
                setInitialTableFilters(storedActionsSuiviesFilters?.tableFilters)
                setInitialSort(storedActionsSuiviesFilters?.sort)
                if (storedActionsSuiviesFilters?.tableFilters !== undefined) {
                    filters = formatIntoFilterArray(storedActionsSuiviesFilters?.tableFilters, themeSelection);
                    filledSessionStorage = true
                }
            }
        }
        if (!filledSessionStorage) {
            if (allFilters === undefined) {
                filters = formatThemeSelection([], themeSelection)
            } else {
                filters = formatIntoFilterArray(allFilters, themeSelection);
            }
        }
        const themeQualification = filters.find(filter => filter.field === 'themeQualification.tags' )
        if (trayHeaderFilter !== TrayHeaderFilterEnum.NONE) {
            const trayHeaderFilterFormatted = getFilterArrayWithHeaderFilters(filters)
            filters = formatIntoFilterArray(trayHeaderFilterFormatted);
            setInitialTableFilters(undefined)
            setInitialSort(undefined)
        }
        if(themeQualification){
            filters = filters.filter(value => (value.field !== 'themeQualification.tags') )
            if(!filters.find(filter => filter.field === 'themeQualification.tags' )){
                filters.push(themeQualification)
            }
        }
        const newPagination =
            {
                ...pagination,
                sortField: storedActionsSuiviesFilters?.sort?.dataField ?? undefined,
                sortOrder: storedActionsSuiviesFilters?.sort?.order ?? undefined,
                page: 1,
                filters:filters.filter(value => value.filterValue && value.filterValue !=="")
            }
        return {storedActionsSuiviesFilters, newPagination};
    }
    return (
        <div>
            <DetailedActionsSuiviesTrayTable
                actions={actions!}
                page={pagination.page}
                sizePerPage={pagination.sizePerPage}
                onTableChange={handleTableChange}
                totalSize={actionsAmount}
                onSelectAction={props.onSelectAction}
                selected={props.selected}
                trayHeaderFilter={trayHeaderFilter}
                userActivity={userActivity!}
                onExport={exportToCsv}
                exporting={exporting}
                initialFilters={initialTableFilters}
                initialSort={initialSort}
                isSupervisor={props.isSupervisor}
                progressStatusOptions={progressStatusOptions}
                themeSelection={themeSelection}
            />
        </div>
    )
}

export default RemoteActionsSuiviesTrayTable