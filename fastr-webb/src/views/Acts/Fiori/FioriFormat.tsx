import FASTRAct from "../../../model/acts/FASTRAct";
import * as moment from "moment";
import Payload from "../../../model/Payload";
import {WebsapActRequestDTO} from "../../../model/acts/websap/WebsapActRequestDTO";
import FormWebsapChange from "../../../model/acts/websap/FormWebsapChange";

export const formatDataForFioriChange = (form, payload: Payload) => {
    const request: FASTRAct<WebsapActRequestDTO> = {
        act: populateFioriRequest(form),
        notification: false,
        dueDate: moment().toDate(),
        personId: payload.idClient,
        serviceId: payload.idService,
    };
    return request
};

export const populateFioriRequest = (form): WebsapActRequestDTO =>  {
    return {
        data: populateFioriData(form)
    }
}

function populateFioriData(form) {
    let requestDTO:FormWebsapChange = new class implements FormWebsapChange {
        actOk: boolean;
        formElementsDataObject: Map<string, string>;
    };
    requestDTO.formElementsDataObject = {};
    requestDTO.actOk = form.genericForm.toggleStatus;
    requestDTO.formElementsDataObject = form.data;

    return requestDTO;
}