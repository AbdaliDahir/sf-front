import {ActModification} from './ActModification';

    import {StatutADG} from './StatutADG';

export interface ManagementActDTO {

    id?: string;

    idDemande?: string;

    dateCreation?: string;

    dateEcheance?: string;

    dateTraitement?: string;

    idPersonne?: string;

    idComptesFacturations?: Array<string>;

    idRum?: string;

    origineADG?: string;

    impacts?: Array<string>;

    modificationLists: Array<ActModification>;

    statutADG?: StatutADG;

}
