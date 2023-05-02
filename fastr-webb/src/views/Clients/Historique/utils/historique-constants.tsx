import moment from "moment";

const MOBILE_TYPE = "mobile";
const LOCATION_TYPE = "LOCATION";
const FIXE_TYPE = "fixe";
const EMPTY_FILTER_VALUE = 0;
const FILTER_NAMES = ["type", "etat", "activite", "date"];
const DATE_FILTER = {
  "beforeThreeMonth": 0,
  "lastThreeMonth": 0,
  "lastOneMonth": 0,
  "lastWeek": 0,
}
export const DATETIME_FORMAT = process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT;
export const THREE_MONTH_AGO = moment().subtract(3, 'months').format(DATETIME_FORMAT);
export const ONE_MONTH_AGO = moment().subtract(1, 'months').format(DATETIME_FORMAT);
export const ONE_WEEK_AGO = moment().subtract(1, 'week').format(DATETIME_FORMAT);
export {MOBILE_TYPE, FIXE_TYPE, FILTER_NAMES, EMPTY_FILTER_VALUE, LOCATION_TYPE, DATE_FILTER};
