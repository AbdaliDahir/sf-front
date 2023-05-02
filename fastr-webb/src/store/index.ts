import {applyMiddleware, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import reducer from "./reducers";
import v2Reducer from "./reducers/v2";

export type AppState = ReturnType<typeof reducer & typeof v2Reducer>;

declare global {
    interface Window { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose; }
}

export default function configureStore() {
    const middleware = [thunkMiddleware];
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    let reducers = v2Reducer
    return createStore(
        reducers,
        composeEnhancers(applyMiddleware(...middleware))
    );
}
