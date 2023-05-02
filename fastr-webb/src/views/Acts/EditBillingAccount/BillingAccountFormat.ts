import * as moment from "moment";
import GroupBillingAccountDTO from "../../../model/acts/billing-account/GroupBillingAccountDTO";
import FASTRAct from "../../../model/acts/FASTRAct";
import Payload from "../../../model/Payload";
import {Service} from "../../../model/service";
import {UnGroupBillingAccountDTORequest} from "../../../model/service/UnGroupBillingAccountDTORequest";
import DateUtils from "../../../utils/DateUtils";
import {EditBillingType} from "./EditBillingAccount";


// tslint:disable-next-line:no-any TODO: A typer
export const formatBillingAccountData = (form: any, payload: Payload, service: Service) => {
    if (form.actType === EditBillingType.UNGROUP.toString()) {
        const actWithNoIban = {
            effectDate: DateUtils.toGMT0ISOString(form.effectDate),
            otherBillingMeans: form.bankDetails,
        }
        const actWithIban = {
            effectDate: DateUtils.toGMT0ISOString(form.effectDate),
            accountBillingMeans: form.bankDetails,
            otherBillingMeans: form.bankDetails,
            withPreviousIban: form.withPreviousIban
        }
        const request: FASTRAct<UnGroupBillingAccountDTORequest> = {
            act: form.withPreviousIban !== undefined ? actWithIban : actWithNoIban,
            dueDate: moment().toDate(),
            notification: true,
            personId: payload.idClient,
            serviceId: payload.idService,
        };
        if(request.act!.accountBillingMeans?.iban || request.act!.otherBillingMeans?.iban) {
            request.act!.accountBillingMeans!.iban = form.withPreviousIban ? service.billingAccount.sepaMethod.iban.replace(/\s/g, "") : form.bankDetails.iban.replace(/\s/g, "");
            request.act!.otherBillingMeans.iban = form.withPreviousIban ? service.billingAccount.sepaMethod.iban.replace(/\s/g, "") : form.bankDetails.iban.replace(/\s/g, "");
        }
        if(request.act!.accountBillingMeans?.bic || request.act!.otherBillingMeans?.bic) {
            request.act!.accountBillingMeans!.bic = form.withPreviousIban ? service.billingAccount.sepaMethod.bic.replace(/\s/g,"") : form.bankDetails.bic.replace(/\s/g,"");
            request.act!.otherBillingMeans.bic = form.withPreviousIban ? service.billingAccount.sepaMethod.bic.replace(/\s/g,"") : form.bankDetails.bic.replace(/\s/g,"");
        }

        return request

    } else {
        const request: FASTRAct<GroupBillingAccountDTO> = {
            act: {
                selectedAccountId: form.selectedAccountId
            },
            accountId: service.billingAccount.id,
            personId: payload.idClient,
            serviceId: payload.idService
        };

        return request
    }
};
