import React from "react";
import {
    ConsumptionEvent,
    EventHistory,
    MesureUnit
} from "../../../../model/service/consumption/MobileConsumption";
import LocaleUtils from "../../../../utils/LocaleUtils";
import { FormattedMessage } from "react-intl";

interface Props {
    history: EventHistory
    title: string
}

const MobileConsumptionType = (props: Props) => {

    const formatVoiceUnity = (seconds: number) => {
        let hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;

        return <React.Fragment>
            {hours}h {minutes}min {seconds}s
        </React.Fragment>
    }

    const formatDataUnity = (giga: number, unit: MesureUnit) => {
        return <React.Fragment>
            {giga.toFixed(2)} <span className="text-capitalize">{unit}</span>
        </React.Fragment>
    }


    const formatByUnit = (consumptionEvent: ConsumptionEvent, type: MesureUnit) => {
        switch (type) {
            case "S":
                return formatVoiceUnity(consumptionEvent.totalConsumed)
            case "MO":
            case "KO":
            case "GO":
                return formatDataUnity(consumptionEvent.totalConsumed, type)
            case "NB":
                return <React.Fragment>{consumptionEvent.totalConsumed}</React.Fragment>
            case "NA":
            case "EURO":
                return LocaleUtils.formatCurrency(consumptionEvent.totalAmount, true, true)
            default :
                return <React.Fragment>{consumptionEvent.totalConsumed} {type}</React.Fragment>
        }
    }

    const groupBy = <T extends unknown, E extends unknown>(list: T[], keyGetter: (e: T) => E): Map<E, T[]> => {
        const map = new Map();
        if (list) {
            list.forEach((item) => {
                const key = keyGetter(item);
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            });
        }
        return map;
    }

    const printElement = (events: ConsumptionEvent[]) => {
        let consumptionEvent = events.reduce((a, b) => {
            let c = Object.assign({}, a);

            c.totalConsumed = a.totalConsumed + b.totalConsumed
            c.totalAmount = a.totalAmount + b.totalAmount
            c.totalAmount = a.totalAmount + b.totalAmount
            return c
        });

        return <p>
            <h6>{consumptionEvent.formattedLabel ? consumptionEvent.formattedLabel : consumptionEvent.eventTypeLabel}</h6>
            {formatByUnit(consumptionEvent, consumptionEvent.totalConsumedUnity)}
        </p>
    }


    if (props.history) {
        let groupByType: Map<"DATA" | "VOIX" | "MMS" | "FRAIS" | "TELECHARGEMENT" | "RECHARGEMENT" | "SURCOUT", ConsumptionEvent[]> = groupBy(props.history.consumptionEvents, e => e.eventType);
        let returnElements: JSX.Element[] = [];

        groupByType.forEach((value, key, map) => {
            returnElements.push(printElement(value))
        })

        const totalAmount = props.history.consumptionEvents
            .map(e => {
            return e.totalAmount
        })
            .reduce((a, b) => a + b)

        const printNoElement = (returnElements: JSX.Element[]) => {
            if (returnElements.length <= 0) {
                return <FormattedMessage id={"no elements"}/>
            } else return null
        }

        const printTotalOuterPlan = () => {
            if (totalAmount && totalAmount > 0) {
               return <React.Fragment>
                    <h6><FormattedMessage id="offer.consumptions.outPlan.amount"/></h6>
                    {LocaleUtils.formatCurrency(totalAmount, true, false)}
                </React.Fragment>
            } else return <React.Fragment/>
        }

        return (
            <div>
                <h5><FormattedMessage id={props.title}/></h5>
                {returnElements}
                {printNoElement(returnElements)}
                {printTotalOuterPlan()}
            </div>
        )
    } else {
        return <React.Fragment/>
    }
}

export default MobileConsumptionType
