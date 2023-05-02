export const legalCategoryList :LegalCategorySettings[] =
    [
        {"name": "Société Action Simplifié", "code": "57"},
        {"name": "Autre Personne Physique", "code": "19"},
        {"name": "Société Anonyme", "code": "55"},
        {"name": "Associé Gérant de Société", "code": "18"},
        {"name": "Profession Libérale", "code": "15"},
        {"name": "Exploitant Agricole", "code": "16"},
        {"name": "Artisan", "code": "13"},
        {"name": "Artisan Commerçant", "code": "11"},
        {"name": "Commerçant", "code": "12"},
        {"name": "Société Civile", "code": "65"},
        {"name": "Comité d'entreprise", "code": "82"},
        {"name": "GIE", "code": "62"},
        {"name": "Autre Personne Morale", "code": "99"},
        {"name": "Organisme Professionnel", "code": "84"},
        {"name": "Non renseigné", "code": "NON_RENSEIGNE"},
        {"name": "Association Loi 1901", "code": "92"},
        {"name": "Syndicats de Propriétaires", "code": "81"},
        {"name": "Pers.Drt Etran.Non au RCS", "code": "32"},
        {"name": "Pers.Drt Etranger au RCS", "code": "31"},
        {"name": "Ste Coop. Commerc. Part.", "code": "51"},
        {"name": "Société en Nom Collectif", "code": "52"},
        {"name": "SARL", "code": "54"},
        {"name": "Collectivités Publiques", "code": "07"}
    ]
;

export const CODE_FOR_COLLECT_TERR:string ="72";

export interface LegalCategorySettings {
    name: string,
    code: string
}

export const getLegalCategoryMap = () => {
    const legalCategoryMap: Map<string, string> = new Map()
    legalCategoryList.forEach(category => legalCategoryMap.set(category.code, category.name));
    return legalCategoryMap;
}
