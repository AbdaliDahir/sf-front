import {TableSort} from "../TableSort";
import {ActionTableFilters} from "./ActionTableFilters";
import {Site} from "../../Site";

export interface ActionFilters {
    tableFilters?:ActionTableFilters
    sort?:TableSort
    themeFilters?: string[],
    site:Site
}