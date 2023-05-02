import * as actionsType from "./actionsTypes";
import ActService from "../../service/ActService";
import {Setting} from "../../model/acts/Setting";
import {AntiChurnClientProposal} from "../../model/acts/antichurn/AntiChurnClientProposal";

const actService = new ActService(true);

export const fetchAndStoreAntiChurnSettings = () => {
    return async dispatch => {
        dispatch(fetchingAntiChurnSetting())
        try {
            const antiChurnSetting: Setting<Array<AntiChurnClientProposal>> = await actService.getAntiChurnSetting("antichurnAct")
            const antiChurnSettingAsKeyValue: Map<string, string> = new Map()

            antiChurnSetting.settingDetail.
                forEach(antiChurnClientProposal => {
                    antiChurnSettingAsKeyValue.set(antiChurnClientProposal.code, antiChurnClientProposal.label)
                    antiChurnClientProposal.actType
                        .sort((a,b)=> a.label.localeCompare(b.label))
                        .forEach((actType) => {
                            antiChurnSettingAsKeyValue.set(actType.code, actType.label)
                            if(actType.detail){
                                actType.detail
                                    .sort((a, b) => a.label.localeCompare(b.label))
                                    .forEach((detail) => antiChurnSettingAsKeyValue.set(detail.code, detail.label))
                            }
                        })
                } )
            dispatch(storeAntiChurnSetting(antiChurnSetting.settingDetail, antiChurnSettingAsKeyValue))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingAntiChurnSetting(error.message))
            throw e
        }
    }
}

const fetchingAntiChurnSetting = () => (
    {
        type: actionsType.FETCH_ANTICHURN_SETTING,
    }
)

const storeAntiChurnSetting = (antiChurnSetting: Array<AntiChurnClientProposal>, antiChurnSettingAsKeyValue: Map<string, string>) => (
    {
        type: actionsType.STORE_ANTICHURN_SETTING,
        payload: {settingMongo: antiChurnSetting, settingAsKeyValue: antiChurnSettingAsKeyValue}
    }
)

const errorFetchingAntiChurnSetting = (err) => (
    {
        type: actionsType.ERROR_FETCHING_ANTICHURN_SETTING,
        payload: err
    }
)