import {Address} from "../../person";
import {Civility} from "../../Civility";
import Act from "../Act";

export default interface EditTutorActRequestDTO extends Act {
    address: Address;
    birthDate: Date;
    civility: Civility;
    email: string;
    lastName: string;
    firstName: string;
    phone: string;
    cellphone: string;
    tutorship: Tutorship;
}

export type Tutorship = "TUTELLE" | "CURATELLE_SIMPLE" | "CURATELLE_RENFORCEE" | "CURATELLE_AMENAGEE"
    | "NON_PROTEGE" | "SAUVEGARDE_JUSTICE" | "HABILITATION_FAMILIALE"
