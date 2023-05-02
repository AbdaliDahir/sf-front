import React, {useEffect, useRef, useState} from "react";
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
import {
    ButtonDropdown,
    CustomInput,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    FormGroup
} from "reactstrap";
import Label from "reactstrap/lib/Label";
import FormSelectInput from "../components/Form/FormSelectInput";
import ValidationUtils from "../utils/ValidationUtils";
import Formsy from "formsy-react";
import LocaleUtils from "../utils/LocaleUtils";

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


const AnalyseGraphiqueV2 = props => {
    const [rawData, setRawData] = useState();
    const [formattedMultitypeChartData, setFormattedMultitypeChartData] = useState();
    const [labels, setLabels] = useState();
    const [facturesRefs, setFacturesRefs] = useState();
    const [period, setPeriod] = useState("6 mois");
    const [showInvoices, setShowInvoices] = useState(false);
    const [itemLabel, setItemLabel] = useState("");
    const [itemValue, setItemValue] = useState("");
    const [itemDate, setitemDate] = useState("");
    const [itemRef, setitemRef] = useState("");
    const [dropdownOpen, setOpen] = useState();
    const [checkedState, setCheckedState] = useState(
        new Array(labels?.length || 0).fill(false)
    );

    const MultitypeChart = useRef();

    const onClickMultitypeChart = (event, i) => {
        const datasetIndex = getElementAtEvent(MultitypeChart.current, event)[0]?.datasetIndex
        const index = getElementAtEvent(MultitypeChart.current, event)[0]?.index

        setItemLabel(formattedMultitypeChartData[datasetIndex]?.label)
        setItemValue(formattedMultitypeChartData[datasetIndex]?.data[index])
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

            const formattedMultitypeChartDatas = formatMultitypeChartData()
            setFormattedMultitypeChartData(formattedMultitypeChartDatas)
        }

    }, [rawData, period])

    const DISPLAY = true;
    const BORDER = true;
    const CHART_AREA = true;
    const TICKS = true;

    const CHART_COLORS = {
        red: 'rgba(218, 56, 50, 0.8)',
        pink: 'rgba(255, 99, 132, 0.8)',
        green: 'rgba(13, 117, 119, 0.8)',
        blue: 'rgba(53, 162, 235, 0.8)',
        purple: 'rgba(150, 71, 147, 0.8)',
        yellow: 'rgba(255, 205, 86, 0.8)',
        orange: 'rgba(255, 159, 64, 0.8)',
        ltGrey: 'rgba(255, 255, 255, 0.8)',
        white: '#FFF',
        black: '#000',
        darkGrey: '#7f7f7f',
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

    // Commons
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
        const facturesRef: any = [];
        rawData?.forEach(item => {

            if(facturesRef?.indexOf(item?.reference) === -1){
                facturesRef.push([item?.reference])
            }
        })

        const size = parseInt(period, 10)
        return facturesRef.slice(0, size)
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

    const formatTooltipLabels = (context) => {
        const label = context.dataset.label || '';
        const formattedValue = context.raw === 0.2 ? 0 : context.raw
        return label + ': ' + LocaleUtils.formatCurrency(formattedValue, false, true);
    }

    const hasNegativeValue = () => {
        let values = [31, 26, 31, 23, 23, 23, 0, 0, 0, 0, 0, 0, 8, 8, 8, 15, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        return values.some(v => v < 0);
    }

    const compareGraph = () => {
        setShowInvoices(!showInvoices)
        setOpen(!dropdownOpen)
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

    const condition = (param1, param2) => {
        return (ctx) => {
            if(ctx.dataset.type === "line") {
                return param1;
            } else if(ctx.dataset.data[ctx.dataIndex] !== 0 ) {
                return param2
            }
            return ""
        };

    }

    //Always display prices on top
    const datalabels: any = {
        formatter: function(value, context) {
            if(context.dataset.type === "line") {
                return LocaleUtils.formatCurrency(value, false, true);
            } else if(value !== 0 && value !== 0.2) {
                return value;
            }
            return ""
        },
        display: DISPLAY,
        color: condition(CHART_COLORS.black, CHART_COLORS.ltGrey),
        align: condition("top", "center"),
        anchor: condition("top", "center"),
        clip: true,
        font: {
            size: "14",
            weight: "bold"
        },

    };

    //Compare invoices
    const handleSelection = position => () => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    }

    const isDisabled = id => {
        return (
            checkedState.length > 1 && checkedState.indexOf(id) === -1
        );
    };

    const loadDropdownItem = () => {
        let elements : any[] = [];
        if(facturesRefs){
            facturesRefs.forEach((elem,index) => {
                elements.push(
                    <DropdownItem onClick={handleSelection}>
                        <div className="d-flex mt-3">
                            <CustomInput type="checkbox" id={"checkbox_" + index} name="selectAll"
                                         onChange={handleSelection(index)}
                                         disabled={isDisabled(index)}/>
                            <div>Facture du {labels[index]} ({elem})</div>
                        </div>
                    </DropdownItem>
                );
            });
        }
        return elements
    }

    const dropdownItems = loadDropdownItem();

    const toggle = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
    }

    // MultitypeChart
    const multitypeChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                align: 'start',
            },
            title: {
                display: DISPLAY,
                text: 'Analyse graphique (Multi Type Chart)',
            },
            tooltip: {
                callbacks: {
                    label: formatTooltipLabels
                }
            },
            datalabels: datalabels,
        },
        chartArea: {
            backgroundColor: 'rgba(251, 85, 85, 0.4)'
        },
        scales: {
            x: {
                grid: {
                    display: DISPLAY,
                    drawBorder: BORDER,
                    drawOnChartArea: CHART_AREA,
                    drawTicks: TICKS,
                    color: CHART_COLORS.grey,
                    lineWidth: 4
                },
                title: {
                    display: DISPLAY,
                },
                ticks: {
                    callback: function(val, index) {
                        return `${labels[index]}`;
                    },
                }
            },
            y : {
                grid: {
                    drawBorder: false,
                    color: function(context) {
                        if ((context.tick.value > 0) || (context.tick.value < 0)) {
                            return CHART_COLORS.grey;
                        }

                        return hasNegativeValue() ? CHART_COLORS.red : CHART_COLORS.grey;
                    }
                },
                title: {
                    display: DISPLAY,
                    text: 'Prix (en €)'
                }
            }
        },
    };

    const handleZeroBarRender = (arr) => {
        arr.map((el, i) => {
            if(el === 0) {
                arr[i] = 0.2
            }
        })
        return arr
    }

    const formatMultitypeChartData = () => {

        const conso = [2, 0, 0, 50, 0, 0];

        return [
            {
                type: 'line' as const,
                label: 'Total facturé',
                borderColor: CHART_COLORS.pink,
                borderWidth: 2,
                borderStyle: 'solid',
                fill: false,
                data: [39, 34, 42, 23, 23, 23],

            },
            {
                type: 'bar',
                label: 'VOS ABONNEMENTS, FORFAITS ET OPTIONS',
                data: [31, 26, 31, 23, 23, 23],
                backgroundColor: getBgColor('VOS ABONNEMENTS, FORFAITS ET OPTIONS'),
            },
            {
                type: 'bar',
                label: 'VOS CONSOMMATIONS TÉLÉPHONIQUES',
                data: handleZeroBarRender(conso),
                backgroundColor: getBgColor('VOS CONSOMMATIONS TÉLÉPHONIQUES'),
            },
            {
                type: 'bar',
                label: 'MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT',
                data: [8, 8, 8, 0, 0, 0],
                backgroundColor: getBgColor('MENSUALITÉS DE VOS FACILITÉS DE PAIEMENT'),
            },
            {
                type: 'bar',
                label: 'VOS PRODUITS ET SERVICES DE TIERS',
                data: [0, 0, 3, 0, 0, 0],
                backgroundColor: getBgColor('VOS PRODUITS ET SERVICES DE TIERS'),
            },
            {
                type: 'bar',
                label: 'VOS ÉQUIPEMENTS',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: getBgColor('VOS ÉQUIPEMENTS'),
            },
        ]
    }

    const renderMultitypeChart = () => {
        if(formattedMultitypeChartData) {
            const data = {
                labels,
                datasets: formattedMultitypeChartData,
            };

            return <div>
                <Chart ref={MultitypeChart}
                       type='bar'
                       data={data}
                       options={multitypeChartOptions}
                       plugins={[datalabels]}
                       onClick={onClickMultitypeChart}
                       />

                <div id="testItemSelection mr-5">
                    {itemLabel && <div><span className="font-weight-bold">Catégorie : </span>{itemLabel}</div>}
                    {itemRef && <div><span className="font-weight-bold">Reférence : </span>{itemRef}</div>}
                    {itemValue && <div><span className="font-weight-bold">Montant : </span>{itemValue} €</div>}
                    {itemDate && <div><span className="font-weight-bold">Date : </span>{itemDate}</div>}
                </div>

            </div>

        } else {
            return <React.Fragment />
        }
    }

    return (
        <React.Fragment>
            <div className="w-100 h-100">
                <div className="d-flex justify-content-center align-items-center flex-column" style={{marginBottom: "300px"}}>


                    <div className="w-50" style={{marginTop: "200px"}}>
                        <div className="w-100 d-flex justify-content-between align-items-end">
                            <React.Fragment>
                                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} direction="down" className="mb-2">
                                    <DropdownToggle onClick={compareGraph} caret>
                                        Comparer
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {dropdownItems}
                                    </DropdownMenu>
                                </ButtonDropdown>
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
                            </React.Fragment>
                        </div>
                        {renderMultitypeChart()}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default AnalyseGraphiqueV2