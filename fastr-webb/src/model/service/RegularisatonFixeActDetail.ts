import {ActDetailHeader} from "./ActDetailHeader";

export interface RegularisationFixeActDetail {
    header?: ActDetailHeader;
    actDetails?: AramisActDetail[];
}

export interface AramisActDetail {

    parametertype?: string;
    parametername?: string;
    parametervalue?: string;
}