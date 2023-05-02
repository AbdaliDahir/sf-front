import Act from "../Act";
import FormWebsapChange from "./FormWebsapChange";

export  interface WebsapActResponseDTO extends Act {
    actId: string;
    actFunctionalId
    actName: string;
    websapData: FormWebsapChange;
}