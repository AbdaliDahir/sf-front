import {EventLogType} from './EventLogType';

import {User} from './User';
import {ValueChangeEvent} from "./ValueChangeEvent";

export interface CaseEvent {

    date?: string;

    type?: EventLogType;

    author?: User;


    valueChangeEvents?:ValueChangeEvent[];

}
