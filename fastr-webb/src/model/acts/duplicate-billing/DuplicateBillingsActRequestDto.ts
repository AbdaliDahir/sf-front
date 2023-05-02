import Act from "../Act";
import DuplicataFacture from "./DuplicataFacture";

export interface DuplicateBillingsActRequestDto extends Act{

    duplicataFacture: DuplicataFacture
}