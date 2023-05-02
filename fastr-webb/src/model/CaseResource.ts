import {ResourceType} from './ResourceType';

    import {User} from './User';

export interface CaseResource {

    resourceType: ResourceType;

    id: string;

    link: string;

    creator: User;

    creationDate: string;

    valid: boolean;

    description: string;

    failureReason: string;

}
