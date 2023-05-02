export const qualification = {
    "LEVEL1_NUMBER2": "2.CONTRAT & COORDONNEES",
    "LEVEL2_NUMBER21": "2.1 S'informer/Modifier",
    "LEVEL3_NUMBER1": "1.Coordonnees",
    "LEVEL4_PERSO": "Nom/Naissance/Adresse/Mail/Tel",
    "LEVEL4_PAY": "RIB/SEPA/Mode de Paiement",

    "LEVEL1_NUMBER4": "4.LIGNES & EQUIPEMENTS",
    "LEVEL2_NUMBER41": "4.1 S'informer/Modifier",
    "LEVEL3_NUMBER41": "1. Equipements",
    "LEVEL4_PUK": "Debloquer code PIN/PUK",

    "LEVEL1_NUMBER3": "3.CONSO & FACTURES",
    "LEVEL2_NUMBER31": "3.1 S'informer/Modifier",
    "LEVEL3_NUMBER31": "1.Demande",
    "LEVEL4_DUP_FACT": "Duplicata de Facture",

    "ADG_PERSONAL_QUALIF": {
        "caseType": "Commercial",
        "code": "PLTFAV02_01_01_01",
        "inactivityDelay": 0,
        "tags": ["2.CONTRAT & COORDONNEES", "2.1 S'informer/Modifier", "1.Coordonnées", "Nom/Naissance/Adresse/Mail/Tél"]

    },

    "ADG_MOY_PAY_QUALIF": {
        "caseType": "Commercial",
        "code": "PLTFAV02_01_01_04",
        "inactivityDelay": 0,
        "tags": ["2.CONTRAT & COORDONNEES", "2.1 S'informer/Modifier", "1.Coordonnées", "RIB/SEPA/Mode de Paiement"]
    },

    "ADG_CTI_QUALIF": {
        "caseType": "Commercial",
        "code": "PLTFAV02_01_02_01",
        "inactivityDelay": 0,
        "tags": ["2.CONTRAT & COORDONNEES", "2.1 S'informer/Modifier", "2.Contrat", "Changement de Titulaire"]
    },

    "ADG_PUK_QUALIF": {
        "caseType": "Commercial",
        "code": "PLTFAV04_01_02_04",
        "inactivityDelay": 0,
        "tags": ["4.LIGNES & EQUIPEMENTS", "4.1 S'informer/Modifier", "1.Equipements", "Débloquer code PIN/PUK"]
    },

    "ADG_DUPL_FACT_QUALIF": {
        "caseType": "Commercial",
        "code": "PLTFAV03_01_01_01",
        "inactivityDelay": 0,
        "tags": ["3.CONSO & FACTURES", "3.1 S'informer/Modifier", "1.Demande", "Duplicata de Facture"]
    },

    "ADG_JPP_QUALIF": {
        "caseType": "Commercial",
        "code": "PLTFAV03_01_01_11",
        "inactivityDelay": 0,
        "tags": ["3.CONSO & FACTURES", "3.1 S'informer/Modifier", "1.Demande", "Date de prélèvement"]

    },

    "ADG_CHGT_CF_QUALIF": {
        "caseType": "Commercial",
        "code": "PLTFAV03_01_01_03",
        "inactivityDelay": 0,
        "tags": ["3.CONSO & FACTURES", "3.1 S'informer/Modifier", "1.Demande", "Facture Groupée"]
    },

    "ADG_ADR_FACT": {
        "caseType": "Commercial",
        "code": "PLTFAV03_01_01_03",
        "inactivityDelay": 0,
        "tags": ["3.CONSO & FACTURES", "3.1 S'informer/Modifier", "1.Demande", "Facture Groupée"]
    },
    
    "ADG_COMM_MANUEL": {
        "caseType": "Commercial",
        "code": "PLTFAV03_01_01_03",
        "inactivityDelay": 0,
        "tags": ["3.CONSO & FACTURES", "3.1 S'informer/Modifier", "1.Demande", "Facture Groupée"]
    },

    "ADG_CAT_CLIENT": {
        "caseType": "Commercial",
        "code": "PLTFAV02_01_02_11",
        "inactivityDelay": 0,
        "tags": ["2.CONTRAT & COORDONNEES", "2.1 S'informer/Modifier", "2.Contrat", "Modification Catégorie Client"]
    },
    "RV_ETIQUETTE_FASTR": {
        "caseType": "Commercial",
        "code": "RELDIS_04_03_01_04",
        "inactivityDelay": 0,
        "tags": ["4.LIGNES & EQUIPEMENTS", "4.3 Dysfonctionnement", "1.Equipements", "Etiquette Non Reçue/Perdue"]
    },

    "CHG_STATUT_EQT_FASTR": {
        "caseType": "Commercial",
        "code": "PFCTFIX04_03_01_03",
        "inactivityDelay": 0,
        "tags": ["4.LIGNES & EQUIPEMENTS", "4.3 Dysfonctionnement", "1.Equipements", "Equipement retourné par le client"]
    }
};

export interface ActQualification {
    caseType: string,
    code: string,
    tags: string[],
    inactivityDelay: number
}