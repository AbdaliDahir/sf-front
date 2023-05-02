import {EStepDetailName} from "./enums/EStepDetailName";

export interface MaxwellStepDTO {
    name            : EStepDetailName,
    date            : Date,
    status          : string,
    returnCode      : string,
    returnMessage   : string,
    contactId      ?: string;
}