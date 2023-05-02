import {ConsumptionPeriodLanded} from "../../../../model/service/consumption/ConsumptionPeriodLanded";
import {Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import Progress from "reactstrap/lib/Progress";
import moment from "moment";
import React from "react";

interface DataSizeUnit {
    icon: string
    progress: string
    label: string
}

interface Props {
    consumptionPeriod: ConsumptionPeriodLanded
    index: number
    isSyntheticMode: boolean
}


const LandedConsumptionPeriod = ({consumptionPeriod, index, isSyntheticMode}: Props) => {
    const consumptionValueToNumber = Number(consumptionPeriod.consumptionValue);
    const consumptionValueToTime = moment.utc(consumptionValueToNumber*1000).format('HH:mm:ss');
    const splittedConsumptionValueToTime = consumptionValueToTime.split(':');
    const ConsumptionValueToTimeFormatted = `${splittedConsumptionValueToTime[0]}h ${splittedConsumptionValueToTime[1]}m ${splittedConsumptionValueToTime[2]}s`;

    const consumptionLimitToNumber = Number(consumptionPeriod.consumptionLimit)
    const consumptionLimitToTime = moment.utc(consumptionLimitToNumber*1000).format('HH:mm:ss');
    const splittedConsumptionLimitToTime = consumptionLimitToTime.split(':');
    const consumptionLimitToHourFormatted = `${splittedConsumptionLimitToTime[0]} h ${splittedConsumptionLimitToTime[1]} min`;

    const libelleForfait = consumptionPeriod.libelleForfait

    const calculateRemainingPercentage = (value: number, total: number) => {
        if (0 == total) {
            return 0;
        }
        const percentage = (value / total) * 100;
        const percentageMini = isSyntheticMode ? 18 : 10
        if (percentage < percentageMini && value > 0) {
            return percentageMini
        }
        return percentage
    }

    const adaptedClassName = isSyntheticMode ? "" : (index == 0 ? "mb-2" : "mt-2 mb-2")
    const dataSizeUnit: DataSizeUnit = {
        icon: isSyntheticMode ? "sm" : "xl",
        progress: isSyntheticMode ? "md" : "xl",
        label: isSyntheticMode ? "xs": "sm"
    }

    const adaptedIcon = "icon-call";
    return <Row className={adaptedClassName}>
        <Col>
            <Row>
                <Col sm={11} className='mt-2 mb-2'>
                    <span className={`icon-gradient mr-1 font-size-${dataSizeUnit.icon} ${adaptedIcon}`}/> <span
                    className={`font-italic font-size-${dataSizeUnit.label} mr-2`}>{libelleForfait}</span><span
                    className={`font-weight-bold font-size-${dataSizeUnit.label}`}>- {consumptionLimitToHourFormatted}</span>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Progress className={`progress-${dataSizeUnit.progress} progress-info-conso`}
                              color="success"
                              value={calculateRemainingPercentage(consumptionValueToNumber, consumptionLimitToNumber)}>
                        {ConsumptionValueToTimeFormatted}
                    </Progress>
                </Col>
            </Row>
        </Col>
    </Row>;
}

export default LandedConsumptionPeriod;