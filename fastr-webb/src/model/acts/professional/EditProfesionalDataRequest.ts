import {MoralPersonDTO} from './MoralPersonDTO';
import Act from "../Act";

export interface EditProfesionalDataRequest extends Act {

    legalPersonDto: MoralPersonDTO;

}
