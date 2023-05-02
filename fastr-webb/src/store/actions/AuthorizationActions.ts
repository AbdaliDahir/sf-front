import * as actionTypes from "./actionsTypes";
import AuthorizationService from "../../service/AuthorizationService";

const service :AuthorizationService =new AuthorizationService(true)
export function saveAuthorization(payload: Array<string>) {
    return {
        type: actionTypes.STORE_AUTHORIZATION,
        payload
    }
}

export const fetchAndStoreAuthorizations = (sessionId) => {
    return async dispatch => {
        dispatch(fetchingAuthorizations())
        try {
            const retrievedAuthorizations = await service.getAuthorizations(sessionId);
            dispatch(saveAuthorization(retrievedAuthorizations))
        } catch (e) {
            const error = await e
            dispatch(errorFetchingAuthorizations(error.message))
            throw e
        }
    }
}

const fetchingAuthorizations = () => (
    {
        type: actionTypes.FETCH_AUTHORIZATION,
    }
)
const errorFetchingAuthorizations = (err) => (
    {
        type: actionTypes.ERROR_FETCHING_AUTHORIZATIONS,
        payload: err
    }
)
