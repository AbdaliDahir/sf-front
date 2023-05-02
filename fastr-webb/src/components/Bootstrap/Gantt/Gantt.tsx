import React, {useEffect, useLayoutEffect, useRef} from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import {useTypedSelector} from "../../Store/useTypedSelector";
import {differenceInCalendarDays} from "date-fns";
import "./Gantt.css";
import Progress from "reactstrap/lib/Progress";

interface Props {
    labels: string[]
    values: string[]
    now: string
    progresses: ProgressTask[]
}

interface ProgressTask {
    from: string
    to: string
}

const Selector = {
    GANTT: '.gantt',
    GANTT_VALUES: '.gantt-values .gantt-value',
    GANTT_BARS: '.gantt-bars .progress',
    GANTT_BARS_FILL: '.gantt-bars .progress .progress-bar',
    GANTT_PINS: '.gantt-pin'
};

const getProgressFill = function getProgressFill(parent) {
    return parent ? parent.querySelector(Selector.GANTT_BARS_FILL) : null;
};

const getFillWidth = function getFillWidth(element, offset) {
    return element ? element.offsetLeft + element.offsetWidth / 2 - offset : 0;
};

const getHalfWidth = function getHalfWidth(element) {
    return element ? element.offsetWidth / 2 : 0;
};

const getHalfPosition = function getHalfPosition(element) {
    return element ? element.offsetLeft + element.offsetWidth / 2 : 0;
};

const hasNoPin = function hasNoPin(parent) {
    return parent ? parent.querySelectorAll(Selector.GANTT_PINS).length <= 0 : null;
};

const addPin = function addPin(parent, left, height) {
    const pinStart = document.createElement('div');
    if(parent && pinStart) {
        pinStart.classList.add('gantt-pin');
        pinStart.style.left = left + "px";
        pinStart.style.height = height + "px";
        parent.appendChild(pinStart);
    }
};

const changePin = function addPin(pin, left, height) {
    if(pin) {
        pin.classList.add('gantt-pin');
        pin.style.left = left + "px";
        pin.style.height = height + "px";
    }
};

const fillInProgress = function fillInProgress(element, width, totalWidth) {
    if(element) {
        element.style.width = totalWidth - width + "px";
        element.setAttribute('aria-valuenow', width);
        element.setAttribute('aria-valuemin', 0);
        element.setAttribute('aria-valuemax', width);
    }
} // Getters

function monthDiff(dateFrom, dateTo) {
    return dateTo.getMonth() - dateFrom.getMonth() +
        (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}

function parseDate(input) {
    const parts = input.match(/(\d+)/g);
    // note parts[1]-1
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

function printPins(elements, pos, container) {
    elements.forEach(function (elem) {
        if (elem && hasNoPin(elem)) {
            addPin(elem, pos, container.clientHeight)
        } else if (elem){
            // @ts-ignore
            changePin(elem.querySelector(".gantt-pin"), pos, container.clientHeight)
        }
    });
}

function daysDiff(dateFrom, dateTo) {
    return Math.round((dateTo - dateFrom) / (1000 * 60 * 60 * 24));
}


const createChart = (e, parent) => {
    const days = parent.querySelectorAll(Selector.GANTT_VALUES)
    const tasks = parent.querySelectorAll(Selector.GANTT_BARS)

    let daysArray = []
    const length = days.length;
    for (let i = 0; i < length; i++) {
        // @ts-ignore
        daysArray.push(days[i]);
    }

    const nowDay = daysArray.filter(function (x) {
        // @ts-ignore
        return x.classList.contains('now')
    });

    const nowDayIndex = daysArray.indexOf(nowDay[0])
    if (hasNoPin(nowDay[0])) {
        addPin(nowDay[0], getHalfWidth(nowDay[0]), parent.clientHeight)
    } else {
        // @ts-ignore
        changePin(nowDay[0].querySelector(".gantt-pin"), getHalfWidth(nowDay[0]), parent.clientHeight)
    }

    tasks.forEach((el: any) => {
        const d = new Date();
        const year = d.getFullYear();
        const monthNumber = d.getUTCMonth() + 1
        const dayNumber = d.getDate();
        let day = ""
        let month = ""
        if (dayNumber < 10) {
            day = "0" + dayNumber
        } else {
            day = "" + dayNumber
        }
        if (monthNumber < 10) {
            month = "0" + monthNumber
        } else {
            month = "" + monthNumber
        }
        const startDay = `${day}/${month}/${year - 2}`
        const minusOneYear = `${day}/${month}/${year - 1}`
        const endDay = `${day}/${month}/${year + 2}`
        const plusOneYear = `${day}/${month}/${year + 1}`
        if (startDay && endDay) {
            let left = 0
            let width = 0

            const filteredArrayStart = daysArray.filter(function(day: Element) {
                return String(day.textContent).trim().localeCompare(String(startDay).trim()) === 0
            })
            const startDayElement = filteredArrayStart[0]
            left = getHalfPosition(startDayElement)

            const filteredArrayEnd = daysArray.filter(function(day: Element) {
                return String(day.textContent).trim().localeCompare(String(endDay).trim()) === 0
            })
            const endDayElement = filteredArrayEnd[0]

            const filteredArrayMinusOne = daysArray.filter(function(day: Element) {
                return String(day.textContent).trim().localeCompare(String(minusOneYear).trim()) === 0
            })
            const minusOneYearElement = filteredArrayMinusOne[0]

            const filteredArrayPlusOne = daysArray.filter(function(day: Element) {
                return String(day.textContent).trim().localeCompare(String(plusOneYear).trim()) === 0
            })
            const plusOneYearElement = filteredArrayPlusOne[0]

            width = getFillWidth(endDayElement, left)

            const pinLeft = getHalfWidth(startDayElement)

            const elems = [startDayElement, minusOneYearElement, plusOneYearElement, endDayElement];
            printPins(elems, pinLeft, parent);

            if (nowDay[0] && nowDayIndex > -1) {
                if (nowDayIndex < daysArray.indexOf(endDayElement)) {
                    const fill = getProgressFill(el)
                    const fillWidth = getFillWidth(nowDay[0], left)
                    fillInProgress(fill, fillWidth, width)

                } else if (nowDayIndex >= daysArray.indexOf(endDayElement)) {
                    const fill = getProgressFill(el)
                    const fillWidth = getFillWidth(nowDay[0], left)
                    fillInProgress(fill, fillWidth, width)
                }
            }
            // apply css
            let oneDay = width / 1460
            const dateFromNow = new Date()
            dateFromNow.setFullYear(dateFromNow.getFullYear() - 2)
            const daysFromStartToNow = daysDiff(dateFromNow, new Date(parseDate(el.dataset.from))) + 1
            const durationOfTheOfferInMonth = monthDiff(new Date(parseDate(el.dataset.from)), new Date(parseDate(el.dataset.to)))
            const durationOfTheOfferInDays = durationOfTheOfferInMonth * 30.417;

            const now = new Date()
            const dateTo = new Date(parseDate(el.dataset.to))
            const isDaysLef = dateTo.getTime() > now.getTime()

            el.style.left = `${left + oneDay * daysFromStartToNow}px`
            el.style.width = `${oneDay * durationOfTheOfferInDays}px`
            el.children[0].style.width = `${isDaysLef ? oneDay * daysDiff(now, dateTo) : 0}px`
            if (e.type === 'load') {
                el.style.backgroundColor = el.dataset.color
                el.style.opacity = 1
            }
        }
    })
}


const printLabel = (props: Props) => {
    return props.labels.map((e, index) => {
        const now = new Date()
        const endDate = new Date(parseDate(props.progresses[index].to))
        let daysLeft = 0
        let monthLeft = 0
        if (endDate.getTime() > now.getTime()) {
            daysLeft = Math.abs(differenceInCalendarDays(now, endDate))
            monthLeft = Math.trunc(daysLeft / 30)
        }
        return <div key={index} className="labelsContainer">
            <div className={`gantt-label`}>{e}</div>
            <div
                className={`gantt-label subLabels`}>du {props.progresses[index].from} au {props.progresses[index].to} ~ {monthLeft < 1 ? daysLeft + " jours restants" : monthLeft + " mois restants"} </div>
        </div>
    })
}

const printValues = (props: Props) => {
    return props.values.map((e, index) => {
        return <div key={index} className={`gantt-value ${props.now === e ? "now" : ""}`}>{e}</div>
    })
}

const printProgresses = (props: Props) => {
    if (props.progresses) {
        return props.progresses.map((e, index) => {
            return <div className="progressContainer">
                <Progress key={index} barClassName="bg-gradient-red linear" data-from={e.from} data-to={e.to} className="progress-sm"/>
            </div>
        })
    } else {
        return <React.Fragment/>
    }
}

const Gantt = (props: Props) => {

    let chartRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    // @ts-ignore
    const activeTab = useTypedSelector(state => state.uiContext.activeTab);
    
    useEffect(() => {
        createChart({type: "load"}, chartRef.current);
    }, [activeTab])

    function updateSize() {
        if (chartRef.current !== null) {
            createChart({type: "load"}, chartRef.current);
        }
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);


    return (
        <Row>
            <Col md={4} className="labelsBloc">
                <div className="gantt-labels d-sm-none d-none d-md-block">
                    {printLabel(props)}
                </div>
            </Col>
            <Col md={8} className="progressBarBloc">
                <div ref={chartRef} className="gantt">
                    <div className="gantt-values">
                        {printValues(props)}
                    </div>
                    <div className="gantt-bars">
                        {printProgresses(props)}
                    </div>
                </div>
            </Col>

        </Row>
    )

}

export default Gantt
