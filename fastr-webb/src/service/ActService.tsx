import RequestForAddressChange from "../model/acts/address/EditAddressActRequest";
import GroupBillingAccountDTO from "../model/acts/billing-account/GroupBillingAccountDTO";
import { EditBillingDayActRequestDTO } from "../model/acts/billing-day/EditBillingDayActRequestDTO";
import GetBillingDayActRequestDTO from "../model/acts/billing-day/GetBillingDayActRequestDTO";
import { EditBillingMethodActRequestDTO } from "../model/acts/billing-method/EditBillingMethodActRequestDTO";
import RequestForContact from "../model/acts/contact/RequestForContact";
import RequestForDeathStatus from "../model/acts/death/RequestForDeathStatus";
import { EditOwnerEligibilityDto } from "../model/acts/edit-owner/EditOwnerEligibilityDto";
import EditOwnerRequestDTO from "../model/acts/edit-owner/EditOwnerRequestDTO";
import EditServiceUserRequest from "../model/acts/edit-user/EditServiceUserRequest";
import FASTRAct from "../model/acts/FASTRAct";
import RequestForPassword from "../model/acts/password/RequestForPassword";
import { EditTutorActRequestDTO } from "../model/acts/personal";
import EditPersonalDataRequest from "../model/acts/personal-data/EditPersonalDataRequest";
import RequestForAdministrativeData from "../model/acts/personal-data/RequestForAdministrativeData";
import RequestForProfessional from "../model/acts/professional/RequestForProfessional";
import GetPUKCodeResponseDTO from "../model/acts/puk/GetPUKCodeResponseDTO";
import { SendCommunicationRequestDTO } from "../model/acts/send-communication/SendCommunicationRequestDTO";
import TransactionDTO from "../model/acts/TransactionDTO";
import { BillingMethods } from "../model/BillingMethods";
import { ManagementActDTO } from "../model/service/ManagementActDTO";
// Components
import AbstractService from "./AbstractService";
import { UnGroupBillingAccountDTORequest } from "../model/service/UnGroupBillingAccountDTORequest";
import EditBillingAddressActRequestDTO from "../model/acts/billing-address/EditBillingAddressActRequestDTO";
import { CheckIbanBicRequestDTO } from "../model/service/CheckIbanBicRequestDTO";
import { RibOnlineRequestDTO } from "../model/service/RibOnlineRequestDTO";
import { CheckIbanBicResponseDTO } from "../model/service/CheckIbanBicResponseDTO";
import { RibOnlineResponseDTO } from "../model/service/RibOnlineResponseDTO";
import { UpdatePaymentsMeanDTO } from "../model/service/UpdatePaymentsMeanDTO";
import { ManagementActGingerDTO } from "../model/service/ManagementActGingerDTO";
import { EditClientCategoryRequestDTO } from "../model/acts/client-category/EditClientCategoryRequestDTO";
import { RetentionActResponseDTO } from "../model/acts/retention/RetentionActResponseDTO";
import { Setting } from "../model/acts/Setting";
import { RetentionSetting } from "../model/acts/retention/RetentionSetting";
import { WebsapSetting } from "../model/acts/websap/WebsapSetting";
import { WebsapActResponseDTO } from "../model/acts/websap/WebsapActResponseDTO";
import { RetentionIneligibilityCausesSetting } from "../model/acts/retention/RetentionIneligibilityCausesSetting";
import { AntiChurnClientProposal } from "../model/acts/antichurn/AntiChurnClientProposal";
import { ScenarioActDTO } from "../model/scenario/ScenarioActDTO";
import { BillingsSettings } from "../model/acts/duplicate-billing/BillingsSettings";
import { AntiChurnActResponseDTO } from "../model/acts/antichurn/AntiChurnActResponseDTO";
import { DuplicateBillingsActResponseDto } from "../model/acts/duplicate-billing/DuplicateBillingsActResponseDto";
import { SavActSaveCommentDTO } from "../model/service/SavActSaveCommentDTO";
import { DuplicateBillingsActRequestDto } from "../model/acts/duplicate-billing/DuplicateBillingsActRequestDto";
import { LandedDevice } from "../model/service/Devices";
import { RetourEquipementActDetail } from "../model/service/RetourEquipementActDetail";
import { ActCollection } from "../model/service/ActCollection";
import { EligibilityRenvoiEtiquette } from "../model/service/EligibilityrenvoiEtiquette";
import { PointsDepotsRenvoiEtiquette } from "../model/service/PointsDepotsRenvoiEtiquette";
import { RegularisationFixeActDetail } from "../model/service/RegularisatonFixeActDetail";
import { MaxwellActResponse } from "../model/maxwell/MaxwellAct";
import { RegularisationFixeAdgDetail } from "src/model/service/RegularisationFixAdgDetail";
import { DynamicDataResponse } from "src/model/aramis/DynamicDataResponse";
import {RenvoiEquipementActResponse} from "../model/service/RenvoiEquipementActResponse";

export default class ActService extends AbstractService {

    public async updatePasswordSC(updatePersonalDataRequest: FASTRAct<RequestForPassword>, personId: string, offerId: string): Promise<TransactionDTO> {
        return this.post<FASTRAct<RequestForPassword>, TransactionDTO>(`/fastr-acts/acts/client/${personId}/${offerId}/password`, updatePersonalDataRequest)
    }

    public async updatePersonalData(updatePersonalDataRequest: FASTRAct<RequestForAdministrativeData>, personId: string, offerId: string): Promise<TransactionDTO> {
        return this.post<FASTRAct<RequestForAdministrativeData>, TransactionDTO>(`/fastr-acts/acts/client/${personId}/${offerId}/adminData`, updatePersonalDataRequest)
    }

    public async updateDeclaProData(updatePersonalDataRequest: FASTRAct<RequestForAdministrativeData>, personId: string, offerId: string): Promise<TransactionDTO> {
        return this.post<FASTRAct<RequestForAdministrativeData>, TransactionDTO>(`/fastr-acts/acts/client/${personId}/${offerId}/declarationPro`, updatePersonalDataRequest)
    }

    public async updateContactData(updatePersonalDataRequest: FASTRAct<RequestForContact>, personId: string, offerId: string): Promise<TransactionDTO> {
        return this.post<FASTRAct<RequestForContact>, TransactionDTO>(`/fastr-acts/acts/client/${personId}/${offerId}/contact`, updatePersonalDataRequest)
    }

    public async updateAddress(updateAddressRequest: FASTRAct<RequestForAddressChange>, personId: string, offerId: string): Promise<TransactionDTO> {
        return this.post<FASTRAct<RequestForAddressChange>, TransactionDTO>(`/fastr-acts/acts/client/${personId}/${offerId}/address`, updateAddressRequest)
    }

    public async updateBillingMethod(updatedBillingMethodRequest: FASTRAct<EditBillingMethodActRequestDTO>): Promise<BillingMethods> {
        return this.post<FASTRAct<EditBillingMethodActRequestDTO>, BillingMethods>('/fastr-acts/acts/client/IDdata/billing/methods', updatedBillingMethodRequest)
    }

    public async updateTutorshipEclient(updateTutorshipRequest: FASTRAct<EditTutorActRequestDTO>, personId: string, offerId: string): Promise<TransactionDTO> {
        return this.post<FASTRAct<EditTutorActRequestDTO>, TransactionDTO>(`/fastr-acts/acts/client/${personId}/${offerId}/tutor`, updateTutorshipRequest)
    }

    public async updateDeathAssumption(updateDeathRequest: FASTRAct<RequestForDeathStatus>, personId: string, offerId: string): Promise<TransactionDTO> {
        return this.post<FASTRAct<RequestForDeathStatus>, TransactionDTO>(`/fastr-acts/acts/client/${personId}/${offerId}/deathAssumption`, updateDeathRequest)
    }

    public async updateMobileServiceUser(editServiceUserRequest: FASTRAct<EditServiceUserRequest>): Promise<TransactionDTO> {
        return this.post<FASTRAct<EditServiceUserRequest>, TransactionDTO>('/fastr-acts/acts/mobile/user/edit', editServiceUserRequest)
    }

    public async getPukCode(iccId: string, idService: string): Promise<GetPUKCodeResponseDTO> {
        return this.get<GetPUKCodeResponseDTO>(`/fastr-acts/acts/mobile/${idService}/puk/${iccId}`)
    }

    public async updateCorporationData(editProfesionalDataRequest: FASTRAct<RequestForProfessional>, personId: string): Promise<TransactionDTO> {
        return this.post<FASTRAct<RequestForProfessional>, TransactionDTO>('/fastr-acts/acts/client/corporation/' + personId, editProfesionalDataRequest)
    }

    public async postCodePUKWasRead(): Promise<TransactionDTO> {
        // tslint:disable-next-line:no-any
        return this.post<any, any>('/fastr-acts/acts/mobile/puk', "")
    }

    public async updateCorporationSigcData(editSigcProDataRequest: FASTRAct<EditPersonalDataRequest>, personId: string, idService: string): Promise<TransactionDTO> {
        return this.post<FASTRAct<EditPersonalDataRequest>, TransactionDTO>(`/fastr-acts/acts/client/corporation/registration/${personId}/${idService}`, editSigcProDataRequest)
    }

    // Edit owner
    public async getEditOwnerEligibility(idPerson: string, idService: string, isMoral: boolean): Promise<EditOwnerEligibilityDto> {
        return this.get<EditOwnerEligibilityDto>(`/fastr-acts/acts/editOwner/eligibility/${idPerson}/${idService}?moral=${isMoral}`);
    }

    public async changeOwner(changeOwnerRequest: FASTRAct<EditOwnerRequestDTO>): Promise<TransactionDTO> {
        return this.post<FASTRAct<EditOwnerRequestDTO>, TransactionDTO>('/fastr-acts/acts/editOwner', changeOwnerRequest);
    }

    public async updateBillingAddress(billingAddressRequest: FASTRAct<EditBillingAddressActRequestDTO>, personId: string): Promise<TransactionDTO> {
        return this.post<FASTRAct<EditBillingAddressActRequestDTO>, TransactionDTO>('/fastr-acts/acts/client/' + personId + '/billing/address', billingAddressRequest)
    }

    // TODO: On avait dit FASTR agnostique a à l'emplacement du client + pourquoi avoir développé cet acte si il est proxifié par SIGC ?
    public async getEclientBillingDay(accountId: string): Promise<GetBillingDayActRequestDTO> {
        return this.get<GetBillingDayActRequestDTO>(`/fastr-acts/acts/client/${accountId}/eclient/billing/day`);
    }

    // TODO: On avait dit FASTR agnostique a à l'emplacement du client + pourquoi avoir développé cet acte si il est proxifié par SIGC ?
    public async editEclientBillingDay(request: FASTRAct<EditBillingDayActRequestDTO>): Promise<TransactionDTO> {
        return this.post<FASTRAct<EditBillingDayActRequestDTO>, TransactionDTO>('/fastr-acts/acts/client/eclient/update/billing/day', request);
    }

    public async getActsHistory(idAct: string): Promise<ManagementActDTO> {
        return this.get<ManagementActDTO>(`/fastr-acts/acts/client/historyActs/${idAct}`);
    }

    public async getActsGingerHistory(idAct: string): Promise<ManagementActGingerDTO> {
        return this.get<ManagementActGingerDTO>(`/fastr-notif/notif/ginger/history/byYourRefs/${idAct}`);
    }

    // Group - Ungroup account billing
    public async unGroupBillingAccount(request: FASTRAct<UnGroupBillingAccountDTORequest>): Promise<TransactionDTO> {
        return this.post<FASTRAct<UnGroupBillingAccountDTORequest>, TransactionDTO>('/fastr-acts/acts/client/eclient/unGroup/CF', request);
    }

    public async groupAccountBilling(request: FASTRAct<GroupBillingAccountDTO>): Promise<TransactionDTO> {
        return this.post<FASTRAct<GroupBillingAccountDTO>, TransactionDTO>('/fastr-acts/acts/client/eclient/billingAccount/group', request);
    }

    public async checkIbanBicEntries(request: CheckIbanBicRequestDTO): Promise<CheckIbanBicResponseDTO> {
        return this.post<CheckIbanBicRequestDTO, CheckIbanBicResponseDTO>(`/fastr-acts/acts/client/erisk/check/iban/bic`, request);
    }

    public async validateRibOnline(request: RibOnlineRequestDTO): Promise<RibOnlineResponseDTO> {
        return this.post<RibOnlineRequestDTO, RibOnlineResponseDTO>(`/fastr-acts/acts/client/erisk/validate/ribOnline`, request);
    }

    public async updatePaymentMeans(request: FASTRAct<UpdatePaymentsMeanDTO>): Promise<TransactionDTO> {
        return this.post<FASTRAct<UpdatePaymentsMeanDTO>, TransactionDTO>(`/fastr-acts/acts/client/eclient/billing/updateBillingMeans`, request);
    }

    public async sendCommunication(request: FASTRAct<{ parameterMessageRequestDTO: SendCommunicationRequestDTO }>): Promise<TransactionDTO> {
        return this.post<FASTRAct<{ parameterMessageRequestDTO: SendCommunicationRequestDTO }>, TransactionDTO>('/fastr-acts/acts/notification/send', request);
    }

    public async editClientCategory(request: FASTRAct<EditClientCategoryRequestDTO>, personId: string): Promise<TransactionDTO> {
        return this.post<FASTRAct<EditClientCategoryRequestDTO>, TransactionDTO>(`/fastr-acts/acts/client/${personId}/clientCategory`, request);
    }

    public async getServiceCategories(isAuthorizedVip: boolean): Promise<Array<string>> {
        return this.get<Array<string>>(`/fastr-acts/acts/client/serviceCategories?isAuthorizedVip=${isAuthorizedVip}`);
    }

    public async getActRetention(actId: string): Promise<RetentionActResponseDTO> {
        return this.get<RetentionActResponseDTO>(`/fastr-acts/acts/retention/${actId}`);
    }

    public async getActDuplicateBillings(actId: string): Promise<DuplicateBillingsActResponseDto> {
        return this.get<DuplicateBillingsActResponseDto>(`/fastr-acts/acts/duplicataFacture/${actId}`);
    }

    public async sendActDuplicateBillings(request: FASTRAct<DuplicateBillingsActRequestDto>): Promise<TransactionDTO> {
        return this.post<FASTRAct<DuplicateBillingsActRequestDto>, TransactionDTO>('/fastr-acts/acts/duplicataFacture/save', request);
    }

    public async getActAntiChurn(actId: string): Promise<AntiChurnActResponseDTO> {
        return this.get<AntiChurnActResponseDTO>(`/fastr-acts/acts/antichurn/${actId}`);
    }

    public async getActSmsi(actId: string): Promise<ScenarioActDTO> {
        return this.get<ScenarioActDTO>(`/fastr-acts/acts/comunication/${actId}`);
    }

    public async getRetentionSetting(family: string): Promise<Setting<RetentionSetting>> {
        return this.get<Setting<RetentionSetting>>(`/fastr-acts/acts/retention/motifs?family=${family}`);
    }

    public async getAntiChurnSetting(name: string): Promise<Setting<Array<AntiChurnClientProposal>>> {
        return this.get<Setting<Array<AntiChurnClientProposal>>>(`/fastr-acts/acts/antichurn/setting?name=${name}`);
    }

    public async getRetentionIneligibilityCausesSetting(): Promise<Setting<RetentionIneligibilityCausesSetting>> {
        return this.get<Setting<RetentionIneligibilityCausesSetting>>(`/fastr-acts/acts/retention/motifs?family=retentionIneligibilitySetting`);
    }

    public async getActWebsap(actId: string): Promise<WebsapActResponseDTO> {
        return this.get<WebsapActResponseDTO>(`/fastr-acts/acts/websap/${actId}`);
    }

    public async getWebsapSettings(): Promise<Setting<WebsapSetting>> {
        return this.get<Setting<WebsapSetting>>(`/fastr-acts/acts/websap/settings`);
    }

    public async getWebsapAccess(sapPassword: string): Promise<any> {
        return this.post<any, any>(`/fastr-acts/acts/websap/websap-access`, { sapPassword: sapPassword });
    }

    public async getBillingsSettings(name: string): Promise<Setting<BillingsSettings>> {
        return this.get<Setting<BillingsSettings>>(`/fastr-acts/acts/duplicataFacture/setting?name=${name}`);
    }

    public async getSbeRecherche(request: { referenceName: string | undefined; reference: string | undefined }): Promise<any> {
        const { referenceName } = request;
        const { reference } = request;
        return this.get<any>(`/fastr-acts/acts/sav/service-requests?${referenceName}=${reference}`);
    }

    public async getSbeConsultation(reference: string | undefined): Promise<any> {
        return this.get<any>(`/fastr-acts/acts/sav/service-requests/${reference}`);
    }

    public async saveComment(commentData: SavActSaveCommentDTO): Promise<any> {
        return this.post<any, any>(`/fastr-acts/acts/sav`, commentData);
    }

    public async getNextActSequence(): Promise<any> {
        return this.get<any>(`/fastr-acts/acts/next/sequence`);
    }

    public async retourEquipment(request: LandedDevice[], refSiebel: string, caseId: string, contactId: string): Promise<any> {
        return this.post<any, any>(`/fastr-acts/acts/landed/returnDevice/${refSiebel}/${caseId}/${contactId}`, request);
    }

    public async getActReturnEquipment(idTransaction: string, siebelAccount: string): Promise<RetourEquipementActDetail> {
        return this.get<RetourEquipementActDetail>(`/fastr-acts/acts/landed/act/${idTransaction}/refSiebel/${siebelAccount}`);
    }

    public async getActRenvoiEquipement(idTransaction: string, siebelAccount: string): Promise<RenvoiEquipementActResponse> {
        return this.get<RenvoiEquipementActResponse>(`/fastr-acts/renvoi-equipement/landed/act/${idTransaction}/refSiebel/${siebelAccount}`)
    }

    public async getActRegularisationFIxe(transactionId: string, refSiebel: string): Promise<RegularisationFixeActDetail> {
        return this.get<RegularisationFixeActDetail>(`/fastr-acts/acts/regularisation-fixe?transactionId=${transactionId}&refSiebel=${refSiebel}`);
    }

    public async getListActRegularisationDetailedFixeForLastTwoYears(refSiebel: string): Promise<RegularisationFixeAdgDetail[]> {
        return this.get<RegularisationFixeAdgDetail[]>(`/fastr-acts/acts/regularisation-fixe-list-details?refSiebel=${refSiebel}&depthInDays=720`);
    }

    public async getListActRegularisationFixeForLastThreeMonths(refSiebel: string): Promise<any> {
        return this.get<RegularisationFixeActDetail>(`/fastr-acts/acts/regularisation-fixe-list?refSiebel=${refSiebel}&depthInDays=90`);
    }

    public async getActById(idAct: string): Promise<ActCollection> {
        return this.get<ActCollection>(`/fastr-acts/acts/${idAct}`);
    }

    // -------- ADG RENVOI ETIQUETTE
    public async getEligibilityRenvoiEtiquette(siebelAccount: string): Promise<EligibilityRenvoiEtiquette> {
        return this.get<EligibilityRenvoiEtiquette>(`/fastr-acts/acts/renvoiEtiquette/eligibility?accountId=${siebelAccount}`);
    }

    public async getPointsDepot(postalCode: string, city?: string): Promise<PointsDepotsRenvoiEtiquette> {
        return this.get<PointsDepotsRenvoiEtiquette>(`/fastr-acts/acts/renvoiEtiquette/pointsDepot?codePostale=${postalCode}${city ? "&ville=" + city : ""}`);
    }

    public async getMaxwellAct(actId: string): Promise<MaxwellActResponse> {
        return this.get<MaxwellActResponse>(`/fastr-acts/acts/maxwell/${actId}`);
    }

    public async getStatusCodeLitige(): Promise<any> {
        return this.get<any>(`/fastr-acts/acts/status-code-lititge/fetch`);
    }

    public async getDynamicData(accountId: string): Promise<DynamicDataResponse[]> {
        return this.get<DynamicDataResponse[]>(`/fastr-acts/renvoi-equipement/get-dynamic-data?accountId=${accountId}`);
    }

    public async getPointsLivraison(selectedEquipments: DynamicDataResponse[], postalCode: string, city?: string): Promise<PointsDepotsRenvoiEtiquette> {
        return this.post<DynamicDataResponse[], PointsDepotsRenvoiEtiquette>(`/fastr-acts/renvoi-equipement/points-livraison?codePostale=${postalCode}${city ? "&ville=" + city : ""}`, selectedEquipments);
    }

}
