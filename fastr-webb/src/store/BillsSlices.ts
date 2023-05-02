import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "redux";
import {BillingInformation} from "../model/person/billing/BillingInformation";
import BillingService from "../service/BillingService";

const billingService: BillingService = new BillingService();

export interface BillsSliceState {
    loading: boolean
    data?: BillingInformation
    error?: string
}

const initialState: BillsSliceState = {
    data: undefined,
    loading: false,
    error: undefined,
};

const billsSlice = createSlice({
    name: "billsSlice",
    initialState,
    reducers: {
        billsLoading: (state) => {
            state.loading = true
            state.error = ""
        },
        billsLoadingSuccess: (state, action) => {
            state.data = action.payload
            state.loading = false
        },
        billsLoadingFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        }
    }
})

export const loadBills = (billingAccountId: string, refSiebel: string | undefined, isMobileService: boolean) => async (dispatch: Dispatch) => {
    dispatch(billsSlice.actions.billsLoading());
    try {
        const bills = await billingService.getBillingInfo(billingAccountId, refSiebel, isMobileService, false);
        dispatch(billsSlice.actions.billsLoadingSuccess(bills));
    } catch (error) {
        dispatch(billsSlice.actions.billsLoadingFailure(error))
    }
};

export default billsSlice
