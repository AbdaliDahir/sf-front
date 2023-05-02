import {FilterType} from "../../enums/FilterType";
import {TableComparator} from "../../enums/TableComparator";
import {CaseStatus} from "../../case/CaseStatus";
import {ServiceType} from "../../ServiceType";

export interface ActionTableFilters {
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
    "processCurrentState.updateDate"?: {
        filterVal: {
            date: Date | string,
            comparator: TableComparator,
        },
        filterType: FilterType,
        comparator: TableComparator,
        caseSensitive: boolean
    },
    "processCurrentState.assignee.login"?: {
        filterVal: string,
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
    },
    serviceType?: {
        filterVal: ServiceType,
        filterType: FilterType,
        comparator: TableComparator,
        caseSensitive: boolean
    },
    "creationAuthor.activity.label"?: {
        filterVal: string,
        filterType: FilterType,
        comparator: TableComparator,
        caseSensitive: boolean
    }
}