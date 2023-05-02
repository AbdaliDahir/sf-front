import React, {useEffect, useRef, useState} from "react";
import 'moment/locale/fr';

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
import { Bar,
    Chart,
    Line,
    getElementAtEvent} from 'react-chartjs-2';
import {FormGroup} from "reactstrap";
import Label from "reactstrap/lib/Label";
import FormSelectInput from "../components/Form/FormSelectInput";
import ValidationUtils from "../utils/ValidationUtils";
import Formsy from "formsy-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const AnalyseGraphique = props => {
    const [rawData, setRawData] = useState();
    const [formattedBarGraphData, setFormattedBarGraphData] = useState();
    const [formattedBarNegativeGraphData, setFormattedBarNegativeGraphData] = useState();
    const [formattedMultitypeChartData, setFormattedMultitypeChartData] = useState();
    const [formattedLineChartData, setFormattedLineChartData] = useState();
    const [labels, setLabels] = useState();
    const [facturesRefs, setFacturesRefs] = useState();
    const [period, setPeriod] = useState("6 mois");


    const [itemLabel, setItemLabel] = useState("");
    const [itemValue, setItemValue] = useState("");
    const [itemDate, setitemDate] = useState("");
    const [itemRef, setitemRef] = useState("");



    const chartRef = useRef();

    const onClick = (event, i) => {
        const datasetIndex = getElementAtEvent(chartRef.current, event)[0]?.datasetIndex
        const index = getElementAtEvent(chartRef.current, event)[0]?.index

        setItemLabel(formattedBarGraphData[datasetIndex]?.label)
        setItemValue(formattedBarGraphData[datasetIndex]?.data[index])
        setitemDate(labels[index])
        setitemRef(facturesRefs[index])

    }

    useEffect(() => {
        loadGraphData()
    }, [])

    useEffect(() => {
        if(rawData) {
            const labelsArr = getLabels()
            setLabels(labelsArr)

            const facturesArr = getFactureRef()
            setFacturesRefs(facturesArr)

            const formattedBarGraphDatas = formatBarGraphData()
            setFormattedBarGraphData(formattedBarGraphDatas)

            const formattedBarNegativeGraphDatas = formatBarNegativeGraphData()
            setFormattedBarNegativeGraphData(formattedBarNegativeGraphDatas)

            const formattedMultitypeChartDatas = formatMultitypeChartData()
            setFormattedMultitypeChartData(formattedMultitypeChartDatas)

            const formattedLineChartDatas = formatLineGraphData()
            setFormattedLineChartData(formattedLineChartDatas)
        }

    }, [rawData, period])

    const DISPLAY = true;
    const BORDER = true;
    const CHART_AREA = true;
    const TICKS = true;

    const CHART_COLORS = {
        red: 'rgba(218, 56, 50, 0.7)',
        pink: 'rgba(255, 99, 132, 0.7)',
        green: 'rgba(13, 117, 119, 0.7)',
        blue: 'rgba(53, 162, 235, 0.7)',
        purple: 'rgba(150, 71, 147, 0.7)',
        yellow: 'rgba(255, 205, 86, 0.7)',
        orange: 'rgba(255, 159, 64, 0.7)',
        white: 'rgba(0, 15, 255, 0.7)',
        black: 'rgba(0, 0, 0, 0.7)',
        grey: '#e1e1e1' // grid lines accept only hex colors...
    };

    const loadGraphData = () => {
        const mock = [
            {
                date: "27/11/2021",
                reference: "B321-024047332",
                name: "VOS ABONNEMENTS, FORFAITS ET OPTIONS",
                amount: 31
            },
            {
                date: "27/11/2021",
                reference: "B321-024047332",
                name: "VOS CONSOMMATIONS TÉLÉPHONIQUES",
                amount: 0
            },
            {
                date: "27/11/2021",
                reference: "B321-024047332",
                name: "MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT",
                amount: 8
            },
            {
                date: "27/10/2021",
                reference: "B321-021927843",
                name: "VOS ABONNEMENTS, FORFAITS ET OPTIONS",
                amount: 26.00
            },
            {
                date: "27/10/2021",
                reference: "B321-021927843",
                name: "VOS CONSOMMATIONS TÉLÉPHONIQUES",
                amount: 0
            },
            {
                date: "27/10/2021",
                reference: "B321-021927843",
                name: "MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT",
                amount: 8
            },
            {
                date: "27/09/2021",
                reference: "B321-019686661",
                name: "VOS ABONNEMENTS, FORFAITS ET OPTIONS",
                amount: 31
            },
            {
                date: "27/09/2021",
                reference: "B321-019686661",
                name: "VOS CONSOMMATIONS TÉLÉPHONIQUES",
                amount: 0
            },
            {
                date: "27/09/2021",
                reference: "B321-019686661",
                name: "VOS PRODUITS ET SERVICES DE TIERS",
                amount: 3
            },
            {
                date: "27/09/2021",
                reference: "B321-019686661",
                name: "MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT",
                amount: 8
            },
            {
                date: "27/09/2021",
                reference: "B321-019686661",
                name: "VOS ÉQUIPEMENTS",
                amount: 0
            },
            {
                date: "27/08/2021",
                reference: "B321-017417893",
                name: "VOS ABONNEMENTS, FORFAITS ET OPTIONS",
                amount: 23
            },
            {
                date: "27/08/2021",
                reference: "B321-017417893",
                name: "VOS PRODUITS ET SERVICES DE TIERS",
                amount: -10
            },
            {
                date: "27/08/2021",
                reference: "B321-017417893",
                name: "VOS CONSOMMATIONS TÉLÉPHONIQUES",
                amount: 0
            },
            {
                date: "27/07/2021",
                reference: "B321-015247651",
                name: "VOS ABONNEMENTS, FORFAITS ET OPTIONS",
                amount: 23
            },
            {
                date: "27/07/2021",
                reference: "B321-015247651",
                name: "VOS PRODUITS ET SERVICES DE TIERS",
                amount: 0
            },
            {
                date: "27/07/2021",
                reference: "B321-015247651",
                name: "VOS CONSOMMATIONS TÉLÉPHONIQUES",
                amount: 0
            },
            {
                date: "27/06/2021",
                reference: "B321-012991667",
                name: "VOS ABONNEMENTS, FORFAITS ET OPTIONS",
                amount: 23
            },
            {
                date: "27/06/2021",
                reference: "B321-012991667",
                name: "VOS PRODUITS ET SERVICES DE TIERS",
                amount: 0
            },
            {
                date: "27/06/2021",
                reference: "B321-012991667",
                name: "VOS CONSOMMATIONS TÉLÉPHONIQUES",
                amount: 0
            },
        ];
        setRawData(mock)
    }

    const getLabels = () => {
        const labelsArr: any = [];
        rawData?.forEach(item => {

            if(labelsArr?.indexOf(item?.date) === -1){
                labelsArr.push(item?.date)
            }
        })

        const size = parseInt(period, 10)
        return labelsArr.slice(0, size)
    }

    const getFactureRef = () => {
        const factures: any = [];
        rawData?.forEach(item => {

            if(factures?.indexOf(item?.reference) === -1){
                factures.push(item?.reference)
            }
        })

        const size = parseInt(period, 10)
        return factures.slice(0, size)
    }

    const getBgColor = name => {
        switch (name) {
            case "VOS ABONNEMENTS, FORFAITS ET OPTIONS":
                return  CHART_COLORS.red;
            case "VOS CONSOMMATIONS TÉLÉPHONIQUES":
                return  CHART_COLORS.green;
            case "MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT":
                return  CHART_COLORS.blue;
            case "VOS PRODUITS ET SERVICES DE TIERS":
                return  CHART_COLORS.purple;
            case "VOS ÉQUIPEMENTS":
                return  CHART_COLORS.yellow;
            default:
                return CHART_COLORS.white
        }
    }

    const footer = (tooltipItems) => {
        let sum = 0;

        tooltipItems.forEach(function(tooltipItem) {
            sum += tooltipItem.parsed.y;
        });
        return 'Total: ' + sum;
    };

    const formatLabels = context => {
        let label = context.dataset.label || '';

        if (label) {
            label += ': ';
        }
        if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('fr-US', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
        }
        return label;
    }

    // Bar +
    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                onHover: (event) => {
                    event.native.target.style.cursor = 'pointer'
                }
            },

            title: {
                display: DISPLAY,
                text: 'Analyse graphique (Bar)',
            },
            tooltip: {
                callbacks: {
                    label: formatLabels
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: DISPLAY,
                    text: 'Mois'
                }
            },
            y : {
                beginAtZero: true,
                title: {
                    display: DISPLAY,
                    text: 'Prix (en €)'
                }
            }
        },
    };

    const formatBarGraphData = () => {
        return [
            {
                id: 1,
                label: 'VOS ABONNEMENTS, FORFAITS ET OPTIONS',
                data: [31, 26, 31, 23, 23, 23],
                backgroundColor: getBgColor('VOS ABONNEMENTS, FORFAITS ET OPTIONS'),
            },
            {
                id: 2,
                label: 'VOS CONSOMMATIONS TÉLÉPHONIQUES',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: getBgColor('VOS CONSOMMATIONS TÉLÉPHONIQUES'),
            },
            {
                id: 3,
                label: 'MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT',
                data: [8, 8, 8, 0, 0, 0],
                backgroundColor: getBgColor('MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT'),
            },
            {
                id: 4,
                label: 'VOS PRODUITS ET SERVICES DE TIERS',
                data: [0, 0, 3, 0, 0, 0],
                backgroundColor: getBgColor('VOS PRODUITS ET SERVICES DE TIERS'),
            },
            {
                id: 5,
                label: 'VOS ÉQUIPEMENTS',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: getBgColor('VOS ÉQUIPEMENTS'),
            },
        ]
    }

    const renderBarGraph = () => {
        if(formattedBarGraphData) {
            const data = {
                labels,
                datasets: formattedBarGraphData,
            };

            return <Bar ref={chartRef} datasetIdKey='id' onClick={onClick} options={barOptions} data={data}/>;
        } else {
            return <React.Fragment />
        }
    }

    // Bar -
    const barNegativeOptions = {
        responsive: true,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: DISPLAY,
                text: 'Analyse graphique (Bar)',
            },
            tooltip: {
                callbacks: {
                    label: formatLabels,
                    footer: footer
                }
            }
        },
        scales: {
            x: {
               grid: {
                   display: DISPLAY,
                   drawBorder: BORDER,
                   drawOnChartArea: CHART_AREA,
                   drawTicks: TICKS,
                },
                title: {
                    display: DISPLAY,
                    text: 'Mois'
                },
                ticks: {
                    fontColor: "green",
                    fontFamily: "Gamja Flower",
                    fontSize: 10,
                    fontStyle: "bold"
                }
            },
            y : {
                grid: {
                    drawBorder: false,
                    color: function(context) {
                        if ((context.tick.value > 0) || (context.tick.value < 0)) {
                            return CHART_COLORS.grey;
                        }

                        return CHART_COLORS.red;
                    }
                },
                title: {
                    display: DISPLAY,
                    text: 'Prix (en €)'
                }
            }
        },
    };

    const formatBarNegativeGraphData = () => {
        return [
            {
                label: 'VOS ABONNEMENTS, FORFAITS ET OPTIONS',
                data: [31, 26, 31, 23, 23, 23],
                backgroundColor: getBgColor('VOS ABONNEMENTS, FORFAITS ET OPTIONS'),
            },
            {
                label: 'VOS CONSOMMATIONS TÉLÉPHONIQUES',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: getBgColor('VOS CONSOMMATIONS TÉLÉPHONIQUES'),
            },
            {
                label: 'MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT',
                data: [8, 8, 8, -15, 0, 0],
                backgroundColor: getBgColor('MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT'),
            },
            {
                label: 'VOS PRODUITS ET SERVICES DE TIERS',
                data: [0, 0, 3, 0, 0, 0],
                backgroundColor: getBgColor('VOS PRODUITS ET SERVICES DE TIERS'),
            },
            {
                label: 'VOS ÉQUIPEMENTS',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: getBgColor('VOS ÉQUIPEMENTS'),
            },
        ]
    }

    const renderBarNegativeGraph = () => {
        if(formattedBarNegativeGraphData) {
            const data = {
                labels,
                datasets: formattedBarNegativeGraphData,
            };

            return <Bar id="barChart" options={barNegativeOptions} data={data}/>;
        } else {
            return <React.Fragment />
        }
    }


    // MultitypeChart
    const multitypeChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                align: 'start',
                fullWidth: true,
            },
            legendCallback: (chart) => {
                let html = '<ul>';
                chart.data.datasets.forEach((dataset) => {
                    html = `${html}<li><span style="background-color: ${dataset.backgroundColor}">${dataset.label}</span></li>`;
                });
                html = `${html}</ul>`;
                return html;
            },
            title: {
                display: DISPLAY,
                text: 'Analyse graphique (Multi Type Chart)',
            },
            tooltip: {
                callbacks: {
                    label: formatLabels
                }
            }
        }
    };

    const formatMultitypeChartData = () => {
        return [
            {
                type: 'line' as const,
                label: 'Total facturé',
                borderColor: CHART_COLORS.pink,
                borderWidth: 2,
                fill: false,
                data: [39, 34, 42, 23, 23, 23],
            },
            {
                label: 'VOS ABONNEMENTS, FORFAITS ET OPTIONS',
                data: [31, 26, 31, 23, 23, 23],
                backgroundColor: getBgColor('VOS ABONNEMENTS, FORFAITS ET OPTIONS'),
            },
            {
                label: 'VOS CONSOMMATIONS TÉLÉPHONIQUES',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: getBgColor('VOS CONSOMMATIONS TÉLÉPHONIQUES'),
            },
            {
                label: 'MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT',
                data: [8, 8, 8, 0, 0, 0],
                backgroundColor: getBgColor('MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT'),
            },
            {
                label: 'VOS PRODUITS ET SERVICES DE TIERS',
                data: [0, 0, 3, 0, 0, 0],
                backgroundColor: getBgColor('VOS PRODUITS ET SERVICES DE TIERS'),
            },
            {
                label: 'VOS ÉQUIPEMENTS',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: getBgColor('VOS ÉQUIPEMENTS'),
            },
        ]
    }

    const renderMultitypeChart = () => {
        if(formattedBarGraphData) {
            const data = {
                labels,
                datasets: formattedMultitypeChartData,
            };

            return <Chart type='bar' options={multitypeChartOptions} data={data} />;

        } else {
            return <React.Fragment />
        }
    }



    // LineChart
    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: DISPLAY,
                text: 'Analyse graphique (Line Chart)',
            },
            tooltip: {
                callbacks: {
                    label: formatLabels
                }
            }
        }
    };

    const formatLineGraphData = () => {
        return [
            {
                label: 'VOS ABONNEMENTS, FORFAITS ET OPTIONS',
                data: [31, 26, 31, 23, 23, 23],
                borderColor: getBgColor('VOS ABONNEMENTS, FORFAITS ET OPTIONS'),
            },
            {
                label: 'VOS CONSOMMATIONS TÉLÉPHONIQUES',
                data: [0, 0, 0, 0, 0, 0],
                borderColor: getBgColor('VOS CONSOMMATIONS TÉLÉPHONIQUES'),
            },
            {
                label: 'MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT',
                data: [8, 8, 8, 0, 0, 0],
                borderColor: getBgColor('MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT'),
            },
            {
                label: 'VOS PRODUITS ET SERVICES DE TIERS',
                data: [0, 0, 3, 0, 0, 0],
                borderColor: getBgColor('VOS PRODUITS ET SERVICES DE TIERS'),
            },
            {
                label: 'VOS ÉQUIPEMENTS',
                data: [0, 0, 0, 0, 0, 0],
                borderColor: getBgColor('VOS ÉQUIPEMENTS'),
            },
        ]
    }

    const renderLineChartOptions = () => {
        if(formattedLineChartData) {
            const data = {
                labels,
                datasets: formattedLineChartData,
            };

            return <Line options={lineChartOptions} data={data} />;
        } else {
            return <React.Fragment />
        }
    }

    const optionsList = ['6 mois', '3 mois']

    const renderSelectOptionsList = () => {
        const temp: Array<JSX.Element> = [];
        optionsList.forEach(opt => {
            temp.push(
                <option
                    value={opt} key={opt}>{opt}</option>)
        })
        return temp
    }

    const handleSelectOnChange = (e) => {
        const selectedValue = e.currentTarget.value;
        setPeriod(selectedValue)
    }

    return (
        <React.Fragment>
            <div className="w-100 h-100">
                <div className="d-flex justify-content-center align-items-center flex-column" style={{marginBottom: "300px"}}>


                    <div className="w-50" style={{marginTop: "200px"}}>
                        <div className="w-100 d-flex justify-content-end">
                            <Formsy>
                                <FormGroup>
                                    <Label for="dunningTrigger" className="font-weight-bold">Analyse sur :</Label>

                                    <FormSelectInput name="analyseGraph" id="analyseGraph"
                                                     validations={{isRequired: ValidationUtils.notEmpty}}
                                                     value={period}
                                                     onChange={handleSelectOnChange}
                                                     disabled={false}>
                                        {renderSelectOptionsList()}
                                    </FormSelectInput>
                                </FormGroup>
                            </Formsy>
                        </div>
                        {renderBarGraph()}
                        <div id="testItemSelection mr-5">

                            {itemLabel && <div><span className="font-weight-bold">Catégorie : </span>{itemLabel}</div>}
                            {itemRef && <div><span className="font-weight-bold">Reférence : </span>{itemRef}</div>}
                            {itemValue && <div><span className="font-weight-bold">Montant : </span>{itemValue} €</div>}
                            {itemDate && <div><span className="font-weight-bold">Date : </span>{itemDate}</div>}


                        </div>
                    </div>

                    <div className="w-50" style={{marginTop: "300px"}}>
                        {renderBarNegativeGraph()}
                    </div>

                    <div className="w-50" style={{marginTop: "300px"}}>
                        {renderMultitypeChart()}
                    </div>

                    <div className="w-50" style={{marginTop: "300px"}}>
                        {renderLineChartOptions()}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default AnalyseGraphique