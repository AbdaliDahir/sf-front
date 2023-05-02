import {Person} from './Person';

export interface LegalResponsible {

    responsible: Person;

    contactEmail?: string;

    contactMobilePhoneNumber?: string;

    indicatifMobilePhoneNumber?: string;

    contactPhoneNumber?: string;

    indicatifPhoneNumber?: string;

}
