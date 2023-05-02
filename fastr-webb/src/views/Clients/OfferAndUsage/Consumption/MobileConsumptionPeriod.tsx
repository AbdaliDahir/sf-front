import {ConsumptionPeriod} from "../../../../model/service/consumption/ConsumptionPeriod";
import {Collapse, Row} from "reactstrap";
import Col from "reactstrap/lib/Col";
import Progress from "reactstrap/lib/Progress";
import LocaleUtils from "../../../../utils/LocaleUtils";
import React, {useState} from "react";

interface DataSizeUnit {
    icon: string
    progress: string
    currency: string
    label: string
}

interface Props {
    consumptionPeriod: ConsumptionPeriod
    index: number
    isSyntheticMode: boolean
}


const MobileConsumptionPeriod = ({consumptionPeriod, index, isSyntheticMode}: Props) => {
    const meterLabel = consumptionPeriod.meterLabel ? consumptionPeriod.meterLabel : "-"
    const unityType = consumptionPeriod.unityType
    const consumptionValue = consumptionPeriod.consumptionValue
    const consumptionValueLabel = consumptionPeriod.consumptionValueLabel
    const consumptionLimit = consumptionPeriod.consumptionLimit
    const consumptionLimitLabel = consumptionPeriod.consumptionLimitLabel
    const currentUnitToolTip = consumptionPeriod.currentUnitToolTip

    const [expandedConso, setExpandedConso] = useState(false);

    const toggle = () => {
        if (!isSyntheticMode) {
            setExpandedConso(!expandedConso);
        }
    };

    const renderToolTip = (expandedConso: boolean, currentUnitToolTip: string) => {
        if (!isSyntheticMode) {
            return (<Collapse className="w-100 p-2 ml-3" isOpen={expandedConso}>
                {currentUnitToolTip}
            </Collapse>)
        }
        return <React.Fragment/>
    }

    const calculateRemainingPercentage = (value: number, total: number) => {
        if (0 == total) {
            return 0;
        }
        const percentage = (value / total) * 100;
        const percentageMini = isSyntheticMode ? 8 : 5
        if (percentage < percentageMini && value > 0) {
            return percentageMini
        }
        return percentage
    }

    const adaptedClassName = isSyntheticMode ? "" : (index == 0 ? "mb-2" : "mt-2 mb-2")
    const dataSizeUnit: DataSizeUnit = {
        icon: isSyntheticMode ? "sm" : "xl",
        progress: isSyntheticMode ? "md" : "xl",
        currency: isSyntheticMode ? "sm" : "l",
        label: isSyntheticMode ? "xs": "sm"
    }

    if (unityType == "TEL" || unityType == "DATA") {
        const adaptedIcon = unityType == "DATA" ? "icon-internet-consommation" : "icon-call";
        return (<Row className={adaptedClassName}>
            <Col>
                <Row>
                    <Col sm={11} onClick={toggle}>
                        <span className={`icon-gradient mr-1 font-size-${dataSizeUnit.icon} ${adaptedIcon}`}/> <span
                        className={`font-italic font-size-${dataSizeUnit.label} mr-2`}>{meterLabel}</span> <span
                        className={`font-weight-bold font-size-${dataSizeUnit.label}`}>{consumptionLimitLabel}</span>
                    </Col>
                    {
                        !isSyntheticMode &&
                        <Col sm={1} className="align-self-center text-right" onClick={toggle}>
                            <span className={`icon ${expandedConso ? 'icon-up' : 'icon-down'}`} onClick={toggle}/>
                        </Col>
                    }
                </Row>
                <Row onClick={toggle}>
                    <Col>
                        <Progress className={`progress-${dataSizeUnit.progress} progress-info-conso`}
                                  color="success"
                                  value={calculateRemainingPercentage(consumptionValue, consumptionLimit)}>
                            {consumptionValueLabel}
                        </Progress>
                    </Col>
                </Row>
            </Col>
            {renderToolTip(expandedConso, currentUnitToolTip)}
        </Row>)
    }
    if (unityType == "EUROS") {
        return (<Row className={adaptedClassName}>
            <Col sm={11} onClick={toggle}>
                <span className={`icon-gradient icon-euro mr-1 font-size-${dataSizeUnit.icon}`}/>
                <span className="font-italic mr-2">{meterLabel}</span>
                <span
                    className={`font-weight-bold text-primary font-size-${dataSizeUnit.currency}`}>{LocaleUtils.formatCurrency(consumptionValue, false)}</span>
            </Col>
            {
                !isSyntheticMode &&
                <Col sm={1} className="align-self-center text-right" onClick={toggle}>
                    <span className={`icon ${expandedConso ? 'icon-up' : 'icon-down'}`} onClick={toggle}/>
                </Col>
            }
            {renderToolTip(expandedConso, currentUnitToolTip)}
        </Row>)
    }
    return <React.Fragment/>
}

export default MobileConsumptionPeriod;