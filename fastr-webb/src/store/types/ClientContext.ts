import {Client} from "../../model/person";
import {Service} from "../../model/service";
import {SOCO} from "../../model/TimeLine/SOCO";
import BillingInfo from "../../model/service/billing/BillingInfo";
import {DataLoad} from "../actions/ClientContextActions";

export interface ClientContext<T extends Service> {
    data?: Client
    bills?: BillingInfo
    communications?: SOCO[]
    fetching?: boolean,
    loading: boolean
    error?: string
    serviceId?: string
    service?: T
}


export interface ClientContextAction {
    loadClient: (clientId: string, serviceId: string, dataLoad: DataLoad) => void
    loadBills: (billingAccountId: string, page: number) => void
    loadCommunications: (serviceId: string) => void
}

export default interface ClientContextProps<T extends Service> extends ClientContextAction {
    client: ClientContext<T>
}
