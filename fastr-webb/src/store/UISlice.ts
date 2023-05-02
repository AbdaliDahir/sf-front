import {createSlice} from "@reduxjs/toolkit";
import {TabCategory} from "../model/utils/TabCategory";

export interface UIState {
    blockingUI: boolean
    isAddressChecked: boolean
    activeTab: ClientActiveTab[]
}
export interface ClientActiveTab {
    clientId: string
    activeTab: string
}
const initialClientActiveTab: ClientActiveTab = {
    clientId: 'default',
    activeTab : TabCategory.CASES
}
const initialState: UIState = {
    blockingUI: false,
    isAddressChecked: true,
    activeTab : [initialClientActiveTab]
};

const UISlice = createSlice({
    name: "ui",
    initialState: initialState,
    reducers: {
        toggleBlockingUI(state) {
            state.blockingUI = !state.blockingUI
        },
        setAddressToChecked(state) {
            state.isAddressChecked = true
        },
        setAddressToUnchecked(state) {
            state.isAddressChecked = false
        },
        setActiveTab(state, action) {
            state.activeTab = action.payload
        }
    }
});


export const {
    toggleBlockingUI,
    setAddressToChecked,
    setAddressToUnchecked,
    setActiveTab
} = UISlice.actions

export default UISlice
