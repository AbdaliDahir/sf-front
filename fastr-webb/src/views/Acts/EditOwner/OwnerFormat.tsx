import * as i18nIsoCountries from "i18n-iso-countries";
import EditOwnerRequestDTO from "../../../model/acts/edit-owner/EditOwnerRequestDTO";
import FASTRAct from "../../../model/acts/FASTRAct";
import {Phonenumber} from "../../../model/Phonenumber";
import {transformPhoneNumberForBackend} from "../../../utils/ContactUtils";
import DateUtils from "../../../utils/DateUtils";
import {Client} from "../../../model/person";


// tslint:disable-next-line:no-any TODO A TYPER
export const formatDataForHolderDataChange = (form: any, payload: any, client: Client, caseId?: string) => {
    // TODO: Dans un fichier de conf global
    i18nIsoCountries.registerLocale(require("i18n-iso-countries/langs/fr.json"));

    const {editOwnerAct} = form;
    const {oldBillingMethods} = form;
    let fastrAct: EditOwnerRequestDTO;

    if (editOwnerAct.eligibilityNotAvailable) {
        fastrAct = {
            eligibilityNotAvailable: true
        }

    } else if (editOwnerAct.isNotEligible) {
        fastrAct = {
            ineligibilityReason: editOwnerAct.ineligibilityReason,
            notEligible: true
        }

    } else {
        oldBillingMethods.bankDetails.iban = oldBillingMethods.bankDetails.iban.replace(/\s/g, "");
        oldBillingMethods.bankDetails.bic = oldBillingMethods.bankDetails.bic.replace(/\s/g, "");
        fastrAct = {
            bankAccount: oldBillingMethods.bankDetails
        }

        // selectedClient from search so existing client
        if (editOwnerAct.idClient) {
            fastrAct.idClient = editOwnerAct.idClient;

            /*fastrAct.bankAccount = oldBillingMethods.bankDetails;*/
            fastrAct.bankAccount!.owner = editOwnerAct.selectedClient.ownerPerson.civility + " " + editOwnerAct.selectedClient.ownerPerson.firstName + " " + editOwnerAct.selectedClient.ownerPerson.lastName;


            // new client
        } else {
            const {contact} = editOwnerAct

            const phoneNumber: Phonenumber = contact.phone ? transformPhoneNumberForBackend(contact.phone) : contact.phone;
            const mobilePhoneNumber: Phonenumber = contact.cellphone ? transformPhoneNumberForBackend(contact.cellphone) : contact.cellphone;
            const faxNumber: Phonenumber = contact.fax ? transformPhoneNumberForBackend(contact.fax) : contact.fax;
            const otherNumber: Phonenumber = contact.other ? transformPhoneNumberForBackend(contact.other) : contact.other;

            fastrAct.newOwner = {
                indicatifPhoneNumber: phoneNumber ? phoneNumber.countryCode : undefined,
                phoneNumber: phoneNumber ? phoneNumber.nationalNumber : undefined,
                indicatifMobilePhoneNumber: mobilePhoneNumber ? mobilePhoneNumber.countryCode : undefined,
                mobilePhoneNumber: mobilePhoneNumber ? mobilePhoneNumber.nationalNumber : undefined,
                indicatifFaxNumber: faxNumber ? faxNumber.countryCode : undefined,
                faxNumber: faxNumber ? faxNumber.nationalNumber : undefined,
                indicatifOtherNumber: otherNumber ? otherNumber.countryCode : undefined,
                otherNumber: otherNumber ? otherNumber.nationalNumber : undefined,
                contactEmail: contact.email
            }

            const filledAddress = editOwnerAct.address ? {
                    postalBox: editOwnerAct.address.postalBox,
                    city: editOwnerAct.address.city,
                    zipcode: editOwnerAct.address.zipcode,
                    countryCode: editOwnerAct.address.countryCode,
                    address1: editOwnerAct.address.address1,
                    address2: editOwnerAct.address.address2,
                    identityComplement: editOwnerAct.address.identityComplement,
                    country: editOwnerAct.address.country
                }
                : {
                    postalBox: editOwnerAct["address.postalBox"],
                    city: editOwnerAct["address.city"],
                    zipcode: editOwnerAct["address.zipcode"],
                    countryCode: editOwnerAct["address.countryCode"],
                    address1: editOwnerAct["address.address1"],
                    address2: editOwnerAct["address.address2"],
                    identityComplement: editOwnerAct["address.identityComplement"],
                    country: editOwnerAct["address.country"]
                }


            // new corporation
            if (editOwnerAct.corporation) {
                editOwnerAct.ownerCorporation.legalCreationDate = DateUtils.toGMT0ISOString(editOwnerAct.ownerCorporation.legalCreationDate)

                fastrAct.newOwner!.ownerCorporation = editOwnerAct.ownerCorporation
                fastrAct.newOwner!.ownerCorporation!.address = filledAddress
                fastrAct.newOwner!.siret = editOwnerAct.siret
                fastrAct.newOwner!.siren = editOwnerAct.siret.substr(0, 9)

                fastrAct.bankAccount!.owner = editOwnerAct.ownerCorporation.name

                const legalResponsible = editOwnerAct.legalResponsible;
                fastrAct.newOwner!.legalResponsible = legalResponsible


                const legalResponsiblePhoneNumber: Phonenumber = legalResponsible.contactPhoneNumber ? transformPhoneNumberForBackend(legalResponsible.contactPhoneNumber) : legalResponsible.contactPhoneNumber;
                const legalResponsibleMobilePhoneNumber: Phonenumber = legalResponsible.contactMobilePhoneNumber ? transformPhoneNumberForBackend(legalResponsible.contactMobilePhoneNumber) : legalResponsible.contactMobilePhoneNumber;

                fastrAct.newOwner!.legalResponsible!.indicatifPhoneNumber = legalResponsiblePhoneNumber ? legalResponsiblePhoneNumber.countryCode : undefined;
                fastrAct.newOwner!.legalResponsible!.contactPhoneNumber = legalResponsiblePhoneNumber ? legalResponsiblePhoneNumber.nationalNumber : undefined;
                fastrAct.newOwner!.legalResponsible!.indicatifMobilePhoneNumber = legalResponsibleMobilePhoneNumber ? legalResponsibleMobilePhoneNumber.countryCode : undefined;
                fastrAct.newOwner!.legalResponsible!.contactMobilePhoneNumber = legalResponsibleMobilePhoneNumber ? legalResponsibleMobilePhoneNumber.nationalNumber : undefined;


                // new person
            } else {

                // Adjust the timezone so the backend doesn't parse it to the previous day
                if (editOwnerAct.ownerPerson.birthDate) {
                    editOwnerAct.ownerPerson.birthDate = DateUtils.toGMT0ISOString(editOwnerAct.ownerPerson.birthDate)
                }

                // Put the zero in front of the county code for those with only one numer, ex : 1 => 01 (Ain)
                if (editOwnerAct.ownerPerson.birthDepartment && editOwnerAct.ownerPerson.birthDepartment.length === 1) {
                    editOwnerAct.ownerPerson.birthDepartment = "0" + editOwnerAct.ownerPerson.birthDepartment
                }

                fastrAct.newOwner!.ownerPerson = editOwnerAct.ownerPerson
                fastrAct.newOwner!.ownerPerson!.address = filledAddress

                if (editOwnerAct.personWithSiret) {
                    fastrAct.newOwner!.corporation = true
                    fastrAct.newOwner!.siret = editOwnerAct.siret
                    fastrAct.newOwner!.siren = editOwnerAct.siret.substr(0, 9)
                }

                fastrAct.bankAccount!.owner = form.bankDetails.accountOwner
            }
        }
    }


    const request: FASTRAct<EditOwnerRequestDTO> = {
        act: fastrAct,
        personId: payload.idClient,
        serviceId: payload.idService,
        caseId,
        pro: client.corporation
    };

    return request
};
