import {Filter, formatIntoFilterArray, formatThemeSelection} from "../../../../store/types/Pagination";
import {TrayHeaderFilterEnum} from "../../../../model/Tray/TrayHeaderFilterEnum";
import * as React from "react";
import {ActionTableFilters} from "../../../../model/TableFilters/actions/ActionTableFilters";
import {TableSort} from "../../../../model/TableFilters/TableSort";
import {useEffect,  useState} from "react";
import ActionService from "../../../../service/ActionService";
import {ProgressStatus} from "../../../../model/actions/ProgressStatus";
import {ActionFilters} from "../../../../model/TableFilters/actions/ActionFilters";
import {Base64} from "js-base64";
import moment from "moment";
import {AppState} from "../../../../store";
import {
    fetchAndExportAgentTrayActions, fetchAndExportSVTrayActions,
    fetchAndStoreTrayActions, fetchAndStoreTrayActionAmountIndicators,
    updatePagination
} from "../../../../store/actions";
import { useDispatch, useSelector} from "react-redux";
import DetailedActionTrayTable from "./DetailedActionTrayTable";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {SessionStorageKeys} from "../../../../model/TableFilters/SessionStorageKeys";
import {checkAndCorrectFilters, fillTableFiltersFromSessionStorage} from "../../../../utils/TrayTableFiltersUtils";

interface Props {
    onSelectAction?: (rows, isSelect) => void
    selected?: string[]
    isSupervisor: boolean
    userLogin?: string
}
const RemoteActionTrayTable: React.FunctionComponent<Props> = (props) => {
    const dispatch = useDispatch();
    const actions = useSelector((state: AppState) => state.tray.actions)
    const exporting = useSelector((state: AppState) => state.tray.exporting)
    const pagination = useSelector((state: AppState) => state.tray.pagination)
    const actionsAmount = useSelector((state: AppState) =>  state.tray.actionsAmount)
    const themeSelection = useSelector((state: AppState) =>  state.tray.themeSelection)
    const trayHeaderFilter = useSelector((state: AppState) =>  state.tray.trayHeaderFilter)
    const traySite =  useSelector((state: AppState) =>state.tray.site)
    const userActivity = useSelector((state: AppState) =>  state.store.applicationInitialState.user?.activity)
    const [initialTableFilters, setInitialTableFilters] = useState<ActionTableFilters| undefined>()
    const [initialSort, setInitialSort] = useState<TableSort| undefined>()
    const [progressStatusOptions,setProgressStatusOptions] = useState({})
    const actionService: ActionService = new ActionService(true)
    const getActivityCode = () => {
        return userActivity ? userActivity.code : ""
    }
    useEffect(() => {
        if (props.isSupervisor) {
            const createFilter = () => {
                return actionService.getActionsFilterProgressStatus(userActivity!.code);
            }
            createFilter().then(filterList => {
                const filter = {}
                filterList.forEach((val: ProgressStatus) => filter[val.code] = val.label);
                setProgressStatusOptions(filter)
            })
                .catch(() => {
                    console.log("Error when fetching ProgressStatus filter for Supervisor")
                })
        } else {
            const createFilterProgressStatus = () => {
                return actionService.getActionsFilterProgressStatus(userActivity!.code, props.userLogin)
            }
            createFilterProgressStatus()
                .then(filterList => {
                    if (userActivity?.code && props.userLogin) {
                        const filter = {};
                        filterList.forEach((val: ProgressStatus) => filter[val.code] = val.label);
                        setProgressStatusOptions(filter)
                    }
                })
                .catch(() => {
                    console.error("Error while fetching ProgressStatus filter for Agent")
                })
        }
        updateIndicators().then()
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
        dispatch(fetchAndStoreTrayActionAmountIndicators(userActivity!.code, theme, props.isSupervisor, traySite?.code ?? undefined))
    }
    const fetchData = async () => {
        const {storedActionsFilters, newPagination} = calculateFilters();
        dispatch(updatePagination(newPagination))
        await dispatch(fetchAndStoreTrayActions(getActivityCode(), {
            ...newPagination,
            page: newPagination.page - 1
        }, traySite?.code?? undefined))

        if (userActivity?.code && trayHeaderFilter === TrayHeaderFilterEnum.NONE) {
            sessionStorage.setItem(userActivity?.code + SessionStorageKeys.ACTIONS,
                Base64.encode(JSON.stringify({
                    ...storedActionsFilters,
                    themeFilters: themeSelection,
                    site:traySite
                }))
            )
        }
    }
    const getFilterArrayWithHeaderFilters = (filters) => {
        const filtersFromHeader = {};
        const statusField = "processCurrentState.status";
        const notBeforeField = "processCurrentState.doNotResolveBeforeDate";
        const updateDateField = "processCurrentState.updateDate";
        const estimatedAssignmentDateField = "processCurrentState.estimatedAssignmentDate";
        switch (trayHeaderFilter) {
            case TrayHeaderFilterEnum.ONGOING: {
                filtersFromHeader[statusField] = {
                    filterVal: "ONGOING",
                    filterType: "SELECT",
                    comparator: "="
                };
                break;
            }
            case TrayHeaderFilterEnum.QUALIFIED: {
                filtersFromHeader[statusField] = {
                    filterVal: "QUALIFIED",
                    filterType: "SELECT",
                    comparator: "="
                };
                break;
            }
            case TrayHeaderFilterEnum.NOT_BEFORE_EXCEED: {
                filtersFromHeader[notBeforeField] = {
                    filterVal: { date: moment(), comparator: "<" },
                    filterType: "DATE",
                    comparator: "<"
                };
                break;
            }
            case TrayHeaderFilterEnum.NOT_UPDATED_IN_5_DAYS: {
                filtersFromHeader[updateDateField] = {
                    filterVal: { date: moment().subtract(5, 'days'), comparator: "<" },
                    filterType: "DATE",
                    comparator: "<"
                };
                break;
            }

            case TrayHeaderFilterEnum.ASSIGNMENT_EXCEED: {
                filtersFromHeader[estimatedAssignmentDateField] = {
                    filterVal: { date: moment(), comparator: "<" },
                    filterType: "DATE",
                    comparator: "<"
                };
                break;
            }
        }
        filters = filters || {};

        return Object.assign(filters, filtersFromHeader);
    };
    const exportToCsv = () => {
        if(props.isSupervisor){
            dispatch(fetchAndExportSVTrayActions(getActivityCode()));
        } else {
            dispatch(fetchAndExportAgentTrayActions(getActivityCode()));
        }

    }
    const handleTableChange = async (type, { page, sizePerPage, filters, sortField, sortOrder }) => {
        filters = checkAndCorrectFilters(filters)
        const  {newPagination} = calculateFilters()
        if(userActivity!.code ){
            const encodedStoredActionsFilters = sessionStorage.getItem(userActivity!.code+SessionStorageKeys.ACTIONS)
            if(encodedStoredActionsFilters !== null) {
                const  storedActionsFilters = JSON.parse(Base64.decode(encodedStoredActionsFilters))
                if(storedActionsFilters.tableFilters?.creationDate){
                    if(!filters.creationDate){
                        filters.creationDate = storedActionsFilters.tableFilters.creationDate
                        filters.creationDate.filterVal!.date = new Date(filters.creationDate.filterVal!.date.toString().replace("Z", ""))
                    }
                }
                if(storedActionsFilters.tableFilters?.["processCurrentState.updateDate"]){
                    if(!filters["processCurrentState.updateDate"]){
                        filters["processCurrentState.updateDate"] = storedActionsFilters.tableFilters["processCurrentState.updateDate"]
                        filters["processCurrentState.updateDate"].filterVal!.date = new Date(filters["processCurrentState.updateDate"].filterVal!.date.toString().replace("Z", ""))
                    }
                }
                if(storedActionsFilters.tableFilters?.["processCurrentState.doNotResolveBeforeDate"]){
                    if(!filters["processCurrentState.doNotResolveBeforeDate"]){
                        filters["processCurrentState.doNotResolveBeforeDate"] = storedActionsFilters.tableFilters["processCurrentState.doNotResolveBeforeDate"]
                        filters["processCurrentState.doNotResolveBeforeDate"].filterVal!.date = new Date(filters["processCurrentState.doNotResolveBeforeDate"].filterVal!.date.toString().replace("Z", ""))
                    }
                }
                filters = fillTableFiltersFromSessionStorage(storedActionsFilters!.tableFilters, filters)
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
        await dispatch(fetchAndStoreTrayActions(getActivityCode(), {
            page: page - 1,
            sizePerPage,
            filters: filterArr.filter(value => value.filterValue && value.filterValue !==""),
            sortField,
            sortOrder
        }, traySite?.code?? undefined))
        if (trayHeaderFilter !== TrayHeaderFilterEnum.NONE) {
            if(trayHeaderFilter === (TrayHeaderFilterEnum.ONGOING ||TrayHeaderFilterEnum.QUALIFIED )) {
                delete filtersToRetrieve["processCurrentState.status"]
            }
            if(trayHeaderFilter === TrayHeaderFilterEnum.NOT_BEFORE_EXCEED) {
                delete filtersToRetrieve["processCurrentState.doNotResolveBeforeDate"]
            }
            if(trayHeaderFilter ===  TrayHeaderFilterEnum.NOT_UPDATED_IN_5_DAYS) {
                delete filtersToRetrieve["processCurrentState.updateDate"]
            }
        }
        setInitialTableFilters(filtersToRetrieve)
        if(sortField && sortOrder){
            setInitialSort({
                dataField: sortField,
                order: sortOrder
            })
            sessionStorage.setItem(userActivity?.code+SessionStorageKeys.ACTIONS,
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
            sessionStorage.setItem(userActivity?.code+SessionStorageKeys.ACTIONS,
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
        let storedActionsFilters: ActionFilters | undefined
        if (userActivity!.code) {
            const encodedStoredActionsFilters = sessionStorage.getItem(userActivity!.code + SessionStorageKeys.ACTIONS)
            if (encodedStoredActionsFilters !== null) {
                storedActionsFilters = JSON.parse(Base64.decode(encodedStoredActionsFilters))
                if (storedActionsFilters?.tableFilters?.creationDate) {
                    storedActionsFilters?.tableFilters?.creationDate?.filterVal!.date =
                        new Date(storedActionsFilters.tableFilters?.creationDate?.filterVal!.date)
                }
                if (storedActionsFilters?.tableFilters?.["processCurrentState.updateDate"]) {
                    storedActionsFilters?.tableFilters?.["processCurrentState.updateDate"]?.filterVal!.date =
                        new Date(storedActionsFilters.tableFilters?.["processCurrentState.updateDate"]?.filterVal!.date)
                }
                if (storedActionsFilters?.tableFilters?.["processCurrentState.doNotResolveBeforeDate"]) {
                    storedActionsFilters?.tableFilters?.["processCurrentState.doNotResolveBeforeDate"]?.filterVal!.date =
                        new Date(storedActionsFilters.tableFilters?.["processCurrentState.doNotResolveBeforeDate"]?.filterVal!.date)
                }
                setInitialTableFilters(storedActionsFilters?.tableFilters)
                setInitialSort(storedActionsFilters?.sort)
                if (storedActionsFilters?.tableFilters !== undefined) {
                    filters = formatIntoFilterArray(storedActionsFilters?.tableFilters, themeSelection);
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
                sortField: storedActionsFilters?.sort?.dataField ?? undefined,
                sortOrder: storedActionsFilters?.sort?.order ?? undefined,
                page: 1,
                filters:filters.filter(value => value.filterValue && value.filterValue !=="")
            }
        return {storedActionsFilters, newPagination};
    }
    return (
        <div>
            <DetailedActionTrayTable actions={actions!}
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



export default RemoteActionTrayTable;