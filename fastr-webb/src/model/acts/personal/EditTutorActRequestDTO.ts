import {LegalResponsible} from '../../person/LegalResponsible';


export enum Tutorship {
    TUTELLE,
    CURATELLE_SIMPLE,
    CURATELLE_RENFORCEE,
    CURATELLE_AMENAGEE,
    NON_PROTEGE,
    NON_RENSEIGNE,
    SAUVEGARDE_JUSTICE,
    HABILITATION_FAMILIALE

}

export interface EditTutorActRequestDTO {

    legalResponsible?: LegalResponsible;

    tutorship?: Tutorship;

    tutorshipEndDate?: string

}
