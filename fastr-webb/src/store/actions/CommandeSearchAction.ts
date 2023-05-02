import {CommandeSearchForm} from "../../model/commande/CommandeSearchForm";
import * as actionTypes from "./actionsTypes";
import SearchService from "../../service/v2/SearchService";
import {Commande} from "../../model/commande/Commande";
import {ByTitulaire} from "../../model/commande/ByTitulaire";
import {ByMsisdnOrNdi} from "../../model/commande/ByMsisdnOrNdi";
import {NotificationManager} from "react-notifications";
import {translate} from "../../components/Intl/IntlGlobalProvider";

const searchService = new SearchService();
export function saveCommandeSearchForm (payload:CommandeSearchForm) {
    return {
        type: actionTypes.STORE_COMMANDE_SEARCH_FORM,
        payload
    }
}
export function setLoading (payload:boolean) {
    return {
        type: actionTypes.STORE_COMMANDE_SEARCH_LOADING,
        payload
    }
}

export function initSearchResult () {
    return {
        type: actionTypes.STORE_COMMANDE_SEARCH_RESULT,
        payload:undefined
    }
}

/**
 * @param orderId
 */
export function fetchCommandeByOrderID (orderId:string) {
    return async dispatch => {
        try{
            const commandes:Commande[] = await searchService.getCommandeByOrderId(orderId);
            dispatch(storeCommandes(commandes))
        } catch (e){
            NotificationManager.error(translate.formatMessage({id:"search.command.error"}))
        } finally {
            dispatch(setLoading(false))
        }

    }
}

/**
 *
 * @param iCCiD
 */
export function fetchCommandeByICCID (iCCiD:string) {
    return async dispatch => {
        try{
            const commandes:Commande[] = await searchService.getCommandeByICCID(iCCiD);
            dispatch(storeCommandes(commandes))
        } catch (e){
            NotificationManager.error(translate.formatMessage({id:"search.command.error"}))
        } finally {
            dispatch(setLoading(false))
        }
    }
}

/**
 *
 * @param titulaire
 */
export function fetchCommandeByTitulaire (titulaire:ByTitulaire) {
    return async dispatch => {
        try{
            const commandes:Commande[] = await searchService.getCommandeByTitulaire(titulaire);
            dispatch(storeCommandes(commandes))
        } catch (e){
            NotificationManager.error(translate.formatMessage({id:"search.command.error"}))
        } finally {
            dispatch(setLoading(false))
        }
    }
}

/**
 *
 * @param msisdnOrNdi
 */
export function fetchCommandeByMsisdnOrNdi (msisdnOrNdi:ByMsisdnOrNdi) {
    return async dispatch => {
        try {
            const commandes:Commande[] = await searchService.getCommandeByMsisdnOrNdi(msisdnOrNdi);
            dispatch(storeCommandes(commandes))
        } catch (e){
            NotificationManager.error(translate.formatMessage({id:"search.command.error"}))
        } finally {
            dispatch(setLoading(false))
        }
    }
}

const storeCommandes =(commandes :Commande[]) => (
    {
        type: actionTypes.STORE_COMMANDE_SEARCH_RESULT,
        payload:commandes
    }
)

