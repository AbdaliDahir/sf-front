import * as withFormsy from "formsy-react";
import {translate} from "../../Intl/IntlGlobalProvider";
import {Value, Values} from "formsy-react/dist/interfaces";

withFormsy.addValidationRule('inputMinLength', (values: string[], value: string, lengthMinMessage: number) => {
    if (value !== undefined && value !== null && value.length >= lengthMinMessage) {
        return true;
    } else {
        return translate.formatMessage({id: "validation.minLength.message"},
            {number: lengthMinMessage});
    }
});

withFormsy.addValidationRule('inputMaxLength', (values: string[], value: string, lengthMaxMessage: number) => {
    if (value !== undefined && value !== null && lengthMaxMessage !== undefined && lengthMaxMessage !== null && value.length > lengthMaxMessage) {
        return translate.formatMessage({id: "validation.maxLength.message"},
            {number: lengthMaxMessage});
    } else {
        return true;
    }
});


withFormsy.addValidationRule('inputFieldType', (values: string[], value: string, type: string) => {
    if (type === "alphanumeric") {
        const alphanumeric = new RegExp("^[a-zA-Z0-9 ]*$");
        if (value !== undefined && value !== null && alphanumeric.test(value)) {
            return true;
        } else {
            return translate.formatMessage({id: "validation.alphanumeric.message"});
        }
    } else if (type === "numeric") {
        const numeric = new RegExp("^[0-9]*$");
        if (value !== undefined && value !== null && numeric.test(value)) {
            return true;
        } else {
            return translate.formatMessage({id: "validation.numeric.message"});
        }
    } else if (type === "city") {
        // const city = new RegExp("^[a-zA-Z ][a-zA-Z0-9 ]*$");
        const city = new RegExp(/[^\s]+(\s+[^\s]+)*/);
        if (value !== undefined && value !== null && city.test(value)) {
            return true;
        } else {
            return translate.formatMessage({id: "validation.city.message"});
        }
    } else {
        return true;
    }
});

withFormsy.addValidationRule('isValidFrenchPhoneNumber', (values: Values, value: Value, type: string) => {
    if (!value) {
        return true;
    }
    value = value.startsWith("+33") ? "0" + value.substring(3) : value

    if (type === "FIXE") {
        return !value.match(/^0[1-58-9][0-9]{8}$/) ? translate.formatMessage({id: "validation.french.phone.number"}) : true

    } else if (type === "FAX" || type === "OTHER") {
        return !value.match(/^0[1-9][0-9]{8}$/) ? translate.formatMessage({id: "validation.french.other.number"}) : true

    } else {
        return translate.formatMessage({id: "validation.french.phone.number"})
    }
});

withFormsy.addValidationRule('manualValidation', (values: string[], value: string, isValid: boolean) => {
    return !!isValid;
});

withFormsy.addValidationRule('isNotEquals', (values, value, originalValue) => {
    if (value === originalValue) {
        return translate.formatMessage({id: "validation.isNotEquals.message"})
    } else {
        return true;
    }
});
