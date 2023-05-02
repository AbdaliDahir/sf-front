import * as actionsTypes from "./ClientActionsTypes"
import {DataLoad} from "../../ClientContextActions";
import {Client} from "../../../../model/person";
import ClientService from "../../../../service/ClientService";
import AlertService from "../../../../service/AlertService";
import {Alert} from "../../../../model/alert/Alert";
import {NotificationManager} from "react-notifications";
import {BillingInformation} from "../../../../model/person/billing/BillingInformation";
import BillingService from "../../../../service/BillingService";
import {CurrentMobileConsumption} from "../../../../model/service/consumption/CurrentMobileConsumption";
import {MobileRenewalInfos} from "../../../../model/service/MobileRenewalInfos";
import {CurrentLandedConsumption} from "../../../../model/service/consumption/CurrentLandedConsumption";
import {LandedPaymentFacilityInfos} from "../../../../model/service/LandedPaymentFacility";
import {ClientContextSliceState} from "../../../ClientContextSlice";
import {Case} from "../../../../model/Case";
import CaseService from "../../../../service/CaseService";
import {CaseListsSetting} from "../../../../model/CaseListsSetting";
import { BoxEquipment } from "src/model/equipment/BoxEquipment";
import { CloseService } from "src/model";

const clientService: ClientService = new ClientService();
const alertService: AlertService = new AlertService();
const billingService: BillingService = new BillingService();
const caseService: CaseService = new CaseService(true);

/*Loading client in 2 different ways :
* 1 : results in CLIENT + All HIS SERVICES
* 2 : results in CLIENT + a SINGLE service by serviceId from PAYLOAD*/
const loadClientData = async (idPerson: string, idService: string, howToLoad: DataLoad): Promise<Client> => {
    switch (howToLoad) {
        case DataLoad.ALL_SERVICES:
            return await clientService.getClientWithAllServices(idPerson, true);
        case DataLoad.ALL_SERVICES_LIGHT:
            return await clientService.getClientWithAllServices(idPerson, false);
        case DataLoad.ONE_SERVICE:
            return await clientService.getClientByServiceId(idPerson, idService);
    }
};

const loadAlertData = async (clientId: string, serviceId: string, isMobileService: boolean): Promise<Alert[]> => {
    try {
        return await alertService.getAlertsByClientId(clientId, serviceId, isMobileService);
    } catch (error) {
        NotificationManager.error("Erreur lors du chargement des alertes du client");
        return [];
    }
}

const loadBillsData = async (billingAccountId: string, refSiebel: string | undefined, isMobileService: boolean): Promise<BillingInformation | undefined> => {
    try {
        return await billingService.getBillingInfo(billingAccountId, refSiebel, isMobileService, false);
    } catch (error) {
        NotificationManager.error("Erreur lors du chargement des factures du client");
        return undefined;
    }
}

const loadCurrentMobileConsumption = async (idService: string): Promise<CurrentMobileConsumption | undefined> => {
    try {
        return await clientService.getCurrentMobileConsumption(idService);
    } catch (error) {
        NotificationManager.error("Erreur lors du chargement de la consomation mobile du client");
        return undefined;
    }
}

const loadCurrentLandedConsumption = async (refClient: string): Promise<CurrentLandedConsumption | undefined> => {
    try {
        return await clientService.getCurrentLandedConsumption(refClient);
    } catch (error) {
        NotificationManager.error("Erreur lors du chargement de la consomation fixe du client");
        return undefined;
    }
}

const loadMobileRenewal = async (idService: string): Promise<MobileRenewalInfos | undefined> => {
    try {
        return await clientService.getMobileRenewal(idService);
    } catch (error) {
        NotificationManager.error("Erreur lors du chargement du renouvellement mobile du client");
        return undefined;
    }
}

const loadLandedPaymentFacility = async (siebelAccount: string) => {
    return await clientService.getLandedPaymentFacilities(siebelAccount);
}

export const selectClientV2 = (clientId: string, serviceId: string) => ({
    type: actionsTypes.SELECT_CLIENT_V2,
    payload: {
        clientId,
        serviceId
    }
});

export const storeClientV2 = (client: ClientContextSliceState | undefined) => ({
    type: actionsTypes.STORE_CLIENT_V2,
    payload: {
        client
    }
});

export const fetchAndStoreIsServiceInLists = (clientId: string, serviceId: string) => async (dispatch) => {
    try {
        const setting: CaseListsSetting = await clientService.getIsServiceInLists(clientId, serviceId);
        dispatch(storeIsServiceInLists(setting))
    } catch (e) {
        NotificationManager.warning("La vérification des autorisations clients n'a pas aboutie", null, 7000);
        dispatch(storeIsServiceInLists({
                inCreateCaseBlacklist: false,
                inDuplicateCaseWhitelist: true
            })
        )
    }
}

const storeIsServiceInLists = (isServiceInLists: CaseListsSetting) => (
    {
        type: actionsTypes.IS_SERVICE_IN_LISTS,
        payload: isServiceInLists
    }
)

export const updateClientV2 = (client: Client, serviceId: string) => ({
    type: actionsTypes.STORE_OR_UPDATE_CLIENT_V2,
    payload: {
        clientData: client,
        serviceId
    }
});

export const updateCloseServices = (clientId:string,closeServices: CloseService[]) => ({
    type: actionsTypes.FETCH_AND_STORE_CLOSE_SERVICES,
    payload: {clientId, closeServices} 
});

export const updateCurrentClientV2 = (client: Client, serviceId: string) => ({
    type: actionsTypes.STORE_AND_UPDATE_CURRENT_CLIENT_V2,
    payload: {
        clientData: client,
        serviceId
    }
});

export const removeClientV2 = (clientId: string, serviceId: string) => ({
    type: actionsTypes.REMOVE_CLIENT_V2,
    payload: {
        clientId,
        serviceId
    }
});

export const loadingClientV2 = (clientId: string, serviceId: string) => ({
    type: actionsTypes.LOADING_CLIENT_V2,
    payload: {
        clientId,
        serviceId
    }
});

export const setAlertForClient = (clientId: string, serviceId: string, alerts: Alert[]) => ({
    type: actionsTypes.SET_ALERTS_CLIENT_V2,
    payload: {
        clientId,
        serviceId,
        alerts
    }
});

export const setBillsForClient = (billingAccountId: string, refSiebel: string | undefined, bills: BillingInformation | undefined) => ({
    type: actionsTypes.SET_BILLS_CLIENT_V2,
    payload: {
        billingAccountId,
        refSiebel,
        bills
    }
});

export const setCurrentMobileConsumptionForClient = (serviceId: string, currentConsumption: CurrentMobileConsumption | undefined) => ({
    type: actionsTypes.SET_CURRENT_MOBILE_CONSUMPTION_CLIENT_V2,
    payload: {
        serviceId,
        currentConsumption
    }
});

export const setCurrentLandedConsumptionForClient = (refClient: string, currentConsumption: CurrentLandedConsumption | undefined) => ({
    type: actionsTypes.SET_CURRENT_LANDED_CONSUMPTION_CLIENT_V2,
    payload: {
        refClient,
        currentConsumption
    }
});

export const setMobileRenewalForClient = (serviceId: string, mobileRenewal: MobileRenewalInfos | undefined) => ({
    type: actionsTypes.SET_MOBILE_RENEWAL_CLIENT_V2,
    payload: {
        serviceId,
        mobileRenewal
    }
});

export const setLandedPaymentFacilityForClient = (serviceId: string, landedPaymentFacilityData: LandedPaymentFacilityInfos | undefined) => ({
    type: actionsTypes.SET_LANDED_PAYMENT_FACILITY_CLIENT_V2,
    payload: {
        serviceId,
        landedPaymentFacilityData
    }
});

export const fetchRecentCasesForClientV2 = (idClient: string, idService: string, fromDisrc: boolean) => {
    return async dispatch => {
        dispatch(loadingRecentCasesClientV2(idClient, idService))
        try {
            const retrievedRecentCases: Case[] = await caseService.getRecentCasesList(idClient, encodeURIComponent(idService), !fromDisrc);
            if (fromDisrc) {
                const limit = new Date();
                limit.setTime(limit.getTime() - 24 * 60 * 60 * 1000 * 90);
                dispatch(saveRecentCasesClientV2(idClient, idService, retrievedRecentCases.filter(recentCase => {
                    return (recentCase.status !== "CLOSED" || new Date(recentCase.updateDate).getTime() > limit.getTime());
                })))
            } else {
                dispatch(saveRecentCasesClientV2(idClient, idService, retrievedRecentCases))
            }
            dispatch(loadedRecentCasesClientV2(idClient, idService))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingRecentCasesClientV2(idClient, idService, error.message))
            throw e
        }
    }
}

export const setIsRecentCasesListDisplayedV2 = (clientId, serviceId, state: boolean) => ({
    type: actionsTypes.SET_IS_LIST_DISPLAYED_CLIENT_V2,
    payload: {
        displayed: state,
        clientId,
        serviceId
    }
})

export const resetIsRecentCasesListDisplayedV2 = () => ({
    type: actionsTypes.RESET_IS_LIST_DISPLAYED_CLIENT_V2,
    payload: {
        displayed: true
    }
})

const loadingRecentCasesClientV2 = (clientId: string, serviceId: string) => ({
    type: actionsTypes.SET_LOADING_RECENT_CASES_CLIENT_V2,
    payload: {
        value: true,
        clientId,
        serviceId
    }
})

const loadedRecentCasesClientV2 = (clientId: string, serviceId: string) => ({
    type: actionsTypes.SET_LOADING_RECENT_CASES_CLIENT_V2,
    payload: {
        value: false,
        clientId,
        serviceId
    }
})

// TODO gerer le cas d'erreur en affichant un message (sachant que l'abscence de données n'est pas une erreur car il peut ne pas y avoir de dossiers récents)
const errorFetchingRecentCasesClientV2 = (clientId: string, serviceId: string, errorMessage) => ({
    type: actionsTypes.SET_LOADING_RECENT_CASES_CLIENT_V2,
    payload: {
        value: false,
        clientId,
        serviceId
    }
})

const saveRecentCasesClientV2 = (clientId: string, serviceId: string, casesList) => ({
    type: actionsTypes.SET_RECENT_CASES_CLIENT_V2,
    payload: {
        casesList,
        clientId,
        serviceId
    }
})

export const pushCaseToRecentCasesClientV2 = (aCase: Case) => ({
    type: actionsTypes.PUSH_CASE_TO_RECENT_CASES_CLIENT_V2,
    payload: {
        aCase,
        clientId: aCase.clientId,
        serviceId: aCase.serviceId
    }
})

export const StoreClientV2 = (client: ClientContextSliceState) => async (dispatch) => {
    dispatch(storeClientV2(client));
}

export const fetchAndStoreClientV2 = (clientId: string, serviceId: string, howToLoad: DataLoad) => async (dispatch) => {
    //dispatch(loadingClientV2(clientId, serviceId));
    const client: Client = await loadClientData(clientId, serviceId, howToLoad);
    dispatch(updateClientV2(client, serviceId));
}

export const fetchAlertsAndStoreClientV2 = (clientId: string, serviceId: string, isMobileService: boolean) => async (dispatch) => {
    // dispatch(loadingClientV2(clientId, serviceId));
    const alerts: Alert[] = await loadAlertData(clientId, serviceId, isMobileService);
    dispatch(setAlertForClient(clientId, serviceId, alerts));
};

export const fetchBillsAndStoreClientV2 = (billingAccountId: string, refSiebel: string | undefined, isMobileService: boolean) => async (dispatch) => {
    // dispatch(loadingClientV2(clientId, serviceId));
    const bills: BillingInformation | undefined = await loadBillsData(billingAccountId, refSiebel, isMobileService);
    dispatch(setBillsForClient(billingAccountId, refSiebel, bills));
};

export const fetchLandedConsumptionAndStoreClientV2 = (refClient: string) => async (dispatch) => {
    // dispatch(loadingClientV2(clientId, serviceId));
    const currentConsumption: CurrentLandedConsumption | undefined = await loadCurrentLandedConsumption(refClient);
    dispatch(setCurrentLandedConsumptionForClient(refClient, currentConsumption));
};

export const fetchMobileConsumptionAndStoreClientV2 = (serviceId: string) => async (dispatch) => {
    // dispatch(loadingClientV2(clientId, serviceId));
    const currentConsumption: CurrentMobileConsumption | undefined = await loadCurrentMobileConsumption(serviceId);
    dispatch(setCurrentMobileConsumptionForClient(serviceId, currentConsumption));
};

export const fetchMobileRenewalAndStoreClientV2 = (serviceId: string) => async (dispatch) => {
    // dispatch(loadingClientV2(clientId, serviceId));
    const mobileRenewal: MobileRenewalInfos | undefined = await loadMobileRenewal(serviceId);
    dispatch(setMobileRenewalForClient(serviceId, mobileRenewal));
};

export const fetchLandedPaymentFacilityAndStoreClientV2 = (siebelAccount: string) => async (dispatch) => {
    // dispatch(loadingClientV2(clientId, siebelAccount));
    const landedPaymentFacility: LandedPaymentFacilityInfos | undefined = await loadLandedPaymentFacility(siebelAccount);
    dispatch(setLandedPaymentFacilityForClient(siebelAccount, landedPaymentFacility));
};

export const setEquipmentBox4G = (boxInformation: BoxEquipment) => ({
    type: actionsTypes.SET_EQUIPMENT_BOX_4G,
    payload: boxInformation
})

// TDOO: can be removed if fetchAndStore is safe to be used
export const fetchAndUpdateCurrentClientV2 = (clientId: string, serviceId: string, howToLoad: DataLoad) => async (dispatch) => {
    //dispatch(loadingClientV2(clientId, serviceId));
    const client: Client = await loadClientData(clientId, serviceId, howToLoad);
    dispatch(updateCurrentClientV2(client, serviceId));
}

const loadCloseServices = async (clientId: string, serviceId: string)=>{
    try {
        return await clientService.searchCloseServices(clientId, serviceId)
    } catch (error) {
        NotificationManager.error("Erreur lors du chargement des services rapprochées");
        return []
    }
}

export const fetchAndStoreCloseServices = (clientId: string, serviceId: string) => async (dispatch) => {
    const services: CloseService[] = await loadCloseServices(clientId, serviceId);
    dispatch(updateCloseServices(clientId,services));
}