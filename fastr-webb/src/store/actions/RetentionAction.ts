import * as actionsType from "./actionsTypes";
import {RetentionSetting} from "../../model/acts/retention/RetentionSetting";
import ActService from "../../service/ActService";
import {Setting} from "../../model/acts/Setting";
import {RetentionIneligibilityCausesSetting} from "../../model/acts/retention/RetentionIneligibilityCausesSetting";

const actService = new ActService(true);
export const fetchAndStoreRetentionSettings = () => {
    return async dispatch => {
        dispatch(fetchingRetentionSetting())
        try {
            const retentionSetting: Setting<RetentionSetting> = await actService.getRetentionSetting("retentionSetting")
            // sort motifs/sous motifs by label
            retentionSetting.settingDetail.retentionMotifs
                .sort((a, b) => a.motif.label.localeCompare(b.motif.label))
                .forEach(motif => {
                    motif.sousMotifs?.sort((a, b) => a.label.localeCompare(b.label))
                })
            dispatch(storeRetentionSetting(retentionSetting.settingDetail))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingRetentionSetting(error.message))
            throw e
        }
    }
}

export const fetchAndStoreRetentionRefusSettings = () => {
    return async dispatch => {
        dispatch(fetchingRetentionSetting())
        try {
            const retentionRefusSetting = await actService.getRetentionSetting("retentionRefusSetting")

            // sort motifs/sous motifs by label
            retentionRefusSetting.settingDetail.retentionMotifs
                .sort((a, b) => a.motif.label.localeCompare(b.motif.label))
                .forEach(motif => {
                    motif.sousMotifs?.sort((a, b) => a.label.localeCompare(b.label))
                })
            dispatch(storeRetentionRefusSetting(retentionRefusSetting.settingDetail))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingRetentionSetting(error.message))
            throw e
        }
    }
}

export const fetchAndStoreRetentionIneligibilityCausesSettings = () => {
    return async dispatch => {
        dispatch(fetchingRetentionSetting())
        try {
            const retentionIneligibilityCauses: Setting<RetentionIneligibilityCausesSetting> = await actService.getRetentionIneligibilityCausesSetting()
            retentionIneligibilityCauses.settingDetail.ineligibilityCauses
                .sort((a, b) => a.label.localeCompare(b.label))
            dispatch(storeRetentionIneligibilityCausesSetting(retentionIneligibilityCauses.settingDetail))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingRetentionSetting(error.message))
            throw e
        }
    }
}

const fetchingRetentionSetting = () => (
    {
        type: actionsType.FETCH_RETENTION_SETTING,
    }
)

const storeRetentionSetting = (retentionSetting: RetentionSetting) => (
    {
        type: actionsType.STORE_RETENTION_SETTING,
        payload: retentionSetting
    }
)

const storeRetentionRefusSetting = (retentionRefusSetting: RetentionSetting) => (
    {
        type: actionsType.STORE_RETENTION_REFUS_SETTING,
        payload: retentionRefusSetting
    }
)

const storeRetentionIneligibilityCausesSetting = (retentionSetting: RetentionIneligibilityCausesSetting) => (
    {
        type: actionsType.STORE_RETENTION_INELIGIBILITY_CAUSES_SETTING,
        payload: retentionSetting
    }
)

const errorFetchingRetentionSetting = (err) => (
    {
        type: actionsType.ERROR_FETCHING_RETENTION_SETTING,
        payload: err
    }
)