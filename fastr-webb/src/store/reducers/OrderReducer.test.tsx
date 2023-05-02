import {cleanup} from '@testing-library/react';
import * as Reducer from "../reducers/OrderReducer"
import * as OrderActions from "../actions/OrderActions";
// mock the service
import OrderService from "../../service/OrderService"
import Order from "../../model/orders/Order";

jest.mock("../../service/OrderService");


afterEach(cleanup)

describe("Order Reducer tests", () => {

    const mockedOrderService = new OrderService();

    it('should return the initial state', () => {
        expect(Reducer.initialState).toEqual({
            loading: true,
            data: undefined,
            error: undefined
        });
    });

    it('should change loading from false to true', () => {
        expect(Reducer.OrderReducer(Reducer.initialState, {type: OrderActions.LOAD_ORDER_SUCCESS}))
            .toEqual({
                loading: false,
                data: undefined,
                error: undefined
            })
    });

    it("should test a service call mock via order actions", async (done) => {
        const p: Promise<Order> = Promise.resolve({} as Order);
        const spy = jest.spyOn(mockedOrderService, "getOrder");
        spy.mockReturnValueOnce(p);
        // call the method you want to test
        OrderActions.fetchAndStoreOrder("mockedId");
        p.then(()=>done());
        // expect the mock to have been called
        expect(spy.mock.calls.length).toBe(1);
        spy.mockRestore();
    });
})