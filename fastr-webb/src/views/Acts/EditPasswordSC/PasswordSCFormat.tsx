import * as moment from "moment"
import FASTRAct from "../../../model/acts/FASTRAct";
import RequestForPassword from "../../../model/acts/password/RequestForPassword";
import Payload from "../../../model/Payload";


// tslint:disable-next-line:no-any TODO: A typer
export const formatDataForPasswordSCChange = (form: any, payload: Payload) => {
    let newPassword = ""
    if (!form.deletePassword) {
        newPassword = form.password
    }

    const request: FASTRAct<RequestForPassword> = {
        act: {
            newValues: {
                physicalPerson: {password: newPassword},
                moralPerson: {password: newPassword}
            }
        },
        notification: true,
        dueDate: moment().toDate(),
        personId: payload.idClient,
        serviceId: payload.idService,
    };
    return request
};


