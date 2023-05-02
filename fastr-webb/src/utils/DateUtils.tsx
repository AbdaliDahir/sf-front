import * as moment from "moment";
import {Moment} from "moment";

export default class DateUtils {

    public static NB_MILIS_IN_SECONDS   = 1000;
    public static NB_MILIS_IN_MINUTES   = 60 * DateUtils.NB_MILIS_IN_SECONDS;
    public static NB_MILIS_IN_HOURS     = 60 * DateUtils.NB_MILIS_IN_MINUTES;
    public static NB_MILIS_IN_DAY       = 24 * DateUtils.NB_MILIS_IN_HOURS;


    public static toHTMLInput(date: Date): string {
        return date.toISOString().slice(0, 16);
    }

    public static toGMT0ISOString(date: Moment): string {
        return moment(date).add(moment().utcOffset(), 'minutes').add(2, 'hours').toISOString()
    }

    public static monthsBetween(date1: Date, date2: Date): number {
        const yearD1 = date1.getFullYear()
        const yearD2 = date2.getFullYear()
        const monthD1 = date1.getMonth()
        const monthD2 = date2.getMonth()
        let diffYears
        let diffMonth

        if (date1 > date2) {
            diffYears = yearD1 - yearD2
            diffMonth = monthD1 - monthD2
        } else {
            diffYears = yearD2 - yearD1
            diffMonth = monthD2 - monthD1
        }

        return diffYears * 12 + diffMonth
    }

    public static getFarthestDate<T>(collection: T[], fetcher: (e: T) => Date | string) {
        return fetcher(collection?.sort((a, b) => {
            const e1 = fetcher(a);
            const e2 = fetcher(b);
            let e1Date
            let e2Date
            if (typeof e1 === 'string') {
                e1Date = new Date(e1)
            } else {
                e1Date = e1
            }

            if (typeof e2 === 'string') {
                e2Date = new Date(e2)
            } else {
                e2Date = e2
            }

            let date1 = new Date(e1Date);
            let date2 = new Date(e2Date);

            if (date1.getTime() < date2.getTime()) {
                return 1
            } else if (date1.getTime() > date2.getTime()) {
                return -1
            } else {
                return 0
            }
        })[0]);
    }

    public static getNearestDate<T>(collection: T[], fetcher: (e: T) => Date | string) {
        return fetcher(collection?.sort((a, b) => {
            const e1 = fetcher(a);
            const e2 = fetcher(b);
            let e1Date
            let e2Date
            if (typeof e1 === 'string') {
                e1Date = new Date(e1)
            } else {
                e1Date = e1
            }

            if (typeof e2 === 'string') {
                e2Date = new Date(e2)
            } else {
                e2Date = e2
            }

            let date1 = new Date(e1Date);
            let date2 = new Date(e2Date);
            if (date1.getTime() > date2.getTime()) {
                return 1
            } else if (date1.getTime() < date2.getTime()) {
                return -1
            } else {
                return 0
            }
        })[0]);
    }

    public static daysBetween(date1: Date, date2: Date): number {
        const timeD1 = date1.getTime();
        const timeD2 = date2.getTime();

        const result = (timeD1 - timeD2) / this.NB_MILIS_IN_DAY

        return Math.abs(result)
    }

    public static compareStringDates(date1: string, date2: string) {
        return new Date(date1).getTime() - new Date(date2).getTime();
    }

    public static formatTimeSpentLastUpdate = (timeSpentLastUpdate, displayFormat) => {
        return moment.duration(timeSpentLastUpdate, "seconds").format(displayFormat, {
            largest: 1
        });
    }

    public static sortByDate = (array, dateType) => {
        array.sort((a, b) => {
            a = new Date(a[dateType]).getTime();
            b = new Date(b[dateType]).getTime();
            return a > b ? -1 : a < b ? 1 : 0;
        });
        return array
    }

    public static renderDuration = (duration) => {
        if (duration <= 0) {
            return undefined;
        }

        if (duration < DateUtils.NB_MILIS_IN_MINUTES) {
            return Math.abs(Math.round(duration / DateUtils.NB_MILIS_IN_SECONDS)) + " s";
        }

        if (duration < DateUtils.NB_MILIS_IN_HOURS) {
            return Math.abs(Math.round(duration / DateUtils.NB_MILIS_IN_MINUTES)) + " m";
        }

        if (duration < DateUtils.NB_MILIS_IN_DAY) {
            return Math.abs(Math.round(duration / DateUtils.NB_MILIS_IN_HOURS)) + " h";
        }

        return Math.abs(Math.round(duration / DateUtils.NB_MILIS_IN_DAY)) + " j";
    }
}
