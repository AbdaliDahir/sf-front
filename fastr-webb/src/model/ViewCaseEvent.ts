import {EventLogType} from "./EventLogType";
import {User} from "./User";
import {ViewEventFieldChange} from "./ViewEventFieldChange";

export interface ViewCaseEvent {

    date?: string;

    type?: EventLogType;

    author?: User;

    status?: string

    fieldChanges?:ViewEventFieldChange[];

}