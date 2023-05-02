import { AdvancedSearchDto } from "../model/AdvancedSearchDto";
import { MobileRenewalInfos } from "../model/service/MobileRenewalInfos";
import { LandedPaymentFacilityInfos } from "../model/service/LandedPaymentFacility";
// Components
import AbstractService from "./AbstractService";
import { Page } from "../model/utils/Page";
import { Address, Client } from "../model/person";
import { GesteCommercialBios } from "../model/TimeLine/GesteCommercialBios";
import { CountrySettings } from "../model/CountrySettings";
import { BillingAccountDetails } from "../model/person/billing";
import { Consumption } from "../model/service/consumption/MobileConsumption";
import { CurrentMobileConsumption } from "../model/service/consumption/CurrentMobileConsumption";
import {
    CurrentLandedConsumption,
    DetailedLandedConsumption
} from "../model/service/consumption/CurrentLandedConsumption";
import { Devices } from "../model/service/Devices";
import { FadetContext } from "../model/service/billing/Fadet";
import { CaseListsSetting } from "../model/CaseListsSetting";
import { OfferEnriched } from "../model/TimeLine/OfferEnriched";
import { ActiviteRegul, CloseService } from "src/model/service";
import { BoxEquipment } from "src/model/equipment/BoxEquipment";
import { OfferLocation } from "../model/OfferLocation";
import {LocationEquipment} from "../model/mobileLocation/LocationEquipment";

export default class ClientService extends AbstractService {

    constructor() {
        super(false);
    }

    public async getClientWithAllServices(idPerson: string, forDisRc: boolean = false): Promise<Client> {
        return this.get<Client>(`/fastr-clients/clients/${idPerson}?forDisRc=${forDisRc}`);
    }

    public async getClientByServiceId(idPerson: string, idService: string, forDisRc: boolean = false): Promise<Client> {
        return this.get<Client>(`/fastr-clients/clients/${idPerson}/services/${idService}?forDisRc=${forDisRc}`);
    }


    public async searchClients(query: string): Promise<Client[]> {
        return this.get<Client[]>(`/fastr-clients/clients/search?q=${query}`);
    }

    public async advancedSearchClients(advancedSearch: AdvancedSearchDto): Promise<Client[]> {
        return this.post<AdvancedSearchDto, Client[]>(`/fastr-clients/clients/search`, advancedSearch);
    }


    public async getDiscountMobile(csuCode: string, csuNumeroIntra: string): Promise<Array<GesteCommercialBios>> {
        return this.get<Array<GesteCommercialBios>>(`/fastr-selfcare/selfcare/consultParc/${csuCode}/${csuNumeroIntra}`);
    }

    public async searchClientsCTI(lastName: string, firstName: string, birthDate: string, ndi: string): Promise<Page<Client>> {
        return this.get<Page<Client>>(`/fastr-clients/clients/search/cti?lastName=${lastName}&firstName=${firstName}&birthDate=${birthDate}&ndi=${ndi}`);
    }

    public async searchAddress(query: string): Promise<Address[]> {
        return this.get<Address[]>(`/fastr-clients/address/search?q=${query}`);
    }

    public async getCountries(): Promise<CountrySettings[]> {
        return this.get<CountrySettings[]>(`/fastr-clients/address/countries`);
    }

    public async getBillingDetailsByServiceId(clientFromStore: Client, idService: string): Promise<BillingAccountDetails> {
        return this.post<Client, BillingAccountDetails>(`/fastr-clients/clients/billing?idService=${idService}`, clientFromStore)
    }

    public async getMobileConsumption(idService: string, monthsCursor: number = 0): Promise<Consumption> {
        return this.get<Consumption>(`/fastr-clients/consumption/mobile/${idService}`)
    }

    public async getCurrentMobileConsumption(idService: string): Promise<CurrentMobileConsumption> {
        // return this.get<Consumption>(`/fastr-clients/consumption/mobile/current/${idService}`)
        return this.get<CurrentMobileConsumption>(`/fastr-clients/consumption/mobile/ICClient/EnCours/${idService}`)
    }

    public async getCurrentLandedConsumption(refClient: string): Promise<CurrentLandedConsumption> {
        return this.get<CurrentLandedConsumption>(`/fastr-clients/consumption/landed/info/${refClient}`)
    }

    public async getdetailedLandedConsumption(refClient: string | undefined): Promise<DetailedLandedConsumption> {
        return this.get<DetailedLandedConsumption>(`/fastr-clients/consumption/landed/info/detailed/${refClient}`)
    }

    public async getMobileRenewal(idService: string): Promise<MobileRenewalInfos> {
        return this.get<MobileRenewalInfos>(`/fastr-clients/renewal/mobile/${idService}`)
    }

    public async getLandedPaymentFacilities(siebelAccount: string): Promise<LandedPaymentFacilityInfos> {
        return this.get<LandedPaymentFacilityInfos>(`/fastr-clients/landed/paymentFacility/${siebelAccount}`)
    }

    // tslint:disable-next-line:no-any
    public async getLineActivationStatus(orderID: string): Promise<any> {
        // tslint:disable-next-line:no-any
        return this.get<any>(`/fastr-orders/orders/${orderID}`)
    }

    public async getEligibleBillingAccountIds(clientId: string, serviceId: string): Promise<Array<string>> {
        return this.get<Array<string>>(`/fastr-clients/clients/${clientId}/service/${serviceId}/eligibleBillingAccountIds`);
    }

    public async getAllLandedDevices(refClient: string | undefined): Promise<Devices> {
        return this.get<Devices>(`/fastr-clients/landed/equipment/${refClient}`)
    }


    public async getFadetData(invoiceId, date, isMobile): Promise<Array<FadetContext>> {
        return this.get<Array<FadetContext>>(`/fastr-billing/billing/fadet/?invoiceId=${invoiceId}&isMobileService=${isMobile}&date=${date}`)
    }

    /// Can create/duplicate case
    public async getIsServiceInLists(clientId: string, serviceId: string): Promise<CaseListsSetting> {
        return this.get<CaseListsSetting>(`/fastr-clients/client/${clientId}/service/${serviceId}/isInLists/`);
    }

    public async findAllGcuGcoByRefSiebelForLastThreeMonths(refSiebel: string): Promise<any> {
        return this.get<OfferEnriched>(`/fastr-clients/client/${refSiebel}/gco-gcu?&depthInDays=90`);
    }

    public async getNextRenewalDate(nextRenewalDateRequest: any): Promise<any> {
        // tslint:disable-next-line:no-any
        return this.post<any, any>(`/fastr-clients/ecatfix/get-next-renewal-date`, nextRenewalDateRequest);
    }

    public async findAllGcuGcoByRefSiebelAndRange(refSiebel: string, range: string): Promise<any> {
        return this.get<OfferEnriched>(`/fastr-clients/client/${refSiebel}/gco-gcu?&depthInDays=${range}`);
    }

    public async findAllActiviteRegularisationByRefAndDepthInMonth(refSiebel: string, depth: string): Promise<ActiviteRegul[]> {
        return this.get<ActiviteRegul[]>(`/fastr-clients/client/${refSiebel}/act-regul?&depthInMonth=${depth}`)
            .then(res => res.map(item => { item.regulActiv = true; return item }))
    }

    public async getEquipementRestitution(serviceId: string | undefined): Promise<[BoxEquipment]> {
        return this.get<[BoxEquipment]>(`/fastr-clients/csu-equipment/csu/${serviceId}`);
    }

    public async modifierStatutRetourEquipement(imei: string, equipementRequest: any, headers: any[]): Promise<any> {
        // tslint:disable-next-line:no-any
        return this.postWithCustomHeader<any, any>(`/fastr-clients/csu-equipment/imei/${imei}`, equipementRequest, headers);
    }

    public async getOfferLocationMobile(idService: string) : Promise<OfferLocation[]>{
        return this.get(`/fastr-clients/client/location-mobile/${idService}`)
    }

    public async getLocationEquipments(refSiebl: string) : Promise<LocationEquipment[]>{
        return this.get(`/fastr-clients/client/location-mobile/equipments/${refSiebl}`)
    }

    public async searchCloseServices(personId:string, serviceId:string) {
        return this.get<CloseService[]>(`/fastr-clients/search/advanced?personId=${personId}&serviceId=${serviceId}`);
    }
}
