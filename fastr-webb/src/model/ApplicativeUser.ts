import {Activity} from './Activity';

import {ApplicationUser} from './ApplicationUser';

import {Position} from './Position';

import {Site} from './Site';

export interface ApplicativeUser {

    degrade: boolean;

    username: string;

    password: string;

    perId: string;

    activities: Array<Activity>;

    roles: Array<string>;

    applications: Array<ApplicationUser>;

    positions: Array<Position>;

    site: Site;

    firstName: string;

    lastName: string;

    position: Position;

    activity: Activity;

    acdLogin: string;

    sapLogin: string;

    sso: boolean;

    login: string;

}

export interface SessionWrapper {
    id: string;
    user: ApplicativeUser;
}