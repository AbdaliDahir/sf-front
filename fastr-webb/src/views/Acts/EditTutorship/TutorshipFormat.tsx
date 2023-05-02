import FASTRAct from "../../../model/acts/FASTRAct";
import {EditTutorActRequestDTO} from "../../../model/acts/personal";
import {Phonenumber} from "../../../model/Phonenumber";
import {transformPhoneNumberForBackend} from "../../../utils/ContactUtils";
import {Payload} from "../../Cases/Create/CreateCasePage";
import DateUtils from "../../../utils/DateUtils";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {Client, TUTORSHIP} from "../../../model/person";

export const formatDataForTutorshipChange = (form, payload: Payload, caseId?: string, clientData?: Client, isMoralPerson = false) => {
    
    form.tutorship = (form.removeTutelle && isMoralPerson) ? TUTORSHIP[TUTORSHIP.NON_PROTEGE] : form.tutorship;
    form.tutorship = (form.tutorship === undefined || form.tutorship === null) ? TUTORSHIP[TUTORSHIP.NON_PROTEGE] : form.tutorship;
    form.tutorship = (!form.removeTutelle && isMoralPerson) ? null : form.tutorship;

    if (translate.formatMessage({id: "acts.editpersonaldata.protected.NON_PROTEGE"}) === form.tutorship) {
        form.tutorship = TUTORSHIP[TUTORSHIP.NON_PROTEGE]
    }
    const responsible = form.tutorship !== "NON_PROTEGE" ? form.legalResponsible!.responsible : "";
    if (responsible && responsible.birthDate) {
        responsible.birthDate = DateUtils.toGMT0ISOString(responsible.birthDate)
    }

    const editTutorActRequestAct: EditTutorActRequestDTO = form.tutorship !== "NON_PROTEGE" ? {
        legalResponsible: {
            responsible,
            contactEmail: form.legalResponsible!.contact ? form.legalResponsible!.contact.email : "",
            contactMobilePhoneNumber: form.legalResponsible!.contact ? form.legalResponsible!.contact.cellphone : "",
            contactPhoneNumber: form.legalResponsible!.contact ? form.legalResponsible!.contact.phone : "",
        },
        tutorship: form.tutorship
    } : {
        tutorship: form.tutorship
    };

    if (form.tutorship !== "NON_PROTEGE") {
        const {legalResponsible} = editTutorActRequestAct;
        const phoneNumber: Phonenumber | undefined = legalResponsible!.contactPhoneNumber ? transformPhoneNumberForBackend(legalResponsible!.contactPhoneNumber) : undefined;
        const mobilePhoneNumber: Phonenumber | undefined = legalResponsible!.contactMobilePhoneNumber ? transformPhoneNumberForBackend(legalResponsible!.contactMobilePhoneNumber) : undefined;

        legalResponsible!.indicatifPhoneNumber = phoneNumber ? phoneNumber.countryCode : undefined;
        legalResponsible!.contactPhoneNumber = phoneNumber ? phoneNumber.nationalNumber : undefined;
        legalResponsible!.indicatifMobilePhoneNumber = mobilePhoneNumber ? mobilePhoneNumber.countryCode : undefined;
        legalResponsible!.contactMobilePhoneNumber = mobilePhoneNumber ? mobilePhoneNumber.nationalNumber : undefined;
    }

    const moralEditTutorActRequestAct: EditTutorActRequestDTO = {
        legalResponsible: {
            responsible: {
                birthDate: "1900-01-01",
                civility: "MR",
                firstName: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE],
                lastName: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE],
                address: {
                    zipcode: "00000",
                    city: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE],
                    address1: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE],
                    postalBox: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE],
                    address2: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE],
                    identityComplement: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE],
                },
            },
            indicatifPhoneNumber: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE],
            contactPhoneNumber: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE],
            indicatifMobilePhoneNumber: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE],
            contactMobilePhoneNumber: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE],
            contactEmail: TUTORSHIP[TUTORSHIP.NON_RENSEIGNE]
        }        
    };

    if ("true" === form.hasTutorshipEndDate) {
        editTutorActRequestAct.tutorshipEndDate = DateUtils.toGMT0ISOString(form.tutorshipEndDate)
    } else {
        if (clientData?.ownerPerson?.tutorshipEndDate) {
            editTutorActRequestAct.tutorshipEndDate = "1900-01-01"
        }
    }

    const request: FASTRAct<EditTutorActRequestDTO> = {
        act: (isMoralPerson && form.removeTutelle) ? moralEditTutorActRequestAct : editTutorActRequestAct,
        notification: true,
        dueDate: new Date(Date.now()),
        personId: payload.idClient,
        serviceId: payload.idService,
        caseId,
        pro: false,
        scs: undefined,
        csu: undefined,
        accountId: undefined
    };

    return request
};
