import {Channel} from './Channel';

    import {Media} from './Media';

export interface ContactDTO {


    startDate?: string;

    clientId: string | undefined;
    serviceId: string| undefined;

    contactId?: string;

    channel?: Channel;

    media?: Media;


}
