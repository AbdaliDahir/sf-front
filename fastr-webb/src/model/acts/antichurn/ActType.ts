import {ActDetail} from "./ActDetail";

export interface ActType {
    code: string;
    label: string;
    detail: Array<ActDetail>
}