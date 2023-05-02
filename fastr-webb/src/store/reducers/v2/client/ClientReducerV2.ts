import * as actionTypes from "../../../actions/v2/client/ClientActionsTypes";
import {ActionType} from "../../../actions/v2/common/ActionType";
import {ClientContextSliceState, initialStateRecentCase} from "../../../ClientContextSlice";
import {Case} from "../../../../model/Case";
import {CaseListsSetting} from "../../../../model/CaseListsSetting";
import * as actionsTypes from "../../../actions/v2/case/RecentCasesActionsTypes";

export interface ClientState {
    currentClient: ClientContextSliceState | undefined,
    loadedClients: ClientContextSliceState[],
    errors: string[],
    isServiceInLists: CaseListsSetting | undefined,
}

const initialState: ClientState = {
    currentClient: undefined,
    loadedClients: [],
    errors: [],
    isServiceInLists: undefined,
};

export function ClientReducerV2(state = initialState, action: ActionType): ClientState {

    let targetClient = state.loadedClients.find(c => c.service?.id === action.payload?.serviceId && c.clientData?.id === action.payload?.clientId);

    if (actionTypes.STORE_CLIENT_V2 === action.type) {
        targetClient = state.loadedClients.find(c => c.service?.id === action.payload.client?.serviceId && c.clientData?.id === action.payload.client?.clientData?.id);
    }
    if ([actionTypes.STORE_OR_UPDATE_CLIENT_V2, actionTypes.STORE_AND_UPDATE_CURRENT_CLIENT_V2].includes(action.type)) {
        targetClient = state.loadedClients.find(c => c.service?.id === action.payload.serviceId && c.clientData?.id === action.payload.clientData?.id);
    }

    switch (action.type) {
        case actionTypes.STORE_CLIENT_V2:
            if ( action.payload.client && !targetClient) {
                state.loadedClients.push({
                    ...action.payload.client,
                    recentCases: {...initialStateRecentCase},
                    closeServices: []
                });
            }
            return {
                ...state,
                loadedClients: [...state.loadedClients]
            }
        case actionTypes.STORE_OR_UPDATE_CLIENT_V2:
            if ( !targetClient ) {
                state.loadedClients.push({ ...action.payload,
                    recentCases: {...initialStateRecentCase},
                    service: action.payload.clientData.services.find((e) => e.id === action.payload.serviceId)
                });
            } else {
                targetClient.clientData = action.payload.clientData;
                targetClient.loading = false;
                targetClient.serviceId = action.payload.serviceId;
                targetClient.service = action.payload.clientData.services.find((e) => e.id === action.payload.serviceId);
            }
            return {
                ...state,
                loadedClients: [...state.loadedClients]
            }
        case actionTypes.STORE_AND_UPDATE_CURRENT_CLIENT_V2:
            if ( !targetClient ) {
                state.loadedClients.push({ ...action.payload,
                    recentCases: {...initialStateRecentCase},
                    service: action.payload.clientData.services.find((e) => e.id === action.payload.serviceId)
                });
            } else {
                targetClient.clientData = action.payload.clientData;
                targetClient.loading = false;
                targetClient.serviceId = action.payload.serviceId;
                targetClient.service = action.payload.clientData.services.find((e) => e.id === action.payload.serviceId);
            }
            const newCurrent = state.loadedClients[state.loadedClients.length-1]
            return {
                ...state,
                loadedClients: [...state.loadedClients],
                currentClient: newCurrent
            }
        case actionTypes.FETCH_AND_STORE_CLOSE_SERVICES:
            const loadedClients = state.loadedClients.map(item=>{
                if(item.clientData?.id===action.payload.clientId){
                    return {...item,closeServices: action.payload.closeServices}
                }
                return item;
            })
            return {
                ...state,
                loadedClients
            }
        case actionTypes.LOADING_CLIENT_V2:
            if (targetClient) {
                targetClient.loading = true
            }
            return {
                ...state
            }
        case actionTypes.IS_SERVICE_IN_LISTS:
            return {
                ...state ,
                isServiceInLists : {
                    ...action.payload
                }
            };
        case actionTypes.REMOVE_CLIENT_V2:
            state.loadedClients.splice(state.loadedClients.findIndex(c => c.serviceId === action.payload.serviceId  && c.clientData?.id === action.payload.clientId), 1);
            if ( state.currentClient?.clientData?.id === action.payload.clientId && state.currentClient?.serviceId === action.payload.serviceId ) {
                state.currentClient = undefined;
            }
            return {
                ...state,
                loadedClients: [...state.loadedClients]
            }
        case actionTypes.SELECT_CLIENT_V2:
            state.currentClient = targetClient;
            return {
                ...state
            }
            break;
        case actionTypes.SET_ALERTS_CLIENT_V2:
            if(targetClient) {
                targetClient.alerts = action?.payload?.alerts;
                targetClient.loading = false
            }
            return {
                ...state
            }
            break;
        case actionTypes.SET_BILLS_CLIENT_V2:
            if(action?.payload?.billingAccountId) {
                state.loadedClients.forEach(c => {
                    if (c.service?.billingAccount.id === action.payload.billingAccountId && c.service?.siebelAccount === action.payload?.refSiebel) {
                        c.bills = action?.payload?.bills;
                        c.loading = false
                    }
                })
                return {
                    ...state
                }
            }
            break;
        case actionTypes.SET_CURRENT_MOBILE_CONSUMPTION_CLIENT_V2:
            if(action?.payload?.currentConsumption) {
                state.loadedClients.forEach(c => {
                    if (c.service?.id === action.payload.serviceId) {
                        c.currentConsumption = action?.payload?.currentConsumption;
                        c.loading = false
                    }
                })
                return {
                    ...state
                }
            }
            break;
        case actionTypes.SET_CURRENT_LANDED_CONSUMPTION_CLIENT_V2:
            if(action?.payload?.currentConsumption) {
                state.loadedClients.forEach(c => {
                    if (c.service?.siebelAccount === action.payload.refClient) {
                        c.currentLandedConsumption = action?.payload?.currentConsumption;
                        c.loading = false
                    }
                })
                return {
                    ...state
                }
            }
            break;
        case actionTypes.SET_MOBILE_RENEWAL_CLIENT_V2:
            if(action?.payload?.mobileRenewal) {
                state.loadedClients.forEach(c => {
                    if (c.service?.id === action.payload.serviceId) {
                        c.renewalData = action.payload.mobileRenewal
                        c.loading = false
                    }
                })
                return {
                    ...state
                }
            }
            break;
        case actionTypes.SET_LANDED_PAYMENT_FACILITY_CLIENT_V2:
            if(action?.payload?.landedPaymentFacilityData) {
                state.loadedClients.forEach(c => {
                    if (c.service?.id === action.payload.serviceId) {
                        c.landedPaymentFacilityData = action.payload.landedPaymentFacilityData
                        c.loading = false
                    }
                })
                return {
                    ...state
                }
            }
            break;
        case actionTypes.SET_RECENT_CASES_CLIENT_V2:
            if ( targetClient ) {
                targetClient.recentCases = { ...targetClient.recentCases, casesList: action.payload.casesList };
            }
            return {
                ...state
            }
        case actionsTypes.SET_SELECTED_CASE_V2:
            if (targetClient) {
                targetClient.recentCases = { ...targetClient.recentCases, selectedCase: action.payload.caseId}
            }
            return { ...state }
        case actionTypes.PUSH_CASE_TO_RECENT_CASES_CLIENT_V2:
            if ( targetClient ) {
                const updatedCase: Case = action.payload.aCase;
                const {recentCases} = targetClient;
                let updatedList = [...recentCases.casesList];
                const indexOfModifiedCase = recentCases.casesList.map((casee) => casee.caseId).indexOf(updatedCase.caseId);
                if (indexOfModifiedCase !== -1) {
                    updatedList[indexOfModifiedCase] = updatedCase;
                } else {
                    updatedList = [updatedCase, ...updatedList];
                }
                // order by date ?
                targetClient.recentCases = {...recentCases, casesList: updatedList};
                return {
                    ...state,
                }
            }
            break;
        case actionTypes.SET_LOADING_RECENT_CASES_CLIENT_V2:
            if (targetClient) {
                const {recentCases} = targetClient;
                targetClient.recentCases = {...recentCases, loading: action.payload?.value};
                return {
                    ...state
                }
            }
            break;
        case actionTypes.RESET_IS_LIST_DISPLAYED_CLIENT_V2:
            if (action.payload.displayed) {
                state.loadedClients.forEach(client => client.recentCases.isRecentCasesListDisplayed = action.payload.displayed)
                return {
                    ...state
                }
            }
            break;
        case actionTypes.SET_IS_LIST_DISPLAYED_CLIENT_V2:
            if (targetClient) {
                const {recentCases} = targetClient;
                targetClient.recentCases = {...recentCases, isRecentCasesListDisplayed: action.payload.displayed};
                return {
                    ...state
                }
            }
            break
        case actionTypes.SET_EQUIPMENT_BOX_4G:
            if(action?.payload) {
                state.loadedClients.forEach(c => {
                    if (c.service?.id === action.payload.serviceId) {
                        c.equipment = {...c.equipment, box4G : { ...action.payload}};
                        c.loading = false
                    }
                })
                return {
                    ...state
                }
            }
        default:
            break;
    }

    return state;
}
