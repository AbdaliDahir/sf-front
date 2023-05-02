import {MoralPersonDTO} from "../../MoralPersonDTO";
import {PhysicalPersonDTO} from "../../PhysicalPersonDTO";
import Act from "../Act";

export default interface EditPersonalDataRequest extends Act {
    oldValues: PersonalDataDTO,
    newValues: PersonalDataDTO,
}

export interface PersonalDataDTO {

    email: string;

    favoriteContactHour: string;

    favoriteContactDay: string;

    language: string;

    moralPerson: MoralPersonDTO;

    physicalPerson: PhysicalPersonDTO;

    fax: string;

    phone: string;

    cellphone: string;

    other: string;

}
