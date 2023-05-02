import { Client } from "src/model/person"


export const phoneFormatter = (phoneNumber: string, phoneIndicatif: string) => {

    return phoneIndicatif === '+33' ? phoneNumber.replace(/(\d)(?=(\d{2})+(?!\d))/g, '$1.') :
        `(${phoneIndicatif}) ${phoneNumber}`
}

export const getClientFormattedPhones = (clientData: Client) => {

    const out = new Array<string>()

    if (clientData?.phoneNumber) {
        out.push(phoneFormatter(clientData.phoneNumber, clientData.indicatifPhoneNumber))
    }

    if (clientData?.faxNumber) {
        out.push(phoneFormatter(clientData.faxNumber, clientData.indicatifFaxNumber))
    }

    if (clientData?.mobilePhoneNumber) {
        out.push(phoneFormatter(clientData.mobilePhoneNumber, clientData.indicatifMobilePhoneNumber))
    }

    if (clientData?.otherNumber) {
        out.push(phoneFormatter(clientData.otherNumber, clientData.indicatifOtherNumber))
    }
    return out.filter(onlyUnique).join("  ");
}
const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}