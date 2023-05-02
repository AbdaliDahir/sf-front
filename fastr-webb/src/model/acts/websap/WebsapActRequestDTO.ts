import Act from "../Act";
import FormWebsapChange from "./FormWebsapChange";

export  interface WebsapActRequestDTO extends Act {
    data: FormWebsapChange;
}