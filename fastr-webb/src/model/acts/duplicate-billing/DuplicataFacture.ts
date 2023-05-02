import Duplicata from "./Duplicata";
import OptionDuplicata from "./OptionDuplicata";
import AddressModel from "./AddressModel";
import {GlobalStatus} from "./GlobalStatus";

export default interface DuplicataFacture {
    listDuplicata: Duplicata[]
    optionDuplicata: OptionDuplicata
    shipTo: AddressModel
    totalCost: number
    category: string
    date?: string
    creationDate?: string
    globalStatus?: GlobalStatus
}