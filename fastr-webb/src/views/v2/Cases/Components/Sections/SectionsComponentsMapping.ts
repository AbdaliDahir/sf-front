import MediaV2 from "../CaseMediaV2";
import CardForADGInsideCaseV2 from "../../../Acts/CardForADGInsideCaseV2";
import QualificationSelectionV2 from "../../Qualification/QualificationSelectionV2";
import CaseDescriptionV2 from "../CaseDescriptionV2";
import CaseConclusionV2 from "../CaseConclusionV2";
import CaseHistoryV2 from "../../CaseHistory/CaseHistoryV2";
import CaseCommentV2 from "../CaseCommentV2";
import ThemeSelectionV2 from "../../Scaling/ThemeSelectionV2";
import EditRetentionCardV2 from "../../../Acts/Retention/EditRetentionCardV2";
import AntiChurnCardV2 from "../../../Acts/AntiChurn/AntiChurnCardV2";
import MaxwellCard from "../../../Acts/Maxwell/MaxwellCard";
import MaxwellBlock from "../MaxwellV2/MaxwellBlock";
import ActionComponent from "../../../Actions/ActionComponent";
import GdprComponent from "../GDPR/GdprComponent";
import ToggleVegasCouriersCard from "src/views/v2/Acts/ToggleVegasCouriers/ToggleVegasCouriersCard";

export enum Placement {
    MAIN,
    SECONDARY
}

// !_! + phantom SCALING_ADDITIONAL_DATA
const SectionsComponents = {
    ADG:                       {component: CardForADGInsideCaseV2, title: "Actions", icon: "icon-gradient icon-rom mr-2", excludeHeader:true, placement : Placement.MAIN},
    QUALIFICATION:             {component: QualificationSelectionV2, title: "Motif", icon: "icon-gradient icon-rom mr-2" , excludeHeader : true, placement : Placement.MAIN},
    SCALING:                   {component: ThemeSelectionV2, title: "Thème", casePicto:"SCALING_LIGHT", excludeHeader:true, placement : Placement.MAIN},
    DESCRIPTION:               {component: CaseDescriptionV2, title: "cases.create.clientRequest", icon: "icon-document", placement : Placement.SECONDARY},
    MEDIA:                     {component: MediaV2, title: "cases.create.contact", icon: "icon-user", placement : Placement.SECONDARY},
    COMMENT:                   {component: CaseCommentV2, title: "COMMENT", icon: "icon-user", placement : Placement.SECONDARY},
    CONCLUSION:                {component: CaseConclusionV2, icon: "icon-contract", excludeHeader:true, placement : Placement.SECONDARY},
    ADG_RETENTION:             {component: EditRetentionCardV2, excludeHeader : true, placement : Placement.MAIN},
    ADG_ANTICHURN:             {component: AntiChurnCardV2, excludeHeader : true, placement : Placement.MAIN},
    ADG_ASSOCIATION_COURRIERS: {component: ToggleVegasCouriersCard, excludeHeader : true, placement : Placement.MAIN},
    HISTORY:                   {component: CaseHistoryV2, title: "cases.history.title", icon: "icon-clock", excludeHeader : true, placement : Placement.MAIN},
    DIAG_MAXWELL_CARD:         {component: MaxwellCard, title: "cases.history.title", icon: "icon-diag", excludeHeader : true, placement : Placement.MAIN},
    MAXWELL:                   {component: MaxwellBlock, title: "maxwellV2.incident.list.title", icon: "icon-document", excludeHeader : true, placement : Placement.MAIN},
    ACTIONS:                   {component: ActionComponent, title: "cases.actions.traitement.title", icon: "icon-document", excludeHeader : true, placement : Placement.MAIN},
    GDPR:                      {component: GdprComponent, title: "cases.gdpr.title", icon:"icon-white icon-contract", excludeHeader: true, placement: Placement.MAIN}
}

export default SectionsComponents