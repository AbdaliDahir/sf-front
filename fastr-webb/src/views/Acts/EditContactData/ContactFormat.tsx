import * as moment from "moment";
import FormFromContact from "../../../model/acts/contact/FormFromContact";
import RequestForContact from "../../../model/acts/contact/RequestForContact";
import FASTRAct from "../../../model/acts/FASTRAct";
import Payload from "../../../model/Payload";
import {transformPhoneNumberForBackend} from "../../../utils/ContactUtils";

moment.locale(process.env.REACT_APP_FASTR_LANGUAGE);

export const formatDataForContactChange = (form: FormFromContact, payload: Payload) => {
    // We transform the phone number to match the format used in backend
    if (form && form.contact) {
        const {contact: {phone, cellphone, fax, other}} = form;
        form.contact.phone = phone ? transformPhoneNumberForBackend(phone) : {countryCode: "", nationalNumber: ""};
        form.contact.cellphone = cellphone ? transformPhoneNumberForBackend(cellphone) : {
            countryCode: "",
            nationalNumber: ""
        };
        form.contact.fax = fax ? transformPhoneNumberForBackend(fax) : {countryCode: "", nationalNumber: ""};
        form.contact.other = other ? transformPhoneNumberForBackend(other) : {countryCode: "", nationalNumber: ""}
    }

    // Because Webservice sends HEURE_CONTACT_0X and receive HeureContact_0X
    const formatContactHour = (contactHour: string) => contactHour.replace("HEURE_CONTACT", "HeureContact")

    const request: FASTRAct<RequestForContact> = {
        act: {
            newValues: {
                ...form.contact,
                favoriteContactHour: (form && form.notificationInformation && form.notificationInformation.favoriteContactHour) ? formatContactHour(form.notificationInformation.favoriteContactHour) : undefined,
                favoriteContactDay: (form && form.notificationInformation && form.notificationInformation.favoriteContactDay) ? form.notificationInformation.favoriteContactDay : undefined,
            }
        },
        notification: true,
        dueDate: moment().toDate(),
        pro: form.corporation,
        personId: payload.idClient,
        serviceId: payload.idService,
    };
    return request
};
