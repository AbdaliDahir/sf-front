import {ACT_ID} from "../../model/actId";

/*
* MM : Mobile Moral
* FM : Fixe Moral
* MP : Mobile Physique
* FP : Fixe Physique
* */

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
        adgClass: "admin"
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
        adgClass: "billing"

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
        adgClass: "admin"

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
        adgClass: "admin"

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
        adgClass: "admin"

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
        adgClass: "admin"

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
        adgClass: "admin"

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
        adgClass: "admin"

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
        adgClass: "admin"

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
        adgClass: "admin"

    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_WEBSAP_ECHEANCIER],
        tooltip: "act.edit.websapecheancier.access.tooltip",
        label: "act.edit.websapecheancier.access",
        icon: "icon-block",
        buttonId: "ADG_WEBSAP_ECHEANCIER",
        checkEligibility: false,
        target: "ADG_WEBSAP_ECHEANCIER",
        adgClass: "billing"

    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_WEBSAP_AVOIR_MANUEL],
        tooltip: "act.edit.websapavoirmanuel.access.tooltip",
        label: "act.edit.websapavoirmanuel.access",
        icon: "icon-block",
        buttonId: "ADG_WEBSAP_AVOIR_MANUEL",
        checkEligibility: false,
        target: "ADG_WEBSAP_AVOIR_MANUEL",
        adgClass: "billing"

    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_WEBSAP_GEL_RELANCE],
        tooltip: "act.edit.websapgelrelance.access.tooltip",
        label: "act.edit.websapgelrelance.access",
        icon: "icon-block",
        buttonId: "ADG_WEBSAP_GEL_RELANCE",
        checkEligibility: false,
        target: "ADG_WEBSAP_GEL_RELANCE",
        adgClass: "billing"

    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_WEBSAP_DEMANDE_SURENDETTEMENT],
        tooltip: "act.edit.websapdemandesurendettement.access.tooltip",
        label: "act.edit.websapdemandesurendettement.access",
        icon: "icon-block",
        buttonId: "ADG_WEBSAP_DEMANDE_SURENDETTEMENT",
        checkEligibility: false,
        target: "ADG_WEBSAP_DEMANDE_SURENDETTEMENT",
        adgClass: "billing"

    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_WEBSAP_AVANCE_FACTURE],
        tooltip: "act.edit.websapavancefacture.access.tooltip",
        label: "act.edit.websapavancefacture.access",
        icon: "icon-block",
        buttonId: "ADG_WEBSAP_AVANCE_FACTURE",
        checkEligibility: false,
        target: "ADG_WEBSAP_AVANCE_FACTURE",
        adgClass: "billing"

    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_FIORI_ECHEANCIER],
        tooltip: "act.edit.fioriecheancier.access.tooltip",
        label: "act.edit.fioriecheancier.access",
        icon: "icon-block",
        buttonId: "ADG_FIORI_ECHEANCIER",
        checkEligibility: false,
        target: "ADG_FIORI_ECHEANCIER",
        adgClass: "billing"

    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_FIORI_AVOIR_MANUEL],
        tooltip: "act.edit.fioriavoirmanuel.access.tooltip",
        label: "act.edit.fioriavoirmanuel.access",
        icon: "icon-block",
        buttonId: "ADG_FIORI_AVOIR_MANUEL",
        checkEligibility: false,
        target: "ADG_FIORI_AVOIR_MANUEL",
        adgClass: "billing"

    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_FIORI_GEL_RELANCE],
        tooltip: "act.edit.fiorigelrelance.access.tooltip",
        label: "act.edit.fiorigelrelance.access",
        icon: "icon-block",
        buttonId: "ADG_FIORI_GEL_RELANCE",
        checkEligibility: false,
        target: "ADG_FIORI_GEL_RELANCE",
        adgClass: "billing"

    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_FIORI_DEMANDE_SURENDETTEMENT],
        tooltip: "act.edit.fioridemandesurendettement.access.tooltip",
        label: "act.edit.fioridemandesurendettement.access",
        icon: "icon-block",
        buttonId: "ADG_FIORI_DEMANDE_SURENDETTEMENT",
        checkEligibility: false,
        target: "ADG_FIORI_DEMANDE_SURENDETTEMENT",
        adgClass: "billing"

    },
    {
        shouldDisplay: ["MP", "MM"],
        adgAuthorization: [ACT_ID.ADG_FIORI_AVANCE_FACTURE],
        tooltip: "act.edit.fioriavancefacture.access.tooltip",
        label: "act.edit.fioriavancefacture.access",
        icon: "icon-block",
        buttonId: "ADG_FIORI_AVANCE_FACTURE",
        checkEligibility: false,
        target: "ADG_FIORI_AVANCE_FACTURE",
        adgClass: "billing"

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
        adgClass: "admin"

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
        adgClass: "admin"

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
        adgClass: "equipment"

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
        adgClass: "billing"

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
        adgClass: "billing"

    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_COMM_MANUEL],
        tooltip: "act.send.communication.access.tooltip",
        label: "act.send.communication.access",
        icon: "icon-mail",
        buttonId: "ACT_ID.ADG_COMM_MANUEL",
        checkEligibility: false,
        target: "ADG_COMM_MANUEL",
        adgClass: "admin"

    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_COMM_MANUEL],
        tooltip: "act.send.communication.access.tooltip",
        label: "act.send.communication.access",
        icon: "icon-mail",
        buttonId: "ACT_ID.ADG_COMM_MANUEL",
        checkEligibility: false,
        target: "ADG_COMM_MANUEL",
        adgClass: "billing"

    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_COMM_MANUEL],
        tooltip: "act.send.communication.access.tooltip",
        label: "act.send.communication.access",
        icon: "icon-mail",
        buttonId: "ACT_ID.ADG_COMM_MANUEL",
        checkEligibility: false,
        target: "ADG_COMM_MANUEL",
        adgClass: "equipment"

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
        adgClass: "billing"

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
        adgClass: "admin"

    },
    {
        shouldDisplay: ["MP", "FP", "MM", "FM"],
        adgAuthorization: [ACT_ID.ADG_SUIVI_SAV],
        tooltip: "Suivi SAV",
        label: "Suivi SAV",
        icon: "",
        buttonId: "ACT_ID.ADG_SUIVI_SAV",
        checkEligibility: false,
        target: "ADG_SUIVI_SAV",
        adgClass: "admin"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_AJUSTEMENT_FAST],
        tooltip: "button.edit.unpaid.regularization.access.tooltip",
        label: "button.edit.unpaid.regularization.access",
        icon: "",
        buttonId: "ACT_ID.AJUSTEMENT",
        checkEligibility: false,
        target: "AJUSTEMENT",
        adgClass: "billing"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_ANNU_ENG_FAST],
        tooltip: "button.edit.cancel.engagement.access.tooltip",
        label: "button.edit.cancel.engagement.access",
        icon: "",
        buttonId: "ACT_ID.ANNU_ENG",
        checkEligibility: false,
        target: "ANNU_ENG",
        adgClass: "billing"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_ANNU_RESI_FAST],
        tooltip: "button.edit.cancel.planned.resiliation.access.tooltip",
        label: "button.edit.cancel.planned.resiliation.access",
        icon: "",
        buttonId: "ACT_ID.ANNU_RESI",
        checkEligibility: false,
        target: "ANNU_RESI",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FAST],
        tooltip: "button.edit.return.equipement.access.tooltip",
        label: "button.edit.return.equipement.access",
        icon: "",
        buttonId: "ACT_ID.CHG_STATUT_EQT",
        checkEligibility: false,
        target: "CHG_STATUT_EQT",
        adgClass: "billing"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FAST],
        tooltip: "button.edit.return.equipement.access.tooltip",
        label: "button.edit.return.equipement.access",
        icon: "",
        buttonId: "ACT_ID.CHG_STATUT_EQT",
        checkEligibility: false,
        target: "CHG_STATUT_EQT",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_LITIGE_STIT_FAST],
        tooltip: "button.edit.litige.stit.access.tooltip",
        label: "button.edit.litige.stit.access",
        icon: "",
        buttonId: "ACT_ID.LITIGE_STIT",
        checkEligibility: false,
        target: "LITIGE_STIT",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_REACTIVATION_FAST],
        tooltip: "button.edit.reactivation.client.account.access.tooltip",
        label: "button.edit.reactivation.client.account.access",
        icon: "",
        buttonId: "ACT_ID.REACTIVATION",
        checkEligibility: false,
        target: "REACTIVATION",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_REGUL_FRAIS_FAST],
        tooltip: "button.edit.costs.regularization.access.n1.tooltip",
        label: "button.edit.costs.regularization.access.n1",
        icon: "",
        buttonId: "ACT_ID.REGUL_FRAIS",
        checkEligibility: false,
        target: "REGUL_FRAIS",
        adgClass: "billing"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_REGUL_FRAIS_N2_FAST],
        tooltip: "button.edit.costs.regularization.access.n2.tooltip",
        label: "button.edit.costs.regularization.access.n2",
        icon: "",
        buttonId: "ACT_ID.REGUL_FRAIS_N2",
        checkEligibility: false,
        target: "REGUL_FRAIS_N2",
        adgClass: "billing"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_RENONCIATION_FAST],
        tooltip: "button.edit.order.waiver.access.tooltip",
        label: "button.edit.order.waiver.access",
        icon: "",
        buttonId: "ACT_ID.RENONCIATION",
        checkEligibility: false,
        target: "RENONCIATION",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_RENUMEROTATION_FAST],
        tooltip: "button.edit.renumerotation.access.tooltip",
        label: "button.edit.renumerotation.access",
        icon: "",
        buttonId: "ACT_ID.RENUMEROTATION",
        checkEligibility: false,
        target: "RENUMEROTATION",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_REPORT_RELANCE_FAST],
        tooltip: "button.edit.reminder.postponement.access.tooltip",
        label: "button.edit.reminder.postponement.access",
        icon: "",
        buttonId: "ACT_ID.REPORT_RELANCE",
        checkEligibility: false,
        target: "REPORT_RELANCE",
        adgClass: "billing"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_RESIL_IMMEDIATE_FAST],
        tooltip: "button.edit.immediate.client.account.resiliation.access.tooltip",
        label: "button.edit.immediate.client.account.resiliation.access",
        icon: "",
        buttonId: "ACT_ID.RESIL_IMMEDIATE",
        checkEligibility: false,
        target: "RESIL_IMMEDIATE",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_RESIL_PLANIFIEE_FAST],
        tooltip: "button.edit.planned.client.account.resiliation.access.tooltip",
        label: "button.edit.planned.client.account.resiliation.access",
        icon: "",
        buttonId: "ACT_ID.RESIL_PLANIFIEE",
        checkEligibility: false,
        target: "RESIL_PLANIFIEE",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_RESIL_SANS_COMM_FAST],
        tooltip: "button.edit.resiliation.without.fees.or.communication.access.tooltip",
        label: "button.edit.resiliation.without.fees.or.communication.access",
        icon: "",
        buttonId: "ACT_ID.RESIL_SANS_COMM",
        checkEligibility: false,
        target: "RESIL_SANS_COMM",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_RETRACTATION_FAST],
        tooltip: "button.edit.order.withdrawal.access.tooltip",
        label: "button.edit.order.withdrawal.access",
        icon: "",
        buttonId: "ACT_ID.RETRACTATION",
        checkEligibility: false,
        target: "RETRACTATION",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_RV_ETIQUETTE_FAST],
        tooltip: "button.edit.renvois.etiquette.access.tooltip",
        label: "button.edit.renvois.etiquette.access",
        icon: "",
        buttonId: "ACT_ID.RV_ETIQUETTE",
        checkEligibility: false,
        target: "RV_ETIQUETTE",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_RV_ETIQUETTE_FASTR],
        tooltip: "button.edit.renvois.etiquette.fastr.access.tooltip",
        label: "button.edit.renvois.etiquette.fastr.access",
        icon: "icon-diag",
        buttonId: "ACT_ID.ADG_FIXE_RV_ETIQUETTE_FASTR",
        checkEligibility: false,
        target: "ADG_FIXE_RV_ETIQUETTE_FASTR",
        adgClass: "equipment",
        action: false
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_SUSPENSION_FAST],
        tooltip: "button.edit.client.account.suspension.access.tooltip",
        label: "button.edit.client.account.suspension.access",
        icon: "",
        buttonId: "ACT_ID.SUSPENSION",
        checkEligibility: false,
        target: "SUSPENSION",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_MDA_ARAMIS_FAST],
        tooltip: "button.edit.autreFixe.access.tooltip",
        label: "button.edit.autreFixe.access",
        icon: "",
        buttonId: "ACT_ID.MDA_ARAMIS",
        checkEligibility: false,
        target: "MDA_ARAMIS",
        adgClass: "billing"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_MDA_ARAMIS_FAST],
        tooltip: "button.edit.autreFixe.access.tooltip",
        label: "button.edit.autreFixe.access",
        icon: "",
        buttonId: "ACT_ID.MDA_ARAMIS",
        checkEligibility: false,
        target: "MDA_ARAMIS",
        adgClass: "equipment"
    },
    {
        shouldDisplay: ["FP", "FM"],
        adgAuthorization: [ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FASTR],
        tooltip: "button.edit.return.equipement.access.tooltip",
        label: "button.edit.return.equipement.access",
        icon: "",
        buttonId: "ACT_ID.ADG_FIXE_CHG_STATUT_EQT_FASTR",
        checkEligibility: false,
        target: "ADG_FIXE_CHG_STATUT_EQT_FASTR",
        adgClass: "equipment"
    }
]
