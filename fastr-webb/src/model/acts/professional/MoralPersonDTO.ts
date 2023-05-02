export interface MoralPersonDTO {

    apeCode?: string;

    contact?: string;

    vtaNumber?: string;

    companyName: string;

    siren?: string;

    siret: string;

    motDePasse?: string;

    legalCategoryCode?: string;

    taxSystem: string;

    legalStatus?: string;

    legalCreationDate: string;

    legalCategoryName?: string;

    chorusFlag: boolean;

    chorusServiceCode:  string | undefined;

    chorusLegalEngagement:  string | undefined;

    creditLimit: number|undefined;

    treasurer?: string;


}
