import {
    LOAD_BILLS_ERROR,
    LOAD_BILLS_LOADING,
    LOAD_BILLS_SUCCESS,
    LOAD_CLIENT_CASES_ERROR,
    LOAD_CLIENT_CASES_LOADING,
    LOAD_CLIENT_CASES_SUCCESS,
    LOAD_CLIENT_ERROR,
    LOAD_CLIENT_LOADING,
    LOAD_CLIENT_SUCCESS,
    LOAD_COMMUNICATIONS_LOADING,
    LOAD_COMMUNICATIONS_SUCCESS,
    LOAD_COMMUNICATIONS_ERROR
} from "../actions/ClientContextActions"
import {ClientContext} from "../types/ClientContext"
import {Service} from "../../model/service";

const initialState: ClientContext<Service> = {
    data: undefined,
    loading: true,
    fetching: false,
    error: undefined,
    serviceId: undefined,
    service: undefined
};

// tslint:disable-next-line:no-any
export default function fetchClientReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_CLIENT_LOADING:
            return {
                ...state,
                loading: true,
                fetching: true,
                error: ''
            };

        case LOAD_CLIENT_SUCCESS:
            return {
                ...state,
                data: action.data,
                loading: false,
                fetching: false,
                serviceId: action.serviceId,
                service: action.data.services.find((e) => e.id === action.serviceId)
            };
        case LOAD_CLIENT_ERROR:
            return {
                ...state,
                loading: false,
                fetching: false,
                error: action.error
            };

        default:
            return state;
    }
}

// tslint:disable-next-line:no-any
export function fetchCasesReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_CLIENT_CASES_LOADING:
            return {
                ...state,
                loading: true,
                fetching: true,
                error: ''
            };

        case LOAD_CLIENT_CASES_SUCCESS:
            return {
                ...state,
                data: action.data.content,
                loading: false,
                fetching: false,
                currentPage: action.data.number,
                totalPages: action.data.totalPages,
                totalElements: action.data.totalElements,
            };
        case LOAD_CLIENT_CASES_ERROR:
            return {
                ...state,
                loading: false,
                fetching: false,
                error: action.error
            };

        default:
            return state;
    }
}


// tslint:disable-next-line:no-any
export function fetchBillsReducer(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_BILLS_LOADING:
            return {
                ...state,
                loading: true,
                fetching: true,
                error: ''
            };

        case LOAD_BILLS_SUCCESS:
            return {
                ...state,
                data: action.data,
                loading: false,
                fetching: false,
            };
        case LOAD_BILLS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
                fetching: false,
            };

        default:
            return state;
    }
}

// tslint:disable-next-line:no-any
export function fetchCommunications(state = initialState, action: any) {
    switch (action.type) {
        case LOAD_COMMUNICATIONS_LOADING:
            return {
                ...state,
                loading: true,
                error: ''
            };

        case LOAD_COMMUNICATIONS_SUCCESS:
            return {
                ...state,
                data: action.data,
                loading: false,
            };
        case LOAD_COMMUNICATIONS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            };

        default:
            return state;
    }
}

