import {Person} from './Person';

    import {Corporation} from './Corporation';
import {Service} from "../service";
import {LegalResponsible} from "./LegalResponsible";
import {ClientCategory} from "../acts/client-category/ClientCategory";


export interface Client extends Person{

    id: string;

    ownerPerson: Person;

    ownerCorporation: Corporation;

    contactEmail: string;

    contactPhoneNumber: string;

    mobilePhoneNumber: string;

    phoneNumber: string;

    otherNumber: string;

    faxNumber: string;

    favoriteContactDay: string;

    favoriteContactHour: string;

    indicatifMobilePhoneNumber: string;

    indicatifPhoneNumber: string;

    indicatifOtherNumber: string;

    indicatifFaxNumber: string;

    language: string;

    creationDate: string;

    codeProfession: string;

    services: Service[];

    vip: boolean;

    fictive: boolean;

    sensible: boolean;

    probablyDead: boolean;

    corporation: boolean;

    siret: string;

    siren: string;

    legalResponsible: LegalResponsible;

    taxSystem: string;

    clientCategory: ClientCategory;

    password: string


}
