import {EngagementCurrentStatus} from "./EngagementCurrentStatus";
import {Plan} from "./Plans";
import {ServiceStatus} from './ServiceStatus';
import {Person} from "../person";
import {OfferCategory} from "../OfferCategory";
import {BillingAccount} from "../person/billing";
import {AdditionalData} from "./AdditionalData";
import {ServiceType} from "../ServiceType";
import { MultiPacks } from "../MultiPacks";
import {NatureDeServiceBios} from "../enums/NatureDeServiceBios";

export interface Service {
	siebelAccount?: string;
	ndi?: string;
	id: string;
	label: string;
	billingAccount: BillingAccount;
	status: ServiceStatus;
	offerCode: string
	offerName: string
	creationDate: string;
	activationDate: string;
	multiPacks: MultiPacks;
    plans: Plan[];
	terminationDate: string;
	lastUpdateDate: string;
	suspensionDate: string;
	user: Person;
	category: OfferCategory;
	additionalData: AdditionalData;
	offerTypeId: string;
	brand: string;
	segment?: string
	engagementCurrentStatus: EngagementCurrentStatus;
    serviceType: ServiceType,
	marqueBios: string,
	natureServiceBios: NatureDeServiceBios
}
