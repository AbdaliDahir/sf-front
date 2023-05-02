export interface Address {

    identityComplement?: string;

    postalBox?: string;

    city?: string;

    zipcode?: string;

    countryCode?: string;

    /**
     * @deprecated
     */
    idTechniqueAdresseTitulaire?: string;

    /**
     * @deprecated
     */
    idTechniqueAdresseTitulaireCSU?: string;

    geoComplement?: string;

    address1?: string;

    address2?: string;

    country?: string;
}
