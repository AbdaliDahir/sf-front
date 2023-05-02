import FormDuplicateBillings from "../../../model/acts/duplicate-billing/FormDuplicateBilling";
import Payload from "../../../model/Payload";
import FASTRAct from "../../../model/acts/FASTRAct";
import * as moment from "moment";
import {DuplicateBillingsActRequestDto} from "../../../model/acts/duplicate-billing/DuplicateBillingsActRequestDto";
import DuplicataFacture from "../../../model/acts/duplicate-billing/DuplicataFacture";
import Duplicata from "../../../model/acts/duplicate-billing/Duplicata";

export const formatDuplicateBilling = (form: FormDuplicateBillings, payload: Payload) => {

    const request: FASTRAct<DuplicateBillingsActRequestDto> = {
        act: {
            duplicataFacture: formatDuplicataFacture(form, payload)
        },
        actName: "ADG_DUPL_FACT",
        notification: false,
        dueDate: moment().toDate(),
        personId: payload.idClient,
        serviceId: payload.idService,
    };
    return request
};

export const formatDuplicataFacture = (form: FormDuplicateBillings, payload: Payload): DuplicataFacture => {
    return {
        listDuplicata: formatListDuplicata(form, payload),
        optionDuplicata: {
            charged: form.duplicateBillingsForm.billingDuplicates,
            bigFont: false,
            braille: false,
            detailled: form.duplicateBillingsForm.billingDetails
        },
        totalCost: form.duplicateBillingsForm.totalCost,
        shipTo: {
            civility: form.duplicateBillingsForm.address.civility,
            firstName: form.duplicateBillingsForm.address.firstName,
            lastName: form.duplicateBillingsForm.address.lastName,
            companyName: form.duplicateBillingsForm.address.companyName,
            streetWithNumber: form.duplicateBillingsForm.address.streetWithNumber,
            additionalAdress1: form.duplicateBillingsForm.address.additionalAdress1,
            additionalAdress2: undefined,
            postalCode:form.duplicateBillingsForm.address.postalCode,
            city: form.duplicateBillingsForm.address.city,
            country: form.duplicateBillingsForm.address.country
        },
        category: form.duplicateBillingsForm.category
    }
}

export const formatListDuplicata = (form: FormDuplicateBillings, payload: Payload): Duplicata[] => {
    const listDuplicata: Duplicata[] = [];
    form.duplicateBillingsForm.bankingMovements.forEach((bankingMovement) => {
        listDuplicata.push({
            clientId: payload.idClient,
            serviceId: payload.idService,
            cf: form.duplicateBillingsForm.billingAccountId,
            billId: bankingMovement.bill.id,
            billDate: bankingMovement.bill.date,
            amount: bankingMovement.amount,
            billType: bankingMovement.bill.type

        })
    });
    return listDuplicata
}

export const formatAmount = (amount: string) => {
    if(amount){
        const formattedAmountTab: string[] = amount.split(".")
        if (formattedAmountTab.length === 1) {
            formattedAmountTab.push("00");
        }
        if (formattedAmountTab[1].length === 1) {
            formattedAmountTab[1] += "0";
        }
        if(amount==="0"){
            return "";
        }
        return formattedAmountTab.join(",") + "€";
    }
    return "";

}

