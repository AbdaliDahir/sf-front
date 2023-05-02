import Order from "../../model/orders/Order";

export interface OrderContext {
    data?: Order
    loading: boolean
    error?: string
}


export interface OrderContextAction {
    loadOrder: (orderId: string) => void
}

export default interface OrderContextProps extends OrderContextAction {
    order: OrderContext
}
