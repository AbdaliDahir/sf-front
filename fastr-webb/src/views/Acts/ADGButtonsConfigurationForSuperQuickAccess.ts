import {ACT_ID} from "../../model/actId";

export const ADGButtonConfig = [
    {
        shouldDisplay: ["MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_CHGT_CAT],
        tooltip: "act.cat.corpo.access.tooltip",
        label: "act.cat.corpo.access",
        icon: "icon-world",
        buttonId: "ACT_ID.ADG_CHGT_CAT",
        checkEligibility: false,
        target: "ADG_CHGT_CAT",
    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_JPP],
        tooltip: "act.edit.jpp.access.tooltip",
        label: "act.edit.jpp.access",
        icon: "icon-calendar",
        buttonId: "ACT_ID.ADG_JPP",
        checkEligibility: false,
        target: "ADG_JPP",
    },
    {
        shouldDisplay: ["MP", "FP"],
        adgAuthorization: [ACT_ID.ADG_ETAT_CIVIL],
        tooltip: "act.personal.data.access.tooltip",
        label: "act.personal.data.access",
        icon: "icon-user",
        buttonId: "ACT_ID.ADG_ETAT_CIVIL",
        checkEligibility: false,
        target: "ADG_ETAT_CIVIL",
    },
    {
        shouldDisplay: ["MP", "FP"],
        adgAuthorization: [ACT_ID.ADG_GESTION_DECLA_PRO],
        tooltip: "act.declapro.data.access.tooltip",
        label: "act.declapro.data.access",
        icon: "icon-user",
        buttonId: "ACT_ID.ADG_GESTION_DECLA_PRO",
        checkEligibility: false,
        target: "ADG_GESTION_DECLA_PRO",

    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_CONTACT],
        tooltip: "act.contact.data.access.tooltip",
        label: "act.contact.data.access",
        icon: "icon-call",
        buttonId: "ACT_ID.ADG_CONTACT",
        checkEligibility: false,
        target: "ADG_CONTACT",
    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_ADR_PRINC],
        tooltip: "act.address.data.access.tooltip",
        label: "act.history.label.ADG_ADR_PRINC",
        icon: "icon-home",
        buttonId: "ACT_ID.ADG_ADR_PRINC",
        checkEligibility: false,
        target: "ADG_ADR_PRINC",
    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_CTI],
        tooltip: "act.edit.cti.access.tooltip",
        label: "act.edit.cti.access",
        icon: "icon-user",
        buttonId: "ACT_ID.ADG_CTI",
        checkEligibility: false,
        target: "ADG_CTI",
    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_ADR_FACT],
        tooltip: "act.billing.address.access.tooltip",
        label: "act.billing.address.access",
        icon: "icon-bill",
        buttonId: "ACT_ID.ADG_ADR_FACT",
        checkEligibility: true,
        target: "ADG_ADR_FACT",
    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_UTIL],
        tooltip: "act.edit.user.access.tooltip",
        label: "act.edit.user.access",
        icon: "icon-add-user",
        buttonId: "ACT_ID.ADG_UTIL",
        checkEligibility: true,
        target: "ADG_UTIL",
    },
    {
        shouldDisplay: ["MP", "FP"],
        adgAuthorization: [ACT_ID.ADG_DCD],
        tooltip: "act.edit.dcd.access.tooltip",
        label: "act.edit.dcd.access",
        icon: "icon-block",
        buttonId: "ACT_ID.ADG_DCD",
        checkEligibility: false,
        target: "ADG_DCD",
    },
    {
        shouldDisplay: ["MP", "FP"],
        adgAuthorization: [ACT_ID.ADG_TUTELLE],
        tooltip: "act.edit.tutel.access.tooltip",
        label: "act.edit.tutel.access",
        icon: "icon-parental-lock",
        buttonId: "ACT_ID.ADG_TUTELLE",
        checkEligibility: false,
        target: "ADG_TUTELLE",
    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_MDP],
        tooltip: "act.edit.mdp.access.tooltip",
        label: "act.edit.mdp.access",
        icon: "icon-lock",
        buttonId: "ACT_ID.ADG_MDP",
        checkEligibility: false,
        target: "ADG_MDP",
    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_PUK],
        tooltip: "act.get.puk.access.tooltip",
        label: "act.get.puk.access",
        icon: "icon-sd-card",
        buttonId: "ACT_ID.ADG_PUK",
        checkEligibility: true,
        target: "ADG_PUK",
    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_CHGT_CF],
        tooltip: "act.edit.billing.account.access.tooltip",
        label: "act.edit.billing.account.access",
        icon: "icon-bill",
        buttonId: "ACT_ID.ADG_CHGT_CF",
        checkEligibility: false,
        target: "ADG_CHGT_CF",
    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_COMM_MANUEL_QA],
        tooltip: "act.send.communication.access.tooltip",
        label: "act.send.communication.access",
        icon: "icon-mail",
        buttonId: "ACT_ID.ADG_COMM_MANUEL",
        checkEligibility: false,
        target: "ADG_COMM_MANUEL",
    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_MOY_PAY],
        tooltip: "act.edit.billing.means.access.tooltip",
        label: "act.edit.billing.means.access",
        icon: "icon-bill",
        buttonId: "ACT_ID.ADG_MOY_PAY",
        checkEligibility: false,
        target: "ADG_MOY_PAY",
    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_CAT_CLIENT],
        tooltip: "act.edit.client.category.access.tooltip",
        label: "act.edit.client.category.access",
        icon: "icon-faceid",
        buttonId: "ACT_ID.ADG_CAT_CLIENT",
        checkEligibility: false,
        target: "ADG_CAT_CLIENT",
    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_DUPL_FACT],
        tooltip: "act.edit.dup.fact.access.tooltip",
        label: "act.edit.dup.fact.access",
        icon: "icon-bill",
        buttonId: "ACT_ID.ADG_DUPL_FACT",
        checkEligibility: false,
        target: "ADG_DUPL_FACT",
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FASTR],
        tooltip: "act.edit.dup.fact.access.tooltip",
        label: "ACT_CODE.ADG_FIXE_CHG_STATUT_EQT_FASTR",
        icon: "icon-bill",
        buttonId: "ADG_FIXE_CHG_STATUT_EQT_FASTR",
        checkEligibility: false,
        target: "ADG_FIXE_CHG_STATUT_EQT_FASTR",
    },
    {
        shouldDisplay: ["FP", "MM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_RV_ETIQUETTE_FASTR],
        tooltip: "button.edit.renvois.etiquette.fastr.access.tooltip",
        label: "ACT_CODE.ADG_FIXE_RV_ETIQUETTE_FASTR",
        icon: "icon-bill",
        buttonId: "ADG_FIXE_RV_ETIQUETTE_FASTR",
        checkEligibility: false,
        target: "ADG_FIXE_RV_ETIQUETTE_FASTR",
    }
]
