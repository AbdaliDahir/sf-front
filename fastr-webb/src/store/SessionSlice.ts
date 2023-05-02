import {createSlice} from "@reduxjs/toolkit";
import {ApplicativeUser} from "../model/ApplicativeUser";
import AuthService from "../service/AuthService";
import SessionService from "../service/SessionService";
import {
    storeUserPasswordV2,
    updateUser
} from "./actions/v2/applicationInitalState/ApplicationInitalStateActions";
import {Dispatch} from "redux";

export interface SessionSliceState {
    user?: ApplicativeUser;
    loading: boolean
    error?: string
}

const initialSessionState: SessionSliceState = {
    user: undefined,
    loading: false
}

const authService: AuthService = new AuthService();

const sessionSlice = createSlice({
    name: "sessionSlice",
    initialState: initialSessionState,
    reducers: {
        authenticationInProgress: (state) => {
            state.loading = true
            state.error = ''
            state.user = undefined
            return state;
        },

        authenticationFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
            return state;
        },

        authenticationSucceed: (state, action) => {
            state.loading = false
            state.user = action.payload
            return state;
        },

        clearSessionState: (state) => {
            state = initialSessionState;
            return state;
        }
    }
})

export const authenticateDistrib = (channel: string | null) => (dispatch: Dispatch) => {
    dispatch(sessionSlice.actions.authenticationInProgress());
    authService.authenticateDistribution(channel).then(applicativeUser => {
        SessionService.registerSession(applicativeUser.id);
        //fetchAndStoreApplicationInitialStateV2();
        dispatch(sessionSlice.actions.authenticationSucceed(applicativeUser));
    }, error => {
        dispatch(sessionSlice.actions.authenticationFailure(error.error));
    });
};

export const authenticateLogin = (usr: string, pwd: string) => (dispatch: Dispatch) => {
    dispatch(sessionSlice.actions.authenticationInProgress());
    authService.authenticateLogin(usr, pwd)
        .then(appUser => {
            SessionService.registerSession(appUser.id);
            //fetchAndStoreApplicationInitialStateV2();
            dispatch(sessionSlice.actions.authenticationSucceed(appUser));
            dispatch(updateUser(appUser));
            authService.encryptPassword(pwd).then( encrypted => {
                dispatch(storeUserPasswordV2(encrypted));
            }).catch( error => {
                Promise.resolve(error).then(value => {
                    console.log("Error while trying to encrypt password: ", error);
                });
            })
        })
        .catch(error => {
            Promise.resolve(error).then(value => {
                dispatch(sessionSlice.actions.authenticationFailure(value.error || value.message))
            });
        });
};

export default sessionSlice;
