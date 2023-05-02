import {createSlice, Dispatch} from "@reduxjs/toolkit";
import {CloseService, Service} from "../model/service";
import {CurrentMobileConsumption} from "../model/service/consumption/CurrentMobileConsumption";
import {CurrentLandedConsumption} from "../model/service/consumption/CurrentLandedConsumption";
import {MobileRenewalInfos} from "../model/service/MobileRenewalInfos";
import {LandedPaymentFacilityInfos} from "../model/service/LandedPaymentFacility";
import ClientService from "../service/ClientService";
import {Client} from "../model/person";
import {Consumption} from "../model/service/consumption/MobileConsumption";
import { NextRenewalDate } from "src/model/service/NextRenewalDate";
import {Alert} from "../model/alert/Alert";
import {BillingInformation} from "../model/person/billing/BillingInformation";
import {RecentCaseState} from "./reducers/v2/case/RecentCasesReducerV2";
import { EquipmentType } from "src/model/equipment/EquipmentType";

export interface ClientContextSliceState {
    loading: boolean
    consumptionLoading: boolean
    currentConsumptionLoading: boolean
    currentLandedConsumptionLoading: boolean
    renewalLoading: boolean
    landedPaymentFacilityLoading: boolean
    clientData?: Client
    error?: string
    serviceId?: string
    service?: Service
    siebelAccount?: string
    consumption?: Consumption
    currentConsumption?: CurrentMobileConsumption | null
    currentLandedConsumption?: CurrentLandedConsumption | null
    renewalData?: MobileRenewalInfos
    nextRenewalDate?: NextRenewalDate
    landedPaymentFacilityData?: LandedPaymentFacilityInfos[]
    alerts: Alert[]
    bills?: BillingInformation
    recentCases: RecentCaseState
    equipment: EquipmentType | undefined,
    closeServices: CloseService[]
}

export const initialStateRecentCase: RecentCaseState = {
    casesList: [],
    loading: false,
    isRecentCasesListDisplayed: true,
    isMatchingCaseModalDisplayed: false,
    selectedCase: ""
};

const initialClientState: ClientContextSliceState = {
    loading: false,
    consumptionLoading: false,
    currentConsumptionLoading: false,
    currentLandedConsumptionLoading: false,
    renewalLoading: false,
    landedPaymentFacilityLoading: false,
    clientData: undefined,
    error: undefined,
    serviceId: undefined,
    service: undefined,
    siebelAccount: undefined,
    consumption: undefined,
    currentConsumption: undefined,
    currentLandedConsumption: undefined,
    renewalData: undefined,
    nextRenewalDate: undefined,
    landedPaymentFacilityData: undefined,
    alerts: [],
    bills: undefined,
    recentCases: initialStateRecentCase,
    equipment: undefined,
    closeServices: []
};

export enum DataLoad {
    ALL_SERVICES,
    ONE_SERVICE,
    ALL_SERVICES_LIGHT
}

const clientService: ClientService = new ClientService();

const clientSlice = createSlice({
    name: "clientSlice",
    initialState: initialClientState,
    reducers: {
        clientLoading: (state) => {
            state.loading = true
            state.error = ''
        },

        clientLoadingFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },

        resetClient: (state) => {
            state.loading = true
            state.clientData = undefined
        },

        // Load client with all his services (ALL_SERVICES)

        clientsLoadingSuccess: (state, action) => {
            state.clientData = action.payload
            state.loading = false
        },

        // Load client with only the service asked (ONE_SERVICE)

        clientLoadingSuccess: (state, action) => {
            state.clientData = action.payload
            state.loading = false
            state.serviceId = action.payload.serviceId
            state.service = action.payload.services.find((e) => e.id === action.payload.serviceId)
        },

        clientNextRenewalDateLoadingSuccess: (state, action) => {
            state.nextRenewalDate = action.payload
        },

        // Loading Current Consumption
        currentConsumptionLoading: (state) => {
            state.currentConsumptionLoading = true
            state.currentConsumption = undefined
        },

        currentConsumptionLoadingSuccess: (state, action) => {
            state.currentConsumptionLoading = false
            state.currentConsumption = action.payload
        },

        currentConsumptionLoadingFailure: (state, action) => {
            state.currentConsumptionLoading = false
            state.currentConsumption = null
            state.error = action.payload
        },

        // Loading Current Landed Consumption
        currentLandedConsumptionLoading: (state) => {
            state.currentLandedConsumptionLoading = true
            state.currentLandedConsumption = undefined
        },

        currentLandedConsumptionLoadingSuccess: (state, action) => {
            state.currentLandedConsumptionLoading = false
            state.currentLandedConsumption = action.payload
        },

        currentLandedConsumptionLoadingFailure: (state, action) => {
            state.currentLandedConsumptionLoading = false
            state.currentLandedConsumption = null
            state.error = action.payload
        },

        // Loading Consumption
        consumptionLoading: (state) => {
            state.consumptionLoading = true
            state.consumption = undefined
        },

        consumptionLoadingSuccess: (state, action) => {
            state.consumptionLoading = false
            state.consumption = action.payload
        },

        consumptionLoadingFailure: (state, action) => {
            state.consumptionLoading = false
            state.error = action.payload
        },


        // Loading Renewal
        renewalLoading: (state) => {
            state.renewalLoading = true
        },

        renewalLoadingSuccess: (state, action) => {
            state.renewalLoading = false
            state.renewalData = action.payload
        },

        renewalLoadingFailure: (state, action) => {
            state.renewalLoading = false
            state.error = action.payload
        },

        // Loading LandedPaymentFacilities
        landedPaymentFacilityLoading: (state) => {
            state.landedPaymentFacilityLoading = true
        },

        landedPaymentFacilitySuccess: (state, action) => {
            state.landedPaymentFacilityLoading = false
            state.landedPaymentFacilityData = action.payload
        },

        landedPaymentFacilityFailure: (state, action) => {
            state.landedPaymentFacilityLoading = false
            state.error = action.payload
        }
    }
});

const loadClientData = async (idPerson: string, idService: string, howToLoad: DataLoad, forDisRc: boolean) => {
    switch (howToLoad) {
        case DataLoad.ALL_SERVICES:
            return await clientService.getClientWithAllServices(idPerson, forDisRc);
        case DataLoad.ALL_SERVICES_LIGHT:
            return await clientService.getClientWithAllServices(idPerson, forDisRc);
        case DataLoad.ONE_SERVICE:
            return await clientService.getClientByServiceId(idPerson, idService, forDisRc);
    }
}

const loadNextRenewalDate = async (idSiebel, numeroLigne) => {
    return await clientService.getNextRenewalDate({ "idSiebel": idSiebel, "numeroLigne": numeroLigne });
}

const loadMobileConsumption = async (idService: string, monthsCursor: number) => {
    return await clientService.getMobileConsumption(idService, monthsCursor);
}

const loadCurrentMobileConsumption = async (idService: string) => {
    return await clientService.getCurrentMobileConsumption(idService);
}

const loadCurrentLandedConsumption = async (refClient: string) => {
    return await clientService.getCurrentLandedConsumption(refClient);
}

const loadMobileRenewal = async (idService: string) => {
    return await clientService.getMobileRenewal(idService);
}

const loadLandedPaymentFacility = async (siebelAccount: string) => {
    return await clientService.getLandedPaymentFacilities(siebelAccount);
}


export const fetchClient = (
    clientId: string,
    serviceId: string,
    howToLoad: DataLoad,
    forDisRc: boolean,
    fetchNextRenewalDate: boolean = false
) => (dispatch: Dispatch) => {
    dispatch(clientSlice.actions.clientLoading());
    loadClientData(clientId, serviceId, howToLoad, forDisRc).then(
        data => {
            const clientInfo = { ...data, serviceId };
            dispatch(clientSlice.actions.clientLoadingSuccess(clientInfo));

            if (fetchNextRenewalDate) {
                const service = clientInfo.services.find((e) => e.id === clientInfo.serviceId);
                loadNextRenewalDate(service!.siebelAccount, service!.ndi).then(nextRenewalDate => {
                    dispatch(clientSlice.actions.clientNextRenewalDateLoadingSuccess(nextRenewalDate));
                });
            }
        },
        error =>
            dispatch(clientSlice.actions.clientLoadingFailure(error.message || "Unexpected Error!!!1"))
    );
};

export const fetchMobileRenewal = (serviceId: any) => (dispatch: Dispatch) => {
    dispatch(clientSlice.actions.renewalLoading());
    loadMobileRenewal(serviceId)
        .then(
            data => {
                const renewal = {...data, serviceId};
                dispatch(clientSlice.actions.renewalLoadingSuccess(renewal))
            },
            error =>
                dispatch(clientSlice.actions.renewalLoadingFailure(error.message || "Unexpected Error!!!2"))
        );
};

export const fetchLandedPaymentFacility = (siebelAccount: any) => (dispatch: Dispatch) => {
    dispatch(clientSlice.actions.landedPaymentFacilityLoading());
    loadLandedPaymentFacility(siebelAccount)
        .then(
            data => {
                const LandedPaymentFacility = data;
                dispatch(clientSlice.actions.landedPaymentFacilitySuccess(LandedPaymentFacility))
            },
            error =>
                dispatch(clientSlice.actions.landedPaymentFacilityFailure(error.message || "Unexpected Error!!!3"))
        );
};

export const fetchCurrentMobileConsumption = (serviceId: string) => (dispatch: Dispatch) => {
    dispatch(clientSlice.actions.currentConsumptionLoading());
    loadCurrentMobileConsumption(serviceId)
        .then(
            data => {
                const consumption = {...data, serviceId};
                dispatch(clientSlice.actions.currentConsumptionLoadingSuccess(consumption))
            },
            error =>
                dispatch(clientSlice.actions.currentConsumptionLoadingFailure(error.message || "Unexpected Error!!!4"))
        );
};

export const fetchCurrentLandedConsumption = (refClient: string) => (dispatch: Dispatch) => {
    dispatch(clientSlice.actions.currentLandedConsumptionLoading());
    loadCurrentLandedConsumption(refClient)
        .then(
            data => {
                const consumptionLanded = {...data, refClient};
                dispatch(clientSlice.actions.currentLandedConsumptionLoadingSuccess(consumptionLanded))
            },
            error =>
                dispatch(clientSlice.actions.currentLandedConsumptionLoadingFailure(error.message || "Unexpected Error!!!5"))
        );
};

export const fetchMobileConsumption = (serviceId: string, monthsCursor: number = 0) => (dispatch: Dispatch) => {
    dispatch(clientSlice.actions.consumptionLoading());
    loadMobileConsumption(serviceId, monthsCursor)
        .then(
            data => {
                const consumption = {...data, serviceId};
                dispatch(clientSlice.actions.consumptionLoadingSuccess(consumption))
            },
            error =>
                dispatch(clientSlice.actions.consumptionLoadingFailure(error.message || "Unexpected Error!!!6"))
        );
};

export default clientSlice
