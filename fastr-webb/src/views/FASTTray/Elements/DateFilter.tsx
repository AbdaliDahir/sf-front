import * as React from "react";
import DatePicker from "react-datepicker";
import {Comparator} from "react-bootstrap-table2-filter";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {useEffect, useState} from "react";

interface Props {
    onFilter: (e) => void
    // tslint:disable-next-line:no-any
    column: any
    initialDate?: Date
    initialComparator?: "LIKE" | ">" | "<" | "="
    disabled?:boolean
}
const DateFilter: React.FunctionComponent<Props> = ({
    onFilter,
    column,
    initialDate,
    initialComparator,
    disabled
}) => {
    const  DATE_FORMAT = "dd/MM/yy";
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [comparator, setComparator] = useState(Comparator.LIKE)

    useEffect(() => {
        if(initialDate){
            setSelectedDate(initialDate)
        }
    }, [initialDate])
    useEffect(() => {
        if(initialComparator){
            setComparator(initialComparator)
        }
    }, [initialComparator])
    const filter = (newDate?, newComparator?) => {
        onFilter({
            date: newDate || selectedDate,
            comparator: newComparator?? comparator
        });
    }
    const handleChangeDate = (date) => {
        filter(date)
        setSelectedDate(date)
    }
    const handleChangeComparator = (e) => {
        e.stopPropagation()
        const currentComparator = e.currentTarget.value;
        filter(false, currentComparator)
        setComparator(currentComparator)
    }
    const handleClick = (e) => {
        e.stopPropagation();
    }
    return(
        <>
            <div key="datepicker" onClick={handleClick}>
                <DatePicker
                    key="datepicker"
                    className={`form-control ${initialDate? "initial-filter-border" :""}`}
                    selected={selectedDate}
                    onChange={handleChangeDate}
                    dateFormat={DATE_FORMAT}
                    locale="fr"
                    readOnly={disabled?? false}
                />
            </div>,
            <select
                key="select"
                className={`form-control ${initialComparator? "initial-filter-border" :""}`}
                onChange={handleChangeComparator}
                onClick={handleClick}
                style={{
                    "width": "80px"
                }}
                value={comparator}
                disabled={disabled?? false}
            >
                <option value={Comparator.LIKE}>{translate.formatMessage({id: "tray.table.filter.all"})}</option>
                <option value={Comparator.GT}>{translate.formatMessage({id: "tray.table.filter.after"})}</option>
                <option value={Comparator.EQ}>{translate.formatMessage({id: "tray.table.filter.exact"})}</option>
                <option value={Comparator.LT}>{translate.formatMessage({id: "tray.table.filter.before"})}</option>
            </select>
        </>

    )
}
export default DateFilter