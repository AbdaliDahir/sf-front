import * as actionsType from "./actionsTypes";
import ActService from "../../service/ActService";
import {Setting} from "../../model/acts/Setting";
import {BillingsSettings} from "../../model/acts/duplicate-billing/BillingsSettings";

const actService = new ActService(true);

export const fetchAndStoreBillingsSettings = () => {
    return async dispatch => {
        dispatch(fetchingBillingsSettings())
        try {
            const billingSettings: Setting<BillingsSettings> = await actService.getBillingsSettings("billingsSettings")
            dispatch(storeBillingsSettings(billingSettings.settingDetail))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingBillingsSetting(error.message))
            throw e
        }
    }
}

const fetchingBillingsSettings = () => (
    {
        type: actionsType.FETCH_BILLINGS_SETTING,
    }
)

const storeBillingsSettings = (billingsSettings: BillingsSettings) => (
    {
        type: actionsType.STORE_BILLINGS_SETTING,
        payload: billingsSettings
    }
)

const errorFetchingBillingsSetting = (err) => (
    {
        type: actionsType.ERROR_FETCHING_BILLINGS_SETTING,
        payload: err
    }
)