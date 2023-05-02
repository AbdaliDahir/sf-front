import {MaxwellProcess} from "./enums/MaxwellProcess";


export interface TicketCreationState {

    idTicket: string;

    state: MaxwellProcess;

    attachementDirectory: string;

}

