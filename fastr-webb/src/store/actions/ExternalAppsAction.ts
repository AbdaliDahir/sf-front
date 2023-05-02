import * as actionsType from "./actionsTypes";
import ExternalApplicatationService from "../../service/DisrcExternalApplicationService";
import {FIORI_ACT_OPENED_IN_EXTERNAL_APPS} from "./actionsTypes";

const externalApplicatationService: ExternalApplicatationService = new ExternalApplicatationService();
export const fetchAndStoreExternalApps = () => {
    return async dispatch => {
        dispatch(fetchingExternalApps())
        try {
            const externalApps: any = await externalApplicatationService.getExternalApps();
            dispatch(storeExternalApps((externalApps)))
        }catch (e) {
            const error = await e
            dispatch(errorFetchingExternalApps(error.message))
            throw e
        }
    }
}

export const actFioriOpenedInExternalApps = (data) => {
    return (dispatch) => dispatch(
        {
            type: FIORI_ACT_OPENED_IN_EXTERNAL_APPS,
            payload: data
        }
        );
};

const fetchingExternalApps = () => (
    {
        type: actionsType.FETCH_EXTERNAL_APPS,
    }
)

const storeExternalApps = (externalApps: any[]) => (
    {
        type: actionsType.STORE_EXTERNAL_APPS,
        payload: externalApps
    }
)

const errorFetchingExternalApps = (err) => (
    {
        type: actionsType.ERROR_FETCHING_EXTERNAL_APPS,
        payload: err
    }

)
