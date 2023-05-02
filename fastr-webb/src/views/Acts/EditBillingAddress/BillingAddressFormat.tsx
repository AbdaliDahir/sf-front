import * as _ from "lodash";
import EditBillingAddressActRequestDTO, {StandardizationState} from "../../../model/acts/billing-address/EditBillingAddressActRequestDTO";
import FASTRAct from "../../../model/acts/FASTRAct";
import {Address, Client} from "../../../model/person";
import {Person} from "../../../model/person/Person";

/*
import LocaleUtils from "../../../utils/LocaleUtils";
*/

function getNonNullValues(valueFromForm: string | undefined, valueFromCache: string): string {
    if (valueFromForm === undefined || valueFromForm === null || valueFromForm === "") {
        return valueFromCache;
    } else {
        return valueFromForm;
    }
}

// tslint:disable-next-line:no-any
function setAddressInRequest(form: any): Address {
    return {
        identityComplement: form.act.address.identityComplement,
        postalBox: form.act.address.postalBox,
        city: form.act.address.city,
        zipcode: form.act.address.zipcode,
        countryCode: form.act.address.countryCode,
        address1: form.act.address.address1,
        address2: form.act.address.address2
    }
}
// tslint:disable-next-line:no-any
function populatePayerInfo(form: any, data: Client): Person {
    if (form.nextPayerStatus === "CORPORATION") {
        return {
            civility: "",
            firstName: "",
            lastName: "",
            birthDate: "",
            address: setAddressInRequest(form)
        }
    }
    else {
        return {
            civility: getNonNullValues(form.act.civility, _.get(data, 'ownerPerson.civility')),
            firstName: getNonNullValues(form.act.firstName,  _.get(data, 'ownerPerson.firstName')),
            lastName: getNonNullValues(form.act.lastName,  _.get(data, 'ownerPerson.lastName')),
            birthDate: _.get(data, 'ownerPerson.birthDate'),
            address: setAddressInRequest(form)
        }
    }

}

// tslint:disable-next-line:no-any
export const formatDataForBillingAddressChange = (form: any, payload: any, data: Client, caseId?: string) => {
    const {sameAddrAsOwner} = form;
        const request: FASTRAct<EditBillingAddressActRequestDTO> = {
            "act": {
                billingAccount: {
                    billingAddressSameAsOwner: sameAddrAsOwner,
                    businessName: form.act.businessName,
                    payer: populatePayerInfo(form, data)
                },
                corporation: data.corporation,
                nextPayerStatus: form.nextPayerStatus,
                standardizationState: StandardizationState.STANDARDIZED,
                services: data.services
            },
            "personId": payload.idClient,
            "caseId": caseId,
            "pro": data.corporation,
            "serviceId": payload.idService,
        };
        return request
};
