import {CaseProgressStatus} from "../../CaseProgressStatus";
import {FilterType} from "../../enums/FilterType";
import {TableComparator} from "../../enums/TableComparator";
import {CaseStatus} from "../../case/CaseStatus";
import {ServiceType} from "../../ServiceType";

export interface CaseTableFilters {
    progressStatus?: {
        filterVal: CaseProgressStatus,
        filterType: FilterType
        comparator: TableComparator,
        caseSensitive: boolean
    },
    "themeQualification.tags"?: {
        filterVal: string,
        filterType: FilterType
        comparator: TableComparator,
        caseSensitive: boolean
    },
    updateDate?: {
        filterVal: {
            date: Date | string,
            comparator: TableComparator,
        },
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
    caseId?: {
        filterVal: string,
        filterType: FilterType,
        comparator: TableComparator,
        caseSensitive: boolean
    },
    status?: {
        filterVal: CaseStatus,
        filterType: FilterType,
        comparator: TableComparator,
        caseSensitive: boolean
    },
    "caseOwner.login"?: {
        filterVal: string,
        filterType: FilterType,
        comparator: TableComparator,
        caseSensitive: boolean
    },
    "qualification.tags"?: {
        filterVal: string,
        filterType: FilterType,
        comparator: TableComparator,
        caseSensitive: boolean
    },
    doNotResolveBeforeDate?: {
        filterVal: {
            date: Date | string,
            comparator: TableComparator
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
    "resources.resourceType" :{
        filterVal: string,
        filterType: FilterType
        comparator: TableComparator,
        caseSensitive: boolean
    },
    "caseCreator.activity.label" :{
        filterVal: string,
        filterType: FilterType
        comparator: TableComparator,
        caseSensitive: boolean
    }
}