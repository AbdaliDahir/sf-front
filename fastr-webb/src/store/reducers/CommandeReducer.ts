import {CommandeSearchForm} from "../../model/commande/CommandeSearchForm";
import {Commande} from "../../model/commande/Commande";
import {
    ActionsType, STORE_COMMANDE_SEARCH_FORM, STORE_COMMANDE_SEARCH_LOADING,
    STORE_COMMANDE_SEARCH_RESULT
} from "../actions/actionsTypes";

export interface CommandeState{
    loading: boolean
    form : CommandeSearchForm,
    commandes?: Commande []
}

export const initialCommandeSearchForm = {
    email: "",
    firstName: "",
    lastName: "",
    siren: "",
    zipcode: "",
    nLigne:"",
    cSim: '893310',
    nCommand:"",
}
const initialState:CommandeState  = {
    loading:false,
    form: initialCommandeSearchForm
};

export function CommandeReducer(state = initialState, action: ActionsType): CommandeState{
    switch (action.type) {
        case STORE_COMMANDE_SEARCH_FORM:
            return {
                ...state,
                form: action.payload
            };
        case STORE_COMMANDE_SEARCH_RESULT:
            return {
                ...state,
                commandes: action.payload
            }
        case STORE_COMMANDE_SEARCH_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        default:
            return state;
    }
}