import {combineReducers} from "redux";
import {reducers} from "../index";
import {ApplicationInitialStateReducerV2} from "./applicationInitalState/ApplicationInitialStateReducerV2";
import {CasesPageReducerV2} from "./case/CasesPageReducerV2";
import {MediaReducerV2} from "./media/MediaReducerV2";
import {UIReducerV2} from "./ui/UIReducerV2";
import {ContactReducerV2} from "./contact/ContactReducerV2";
import {ClientReducerV2} from "./client/ClientReducerV2";
import {RecentCasesReducerV2} from "./case/RecentCasesReducerV2";
import clientSlice from "../../ClientContextSlice";

const storeReducer = combineReducers({
    ui: UIReducerV2,
    applicationInitialState: ApplicationInitialStateReducerV2,
    client: ClientReducerV2,
    clientContext: clientSlice.reducer,
    cases: CasesPageReducerV2,
    recentCases: RecentCasesReducerV2,
    contact: ContactReducerV2,
    mediaSettings: MediaReducerV2,
});

const reducer = combineReducers({
    ...reducers,
    store: storeReducer
});

export const logOut = () => ({
    type: "USER_LOGOUT"
});

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        state = undefined;
        localStorage.removeItem('persist:root');
        sessionStorage.removeItem('persist:root');
    }

    return reducer(state, action);
};

export default rootReducer;