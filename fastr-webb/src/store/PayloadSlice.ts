import {createSlice, Dispatch} from "@reduxjs/toolkit";

export interface PayloadSliceState {
    payload?
}

const initialPayloadState: PayloadSliceState = {
    payload: undefined
}

const payloadSlice = createSlice({
    name: "payloadSlice",
    initialState: initialPayloadState,
    reducers: {
        definePayload: (state, action) => {
            state.payload = action.payload
        },
    }
})

export const setPayload = (payload) => (dispatch: Dispatch) => {
    dispatch(payloadSlice.actions.definePayload(payload))
};

export default payloadSlice;
