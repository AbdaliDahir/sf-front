import FASTRAct from "../../../../model/acts/FASTRAct";
import * as moment from "moment";
import RenvoiEtiquetteActRequestDTO from "../../../../model/acts/renvoi-etiquette/RenvoiEtiquetteActRequestDTO";
import Payload from "../../../../model/Payload";

export const formatDataForRvEtiquetteFastr = (form, payload: Payload, siebelAccount) => {
    const request: FASTRAct<RenvoiEtiquetteActRequestDTO> = {
        act: populateRvEtiquetteRequest(form, siebelAccount),
        dueDate: moment().toDate(),
        personId: payload.idClient,
        serviceId: payload.idService,
    };
    return request
};

export const populateRvEtiquetteRequest = (form, siebelAccount): RenvoiEtiquetteActRequestDTO => {
    return {
        refSiebel: siebelAccount,
        transportType: form.transportType,
        etiquetteType: form.etiquetteType,
        coordLambertX: form.coordLambertX,
        coordLambertY: form.coordLambertY,
        positionLibelle: form.positionLibelle,
        positionCode: form.positionCode,
        login: form.login
    }
}