import {Address} from './Address';
import {QualificationLevelPro} from "../QualificationLevelPro";

export enum TUTORSHIP {
    TUTELLE,
    CURATELLE_SIMPLE,
    CURATELLE_RENFORCEE,
    CURATELLE_AMENAGEE,
    NON_PROTEGE,
    NON_RENSEIGNE,
    SAUVEGARDE_JUSTICE,
    HABILITATION_FAMILIALE
}

export interface Person {

    birthDate: string;

    civility: string;

    firstName: string;

    lastName: string;

    address: Address;

    birthDepartment?: string;

    tutorshipType?: TUTORSHIP;

    qualificationLevelPro?: QualificationLevelPro

    tutorshipEndDate?: string

}
