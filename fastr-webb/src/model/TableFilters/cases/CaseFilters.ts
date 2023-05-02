import {CaseTableFilters} from "./CaseTableFilters";
import {TableSort} from "../TableSort";
import {Site} from "../../Site";

export interface CaseFilters {
    tableFilters?: CaseTableFilters,
    sort?:TableSort
    themeFilters?: string[],
    site:Site
}