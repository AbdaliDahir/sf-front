import {translate} from "src/components/Intl/IntlGlobalProvider";
import moment from "moment";

export interface Pagination {
    page: number
    sizePerPage: number
    sortField?: string
    sortOrder?: string
    filters?: Array<Filter>

}

export interface Filter {
    field: string
    filterValue: string
    type: "DATE" | "TEXT" | "SELECT" | "TEXT_ARRAY" | "BOOLEAN"
    comparator?: "LT" | "GT" | "ALL" | "EQUAL"
}

const comparatorMap = {
    ">": "GT",
    "<": "LT",
    "=": "EQUAL",
    "LIKE": "ALL"
}

export function formatThemeSelection(filtersArr?: Array<Filter>, themeSelection?: Array<string>) {
    if (!filtersArr) {
        filtersArr = []
    }
    if (themeSelection && themeSelection.length) {
        const placeHolderOption: string = translate.formatMessage({id: "tray.cases.filter.themes.all"});
        filtersArr = filtersArr.filter(filter => !(filter.field === 'themeQualification.tags' && filter.type==="TEXT_ARRAY"));
        if (themeSelection[0] !== placeHolderOption) {
            filtersArr.push(
                {
                    field: 'themeQualification.tags',
                    filterValue: themeSelection.filter(themeSelected => themeSelected !== placeHolderOption).join(","),
                    type: "TEXT_ARRAY",
                    comparator: "EQUAL"
                }
            )
        }
    }
    return filtersArr
}

export const formatIntoFilterArray = (filters, themeSelections?: Array<string>): Array<Filter> => {
    if (!filters) {
        return []
    }
    const filtersArr: Array<Filter> = [];
    const fields: string[] = Object.keys(filters);
    fields.forEach(field => {
        if (filters[field].filterType === "TEXT") {
            filtersArr.push(
                {
                    field,
                    filterValue: filters[field].filterVal,
                    type: filters[field].filterType
                }
            )
        } else if (filters[field].filterType === "DATE") {
            filtersArr.push(
                {
                    field,
                    filterValue: moment(filters[field].filterVal.date).utc().startOf('day').toISOString().replace("Z", ""),
                    type: filters[field].filterType,
                    comparator: comparatorMap[filters[field].filterVal.comparator]
                }
            )
        } else if (filters[field].filterType === "SELECT" &&  filters[field].filterVal !== 'default' && filters[field].filterVal !== undefined ) {
            filtersArr.push(
                {
                    field,
                    filterValue: filters[field].filterVal,
                    type: filters[field].filterType,
                }
            )
        } else if (filters[field].filterType === "NULL" || filters[field].filterType === "NOT_NULL"|| filters[field].filterType === "TEXT_ARRAY") {
            filtersArr.push(
                {
                    field,
                    filterValue: filters[field].filterVal,
                    type: filters[field].filterType,
                }
            )
        }
    })

    return formatThemeSelection(filtersArr, themeSelections);
}



