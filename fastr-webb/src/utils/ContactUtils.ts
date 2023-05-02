import {parsePhoneNumber} from "libphonenumber-js";
import {Phonenumber} from "../model/Phonenumber";

export function transformPhoneNumberForBackend(phoneNumber: string | Phonenumber): Phonenumber {
    if (typeof phoneNumber === "string") {
        const countryCode = '+' + parsePhoneNumber(phoneNumber).countryCallingCode;

        let nationalNumber = parsePhoneNumber(phoneNumber).nationalNumber.toString();

        // case France TODO: Dégueulasse, a virer
        if ("FR" === parsePhoneNumber(phoneNumber).country) {
            nationalNumber = '0' + nationalNumber;
        }
        return {countryCode, nationalNumber}
    }
    return phoneNumber
}


export function validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const formatPhoneNumber = (indicatif: string, phoneNumber: string) => indicatif + (phoneNumber && phoneNumber.length === 10 ? phoneNumber.substring(1) : phoneNumber);