import {Case} from "../../model/Case";
import CaseService from "../../service/CaseService";
import * as actionTypes from "./actionsTypes";
import {store} from "../../index"

const caseService: CaseService = new CaseService(true);

export const lookForMatchingCaseQualifications = (idClientFrom?: string, idServiceFrom?: string) => {
    return async dispatch => {
        let reduxStore = store.getState()
        const idClient = idClientFrom ? idClientFrom : reduxStore.client.data.id
        const idService = idServiceFrom ? idServiceFrom : reduxStore.client.data.services[0].id
        const motif = reduxStore.casePage.motif
        if (!motif) {
            return
        }
        await dispatch(fetchRecentCases(idClient, idService,false))
        reduxStore = store.getState()
        const listCasesMatchingQualification = reduxStore.recentCases.casesList!.filter(recentCase => {
            if (motif!.code === recentCase.qualification.code && recentCase.category === "IMMEDIATE") {
                return true
            }
            return false
        })
        if (listCasesMatchingQualification.length > 0) {
            await dispatch(setMatchingCase(listCasesMatchingQualification[0]))
            dispatch(setIsMatchingCaseModalDisplayed(true));
        }
    }
}

export const fetchRecentCases = (idClient: string, idService: string,fromDisrc:boolean) => {
    return async dispatch => {
        dispatch(loadingRecentCases())
        try {
            const retrievedRecentCases:Case[] = await caseService.getRecentCasesList(idClient, encodeURIComponent(idService),!fromDisrc);
            if(fromDisrc){
                const limit = new Date();
                limit.setTime(limit.getTime() - 24*60*60*1000*90);
                dispatch(saveRecentCases(retrievedRecentCases.filter(recentCase=>{
                    return (recentCase.status !== "CLOSED" || new Date(recentCase.updateDate).getTime() > limit.getTime());
                })))
            }else {
                dispatch(saveRecentCases(retrievedRecentCases))
            }
            dispatch(loadedRecentCases())
        } catch (e) {
            const error = await e
            dispatch(errorFetchingRecentCases(error.message))
            throw e
        }
    }
}

export const setMatchingCase = (caseFound: Case) => ({
    type: actionTypes.SET_MATCHING_CASE,
    payload: caseFound
})

export const setIsMatchingCaseModalDisplayed = (isDisplayed: boolean) => ({
    type: actionTypes.SET_IS_MATCHING_CASE_MODAL_DISPLAYED,
    payload: isDisplayed
})

export const setIsRecentCasesListDisplayed = (state: boolean) => ({
    type: actionTypes.SET_IS_LIST_DISPLAYED,
    payload: state
})

const loadingRecentCases = () => ({
    type: actionTypes.SET_LOADING_RECENT_CASES,
    payload: true
})
const loadedRecentCases = () => ({
    type: actionTypes.SET_LOADING_RECENT_CASES,
    payload: false
})

// TODO gerer le cas d'erreur en affichant un message (sachant que l'abscence de données n'est pas une erreur car il peut ne pas y avoir de dossiers récents)
const errorFetchingRecentCases = (errorMessage) => ({
    type: actionTypes.SET_LOADING_RECENT_CASES,
    payload: false
})

const saveRecentCases = (recentCases) => ({
    type: actionTypes.SET_RECENT_CASES,
    payload: recentCases
})
