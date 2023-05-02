import {ServiceType} from "../../ServiceType";

export interface MotifID {
    code:string;
    label:string;
    serviceTypes: Array<ServiceType>;
}