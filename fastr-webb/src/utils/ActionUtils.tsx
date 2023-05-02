import moment from "moment";

const FASTR_MOMENT_DATE_FORMAT = process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT;
const FASTR_MOMENT_DATE_HOUR_FORMAT = process.env.REACT_APP_FASTR_DATETIME_WITH_SECOND_FORMAT;

export const formatDate = (value) => {
    return moment.utc(value).format(FASTR_MOMENT_DATE_FORMAT)
}

export const formatDateHour = (value) => {
    return moment.utc(value).format(FASTR_MOMENT_DATE_HOUR_FORMAT)
}

