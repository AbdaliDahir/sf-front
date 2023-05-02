import React from 'react';
import {cleanup, render} from '@testing-library/react';
import OrderPlan from "./OrderPlan";
import {Provider} from "react-redux";
import configureStore from 'redux-mock-store'
import {IntlProvider} from 'react-intl';

afterEach(cleanup)

const mockStore = configureStore([]);

describe("OrderPlan Tests", () => {

    it("renders with values given in props", () => {

        const modifiedState = {
            order: {
                data: {
                    plan: {
                        offerName: "off",
                        offerDetails: "offDetails",
                        commitmentMonths: 3,
                        portabilityDate: new Date(10).toISOString(),
                        portabilityHour: "12",
                        portabilityMsisdn: "1234567"
                    },
                    recurrentPrice: "10",
                    currency: "balles"
                }
            }
        }

        const store = mockStore(modifiedState);

        const {getByText} = render(
            <Provider store={store}>
                <IntlProvider>
                    <OrderPlan/>
                </IntlProvider>
            </Provider>
        );
        expect(getByText(/Pendant/i).textContent).toBe("Pendant 3 mois ");
    });

})