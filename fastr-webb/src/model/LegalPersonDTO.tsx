import {PhysicalPersonDTO} from "./PhysicalPersonDTO";

export interface LegalPhysicalPersonDTO extends PhysicalPersonDTO {

    businessName: string;
    treasurer: string;
    legalForm: string;
    chorus:boolean

}
