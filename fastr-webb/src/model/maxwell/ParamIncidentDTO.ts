import {Incident} from "../Incident";

export interface ParamIncidentDTO {
    code    :string,
    tags    : string[],
    incident: Incident;
}