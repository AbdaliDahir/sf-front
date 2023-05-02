import {TrayHeaderFilterEnum} from "../../../../model/Tray/TrayHeaderFilterEnum";
import {NotificationManager} from "react-notifications";

import {Filter, formatIntoFilterArray, formatThemeSelection} from "../../../../store/types/Pagination";
import {AppState} from "../../../../store";
import {
    fetchAndStoreTrayCaseAmountIndicators,
    fetchAndStoreTrayCases,
    updatePagination
} from "../../../../store/actions";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {SessionStorageKeys} from "../../../../model/TableFilters/SessionStorageKeys";
import {CaseFilters} from "../../../../model/TableFilters/cases/CaseFilters";
import {Base64} from "js-base64";
import {useEffect, useState} from "react";
import {TableSort} from "../../../../model/TableFilters/TableSort";
import DetailedCaseTrayTable from "./DetailedCaseTrayTable";
import {CaseTableFilters} from "../../../../model/TableFilters/cases/CaseTableFilters";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {checkAndCorrectFilters, fillTableFiltersFromSessionStorage} from "../../../../utils/TrayTableFiltersUtils";
import {isAuthorizedTrayThemeSelection} from "../../../../utils";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {fetchAndStoreClientV2, selectClientV2} from "../../../../store/actions/v2/client/ClientActions";
import {DataLoad} from "../../../../context/ClientContext";
import {selectCaseV2} from "../../../../store/actions/v2/case/RecentCasesActions";
import {Case} from "../../../../model/Case";

interface Props {
    activitySelected: string
    onSelectCase?: (rows, isSelect) => void
    selected?: string[]
    isSupervisor: boolean
    trayColumnsForMaxwell
    isCCMaxwell:boolean
    site?: string | null
}

const RemoteCaseTrayTable: React.FunctionComponent<Props> = (props) => {
    const dispatch = useDispatch();
    const cases= useSelector((state: AppState) =>  state.tray.cases)
    const caseAmount= useSelector((state: AppState) => state.tray.caseAmount)
    const pagination= useSelector((state: AppState) => state.tray.pagination)
    const themeSelection= useSelector((state: AppState) => state.tray.themeSelection)
    const trayHeaderFilter= useSelector((state: AppState) => state.tray.trayHeaderFilter)
    const traySite =  useSelector((state: AppState) =>state.tray.site)
    const userActivity= useSelector((state: AppState) => state.session.userActivity)
    const authorizations= useSelector((state: AppState) => state.authorization.authorizations)
    const [initialTableFilters, setInitialTableFilters] = useState<CaseTableFilters| undefined>()
    const [initialSort, setInitialSort] = useState<TableSort| undefined>()
    const sessionIsFrom = useTypedSelector((state: AppState) => state.store.applicationInitialState.sessionIsFrom)

    useEffect(() => {
        if(userActivity?.code ) {
            updateIndicators().then()
        }
    }, [themeSelection])
    useEffect(() => {
        fetchData().then()
    }, [themeSelection,trayHeaderFilter])

    useEffect(() => {
        if(!isAuthorizedTrayThemeSelection(authorizations)){
            fetchData().then()
            if(userActivity?.code ) {
                updateIndicators().then()
            }
        }
    }, [userActivity,traySite])
    const fetchData = async () => {
        if(userActivity?.code ) {
            const {sessionStorageFilters, newPagination} = calculateFilters()
            dispatch(updatePagination(newPagination))
            dispatch(fetchAndStoreTrayCases(getActivityCode(), {
                ...newPagination,
                page: newPagination.page - 1,
                sortField: sessionStorageFilters?.sort?.dataField ?? undefined,
                sortOrder: sessionStorageFilters?.sort?.order ?? undefined
            }, traySite?.code ?? undefined))
            if (userActivity?.code && trayHeaderFilter === TrayHeaderFilterEnum.NONE) {
                sessionStorage.setItem(userActivity!.code + SessionStorageKeys.DOSSIERS, Base64.encode(JSON.stringify({
                    ...sessionStorageFilters,
                    themeFilters: themeSelection,
                    site:traySite
                })))
            }
        }
    }
    const getActivityCode = () => {
        return userActivity ? userActivity.code : ""
    }
    const getFilterArrayWithHeaderFilters = (filters) => {
        const filtersFromHeader = {};
        const statusField = "status";
        const progressStatusField = "progressStatus";

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
            case TrayHeaderFilterEnum.REOPENED: {
                filtersFromHeader[progressStatusField] = {
                    filterVal: "REOPENED",
                    filterType: "SELECT",
                    comparator: "="
                };

                break;
            }
        }
        filters = filters || {};

        return Object.assign(filters, filtersFromHeader);
    }
    const updateIndicators = async () => {
        const placeHolderOption: string = translate.formatMessage({id: "tray.cases.filter.themes.all"})
        const theme = themeSelection.filter(themeSelected => themeSelected !== placeHolderOption).join(",")
        dispatch(fetchAndStoreTrayCaseAmountIndicators(getActivityCode(), theme, props.isSupervisor, props.isCCMaxwell, traySite?.code ?? undefined));
    }
    const handleTableChange = async (type, {page, sizePerPage, filters, sortField, sortOrder}) => {
        filters = checkAndCorrectFilters(filters)
        const  {newPagination} = calculateFilters()
        if(userActivity?.code ){
            const encodedSessionStorageFilters = await sessionStorage.getItem(getActivityCode()+SessionStorageKeys.DOSSIERS)
            if(encodedSessionStorageFilters !== null){
                const sessionStorageFilters: CaseFilters = JSON.parse(Base64.decode(encodedSessionStorageFilters))
                if(sessionStorageFilters.tableFilters?.creationDate){
                    if(!filters.creationDate){
                        filters.creationDate = sessionStorageFilters.tableFilters.creationDate
                        filters.creationDate.filterVal!.date = new Date(filters.creationDate.filterVal!.date.toString().replace("Z", ""))

                    }
                }
                if(sessionStorageFilters.tableFilters?.updateDate){
                    if(!filters.updateDate){
                        filters.updateDate = sessionStorageFilters.tableFilters.updateDate
                        filters.updateDate.filterVal!.date = new Date(filters.updateDate.filterVal!.date.toString().replace("Z", ""))
                    }
                }
                if(sessionStorageFilters.tableFilters?.doNotResolveBeforeDate){
                    if(!filters.doNotResolveBeforeDate){
                        filters.doNotResolveBeforeDate = sessionStorageFilters.tableFilters.doNotResolveBeforeDate
                        filters.doNotResolveBeforeDate.filterVal!.date = new Date(filters.doNotResolveBeforeDate.filterVal!.date.toString().replace("Z", ""))
                    }
                }
                filters = fillTableFiltersFromSessionStorage(sessionStorageFilters!.tableFilters, filters)
            }
        }

        const filtersToSave = filters
        if (trayHeaderFilter !== TrayHeaderFilterEnum.NONE) {
            filters = getFilterArrayWithHeaderFilters(filters)
        }
        // tslint:disable-next-line:prefer-const
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
        dispatch(updatePagination({page, sizePerPage, sortField, sortOrder, filters: filterArr.filter(value => value.filterValue && value.filterValue !=="")}))
        await dispatch(fetchAndStoreTrayCases(getActivityCode(), {
            page: page - 1,
            sizePerPage,
            filters: filterArr.filter(value => value.filterValue && value.filterValue !==""),
            sortField,
            sortOrder
        }, traySite?.code?? undefined))
        if (trayHeaderFilter !== TrayHeaderFilterEnum.NONE) {
            delete filtersToSave.status
            delete filtersToSave.progressStatus
        }
        setInitialTableFilters(filtersToSave)

        if(sortField && sortOrder){
            setInitialSort({
                dataField: sortField,
                order: sortOrder
            })

            sessionStorage.setItem(userActivity!.code+SessionStorageKeys.DOSSIERS,
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
            sessionStorage.setItem(userActivity!.code+SessionStorageKeys.DOSSIERS,
                Base64.encode(JSON.stringify({
                    tableFilters:filters,
                    themeFilters:themeSelection,
                    site:traySite
                }))
            )
        }

    }
    const calculateFilters =  () => {
        const allFilters = pagination.filters;
        let filters: Filter[] = []
        let filledSessionStorage: boolean = false
        let sessionStorageFilters: CaseFilters | undefined
        if (userActivity?.code) {
            const encodedLocalStorageFilters = sessionStorage.getItem(userActivity!.code + SessionStorageKeys.DOSSIERS)
            if (encodedLocalStorageFilters !== null) {
                sessionStorageFilters = JSON.parse(Base64.decode(encodedLocalStorageFilters))
                if (sessionStorageFilters?.tableFilters?.updateDate) {
                    sessionStorageFilters?.tableFilters?.updateDate?.filterVal!.date = new Date(sessionStorageFilters.tableFilters?.updateDate?.filterVal!.date.toString().replace("Z", ""))
                }
                if (sessionStorageFilters?.tableFilters?.creationDate) {
                    sessionStorageFilters?.tableFilters?.creationDate?.filterVal!.date = new Date(sessionStorageFilters.tableFilters?.creationDate?.filterVal!.date)
                }
                if (sessionStorageFilters?.tableFilters?.doNotResolveBeforeDate) {
                    sessionStorageFilters?.tableFilters?.doNotResolveBeforeDate?.filterVal!.date = new Date(sessionStorageFilters.tableFilters?.doNotResolveBeforeDate?.filterVal!.date)
                }
                setInitialTableFilters(sessionStorageFilters?.tableFilters)
                setInitialSort(sessionStorageFilters?.sort)
                if (sessionStorageFilters?.tableFilters !== undefined) {
                    if (themeSelection[0] && themeSelection[0] !== 'Tous') {
                        filters = formatIntoFilterArray(sessionStorageFilters?.tableFilters, themeSelection).filter(value => !(value.field === 'themeQualification.tags' && value.type === "TEXT"));
                    } else {
                        filters = formatIntoFilterArray(sessionStorageFilters?.tableFilters, themeSelection);
                    }
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
        const themeQualification = filters.find(filter => filter.field === 'themeQualification.tags')
        if (trayHeaderFilter !== TrayHeaderFilterEnum.NONE) {
            const trayHeaderFilterFormatted = getFilterArrayWithHeaderFilters(filters)
            filters = formatIntoFilterArray(trayHeaderFilterFormatted);
            setInitialTableFilters(undefined)
            setInitialSort(undefined)


        }
        if (themeQualification) {
            filters = filters.filter(value => (value.field !== 'themeQualification.tags'))
            if (!filters.find(filter => filter.field === 'themeQualification.tags')) {
                filters.push(themeQualification)
            }
        }
        const newPagination = {
            ...pagination,
            page: 1,
            sortField: sessionStorageFilters?.sort?.dataField ?? undefined,
            sortOrder: sessionStorageFilters?.sort?.order ?? undefined,
            filters: filters.filter(value => value.filterValue && value.filterValue !== "")
        }
        return {sessionStorageFilters, newPagination};
    }

    const onDoubleClickCase = async (row: Case) => {
        try {
            await dispatch(fetchAndStoreClientV2(row.clientId, row.serviceId, DataLoad.ALL_SERVICES));
            dispatch(selectClientV2(row.clientId, row.serviceId));
        } catch (e) {
            NotificationManager.error("Erreur lors du chargement du client");
        } finally {
            dispatch(selectCaseV2(row.caseId, row.clientId, row.serviceId));
        }

    }
    return (
        <div>
            <DetailedCaseTrayTable cases={cases}
                                   onSelectCase={props.onSelectCase}
                                   selected={props.selected}
                                   onTableChange={handleTableChange}
                                   page={pagination.page}
                                   sizePerPage={pagination.sizePerPage}
                                   trayHeaderFilter={trayHeaderFilter}
                                   isCCMaxwell={props.isCCMaxwell}
                                   trayColumnsForMaxwell={props.trayColumnsForMaxwell}
                                   totalSize={caseAmount}
                                   initialFilters={initialTableFilters}
                                   initialSort={initialSort}
                                   themeSelection={themeSelection}
                                   isSupervisor={props.isSupervisor}
                                   sessionIsFrom={sessionIsFrom}
                                   onDoubleClickCase={onDoubleClickCase}
            />
        </div>
    )
}
export default RemoteCaseTrayTable