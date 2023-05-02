import {Media} from './Media';

import {Case} from './Case';
import {Channel} from "./Channel";

export interface Contact {

    id?: string;

    createdDate?: string;

    contactId: string;

    clientId?: string;

    serviceId: string;

    lastModifiedDate?: string;

    channel: Channel;

    media: Media;

    mediaChanged?: boolean;

    startDate?: string;

    cases?: Array<Case>;

}


export interface ContactWrapper {
    contact: Contact | undefined,
    isContactComplete: boolean
}
