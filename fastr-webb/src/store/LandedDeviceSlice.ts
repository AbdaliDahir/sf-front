import {createSlice} from "@reduxjs/toolkit";
import {Dispatch} from "redux";
import ClientService from "../service/ClientService";
import {Devices} from "../model/service/Devices";

const clientService: ClientService = new ClientService();

export interface LandedDeviceSliceState {
    loading: boolean
    data?: Devices
    error?: string
}

const initialState: LandedDeviceSliceState = {
    data: undefined,
    loading: false,
    error: undefined,
};

const landedDeviceSlice = createSlice({
    name: "landedDeviceSlice",
    initialState,
    reducers: {
        devicesLoading: (state) => {
            state.loading = true
            state.error = ""
        },
        devicesLoadingSuccess: (state, action) => {
            state.data = action.payload
            state.loading = false
        },
        devicesLoadingFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        }
    }
})

export const fetchLandedDevices = (refSiebel: string | undefined) => async (dispatch: Dispatch) => {
    dispatch(landedDeviceSlice.actions.devicesLoading());
    try {
        const devices = await clientService.getAllLandedDevices(refSiebel);
        dispatch(landedDeviceSlice.actions.devicesLoadingSuccess(devices));
    } catch (error) {
        dispatch(landedDeviceSlice.actions.devicesLoadingFailure(error))
    }
};

export default landedDeviceSlice
