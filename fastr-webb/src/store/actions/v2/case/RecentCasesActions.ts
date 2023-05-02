import * as actionsTypes from "./RecentCasesActionsTypes";
import CaseService from "../../../../service/CaseService";
import {Case} from "../../../../model/Case";

const caseService: CaseService = new CaseService(true);

export const fetchRecentCasesV2 = (idClient: string, idService: string, fromDisrc: boolean) => {
    return async dispatch => {
        dispatch(loadingRecentCasesV2())
        try {
            const retrievedRecentCases: Case[] = await caseService.getRecentCasesList(idClient, encodeURIComponent(idService), !fromDisrc);
            if (fromDisrc) {
                const limit = new Date();
                limit.setTime(limit.getTime() - 24 * 60 * 60 * 1000 * 90);
                dispatch(saveRecentCasesV2(retrievedRecentCases.filter(recentCase => {
                    return (recentCase.status !== "CLOSED" || new Date(recentCase.updateDate).getTime() > limit.getTime());
                })))
            } else {
                dispatch(saveRecentCasesV2(retrievedRecentCases))
            }
            dispatch(loadedRecentCasesV2())
        } catch (e) {
            const error = await e
            dispatch(errorFetchingRecentCasesV2(error.message))
            throw e
        }
    }
}

const loadingRecentCasesV2 = () => ({
    type: actionsTypes.SET_LOADING_RECENT_CASES_V2,
    payload: true
})
const loadedRecentCasesV2 = () => ({
    type: actionsTypes.SET_LOADING_RECENT_CASES_V2,
    payload: false
})

// TODO gerer le cas d'erreur en affichant un message (sachant que l'abscence de données n'est pas une erreur car il peut ne pas y avoir de dossiers récents)
const errorFetchingRecentCasesV2 = (errorMessage) => ({
    type: actionsTypes.SET_LOADING_RECENT_CASES_V2,
    payload: false
})

const saveRecentCasesV2 = (recentCases) => ({
    type: actionsTypes.SET_RECENT_CASES_V2,
    payload: recentCases
})

export const pushCaseToRecentCasesV2 = (aCase) => ({
    type: actionsTypes.PUSH_CASE_TO_RECENT_CASES_V2,
    payload: aCase
})


export const selectCaseV2 = (caseId: string, clientId: string, serviceId: string) => {
    return {
        type: actionsTypes.SET_SELECTED_CASE_V2,
        payload: { caseId, clientId, serviceId}
    }
}