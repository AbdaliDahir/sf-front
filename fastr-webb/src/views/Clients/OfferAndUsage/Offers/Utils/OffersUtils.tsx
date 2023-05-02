import React from "react";
import {FormattedDate, FormattedMessage} from "react-intl";
import DateUtils from "../../../../../utils/DateUtils";
import ProgressBackgroundStatus from "../../../../../components/Bootstrap/ProgressBackgroundStatus";


export const renderOnlyStartDate = (startDate: Date) => {
    return (<React.Fragment>
        <FormattedMessage id={"offer.column.activation.date"}/> <FormattedDate
        value={new Date(startDate)}
        year="numeric"
        month="long"
        day="2-digit"
    />
    </React.Fragment>)
};

export const renderTerminatedOptionsOrDiscounts = (startDate: Date, endDate: Date) => {
    return (<React.Fragment>
        Du{' '}
        <FormattedDate
            value={startDate}
            year="numeric"
            month="long"
            day="2-digit"
        />
        {' '}au{' '}
        <FormattedDate
            value={endDate}
            year="numeric"
            month="long"
            day="2-digit"
        />
    </React.Fragment>)
};


export const renderRunningOptionsOrDiscounts = (startDate: Date, endDate: Date) => {
    const remainingMonths = DateUtils.monthsBetween(endDate, new Date());
    const totalMonths = DateUtils.monthsBetween(endDate, startDate);
    return <React.Fragment>
        <ProgressBackgroundStatus total={totalMonths} value={remainingMonths} size="progress-md"/>
        <div className="d-flex justify-content-between">
            <small>
                <FormattedDate
                    value={new Date(startDate)}
                    year="numeric"
                    month="long"
                    day="2-digit"
                />
            </small>
            <small>{remainingMonths}<FormattedMessage id="offer.months.remaining"/></small>
            <small>
                <FormattedDate
                    value={new Date(endDate)}
                    year="numeric"
                    month="long"
                    day="2-digit"
                />
            </small>
        </div>
    </React.Fragment>

};
