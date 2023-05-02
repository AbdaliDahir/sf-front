import 'react-app-polyfill/ie9';
import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js'

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {addLocaleData} from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';
import './css/index.scss';
import registerServiceWorker from './registerServiceWorker';
import App from "./views/App";
import areIntlLocalesSupported from "intl-locales-supported";
import IntlPolyfill from "intl";
import {Provider} from "react-redux";
import configureStore from "./store";
import * as i18nIsoCountries from "i18n-iso-countries";
import 'whatwg-fetch';
import * as Sentry from '@sentry/browser';
import ErrorBoundary from "./poc/ErrorBoundary";

Sentry.init({dsn: process.env.REACT_APP_FASTR_SENTRY_URL, environment: process.env.REACT_APP_FASTR_ENV});


// Register Intl locale
const localesMyAppSupports = [
    "FR"
];

// Register countries language label by code
// tslint:disable-next-line:no-var-requires
i18nIsoCountries.registerLocale(require("i18n-iso-countries/langs/fr.json"));

if (global.Intl && Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(localesMyAppSupports)) {
        // `Intl` exists, but it doesn't have the data we need, so load the
        // polyfill and patch the constructors we need with the polyfill's.
        const IntPol = IntlPolyfill;
        Intl.NumberFormat = IntPol.NumberFormat;
        Intl.DateTimeFormat = IntPol.DateTimeFormat;
    }
} else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = IntlPolyfill;
}


export const store = configureStore();

addLocaleData(frLocaleData);

ReactDOM.render(
    <Provider store={store}>
        <ErrorBoundary>
            <App/>
        </ErrorBoundary>
    </Provider>
    ,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
