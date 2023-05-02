import {createSlice, Dispatch} from "@reduxjs/toolkit";
import AlertService from "../service/AlertService";
import {Alert} from "../model/alert/Alert";

export interface AlertSliceState {
    alertsByPersonId?: Alert[];
    error: string | undefined;
    loading: boolean;
}

const initialAlertState: AlertSliceState = {
    alertsByPersonId: undefined,
    error: undefined,
    loading: false
}

const alertService: AlertService = new AlertService();

const alertSlice = createSlice({
    name: "alertSlice",
    initialState: initialAlertState,
    reducers: {
        alertLoading: (state) => {
            state.loading = true
            state.error = ''
        },

        getAlertsFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },

        getAlertsSuccess: (state, action) => {
            state.loading = false
            state.alertsByPersonId = action.payload
        }
    }
})

export const fetchAlerts = (personId: string, serviceId: string, isMobileService: boolean) => async (dispatch: Dispatch) => {
    dispatch(alertSlice.actions.alertLoading());
    try {
        const alerts = await alertService.getAlertsByClientId(personId, serviceId, isMobileService);
        dispatch(alertSlice.actions.getAlertsSuccess(alerts));
    } catch (error) {
        dispatch(alertSlice.actions.getAlertsFailure(error.toString()));
    }
};

export default alertSlice;
