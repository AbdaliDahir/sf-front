import {createSlice, Dispatch} from "@reduxjs/toolkit";
import {ActivationFlag} from "../model/activationFlag/ActivationFlag";
import ActivationFlagService from "../service/ActivationFlagService";

export interface ActivationFlagSliceState {
    activationFlags?: ActivationFlag[];
    error: string | undefined;
    loading: boolean;
}

const initialActivationFlagState: ActivationFlagSliceState = {
    activationFlags: undefined,
    error: undefined,
    loading: false
}

const activationFlagService: ActivationFlagService = new ActivationFlagService();

const activationFlagSlice = createSlice({
    name: "activationFlagSlice",
    initialState: initialActivationFlagState,
    reducers: {
        activationFlagLoading: (state) => {
            state.loading = true
            state.error = ''
        },

        getActivationFlagsFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },

        getActivationFlagsSuccess: (state, action) => {
            state.loading = false
            state.activationFlags = action.payload
        }
    }
})

export const fetchActivationFlags = () => async (dispatch: Dispatch) => {
    dispatch(activationFlagSlice.actions.activationFlagLoading());
    try {
        const activationFlags = await activationFlagService.getAllActivationFlag();
        dispatch(activationFlagSlice.actions.getActivationFlagsSuccess(activationFlags));
    } catch (error) {
        dispatch(activationFlagSlice.actions.getActivationFlagsFailure(error.toString()));
    }
};

export default activationFlagSlice;
