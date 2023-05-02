import * as moment from "moment";
import FASTRAct from "../../../model/acts/FASTRAct";
import Payload from "../../../model/Payload";
import {Service} from "../../../model/service";
import {UpdatePaymentsMeanDTO} from "../../../model/service/UpdatePaymentsMeanDTO";
import {EditBillingType} from "./EditBillingMeans";
import DateUtils from "../../../utils/DateUtils";


// tslint:disable-next-line:no-any TODO: A typer
export const formatBillingMeansData = (form: any, payload: Payload, service: Service) => {
    const accountId = service && service.billingAccount!.id;
    const {bankDetails} = form;

    if (bankDetails && bankDetails.iban && bankDetails.bic) {
        bankDetails.iban = bankDetails && bankDetails.iban.replace(/\s/g, '').trim();
        bankDetails.bic = bankDetails && bankDetails.bic.replace(/\s/g, '').trim();
    }
    let request: FASTRAct<UpdatePaymentsMeanDTO> | undefined
    if (form.actType === EditBillingType.IBAN.toString()) {
        request = {

            act: {
                billingAccountID: accountId,
                effectDate: DateUtils.toGMT0ISOString(bankDetails.effectDate),
                accountBillingMeans: bankDetails
            },
            dueDate: moment().toDate(),
            notification: true,
            personId: payload.idClient,
            serviceId: payload.idService,
        };

    } else {
        request = {
            act: {
                billingAccountID: accountId,
                effectDate: DateUtils.toGMT0ISOString(bankDetails.effectDate),
                otherBillingMeans: bankDetails
            },
            dueDate: moment().toDate(),
            notification: true,
            personId: payload.idClient,
            serviceId: payload.idService,
        };

    }
    return request
};
