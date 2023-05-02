import * as actionTypes from "./actionsTypes";
import {Dispatch} from "redux";
import SessionService from "../../service/SessionService";
import {Activity} from "../../model/Activity";

const sessionService: SessionService = new SessionService(true);

export function saveSession(payload: string) {
    return {
        type: actionTypes.STORE_SESSION,
        payload
    }
}

export function setUserActivity(activity: Activity) {
    return {type: actionTypes.SET_SESSION_USER_ACTIVITY, payload: activity}
}

export const fetchAndStoreSessionUserActivity = (sessionId: string) => {
    return async (dispatch: Dispatch) => {
        const userActivity: Activity = await sessionService.getUserActivity(sessionId);
        dispatch(setUserActivity(userActivity))
    }
}
