import {EditBillingDayActRequestDTO} from "../../../model/acts/billing-day/EditBillingDayActRequestDTO";
import FASTRAct from "../../../model/acts/FASTRAct";
import Payload from "../../../model/Payload";

// tslint:disable-next-line:no-any TODO: A typer
export const formatDataForBillingDayChange = (form: any, payload: Payload, caseId?: string) => {
    const newBillingDay = new Date(form.newBillingDay).getDate().toString();
    const request: FASTRAct<EditBillingDayActRequestDTO> = {
        act: {
            currentPaymentDay: form.currentDay,
            initialPaymentDay: form.initialDay,
            newPaymentDay: newBillingDay,
            billingAccount: form.accountId
        },
        caseId,
        personId: payload.idClient,
        serviceId: payload.idService,
        accountId: undefined,
        csu: undefined,
        scs: undefined,
        pro: false,
        dueDate: new Date(Date.now()),
        notification: false
        // TODO: Remplir ces champs là
    };
    return request
};
