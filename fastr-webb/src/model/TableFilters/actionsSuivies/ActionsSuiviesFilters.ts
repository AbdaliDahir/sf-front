import {TableSort} from "../TableSort";
import {ActionsSuiviesTableFilters} from "./ActionsSuiviesTableFilters";
import {Site} from "../../Site";

export interface ActionsSuiviesFilters {
    tableFilters?:ActionsSuiviesTableFilters
    sort?:TableSort
    themeFilters?: string[]
    site:Site
}