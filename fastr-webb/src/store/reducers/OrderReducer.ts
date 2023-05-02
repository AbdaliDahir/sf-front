import Order from "../../model/orders/Order";
import {LOAD_ORDER_ERROR, LOAD_ORDER_LOADING, LOAD_ORDER_SUCCESS} from "../actions/OrderActions";

export interface OrderState {
    loading: boolean
    data: Order | undefined
    error?: string
}

export const initialState: OrderState = {
    loading: true,
    data: undefined,
    error: undefined
};

export function OrderReducer(
    state = initialState,
    // tslint:disable-next-line:no-any
    action: any
): OrderState {
    switch (action.type) {
        case LOAD_ORDER_LOADING:
            return {
                ...state,
                loading: true
            };
        case LOAD_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.data
            };
        case LOAD_ORDER_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        default:
            return state;
    }
}
