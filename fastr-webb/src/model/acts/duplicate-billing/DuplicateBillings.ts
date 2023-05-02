import {BankingMovement} from "../../person/billing/BillingInformation";
import {ClientContext} from "../../../store/types/ClientContext";
import {Service} from "../../service";
import AddressModel from "./AddressModel";

export default interface DuplicateBillings{

    bankingMovements: BankingMovement[]
    billingAccountId: string
    billingDetails: boolean
    billingDuplicates: true
    billingType: string
    address: AddressModel
    client:  ClientContext<Service>
    category: string
    totalCost: number
}
