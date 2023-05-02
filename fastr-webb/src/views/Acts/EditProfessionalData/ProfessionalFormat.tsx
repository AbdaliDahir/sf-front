import * as moment from "moment";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import FASTRAct from "../../../model/acts/FASTRAct";
import {EditProfesionalDataRequest} from "../../../model/acts/professional";
import FormFromProfessional from "../../../model/acts/professional/FormFromProfessional";
import Payload from "../../../model/Payload";
import {getLegalCategoryMap} from "./legalCategory";
import {Client} from "../../../model/person";

function getNonNullValues<T>(valueFromForm: T, valueFromCache: T): T {
    return !valueFromForm ? valueFromCache : valueFromForm;
}


export const formatDataForProfessionalChange = (form: FormFromProfessional, payload: Payload, clientData: Client) => {

    if (!form.ownerCorporation) {
        form.ownerCorporation = {chorusFlag: false}
    }
    const actualLegalCategoryName: string = getNonNullValues(form.ownerCorporation.legalCategory ? getLegalCategoryMap().get(form.ownerCorporation.legalCategory) : undefined, clientData.ownerCorporation.legalCategoryName)!
    const actualCreditLimit = actualLegalCategoryName === translate.formatMessage({id: "acts.editProfessionaldata.category.CT"}) || actualLegalCategoryName === translate.formatMessage({id: "acts.editProfessionaldata.category.CP"})
        ? 19999 : 0
    const request: FASTRAct<EditProfesionalDataRequest> = {
        "act": {
            "legalPersonDto": {
                "companyName": getNonNullValues(form.ownerCorporation.name, clientData.ownerCorporation.name)!,
                "chorusFlag": form.ownerCorporation.chorusFlag,
                "chorusLegalEngagement": form.ownerCorporation.chorusLegalEngagement,
                "chorusServiceCode": form.ownerCorporation.chorusServiceCode,
                "creditLimit": actualCreditLimit,
                "treasurer": !form.ownerCorporation.treasurer || "" === form.ownerCorporation.treasurer.trim() ? translate.formatMessage({id: "not communicated"}) : form.ownerCorporation.treasurer,
                "siret": getNonNullValues(form.siret, clientData.siret),
                "legalCategoryName": actualLegalCategoryName,
                "apeCode": clientData.ownerCorporation.apeCode,
                "legalCategoryCode": getNonNullValues(form.ownerCorporation.legalCategory, clientData.ownerCorporation.legalCategoryCode)!,
                "legalCreationDate": clientData.ownerCorporation.legalCreationDate,
                "legalStatus": clientData.ownerCorporation.legalStatus,
                "taxSystem": clientData.taxSystem,
                "vtaNumber": clientData.ownerCorporation.vtaNumber
            }
        },
        "personId": payload.idClient,
        "serviceId": payload.idService,
        "pro": clientData.corporation,
        notification: true,
        dueDate: moment().toDate(),
    }
    return request
};
