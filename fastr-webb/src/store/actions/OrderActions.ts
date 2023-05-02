import Order from "../../model/orders/Order";
import OrderService from "../../service/OrderService";
import {Dispatch} from "redux";

export const LOAD_ORDER_LOADING = 'REDUX_THUNK_LOAD_ORDER_LOADING';
export const LOAD_ORDER_SUCCESS = 'REDUX_THUNK_LOAD_ORDER_SUCCESS';
export const LOAD_ORDER_ERROR = 'REDUX_THUNK_LOAD_ORDER_ERROR';

const orderService: OrderService = new OrderService();

const loadOrder = async (orderId: string): Promise<Order> => {
    return await orderService.getOrder(orderId);
};

export const fetchAndStoreOrder = (orderId: string) => (dispatch: Dispatch) => {
    dispatch({type: LOAD_ORDER_LOADING});
    loadOrder(orderId)
        .then(
            data => dispatch({type: LOAD_ORDER_SUCCESS, data}),
            error => dispatch({type: LOAD_ORDER_ERROR, error: error.message || 'Unexpected Error!!!10'})
        )
};
