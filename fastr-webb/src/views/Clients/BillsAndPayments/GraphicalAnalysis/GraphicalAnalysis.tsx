import React, {useEffect, useState} from "react";
import {Card, CardBody, CardHeader, CardText, Row, Col} from "reactstrap";
import DisplayTitle from "../../../../components/DisplayTitle";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import BillingService from "../../../../service/BillingService";
import {ClientContextSliceState} from "../../../../store/ClientContextSlice";
import ServiceUtils from "../../../../utils/ServiceUtils";
import {BillsRequest} from "../../../../model/BillsRequestDTO";
import {BillsResponseDTO, DmsItem} from "../../../../model/BillsResponseDTO";
import {NotificationManager} from "react-notifications";
import * as Constants from './Constants'
import ChartDetails from "./ChartDetails";
import ChartHeader from "./ChartHeader";
import BarChart from "./BarChart";
import _ from "lodash";
import moment from "moment-timezone";
import './GraphicalAnalysis.css'
import {FormattedMessage} from "react-intl";
import { BillingInformation } from "src/model/person/billing/BillingInformation";

interface Props {
    clientContext?: ClientContextSliceState
}

const GraphicalAnalysis = (props: Props) => {
    const {clientContext} = props
    const bills: BillingInformation = useTypedSelector(state => state.bills.data)? useTypedSelector(state => state.bills.data)! : useTypedSelector(state => state.store.client.currentClient?.bills)!;
    const client: ClientContextSliceState = clientContext? clientContext : useTypedSelector(state => state.store.clientContext);
    const {service} = client;
    const billingService: BillingService = new BillingService();
    const isMobile = ServiceUtils.isMobileService(service)

    const [expanded, setExpanded] = useState(true);
    const [rawData, setRawData] = useState();
    const [period, setPeriod] = useState("");
    const [type, setType] = useState("");
    const [datasets , setDatasets ] = useState();
    const [formattedChartDates, setFormattedChartDates] = useState();
    const [formattedChartData, setFormattedChartData] = useState();
    const [selectedItem, setSelectedItem] = useState({});
    const [allAmounts, setAllAmounts] = useState({});
    const [errorFetching, setErrorFetching] = useState();

    useEffect(() => {
        if(!rawData) {
            loadGraphData()
        }
        if(rawData) {
            const filtered: any[] = rawData?.filter(data => checkDateRange(data?.date, period))
            let filteredData = type === "Récurrente" ? filtered?.filter(item => item?.type?.indexOf(type) !== -1) : filtered
            getChartDates(filteredData)
            getChartDatas(filteredData)
        }
    }, [bills, expanded, period, type])

    const graphColors = [
        Constants.COLORS.blue,
        Constants.COLORS.red,
        Constants.COLORS.green,
        Constants.COLORS.yellow,
        Constants.COLORS.ltRed,
        Constants.COLORS.purple,
        Constants.COLORS.darkBlue,
        Constants.COLORS.orange,
        Constants.COLORS.ltpurple,
        Constants.COLORS.ltOrange,
        Constants.COLORS.ltGrey,
    ]

    const toggleGraph = () => {
        setExpanded(!expanded);
        setPeriod("3")
        setType("Récurrente")
    };

    const changePeriod = (selectedPeriod: string) => {
        setPeriod(selectedPeriod)
        setSelectedItem({})
    }

    const changeType = (selectedType: string) => {
        setType(selectedType)
        setSelectedItem({})
    }

    const checkDateRange = (datestring: string, monthsRange: string) => {
        let dateFormat = datestring || "";
        if(dateFormat?.indexOf('/') !== -1) {
            const date_components = dateFormat?.split("/");
            const day = date_components[0];
            const month = date_components[1];
            const year = date_components[2];
            dateFormat = `${year}/${month}/${day}`;
        }
        const now = moment().format('YYYY MM')
        const nMounthsAgo = moment().subtract(monthsRange, 'months').format('YYYY MM')
        const date = moment(dateFormat).format('YYYY MM')
        return nMounthsAgo <= date && date <= now
    }

    const renderZeros = (amounts: any[], allAmountsArr: any[]) => {
        if(amounts) {
            amounts.forEach((amount, i) => {
                if(amount === 0) { // should be interpreted by the graph (like zero amounts, or "gratuit" etc...)
                    amounts[i] = Constants.BAR_ZERO
                }
                if(amount === Constants.BAR_NULL) { // added so that all arrays are same length, should not be interpreted by the graph
                    amounts[i] = null
                }
            })
            return amounts
        } else {
            return []
        }
    }

    const capitalizeLegends = (graphLegend: string) => graphLegend?.charAt(0).toUpperCase() + graphLegend?.slice(1) || ""

    const convertStringAmountToNumber = (amount: any) => {
        const amountToNumb = typeof amount === "string" && amount.indexOf(',') !== -1  ? Number(amount.replace(/,/g, '.')) : amount
        return !isNaN(amountToNumb) ? amountToNumb : 0;
    }

    const onClickChart = (datasetIndex: number, index: number, element: any) => {
        const filtered = rawData?.filter(data => checkDateRange(data.date, period)).reverse() || [];
        const bar: any = {}
        const isTotalLineClicked = element?.$datalabels[0]?.$context?.dataset?.label ? element.$datalabels[0].$context.dataset.label : ""
        const contextRaw = element && element.$context && element.$context.raw ? element.$context.raw : ""
        const isNotZeroBar = contextRaw && contextRaw !== Constants.BAR_ZERO
        bar.billReference = filtered ? filtered[index]?.billReference : ""
        bar.date = filtered ? filtered[index]?.date : ""
        bar.amount = isNotZeroBar ? contextRaw : "0"
        bar.label = formattedChartData ? formattedChartData[datasetIndex]?.label : ""
        bar.dmsItem = filtered ? filtered[index]?.dmsItems.filter(item => item?.label.toLowerCase() === bar.label.toLowerCase())[0] : []
        bar.rubrique = bar?.dmsItem && bar.dmsItem.savedLabel ? bar.dmsItem.savedLabel : isTotalLineClicked
        setSelectedItem(bar)
    }

    const saveRawLabel = (graphRawData: BillsResponseDTO[]) => {
        if(graphRawData) {
            return graphRawData.forEach(arr => {
                if(arr?.dmsItems){
                    arr.dmsItems.forEach(item => {
                        item["savedLabel"] = item.label
                    })
                }
            });
        }
    }

    const filterByLineNumber = (graphRawData: BillsResponseDTO[]) => {
        const lineNumber = service?.label;
        return graphRawData ? graphRawData?.filter(item => item?.lineNumber?.indexOf(lineNumber ? lineNumber : "") !== -1) : []
    }

    const loadGraphData = async () => {
        if(bills) {
            try {
                const bankingMovements = bills?.bankingMovements
                const filteredBankingMovements: any[] = bankingMovements.filter(bankingMovement => checkDateRange(bankingMovement?.date, '6') && bankingMovement?.bill !== null) || []
                const requestArr: BillsRequest[]  = []
                if(filteredBankingMovements) {
                    filteredBankingMovements?.forEach(filteredBankingMovement => requestArr.push({date: filteredBankingMovement?.date, billReference: filteredBankingMovement?.bill.id}))
                    const idRef = isMobile ? service?.id : service?.siebelAccount
                    const graphRawData = await billingService.getGraphData(idRef, isMobile, requestArr)
                    const dataFilteredByLineNumber = graphRawData ? filterByLineNumber(graphRawData) : []
                    saveRawLabel(dataFilteredByLineNumber)
                    setRawData(dataFilteredByLineNumber)
                    setPeriod("3")
                    setType("Récurrente")
                }
            } catch (e) {
                const error = await e;
                setErrorFetching(error.message)
                NotificationManager.error(error.message)
            }
        }
    }

    const removeDatesFromLegends = (dmsItem: DmsItem) => {
        if(dmsItem) {
            const containsDateInString = dmsItem.label?.match(/\d{2}([\/.-])\d{2}/g);
            const stringsArr = containsDateInString ? [`du ${containsDateInString[0]}`, `au ${containsDateInString[0]}`, `le ${containsDateInString[0]}`] : []

            if(stringsArr.some(str => dmsItem.label?.includes(str))) {
                const strToRemove = stringsArr?.filter(str => dmsItem.label?.indexOf(str) !== -1)[0];
                const strToRemoveIndex = dmsItem.label?.indexOf(strToRemove)
                dmsItem.label = dmsItem.label?.substr(0, strToRemoveIndex)
            }
        }
    }

    const reorganizeDatasByLabel = (datas: any[]) => { // merge all arrays in one and reorganize by label
        if(datas) {
            const items = datas ? [].concat.apply([], datas) : [];
            return _.groupBy(items, item => item?.label.toLowerCase());
        } else {
            return []
        }
    }

    const reorganizeDatasByValues = (dataSetup: any[]) => { // merge all arrays in one and reorganize by values
        const groups: any[] = [];
        if(dataSetup) {
            dataSetup.forEach((data, i) => {
                groups[i] = data?.labels.map((label, j) => {
                    return {label: data?.labels[j], amount: data?.amounts[j]}
                })
            })
            const groupedValues = reorganizeDatasByLabel(groups)
            return Object.values(groupedValues)
        } else {
            return []
        }
    }

    const getLegendsArr = (dmsItems: any[]) => {
        if(dmsItems) {
            dmsItems.forEach(arr => {
                arr.map(item => {
                    removeDatesFromLegends(item)
                })
            })
            const groupItems = reorganizeDatasByLabel(dmsItems)
            return Object.keys(groupItems)
        } else {
            return []
        }
    }

    const getAmountsArr = (dataSetup: any[]) => {
        const groupedDatas: any[] = dataSetup ? reorganizeDatasByValues(dataSetup) : []
        const amountsArr: any[] = []
        const data = {}
        if(groupedDatas) {
            groupedDatas.forEach((groupedData, i) => {
                    data[`amount${i}`] = groupedDatas[i].map(item => convertStringAmountToNumber(item?.amount || "")).reverse();
                    amountsArr.push(data[`amount${i}`])
                }
            )
        }
        return amountsArr
    }

    const setUpData = (filtered : BillsResponseDTO[]) => {
        const dataSetup: any[] = [];
        if(filtered) {
            filtered.forEach(filteredItem => {
                const amounts = filteredItem?.dmsItems?.map(dmsItem => {
                    return dmsItem?.amount
                })
                const labels = filteredItem?.dmsItems?.map(dmsItem => {
                    return dmsItem?.label?.toLowerCase()
                })
                dataSetup.push({date: filteredItem?.date, labels: labels, amounts: amounts})
            })
        }
        return dataSetup
    }

    const handleDifferencesInInvoices = (data: any[], graphLegends: string[]) => { //All arrays have to be same length
        if(data && graphLegends){
            data.forEach(el => {
                let difference;
                if(JSON.stringify(el?.labels) !== JSON.stringify(graphLegends)) {
                    difference = graphLegends?.filter(legend => el?.labels.indexOf(legend) === -1);
                }
                if(difference && difference.length > 0) {
                    difference.map(diff => {
                        el?.labels.push(diff.toString())
                        el?.amounts.push(Constants.BAR_NULL)
                    })
                }
            })
            return data
        } else {
            return []
        }
    }

    const formatDataSet = (graphLegends: string[], dataSetup: any[], graphAmounts: any[], allAmountsArr: any[]) => {
        const groupedData = dataSetup ? reorganizeDatasByValues(dataSetup) : []
        const formatedDataset: any[] = []
        if(groupedData) {
            groupedData?.map((el, i) => {
                formatedDataset.push({
                    type: 'bar',
                    label: capitalizeLegends(graphLegends[i]),
                    data: renderZeros(graphAmounts[i], allAmountsArr),
                    backgroundColor: graphColors[i],
                    minBarLength: 3
                })}
            );
        }
        setDatasets(formatedDataset)
        return formatedDataset
    }

    const getChartDates = (filtered : BillsResponseDTO[]) => {
        const datesArr: any[] = [];
        if(filtered) {
            filtered.forEach(filteredItem => {
                datesArr.push(filteredItem?.date)
            })
        }
        datesArr.reverse()
        setFormattedChartDates(datesArr)
    }

    const getChartDatas = (filtered : BillsResponseDTO[]) => {
        const dmsItems = filtered?.map(el => el?.dmsItems) || [];

        const sumAmounts: any[] = []
        const amounts: any[] = []
        dmsItems?.forEach((dmsItem: any[], i) => {
            amounts[i] = dmsItem?.map(item => {
                const strAmountNoComma = typeof item.amount === "string" ? item.amount.replace(/,/g, '.') : item.amount
                return Number(strAmountNoComma)
            })
            if(amounts[i].length > 0) {
                sumAmounts.push(amounts[i].reduce(function(a, b){return a + b}))
            } else {
                sumAmounts.push(0);
            }
        });
        const totalAmountArr = [...sumAmounts]?.reverse();
        const graphLegends = getLegendsArr(dmsItems)
        const dataSetup = setUpData(filtered)
        const invoices = handleDifferencesInInvoices(dataSetup, graphLegends)
        const graphAmounts = getAmountsArr(invoices)
        const concatGraphAmounts = [].concat.apply([], graphAmounts)
        const allAmountsArr = concatGraphAmounts && totalAmountArr ? [...concatGraphAmounts, ...totalAmountArr] : []
        const dataSet = formatDataSet(graphLegends, dataSetup, graphAmounts, allAmountsArr)
        const chartData =  [
            {
                type: 'line',
                label: 'Total facturé',
                borderColor: Constants.COLORS.pink,
                borderWidth: 2,
                borderStyle: 'solid',
                fill: false,
                data: totalAmountArr,
            },
            ...dataSet
        ]
        setAllAmounts(allAmountsArr)
        setFormattedChartData(chartData)
    }

    const handleErrorMsg = () => {
        if (errorFetching) {
            return <div className={"fething-error d-flex justify-content-center align-items-center w-100" +
            " font-weight-bold"}>
                <FormattedMessage id={"graph.data.fetching.error"}/>
            </div>
        } else if (!errorFetching && rawData?.length <= 0) {
            return <div className={"d-flex justify-content-center align-items-center w-100"}>
                <FormattedMessage id={"graph.no.data.found"}/>
            </div>
        } else {
            return <React.Fragment />
        }
    }

    const renderBarChart = () => {
        if(datasets?.length > 0) {
            return <BarChart formattedChartDates={formattedChartDates}
                             formattedChartData={formattedChartData}
                             allAmounts={allAmounts}
                             onClickChart={onClickChart}/>
        } else {
            return <div className={"d-flex justify-content-start align-items-center w-100 mt-5"}><FormattedMessage id={"graph.no.filtered.data.found"}/></div>
        }
    }

    const renderAnalyseContent = () => {
        if(rawData?.length > 0 && !errorFetching) {
            return <React.Fragment>
                <ChartHeader changePeriod={changePeriod} changeType={changeType}/>
                <Row className="w-100 d-flex justify-content-between">
                    <div className={"barChartContainer"}>
                        {bills && renderBarChart()}
                    </div>
                    <div className={"chartDetailsContainer"}>
                        <ChartDetails selectedItem={selectedItem}/>
                    </div>
                </Row>




            </React.Fragment>
        } else {
            return <div className="w-100 d-flex justify-content-center align-items-center" style={{height: "100px"}}>
                {handleErrorMsg()}
            </div>
        }
    }

    return <div className="card-block">
        <Card>
            <CardHeader className="d-flex justify-content-between">
                <DisplayTitle icon="icon-gradient icon-graph" fieldName="graphicalAnalysis.title"
                              isLoading={bills}/>
            </CardHeader>
            <CardBody>
                <CardText tag={"div"}>
                    <Row className="ml-1 mr-1 mt-2 mb-2">
                       <Col>
                           <div className={"mt-2 mb-2"}>
                               <FormattedMessage id={"graphicalAnalysis.subtitle"}/>
                           </div>
                        </Col>
                        <Col sm={1} className="d-flex justify-content-center">
                            <i className={`icon icon-black ${expanded ? 'icon-up' : 'icon-down'}`}
                               onClick={toggleGraph}/>
                        </Col>

                    </Row>
                    <Row className="ml-1 mr-1">
                        <Col>{expanded && bills ?
                                <div className="w-100 h-100">
                                    <div className="d-flex justify-content-center align-items-center flex-column mb-5">
                                        <div className="w-100 mt-2 d-flex flex-column align-items-center justify-content-center mb-3">
                                            {renderAnalyseContent()}
                                        </div>
                                    </div>
                                </div>
                            : <React.Fragment />}
                        </Col>
                    </Row>

                </CardText>
            </CardBody>
        </Card>
    </div>
};

export default GraphicalAnalysis
