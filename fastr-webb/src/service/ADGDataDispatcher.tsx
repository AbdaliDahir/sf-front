import {ACT_ID} from "../model/actId";
import {Service} from "../model/service";
import {ClientContext} from "../store/types/ClientContext";
import {formatDataForAddressChange} from "../views/Acts/EditAddresses/AddressFormat";
import {formatDataForAdministrativeDataChange} from "../views/Acts/EditAdministrativeData/AdministrativeDataFormat";
import {formatDataForDeclaProDataChange} from "../views/Acts/EditDeclaPro/DeclaProDataFormat";
import {formatBillingAccountData} from "../views/Acts/EditBillingAccount/BillingAccountFormat";
import {formatBillingMeansData} from "../views/Acts/EditBillingAccount/BillingMeansFormatAndSend";
import {EditBillingType} from "../views/Acts/EditBillingAccount/EditBillingAccount";
import {formatDataForBillingAddressChange} from "../views/Acts/EditBillingAddress/BillingAddressFormat";
import {formatDataForBillingDayChange} from "../views/Acts/EditBillingDay/BillingDayFormat";
import {formatClientCategory, sendClientCategory} from "../views/Acts/EditClientCategory/formatAndSendClientCategory";
import {formatDataForContactChange} from "../views/Acts/EditContactData/ContactFormat";
import {formatDataForDeathStatus} from "../views/Acts/EditDeathAssumption/DeathAssumptionFormat";
import {formatDataForHolderDataChange} from "../views/Acts/EditOwner/OwnerFormat";
import {formatDataForPasswordSCChange} from "../views/Acts/EditPasswordSC/PasswordSCFormat";
import {formatDataForProfessionalChange} from "../views/Acts/EditProfessionalData/ProfessionalFormat";
import {formatDataForTutorshipChange} from "../views/Acts/EditTutorship/TutorshipFormat";
import {formatDataForServiceUser} from "../views/Acts/Leonard/EditServiceUser/ServiceUserFormat";
import {formatDataCommunication} from "../views/Acts/SendCommunication/CommunicationFormat";
import ActService from "./ActService";
import {ClientCategory} from "../model/acts/client-category/ClientCategory";
import {formatDuplicateBilling} from "../views/Acts/DuplicateBillings/DuplicateBillingFormat";

export default class ADGDataDispatcher {

    // TODO: A virer. Y'a un probleme de payload : il manque des champs ou c'est pas le bon. A virer
    // tslint:disable-next-line:no-any
    public startWorking = async (form: any, payload: any, adg: string, contextClient: ClientContext<Service>, caseId: string) => {
        const actService: ActService = new ActService(true);
        let request
        switch (adg) {
            case (ACT_ID.ADG_ADR_PRINC):
                request = formatDataForAddressChange(form, payload);
                return await actService.updateAddress(request, payload.idClient, payload.idService);
            case (ACT_ID.ADG_CONTACT):
                request = formatDataForContactChange(form, payload);
                return actService.updateContactData(request, payload.idClient, payload.idService);
            case (ACT_ID.ADG_ETAT_CIVIL):
                request = formatDataForAdministrativeDataChange(form, payload);
                return await actService.updatePersonalData(request, payload.idClient, payload.idService)
            case (ACT_ID.ADG_GESTION_DECLA_PRO):
                request = formatDataForDeclaProDataChange(form, payload);
                return await actService.updateDeclaProData(request, payload.idClient, payload.idService)
            case(ACT_ID.ADG_CTI):
                request = formatDataForHolderDataChange(form, payload, contextClient.data!, caseId);
                return await actService.changeOwner(request)
            case(ACT_ID.ADG_UTIL):
                request = formatDataForServiceUser(form, payload, caseId);
                return await actService.updateMobileServiceUser(request)
            case(ACT_ID.ADG_CHGT_CAT):
                request = formatDataForProfessionalChange(form, payload, contextClient.data!);
                return actService.updateCorporationData(request, payload.idClient)
            case(ACT_ID.ADG_TUTELLE):
                request = formatDataForTutorshipChange(form, payload, caseId, contextClient.data);
                return await actService.updateTutorshipEclient(request, payload.idClient, payload.idService);
            case(ACT_ID.ADG_DCD):
                request = formatDataForDeathStatus(form, payload);
                return actService.updateDeathAssumption(request, payload.idClient, payload.idService);
            case(ACT_ID.ADG_JPP):
                request = formatDataForBillingDayChange(form, payload, caseId);
                return await actService.editEclientBillingDay(request);
            case(ACT_ID.ADG_ADR_FACT):
                request = formatDataForBillingAddressChange(form, payload, contextClient.data!, caseId);
                if (contextClient!.data!.services && contextClient!.data!.services.length > 0) {
                    return actService.updateBillingAddress(request, payload.idClient);
                } else {
                    return {"idTransaction": "INCONNU"}
                }
            case(ACT_ID.ADG_MDP):
                request = formatDataForPasswordSCChange(form, payload);
                request.pro = contextClient.data?.clientCategory === ClientCategory.CORPORATION;
                return actService.updatePasswordSC(request, payload.idClient, payload.idService);
            case(ACT_ID.ADG_PUK):
                return await actService.postCodePUKWasRead()
            case(ACT_ID.ADG_CHGT_CF):
                request = formatBillingAccountData(form, payload, contextClient.service!);
                if (form.actType === EditBillingType.UNGROUP.toString()) {
                    return actService.unGroupBillingAccount(request);
                } else {
                    return actService.groupAccountBilling(request);
                }
            case(ACT_ID.ADG_COMM_MANUEL):
                request = formatDataCommunication(form, payload);
                return actService.sendCommunication(request)
                break;
            case(ACT_ID.ADG_MOY_PAY):
                request = formatBillingMeansData(form, payload, contextClient.service!);
                return await actService.updatePaymentMeans(request);
                break;
            case(ACT_ID.ADG_CAT_CLIENT):
                const actRequest = formatClientCategory(form, payload, contextClient.data!);
                return await sendClientCategory(actRequest, payload);
            case(ACT_ID.ADG_DUPL_FACT):
                request = formatDuplicateBilling(form, payload);
                return await actService.sendActDuplicateBillings(request);

            default:
                throw Error("ACT functionnal ID does not exist");
        }
    }
}

