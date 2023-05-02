import {Civility} from './Civility';

    import {QualificationLevelPro} from './QualificationLevelPro';

export interface PhysicalPersonDTO {

    civility: Civility;

    lastName: string;

    firstName: string;

    birthDate: string;

    birthCounty: string;

    sirenSiret: string;

    qualificationLevelPro: QualificationLevelPro;

    probablyDeceased: boolean;

    protectedMajor: string;

}
