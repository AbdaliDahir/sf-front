import {Site} from './Site';

    import {Activity} from './Activity';

    import {Position} from './Position';

export interface User {

    perId: string;

    login: string;

    firstName: string;

    lastName: string;

    loginAcd: string;

    vendorCode: string;

    shopCode: string;

    position: Position;

    site: Site;

    physicalSite: Site;

    activity: Activity;

}
