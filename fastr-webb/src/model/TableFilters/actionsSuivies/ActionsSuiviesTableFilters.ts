import {FilterType} from "../../enums/FilterType";
import {TableComparator} from "../../enums/TableComparator";
import {CaseStatus} from "../../case/CaseStatus";

export interface ActionsSuiviesTableFilters{
    "monitoringCurrentState.startDate"?: {
        filterVal: {
            date: Date | string,
            comparator: TableComparator
        },
        filterType: FilterType,
        comparator: string,
        caseSensitive: boolean
    },
    "monitoringCurrentState.assignee.login"?: {
        filterVal: string,
        filterType: FilterType,
        comparator: TableComparator,
        caseSensitive: boolean
    },
    creationDate?: {
        filterVal: {
            date: Date | string,
            comparator:  TableComparator
        },
        filterType: FilterType,
        comparator: string,
        caseSensitive: boolean
    },
    actionId?: {
            filterVal: string,
            filterType: FilterType,
            comparator: TableComparator,
            caseSensitive: boolean
    },
    "themeQualification.tags"?: {
            filterVal: string,
            filterType: FilterType
            comparator: TableComparator,
            caseSensitive: boolean
        },
    "processCurrentState.assignee.activity.label"?: {
            filterVal: string,
            filterType: FilterType,
            comparator: TableComparator,
            caseSensitive: boolean
    },
    "processCurrentState.status"?: {
            filterVal: CaseStatus,
            filterType: FilterType,
            comparator: TableComparator,
            caseSensitive: boolean
        },
    "processCurrentState.progressStatus.code"?: {
            filterVal: string,
            filterType: FilterType
            comparator: TableComparator,
            caseSensitive: boolean
        },
    "processCurrentState.conclusion.label"?: {
            filterVal: string,
            filterType: FilterType,
            comparator: TableComparator,
            caseSensitive: boolean
        },
    "processCurrentState.updateDate"?: {
        filterVal: {
            date: Date | string,
            comparator: TableComparator,
        },
        filterType: FilterType,
        comparator: TableComparator,
        caseSensitive: boolean
    },
    "processCurrentState.doNotResolveBeforeDate"?: {
        filterVal: {
            date: Date | string,
            comparator: TableComparator,
        },
        filterType: FilterType,
        comparator: TableComparator,
        caseSensitive: boolean
    }

}