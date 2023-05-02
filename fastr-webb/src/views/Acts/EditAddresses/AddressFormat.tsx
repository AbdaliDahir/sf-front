import * as moment from "moment";
import RequestForAddressChange from "../../../model/acts/address/EditAddressActRequest";
import FormFromAddressChange from "../../../model/acts/address/FormFromAddressChange";
import FASTRAct from "../../../model/acts/FASTRAct";
import Payload from "../../../model/Payload";


export const formatDataForAddressChange = (form: FormFromAddressChange, payload: Payload) => {
    // TODO: Côté backend
/*    const mapCountryCodeCountry = {
        "France": "F",
        "Maroc": "MAR",
        "Autriche": "A",
        "Belgique": "B",
        "Suisse": "CH",
        "Allemagne": "D",
        "Danemark": "DK",
        "Espagne": "E",
        "Royaume-Uni": "GB",
        "Italie": "I",
        "Luxembourg": "L",
        "Monaco": "MC",
        "Norvège": "N",
        "Pays-Bas": "NL",
        "Portugal": "P",
        "Suède": "S",
        "Finlande": "SF",
        "Grèce": "GR",
    };*/

    /*form.address.countryCode = mapCountryCodeCountry[form.address.countryCode!];*/

    const request: FASTRAct<RequestForAddressChange> = {
        act: {
            newAddress: form.address,
        },
        dueDate: moment().toDate(),
        notification: true,
        personId: payload.idClient,
        serviceId: payload.idService,
    };
    return request
};
