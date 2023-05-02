import DuplicataFacture from "./DuplicataFacture";
import Act from "../Act";

export interface DuplicateBillingsActResponseDto extends Act {
    actId: string
    actFunctionalId: string
    actName: string
    duplicataFacture: DuplicataFacture
}