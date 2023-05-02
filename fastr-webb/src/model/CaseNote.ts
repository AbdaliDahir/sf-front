import {NoteType} from './NoteType';

    import {User} from './User';

    import {Contact} from './Contact';

export interface CaseNote {
    type: NoteType;

    creationDate?: string;

    description: string;

    creator?: User;

    contact?: Contact;

    externalEventId?: string;
}
