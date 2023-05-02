import AbstractService from "./AbstractService";
import {BillingInformation} from "../model/person/billing/BillingInformation";
import {BillsRequestDTO} from "../model/BillsRequestDTO";
import {BillsResponseDTO} from "../model/BillsResponseDTO";

export default class BillingService extends AbstractService {

    constructor() {
        super(false);
    }

    public async getBillingInfo(billingAccount: string,
                                refSiebel: string | undefined,
                                isMobileService: boolean,
                                onlyBills: boolean,
                                startDate?: string,
                                endDate?: string
    ): Promise<BillingInformation> {
        return this.get<BillingInformation>(`/fastr-billing/billing/${billingAccount}?isMobileService=${isMobileService}&onlyBills=${onlyBills}${startDate&&endDate?"&startDate="+startDate+"&endDate="+endDate:""}`);
    }

    public async getGraphData(serviceID: string | undefined, isMobile: boolean, dmsIdBills: any): Promise<Array<BillsResponseDTO>> {
        return this.post<BillsRequestDTO, Array<BillsResponseDTO>>(`/fastr-billing/billing/${serviceID}/getBills?isMobile=${isMobile}`, {dmsIdBills: dmsIdBills});
    }
}
