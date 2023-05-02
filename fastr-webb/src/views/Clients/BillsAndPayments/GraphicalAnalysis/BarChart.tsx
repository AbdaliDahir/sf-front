import React, {useRef} from "react";
import 'moment/locale/fr';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import {
    Chart,
    getElementAtEvent} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

import LocaleUtils from "../../../../utils/LocaleUtils";
import * as Constants from './Constants'

interface Props {
    formattedChartDates?: string[]
    formattedChartData?: any
    allAmounts?: any
    onClickChart?: (datasetIndex: number, index: number, element: any) => void
}

const BarChart = (props: Props) => {
    const {formattedChartDates, formattedChartData, allAmounts, onClickChart} = props;

    const MultiTypeChart = useRef();

    const formatTooltipLabels = context => {
        const label = context.dataset.label || '';
        const formattedValue = context.raw === Constants.BAR_ZERO ? 0 : context.raw
        return label + ': ' + LocaleUtils.formatCurrency(formattedValue, false, true);
    }

    const hasNegativeValue = () => {
        const amounts = allAmounts?.map(function (x) {
            return Number(x);
        });
        return amounts?.some(v => v < 0);
    }

    const handleDisplay = (param1, param2) => {
        return (ctx) => {
            if(ctx.dataset.type === "line") {
                return param1;
            } else if(ctx.dataset.data[ctx.dataIndex] !== 0 ) {
                return param2
            }
            return ""
        };

    }

    const beforeInit = { // just to add space between legends and chart
        beforeInit(chart) {
            const originalFit = chart.legend.fit;
            chart.legend.fit = function fit() {
                originalFit.bind(chart.legend)();
                this.height += 20;
            }
        }
    }

    const displayPrices = {
        formatter: function(value, context) {
            if(context.dataset.type === "line") {
                return LocaleUtils.formatCurrency(value, false, true);
            } else {
                return '';
            }
        },
        display: Constants.DISPLAY,
        color: handleDisplay(Constants.COLORS.black, Constants.COLORS.white),
        align: handleDisplay("top", "center"),
        anchor: handleDisplay("top", "center"),
        clip: true,
        font: {
            size: "14",
            weight: "bold"
        },

    }

    const getStep = (maxAmount) => {
        let step;
        if(maxAmount === 10) {
            step = 2
        } else if(0 < maxAmount && maxAmount <= 2) {
            step = 3
        } else if(2 < maxAmount && maxAmount <= 5) {
            step = 6
        } else if(5 < maxAmount && maxAmount <= 10) {
            step = 10
        } else if((10 < maxAmount && maxAmount <= 15) || maxAmount === 25) {
            step = 20
        } else if(15 < maxAmount && maxAmount < 25) {
            step = 30
        } else if(25 < maxAmount && maxAmount <= 35) {
            step = 40
        } else if(35 < maxAmount && maxAmount <= 40) {
            step = 50
        } else if(40 < maxAmount && maxAmount <= 50) {
            step = 60
        } else if(50 < maxAmount && maxAmount <= 60) {
            step = 70
        } else if(60 < maxAmount && maxAmount <= 70) {
            step = 80
        } else if(70 < maxAmount && maxAmount <= 80) {
            step = 90
        } else if(maxAmount > 80) {
            step = 100
        } else {
            step = 10
        }
        return step
    }

   const getMax = () => {
        const max = Math.round(Math.max(...allAmounts))
        const min = Math.round(Math.abs(Math.min(...allAmounts)))
        const minMax = [min, max]
        let maxAmount = Math.round(Math.max(...minMax))
        const pourcentage = max * Constants.POURCENT // 5% du montant le plus haut
        const step = getStep(max)
        return maxAmount !== 0 ? Math.ceil((maxAmount + Math.round(pourcentage)) / step) * step : 10

    }

    const chartOptions = {
        responsive: true,
        aspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                align: 'start',
                marginBottom : 50
            },
            title: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: formatTooltipLabels
                }
            },
            datalabels: displayPrices,
            beforeInit: beforeInit,
        },
        chartArea: {
            backgroundColor: 'rgba(251, 85, 85, 0.4)'
        },
        scales: {
            x: {
                grid: {
                    display: Constants.DISPLAY,
                    drawBorder: Constants.BORDER,
                    drawOnChartArea: Constants.CHART_AREA,
                    drawTicks: Constants.TICKS,
                    color: Constants.COLORS.grey,
                    lineWidth: 4
                },
                title: {
                    display: Constants.DISPLAY,
                    text: 'Factures',
                },
                ticks: {
                    callback: function(val, index) {
                        return `${formattedChartDates ? formattedChartDates[index] : ""}`;
                    },
                }
            },
            y : {
                grid: {
                    drawBorder: false,
                    color: function(context) {
                        if ((context.tick.value > 0) || (context.tick.value < 0)) {
                            return Constants.COLORS.grey;
                        }

                        return hasNegativeValue() ? Constants.COLORS.red : Constants.COLORS.grey;
                    },
                    lineWidth: function(context) {
                        if ((context.tick.value > 0) || (context.tick.value < 0)) {
                            return 1;
                        }

                        return hasNegativeValue() ? 2 : 1;
                    }
                },
                title: {
                    display: Constants.DISPLAY,
                    text: 'Prix (en € TTC)'
                },
                max: getMax
            }
        },
    };

    const handleClick = (event) => {
        if(onClickChart) {
            const datasetIndex = getElementAtEvent(MultiTypeChart.current, event)[0]?.datasetIndex
            const index = getElementAtEvent(MultiTypeChart.current, event)[0]?.index
            const element = getElementAtEvent(MultiTypeChart.current, event)[0]?.element
            onClickChart(datasetIndex, index, element)
        }
    }

    const renderChart = () => {
        if(formattedChartData) {
            const data = {
                labels: formattedChartDates,
                datasets: formattedChartData,
            };
            return <Chart ref={MultiTypeChart}
                           type='bar'
                           data={data}
                           options={chartOptions}
                           plugins={[displayPrices, beforeInit]}
                           onClick={handleClick}/>

        } else {
            return <React.Fragment />
        }
    }

    return (
        <div className="w-100 d-flex justify-content-center align-items-center">
            <div className="chartContainer w-100">
                {renderChart()}
            </div>
        </div>
    )
}

export default BarChart