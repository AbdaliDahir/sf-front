import moment from "moment";
import { translate } from "src/components/Intl/IntlGlobalProvider";
import { Action, ActionProcessCurrentState } from "src/model/actions/Action";
import { CaseDataProperty } from "src/model/CaseDataProperty";
import { ActiviteRegul } from "src/model/service";
import { RegularisationFixeAdgDetail } from "src/model/service/RegularisationFixAdgDetail";
import { AramisActDetail } from "src/model/service/RegularisatonFixeActDetail";
import { RegularisationAutoSummary } from "src/model/TimeLine";
import { OfferEnriched } from "src/model/TimeLine/OfferEnriched";
import { TimeLineRegularisationItem } from "src/model/TimeLine/Regularisation";

export enum REGULARISATION_FAMILLE_TYPE {
    ADG = 'ADG',
    ACTION = 'Demande d’ADG',
    ACTIVITE = 'ACTIVITE'
};

export const VALID_REGUL_TYPE_FOR_DETAIL = {
    [REGULARISATION_FAMILLE_TYPE.ADG]: true,
    [REGULARISATION_FAMILLE_TYPE.ACTION]: true
}

export const autoRegularisationSummaryMapper = (actDetails: AramisActDetail[]): RegularisationAutoSummary => {
    return {
        taux: actDetails?.find((detail) =>
            actDetailFilterByTypeAndName(detail, "REGUL_AUTO_OBL", "TAUX_REGUL")
        )?.parametervalue,
        nbrImpactedServices: actDetails?.find((detail) =>
            actDetailFilterByTypeAndName(
                detail,
                "REGUL_AUTO_OBL",
                "NB_SERVICES_IMPACTES"
            )
        )?.parametervalue,
        montant: actDetails?.find((detail) =>
            actDetailFilterByTypeAndName(detail, "REGUL_AUTO_MAJ", "MONTANT_REGUL")
        )?.parametervalue,
        dateFacture: actDetails?.find((detail) =>
            actDetailFilterByTypeAndName(detail, "REGUL_AUTO_MAJ", "DATE_FACTURE")
        )?.parametervalue,
        idTechSupport: actDetails?.find((detail) =>
            actDetailFilterByTypeAndName(detail, "REGUL_AUTO_OBL", "ID_ST")
        )?.parametervalue,
        stStatus: actDetails?.find((detail) =>
            actDetailFilterByTypeAndName(detail, "REGUL_AUTO_MAJ", "STATUT_ST")
        )?.parametervalue,
        stCreationDate: actDetails?.find((detail) =>
            actDetailFilterByTypeAndName(detail, "REGUL_AUTO_MAJ", "DATE_DEBUT_ST")
        )?.parametervalue,
        stLastResolutionDate: actDetails?.find((detail) =>
            actDetailFilterByTypeAndName(detail, "REGUL_AUTO_MAJ", "DATE_FIN_ST")
        )?.parametervalue,
        dureeRegul: actDetails?.find((detail) =>
            actDetailFilterByTypeAndName(detail, "REGUL_AUTO_MAJ", "DELAI_ST")
        )?.parametervalue,
    }
};
const getMontantAction = (caseDataProperty: CaseDataProperty[] | undefined) => {
    const data = caseDataProperty;
    if (data) {
        const foundData = data.find(
            (actionData) => actionData.code === "MONTANT_TTC"
        );
        return foundData?.value + " €";
    }
    return "";
};
const getPeriodeAction = (
    processCurrentState: ActionProcessCurrentState | undefined
) => {
    const debutPeriode = processCurrentState?.data.find(
        (data) => data.code === "DEBUT_PERIODE"
    );
    const finPeriode = processCurrentState?.data.find(
        (data) => data.code === "FIN_PERIODE"
    );
    if (debutPeriode && finPeriode) {
        return (
            "du " +
            moment(debutPeriode?.value).format("DD/MM/YYYY") +
            " au " +
            moment(finPeriode?.value).format("DD/MM/YYYY")
        );
    }
    return "";
};

export const actDetailFilterByTypeAndName = (
    detail: AramisActDetail,
    paramType: string,
    paramName: string
) => {
    return (
        detail.parametername === paramName && detail.parametertype === paramType
    );
};
export const getActRegulMontant = (actDetails: AramisActDetail[]) => {
    const montant = actDetails
        ? actDetails.find((detail) =>
            actDetailFilterByTypeAndName(detail, "MONTANT_AJUSTE", "MONTANT")
        )
        : null;
    const montantTTC = actDetails
        ? actDetails.find((detail) =>
            actDetailFilterByTypeAndName(detail, "GLOBAL", "MONTANT_TTC")
        )
        : null;
    const montantRegul = actDetails
        ? actDetails.find((detail) =>
            actDetailFilterByTypeAndName(detail, "REGUL_AUTO_MAJ", "MONTANT_REGUL")
        )
        : null;
    return (
        montant?.parametervalue ||
        montantTTC?.parametervalue ||
        montantRegul?.parametervalue ||
        ""
    );
};
export const getActRegulPeriod = (actDetails: AramisActDetail[]) => {
    const debutPeriode = actDetails
        ? actDetails.find(
            (detail) =>
                actDetailFilterByTypeAndName(detail, 'GLOBAL', 'DEBUT_PERIODE')
        )
        : null;
    const finPeriode = actDetails
        ? actDetails.find(
            (detail) =>
                actDetailFilterByTypeAndName(detail, 'GLOBAL', 'FIN_PERIODE')
        )
        : null;
    const delaiST = actDetails
        ? actDetails.find(
            (detail) =>
                actDetailFilterByTypeAndName(detail, 'REGUL_AUTO_MAJ', 'DELAI_ST')
        )
        : null;
    if (debutPeriode?.parametervalue && finPeriode?.parametervalue) {
        return (
            "du " + debutPeriode.parametervalue + " au " + finPeriode.parametervalue
        );
    }
    if (delaiST?.parametervalue) {
        return delaiST.parametervalue + " J";
    } else {
        return "-";
    }
};

const lastUpdatedDateRegulAuto = (actDetails: AramisActDetail[]) => {
    return actDetails.find((detail) =>
        actDetailFilterByTypeAndName(detail, "REGUL_AUTO_MAJ", "DATE_CHANGEMENT")
    )?.parametervalue || ''
};
const getMotifRegulAuto = (actDetails: AramisActDetail[]) => {
    const motif = actDetails.find((detail) =>
        actDetailFilterByTypeAndName(detail, "REGUL_AUTO_OBL", "TAUX_REGUL")
    );
    return motif ? `${motif?.parametervalue} %` : "";
};


const actionRegulToTimeLineRegul = (
    action: Action
): TimeLineRegularisationItem => {
    return {
        id: action.actionId,
        famille: REGULARISATION_FAMILLE_TYPE.ACTION,
        libelle: action.actionLabel,
        motif: "",
        status: action.processCurrentState?.status
            ? translate.formatMessage({ id: action.processCurrentState?.status })
            : "",
        lastUpdate: action.updateDate ? moment(action.updateDate).format('DD-MM-YYYY') : "",
        montant: getMontantAction(action.processCurrentState?.data || undefined),
        period: getPeriodeAction(action.processCurrentState || undefined),
    };
};

const actRegulToTimeLineRegul = (
    actDetailed: RegularisationFixeAdgDetail,
): TimeLineRegularisationItem => {
    const { act, detail } = actDetailed;
    const montant = getActRegulMontant(detail.actDetails || []).length > 0
        ? `${getActRegulMontant(detail.actDetails || [])} €`
        : '';
    return {
        famille: REGULARISATION_FAMILLE_TYPE.ADG,
        libelle: act.actname,
        id: act.acttransactionid,
        status: act.actresult,
        motif: getMotifRegulAuto(detail.actDetails || []),
        lastUpdate:
            detail.header?.executionDate ||
            lastUpdatedDateRegulAuto(
                detail.actDetails || []
            ),
        montant,
        period: getActRegulPeriod(detail.actDetails || []),
    };
};

const gcoMontant = (gcoGcu: OfferEnriched) => {
    return gcoGcu.recurrentFees && parseFloat(gcoGcu.recurrentFees) != 0 ? parseFloat(gcoGcu.recurrentFees).toFixed(2) :
        gcoGcu.fees && parseFloat(gcoGcu.fees) != 0 ? parseFloat(gcoGcu.fees).toFixed(2) : '';
};

const activityRegulToTimeLineRegul = (act: ActiviteRegul): TimeLineRegularisationItem => {

    return {
        famille: REGULARISATION_FAMILLE_TYPE.ACTIVITE,
        libelle: act.actDescription,
        id: act.actAccountid,
        status: act.actResult,
        motif: '',
        lastUpdate: act.actDate ? moment(act.actDate).format('DD-MM-YYYY') : '',
        montant: '',
        period: '',
    };
};

const actGcoGcuToTimeLineRegul = (
    gcoGcu: OfferEnriched,
): TimeLineRegularisationItem => {
    return {
        famille: gcoGcu.offerFamily,
        libelle: gcoGcu.offerName,
        id: gcoGcu.id,
        status: gcoGcu.commercialStatus,
        motif: '',
        lastUpdate: gcoGcu.activationOfferServiceDate ? moment(gcoGcu.activationOfferServiceDate).format('DD-MM-YYYY') : '',
        montant: gcoGcu.offerFamily === 'GCO' ? gcoMontant(gcoGcu) : '',
        period: `${gcoGcu.activationOfferServiceDate ? moment(gcoGcu.activationOfferServiceDate).format('DD-MM-YYYY') : '-'} au ${gcoGcu.terminationDate ? moment(gcoGcu.terminationDate).format('DD-MM-YYYY') : '-'}`,
    };
};

export const eventRegulToTimeLineRegulMapper = (events: any[]) => {
    let regularisations: TimeLineRegularisationItem[] = [];
    events.map((event) => {
        //act regularisation detailed
        if (event.act) {
            regularisations = [...regularisations, actRegulToTimeLineRegul(event)];
            // action regularisation
        } else if (event.actionId) {
            regularisations = [...regularisations, actionRegulToTimeLineRegul(event)]
            // activite de regularisation
        } else if (event.actaccountid || event.regulActiv) {
            regularisations = [...regularisations, activityRegulToTimeLineRegul(event)]
        } else {
            regularisations = [...regularisations, actGcoGcuToTimeLineRegul(event)]
        }
    });
    return regularisations;
};
