// Components
import AbstractService from "./AbstractService";
import Order from "../model/orders/Order";

export default class OrderService extends AbstractService {

    constructor() {
        super(false);
    }

    public async getOrder(orderId: string) {
        return this.get<Order>(`/fastr-orders/orders/${orderId}/`);
    }

}
