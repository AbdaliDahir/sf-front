import * as i18nIsoCountries from "i18n-iso-countries";
import {translate} from "../components/Intl/IntlGlobalProvider";

export default class LocaleUtils {


    public static getCountry(countryCode?: string): string {
        if (countryCode) {
            return i18nIsoCountries.getName(countryCode, this.LANGUAGE);
        } else {
            return i18nIsoCountries.getName(this.LANGUAGE, this.LANGUAGE);
        }
    }

    public static getInitialCountry(): string {
        return i18nIsoCountries.getName(this.LANGUAGE, this.LANGUAGE);
    }

    public static isCountry(value: string): boolean {
        return isNaN(i18nIsoCountries.alpha3ToNumeric(i18nIsoCountries.getAlpha3Code(value, this.LANGUAGE)));
    }

    public static alpha3ToNumeric(value: string): number {
        return i18nIsoCountries.alpha3ToNumeric(i18nIsoCountries.getAlpha3Code(value, this.LANGUAGE))
    }

    public static getCountryCode(value: string): number {
        return i18nIsoCountries.alpha3ToNumeric(i18nIsoCountries.getAlpha3Code(value, this.LANGUAGE))
    }

    public static formatCurrency(amount?: number, ttc: boolean = true, displayNul: boolean = false): string | undefined {
        if (amount === undefined || (!displayNul && amount === 0)) {
            return "-"
        }
        return new Intl.NumberFormat(this.LANGUAGE, {minimumFractionDigits: 2}).format(amount) + ' ' + this.CURRENCY + ' ' + (ttc ? translate.formatMessage({id: 'TTC'}) : '');
    }

    private static LANGUAGE: string = process.env.REACT_APP_FASTR_LANGUAGE ? process.env.REACT_APP_FASTR_LANGUAGE : "fr";
    private static CURRENCY: string = process.env.REACT_APP_FASTR_CURRENCY ? process.env.REACT_APP_FASTR_CURRENCY : "€";


}