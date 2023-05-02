const ExternalAppsConfigs = {
    GESTION_AUTORISATION_CONTACT: {
        appCode: "ESFC",
        appPage: "GESTPREF",
        label: "Gestion des autorisations de contacts"
    },
    GESTION_OFFRES_GROUPE: {
        appCode: "ESFC",
        appPage: "GESTGROUP",
        label: "Gérer les offres de groupe"
    },
    SUIVI_ODR: {
        appCode: "ESFC",
        appPage: "ODR",
        label: "Suivi ODR"
    },
    REGLER_FACTURES: {
        appCode: "ESFC",
        appPage: "PCBMOB",
        label: "Régler les factures"
    },
    SOLDER_FDP: {
        appCode: "ESFC",
        appPage: "SOLDERFDP",
        label: "Solder la FDP"
    },
    CONSULT_ACHAT: {
        appCode: "ESFC",
        appPage: "CONSULTACHAT",
        label: "Détail des achats multimédia"
    },
    GESTION_DROIT_ACHAT: {
        appCode: "ESFC",
        appPage: "DROITACHAT",
        label: "Gestion des droits d'achat",
    },
    RECOMMANDATIONS_EZY: {
        appCode: "EZY2",
        appPage: "",
        label: "Voir dans EZY",
    },
    INFO_CONSO: {
        appCode: "ESFC",
        appPage: "INFOCONSO",
        label: "Détail Conso Espace Client"
    },
    DIAGNOSTIC_ARBEO: {
        appCode: "ARBEO",
        appPage: "",
        label: "DIAG ARBEO"
    },
    CONSULT_RIO_MOBILE: {
        appCode: "ESFC",
        label: "Accès Extranet Selfcare",
        appPage: "CONSULTRIOMOBILE"
    },
    CONSULT_RIO_FIXE: {
        appCode: "ESFC",
        label: "Accès Extranet Selfcare",
        appPage: "CONSULTRIOFIXE"
    },
    CONSULT_TV_CHANNEL_LIST: {
        appCode: "MOSS",
        label: "Branchement Aletheia",
        appPage: "CONSULTTVCHANNELLIST"
    },
    FIORI_COMMON: {
        appCode: "FIORI",
        label: "Consulter les informations financières",
        value: "CONSULTATION"
    },
    ADG_FIORI_ECHEANCIER: {
        appCode: "FIORI",
        label: "Echéancier",
        value: "ECHEANCIER"
    },
    ADG_FIORI_AVOIR_MANUEL: {
        appCode: "FIORI",
        label: "Avoir Manuel",
        value: "AVOIR_MANUEL"
    },
    ADG_FIORI_GEL_RELANCE: {
        appCode: "FIORI",
        label: "Gel de relance",
        value: "GEL_RELANCE"
    },
    ADG_FIORI_DEMANDE_SURENDETTEMENT: {
        appCode: "FIORI",
        label: "Demande de surendettement",
        value: "DEMANDE_SURENDETTEMENT"
    },
    ADG_FIORI_AVANCE_FACTURE: {
        appCode: "FIORI",
        label: "Avance de facture",
        value: "AVANCE_FACTURE"
    },
    INFO_MOBILE: {
        appCode: "INFM",
        appPage: "",
        label: ""
    },
    VEGAS: {
        appCode: "VEGC",
        label: "Visualisation des courriers VEGAS",
        appPage: "VISU_VEGA"
    }
}





export const BlocksExternalAppsConfig = {
    'administrative': {
        'blockClient': [ExternalAppsConfigs.GESTION_AUTORISATION_CONTACT],
        'blockContract': [],
        'blockPayment': [],
    },
    'offerAndUsage': {
        'blockMobileOffer': [ExternalAppsConfigs.CONSULT_RIO_MOBILE],
        'blockLandedOffer': [ExternalAppsConfigs.CONSULT_RIO_FIXE],
        'blockMobilePaymentFacility': [],
        'blockLandedPaymentFacility': [],
        'blockMobileRenewal': [],
        'blockEngagementsDetails': [],
        'blockMobilePlans': [],
        'blockMobileEquipements': [ExternalAppsConfigs.INFO_MOBILE],
        'blockMobileConsumption2': [ExternalAppsConfigs.INFO_CONSO],
        'blockLandedConsumption': [],
        'tvChannelList': [ExternalAppsConfigs.CONSULT_TV_CHANNEL_LIST]
    },
    'billingAndPayment': {
        'blockPayment': [],
        'BlockBills': [ExternalAppsConfigs.REGLER_FACTURES, ExternalAppsConfigs.SOLDER_FDP, ExternalAppsConfigs.CONSULT_ACHAT, ExternalAppsConfigs.GESTION_DROIT_ACHAT]
    },
    'recommandations': {
        'syntheticRecommandations': [ExternalAppsConfigs.RECOMMANDATIONS_EZY],
        'detailedRecommandations': [ExternalAppsConfigs.RECOMMANDATIONS_EZY],
    },
    'fastrCases': {
        'createCaseNavBar': [ExternalAppsConfigs.DIAGNOSTIC_ARBEO],
        'navBarForUpdate': [ExternalAppsConfigs.DIAGNOSTIC_ARBEO]
    },
    'disrcCases': {
        'caseActionsV2': [ExternalAppsConfigs.DIAGNOSTIC_ARBEO]
    },
    'adg': {
        'fiori': {
            'common': [ExternalAppsConfigs.FIORI_COMMON],
            'ADG_FIORI_ECHEANCIER':[ExternalAppsConfigs.ADG_FIORI_ECHEANCIER],
            'ADG_FIORI_AVOIR_MANUEL':[ExternalAppsConfigs.ADG_FIORI_AVOIR_MANUEL],
            'ADG_FIORI_GEL_RELANCE':[ExternalAppsConfigs.ADG_FIORI_GEL_RELANCE],
            'ADG_FIORI_DEMANDE_SURENDETTEMENT':[ExternalAppsConfigs.ADG_FIORI_DEMANDE_SURENDETTEMENT],
            'ADG_FIORI_AVANCE_FACTURE':[ExternalAppsConfigs.ADG_FIORI_AVANCE_FACTURE]
        }
    },
    'history': {
        'vegasCouriers': [ExternalAppsConfigs.VEGAS]
    }
}
