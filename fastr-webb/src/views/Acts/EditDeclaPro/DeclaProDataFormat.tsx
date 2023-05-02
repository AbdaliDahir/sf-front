import * as moment from "moment";
import FASTRAct from "../../../model/acts/FASTRAct";
import FormFromAdministrativeData from "../../../model/acts/personal-data/FormFromAdministrativeData";
import RequestForAdministrativeData from "../../../model/acts/personal-data/RequestForAdministrativeData";
import Payload from "../../../model/Payload";
import DateUtils from "../../../utils/DateUtils";

export const formatDataForDeclaProDataChange = (form: FormFromAdministrativeData, payload: Payload) => {
    const {ownerPerson} = form;

    if (ownerPerson) {
        if (ownerPerson.birthDate) {
            ownerPerson.birthDate = DateUtils.toGMT0ISOString(ownerPerson.birthDate)
        }

        if (form.ownerPerson.birthCounty && ownerPerson.birthCounty.length === 1) {
            ownerPerson.birthCounty = "0" + ownerPerson.birthCounty
        }
    }

    const request: FASTRAct<RequestForAdministrativeData> = {
        act: {
            newValues: {physicalPerson: ownerPerson}
        },
        notification: true,
        dueDate: moment().toDate(),
        personId: payload.idClient,
        serviceId: payload.idService,
        pro: form.siret
    };
    return request
};
