import * as echarts from 'echarts'
import React, { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Modal from "react-bootstrap/Modal"
import ReactDatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { AiOutlineDownload } from 'react-icons/ai'
import { BiFilter, BiHide, BiToggleLeft, BiToggleRight } from 'react-icons/bi'
import { BsTable } from 'react-icons/bs'
import { FiMinimize } from 'react-icons/fi'
import { GrExpand } from 'react-icons/gr'
import { useParams } from 'react-router'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { Card, CardBody, CardHeader, FormGroup } from 'reactstrap'
import ModalBody from "reactstrap/lib/ModalBody"
import { translate } from 'src/components/Intl/IntlGlobalProvider'
import './DashboardCases.css'
import {
    ACTION_ACTIVITY, ACTION_PROGRESS, ACTION_STATUS, CASES_STATUS, CASES_V2_ADG, getActionStatusDataByActivitiesLength, getCaseAdgDataByActivitiesLength, getHistoActionsSerieByActivitieLength, getHistoCasesSerieByActivitieLength, getLastFiveDays, HISTO_ACTIONS, HISTO_CASES, HISTO_CASES_DETAILS, HISTO_CASES_V2, mockTableData, SITE_TOTAL, SITE_TOTAL_DETAILS
} from './mock-dashboard'
const animatedComponents = makeAnimated();

interface Selection { value: string; label: string }

interface GlobalFilter {
    sites: Selection[];
    activities: Selection[];
    startDate: Date | null;
    endDate: Date | null;
    updated: boolean
}

interface AgentFiltes {
    histoCases: GlobalFilter;
    histoActions: GlobalFilter;
    currentCases: GlobalFilter;
    currentActions: GlobalFilter;
    caseProgression: GlobalFilter;
    casesActivities: GlobalFilter;
    inCompletCases: GlobalFilter;
}

const DashboardV2 = () => {
    const maxDate = new Date();
    const [displayDashFilter, setDisplayDashFilter] = useState(false);
    const [isDetails, setIsDetails] = useState(false);
    const [isTable, setIsTable] = useState(false);
    const [currentFilter, setCurrentFilter] = useState<string>('');
    const [barChartData, setBarChartData] = useState<any>();
    const [statusChartData, setStatusChartData] = useState<any>();
    const [adgChartData, setAdgChartData] = useState<any>();
    const [activityChartData, setActivityChartData] = useState<any>();
    const [progressChartData, setProgressChartData] = useState<any>();
    const [chartDetailData, setChartDetailData] = useState<any>();
    const [casesHistoriqueChartData, setCasesHistoriqueChartData] = useState<any>();
    const [actionsHistoriqueChartData, setActionsHistoriqueChartData] = useState<any>();
    const [currentChartToggle, setcurrentChartToggle] = useState<{ [id: string]: string }>(
        {
            status: 'actions',
            progression: 'dossier',
            activity: 'dossier'
        });
    const beginDate = new Date();
    beginDate.setDate(beginDate.getDate() - 5);
    const [globalFilter, setglobalFilter] = useState<GlobalFilter>();
    const [agentFilters, setAgentFilters] = useState<AgentFiltes>();

    const { profile } = useParams<{ profile: string }>();

    const statusChartId = document.getElementById('statusChart');
    const siteChartId = document.getElementById('siteChart');
    const casesHistoriqueChartId = document.getElementById('casesHistoriqueChart');
    const actionsHistoriqueChartId = document.getElementById('actionsHistoriqueChart');
    const progressChartId = document.getElementById('progressChart');
    const activityChartId = document.getElementById('activityChart');
    const caseAdgId = document.getElementById('caseAdgId');
    const detailChartId = document.getElementById('detailChart');

    const sitesToSelect: Selection[] = [
        { value: 'INTELCIA CASABLANCA', label: 'INTELCIA CASABLANCA' },
        { value: 'RANDSTAD OFFSHORE', label: 'RANDSTAD OFFSHORE' },
        { value: 'ALTICE CAMPUS', label: 'ALTICE CAMPUS' },
        { value: 'INTELCIA - GP SC - COTE D"IVOIRE', label: 'INTELCIA - GP SC - COTE D"IVOIRE' },
        { value: 'INTELCIA - GP SC - PORTUGAL', label: 'INTELCIA - GP SC - PORTUGAL' }
    ]
    const activityToSelect: Selection[] = [
        { value: 'FRONT CO', label: 'FRONT CO' },
        { value: 'FRONT CO PREMIUM', label: 'FRONT CO PREMIUM' },
        { value: 'BACK CO SOLUTION', label: 'BACK CO SOLUTION' }
    ]

    const filterNameDictionary = {
        histoCases: 'historique des dossiers',
        histoActions: 'historique des actions',
        currentCases: 'dossiers encours',
        currentActions: 'actions encours',
        caseProgression: 'dossiers escaladé encours',
        casesActivities: 'dossier encours par activities',
        inCompletCases: 'Mes dossiers incomplets'
    }
    useEffect(() => {
        setBarChartData(SITE_TOTAL);
        setStatusChartData(ACTION_STATUS);
        setProgressChartData(ACTION_PROGRESS);
        setActivityChartData(ACTION_ACTIVITY);
        setCasesHistoriqueChartData(HISTO_CASES_V2);
        setActionsHistoriqueChartData(HISTO_ACTIONS);
        setAdgChartData(CASES_V2_ADG);
        setglobalFilter({
            sites: [sitesToSelect[0]],
            activities: [],
            startDate: beginDate,
            endDate: maxDate,
            updated: false
        })
    }, []);

    useEffect(() => {
        if (barChartData) {
            makeIT(siteChartId, barChartData)
        }
    }, [barChartData])

    useEffect(() => {
        if (statusChartData) {
            makeIT(statusChartId, statusChartData)
        }
    }, [statusChartData])

    useEffect(() => {
        if (progressChartData) {
            makeIT(progressChartId, progressChartData)
        }
    }, [progressChartData])

    useEffect(() => {
        if (activityChartData) {
            makeIT(activityChartId, activityChartData)
        }
    }, [activityChartData])

    useEffect(() => {
        if (chartDetailData) {
            makeIT(detailChartId, chartDetailData)
        }
    }, [chartDetailData])

    useEffect(() => {
        if (casesHistoriqueChartData) {
            makeIT(casesHistoriqueChartId, casesHistoriqueChartData)
        }
    }, [casesHistoriqueChartData])

    useEffect(() => {
        if (actionsHistoriqueChartData) {
            makeIT(actionsHistoriqueChartId, actionsHistoriqueChartData)
        }
    }, [actionsHistoriqueChartData])

    useEffect(() => {
        if (adgChartData) {
            makeIT(caseAdgId, adgChartData)
        }
    }, [adgChartData])


    useEffect(() => {
        if (globalFilter) {
            setAgentFilters({
                histoActions: globalFilter,
                histoCases: globalFilter,
                currentActions: globalFilter,
                currentCases: globalFilter,
                caseProgression: globalFilter,
                casesActivities: globalFilter,
                inCompletCases: globalFilter
            });
        }
    }, [globalFilter]);

    useEffect(() => {
        if (globalFilter) {
            // let localHistoCases = { ...HISTO_CASES, series: getHistoCasesSerieByActivitieLength(globalFilter.activities.length, 5) };
            // setCasesHistoriqueChartData(localHistoCases);

            let localHistoActions = { ...HISTO_ACTIONS, series: getHistoActionsSerieByActivitieLength(globalFilter.activities.length, 5) };
            setActionsHistoriqueChartData(localHistoActions);

            const caseAdgData = { ...CASES_V2_ADG.series[0], data: getCaseAdgDataByActivitiesLength(globalFilter.activities.length) };
            setAdgChartData({ ...CASES_V2_ADG, series: caseAdgData });

            const caseStatusData = { ...CASES_STATUS.series[0], data: getActionStatusDataByActivitiesLength(globalFilter.activities.length) };
            setStatusChartData({ ...CASES_STATUS, series: caseStatusData });
        }

    }, [globalFilter?.activities])



    const openFilter = (filter: string) => {
        setCurrentFilter(filter);
        setDisplayDashFilter(true);
    }
    // const searchDetails = () => { console.log(''); }
    const makeIT = (id, data) => {
        if (id) {
            const pieChart = echarts.init(id);
            pieChart.clear();
            pieChart.setOption(data);
        }
    }

    const columns = [
        {
            dataField: 'creationDate',
            text: translate.formatMessage({ id: "tray.action.table.header.creationDate" }),
            headerStyle: {
                width: '12%',
            }
        },
        {
            dataField: 'label',
            text: "Libellé",

            align: 'left'

        },
        {
            dataField: 'statut',
            text: translate.formatMessage({ id: "tray.action.table.header.status" }),
            headerStyle: {
                width: '12%',
            }
        },
        {
            dataField: 'lastUpdate',
            text: translate.formatMessage({ id: "tray.action.table.header.updateDate" }),
            headerStyle: {
                width: '15%',
            }
        },
        {
            dataField: 'activity',
            text: "Activité",
            headerStyle: {
                width: '12%',
            }
        },
        {
            dataField: 'handledBy',
            text: translate.formatMessage({ id: "tray.action.table.header.assignee.login" }),
            headerStyle: {
                width: '12%',
            }
        }
    ]




    const changeToggle = (name: string, value: string) => {
        const newDictionary = currentChartToggle;
        newDictionary[name] = value;
        if (name === 'status') {
            setStatusChartData(value === 'actions' ? ACTION_STATUS : CASES_STATUS)
        }
        setcurrentChartToggle({ ...newDictionary });
    }
    const seeDetail = (name: string) => {
        setIsDetails(true);
        switch (name) {
            case 'site':
                setChartDetailData(SITE_TOTAL_DETAILS);
                break;
            case 'historique':
                setChartDetailData(HISTO_CASES_DETAILS);
                break;
            default:
                break;
        }
    }
    const updateGlobalFilter = (value, type: string) => {
        if (globalFilter) {
            const newFilter = globalFilter;
            newFilter[type] = value;
            setglobalFilter({ ...globalFilter, [type]: value });
        }
    }

    const getHistoPeriod = (type: string, startDate?: Date) => {
        if (agentFilters) {
            const begin = startDate ? startDate : agentFilters[type].startDate;
            const diffTime = Math.abs(agentFilters[type].endDate.getTime() - begin.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        } else {
            return 0
        }
    }
    const updateAgentFilters = (value, type: string) => {
        if (agentFilters) {
            setAgentFilters({ ...agentFilters, [currentFilter]: { ...agentFilters[currentFilter], [type]: value, updated: true } });
            if (type === 'activities') {
                if (currentFilter === 'histoCases') {
                    const diffDays = getHistoPeriod('histoCases')
                    let localHistCases = {
                        ...HISTO_CASES,
                        xAxis: { ...HISTO_CASES.xAxis, data: getLastFiveDays(diffDays + 1) },
                        series: getHistoCasesSerieByActivitieLength(value.length, diffDays)
                    };
                    console.log(localHistCases)
                    // setCasesHistoriqueChartData(localHistCases);
                }

                if (currentFilter === 'histoActions') {
                    const diffDays = getHistoPeriod('histoActions')
                    let localHistoActions = {
                        ...HISTO_ACTIONS,
                        xAxis: { ...HISTO_ACTIONS.xAxis, data: getLastFiveDays(diffDays + 1) },
                        series: getHistoActionsSerieByActivitieLength(value.length, diffDays)
                    };
                    setActionsHistoriqueChartData(localHistoActions);
                }

                if (currentFilter === 'currentActions') {
                    const caseStatusData = { ...CASES_STATUS.series[0], data: getActionStatusDataByActivitiesLength(value.length) };
                    setStatusChartData({ ...CASES_STATUS, series: caseStatusData });
                }

                if (currentFilter === 'inCompletCases') {
                    const caseAdgData = { ...CASES_V2_ADG.series[0], data: getCaseAdgDataByActivitiesLength(value.length) };
                    setAdgChartData({ ...CASES_V2_ADG, series: caseAdgData });
                }
            }
            if (type === 'startDate') {
                if (currentFilter === 'histoCases') {
                    const diffDays = getHistoPeriod('histoCases', value)
                    const serries = getHistoCasesSerieByActivitieLength(agentFilters.histoCases.activities.length, diffDays);
                    let localHistCases = {
                        ...HISTO_CASES,
                        xAxis: { ...HISTO_CASES.xAxis, data: getLastFiveDays(diffDays + 1) },
                        series: serries
                    };
                    console.log(localHistCases)
                    // setCasesHistoriqueChartData(localHistCases);
                }

                if (currentFilter === 'histoActions') {
                    const diffDays = getHistoPeriod('histoActions', value)
                    const serries = getHistoActionsSerieByActivitieLength(agentFilters.histoActions.activities.length, diffDays);
                    let localHistCases = {
                        ...HISTO_ACTIONS,
                        xAxis: { ...HISTO_ACTIONS.xAxis, data: getLastFiveDays(diffDays + 1) },
                        series: serries
                    };
                    setActionsHistoriqueChartData(localHistCases);
                }
            }
        }
    }

    const updatePeriod = (period: string) => {
        const today = new Date();
        let value = new Date(new Date().setDate(today.getDate() - 5));
        switch (period) {
            case '5':
                updateAgentFilters(value, 'startDate');
                break;
            case '10':
                value = new Date(new Date().setDate(today.getDate() - 10));
                updateAgentFilters(value, 'startDate');
                break;
            case '15':
                value = new Date(new Date().setDate(today.getDate() - 15));
                updateAgentFilters(value, 'startDate');
                break;

            default:
                updateAgentFilters(value, 'startDate');
                break;
        }
    }
    return (
        <div className='d-flex flex-column pt-2 pl-2'>
            {/* filters */}
            <div className='w-100 d-flex mb-3'>
                <div className='w-100 d-flex'>
                    {/* sites filter */}
                    <div className='d-flex flex-column justify-content-center mr-3'>
                        <BiFilter size={20} />
                    </div>
                    {profile === 'admin' && <div className="input-group w-25 mr-2">
                        <Select
                            className='w-100'
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti={true}
                            options={sitesToSelect}
                            onChange={(e) => updateGlobalFilter(e, 'sites')}
                            value={globalFilter?.sites}
                        />
                    </div>}
                    {/* activities filter */}
                    <div className={"input-group mr-2 " + (profile === 'admin' ? 'w-25' : 'w-25')}>
                        <Select
                            className='w-100'
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={activityToSelect}
                            onChange={(e) => updateGlobalFilter(e, 'activities')}
                            value={globalFilter?.activities}
                        />
                    </div>
                    {/* date plage */}
                    <div className="w-25 mr-2 d-flex">
                        <ReactDatePicker
                            onChange={(e) => updateGlobalFilter(e, 'startDate')}
                            value={globalFilter?.startDate?.toLocaleDateString()}
                            selected={globalFilter?.startDate}
                            maxDate={globalFilter?.endDate}
                            className='date-input mr-2'
                            placeholderText='start date'
                        />
                        <ReactDatePicker
                            onChange={(e) => updateGlobalFilter(e, 'endDate')}
                            value={globalFilter?.endDate?.toLocaleDateString()}
                            selected={globalFilter?.endDate}
                            maxDate={maxDate}
                            className='date-input'
                            placeholderText='end date'
                        />
                    </div>
                    {/* search button */}
                    <div className='ml-3 w-25 d-flex justify-content-center'>
                        <button className='btn btn-primary'>Rechercher</button>
                    </div>
                </div>
            </div>
            {/* dashbords admin */}
            {profile === 'admin' && <div className='d-flex mt-3 justify-content-between'>
                {/* sites */}
                <Card className='w-1-5' hidden={isDetails}>
                    <CardHeader className='d-flex justify-content-between'>
                        <label>Totals by Sites</label>
                        <div className='d-flex justify-content-end'>
                            {/* <BsTable className='mr-2 cursor-pointer' size={15} onClick={() => setIsTable(true)} /> */}
                            <BiFilter size={15} className={'mr-2 cursor-pointer ' + (agentFilters?.histoCases.updated ? 'text-danger' : ' ')} onClick={() => openFilter('site')} />
                            <GrExpand size={15} className='mr-2 cursor-pointer' onClick={() => seeDetail('site')} />
                        </div>
                    </CardHeader>
                    <CardBody className='p-0' style={{ height: '250px' }}>
                        <div id="siteChart" className='w-100 h-100'></div>
                    </CardBody>
                </Card>
                {/* status */}
                <Card className='w-1-5' hidden={isDetails}>
                    <CardHeader className='d-flex justify-content-between'>
                        <label>{currentChartToggle.status} par statut</label>
                        <div className='d-flex justify-content-end'>
                            {currentChartToggle.status === 'actions' ? <BiToggleLeft className='mr-2 cursor-pointer' size={15} onClick={() => changeToggle('status', 'dossier')} /> :
                                <BiToggleRight size={15} className='mr-2 cursor-pointer' onClick={() => changeToggle('status', 'actions')} />}
                            <BsTable className='mr-2 cursor-pointer' size={15} onClick={() => setIsTable(true)} />
                            <BiFilter size={15} className={'mr-2 cursor-pointer ' + (agentFilters?.currentActions.updated ? 'text-danger' : ' ')} onClick={() => openFilter(currentChartToggle.status === 'actions' ? 'currentActions' : 'currentCases')} />
                            <GrExpand size={15} className='mr-2 cursor-pointer' />
                        </div>
                    </CardHeader>
                    <CardBody className='p-0'>
                        <div id="statusChart" className='w-100 h-100'></div>
                    </CardBody>
                </Card>
                {/* progression */}
                <Card className='w-1-5' hidden={isDetails}>
                    <CardHeader className='d-flex justify-content-between'>
                        <label>{currentChartToggle.progression} par progression</label>
                        <div className='d-flex justify-content-end'>
                            {/* {currentChartToggle.progression === 'actions' ? <BiToggleLeft className='mr-2 cursor-pointer' size={15} onClick={() => changeToggle('progression', 'dossier')} /> :
                                <BiToggleRight size={15} className='mr-2 cursor-pointer' onClick={() => changeToggle('progression', 'actions')} />} */}
                            <BsTable className='mr-2 cursor-pointer' size={15} onClick={() => setIsTable(true)} />
                            <BiFilter size={15} className={'mr-2 cursor-pointer ' + (agentFilters?.caseProgression.updated ? 'text-danger' : ' ')} onClick={() => openFilter('caseProgression')} />
                            <GrExpand size={15} className='mr-2 cursor-pointer' />
                        </div>
                    </CardHeader>
                    <CardBody className='p-0'>
                        <div id="progressChart" className='w-100 h-100'></div>
                    </CardBody>
                </Card>
                {/* activities */}
                <Card className='w-1-5' hidden={isDetails}>
                    <CardHeader className='d-flex justify-content-between'>
                        <label>{currentChartToggle.activity} par activities</label>
                        <div className='d-flex justify-content-end'>
                            {/* {currentChartToggle.activity === 'actions' ? <BiToggleLeft className='mr-2 cursor-pointer' size={15} onClick={() => changeToggle('activity', 'dossier')} /> :
                                <BiToggleRight size={15} className='mr-2 cursor-pointer' onClick={() => changeToggle('activity', 'actions')} />} */}
                            <BsTable className='mr-2 cursor-pointer' size={15} />
                            <BiFilter size={15} className={'mr-2 cursor-pointer ' + (agentFilters?.casesActivities.updated ? 'text-danger' : ' ')} onClick={() => openFilter('casesActivities')} />
                            <GrExpand size={15} className='mr-2 cursor-pointer' />
                        </div>
                    </CardHeader>
                    <CardBody className='p-0'>
                        <div id="activityChart" className='w-100 h-100'></div>
                    </CardBody>
                </Card>
            </div>}
            {/* dashbords agent */}
            {profile !== 'admin' && <div className='d-flex mt-3 justify-content-between'>
                {/* historique dossier */}
                <Card className='w-1-3' hidden={isDetails}>
                    <CardHeader className='d-flex justify-content-between'>
                        <label>Mes dossiers récents </label>
                        <div className='d-flex justify-content-end'>
                            <BsTable className='mr-2 cursor-pointer' size={15} onClick={() => setIsTable(true)} />
                            <BiFilter size={15} className={'mr-2 cursor-pointer ' + (agentFilters?.histoCases.updated ? 'text-danger' : ' ')} onClick={() => openFilter('histoCases')} />
                            <GrExpand size={15} className='mr-2 cursor-pointer' onClick={() => seeDetail('historique')} />
                        </div>
                    </CardHeader>
                    <CardBody className='p-0' style={{ height: '250px' }}>
                        <div id="casesHistoriqueChart" className='w-100 h-100'></div>
                    </CardBody>
                </Card>
                {/* historique actions */}
                {/* <Card className='w-1-5' hidden={isDetails}>
                    <CardHeader className='d-flex justify-content-between'>
                        <label>Mes actions créé</label>
                        <div className='d-flex justify-content-end'>
                            <BsTable className='mr-2 cursor-pointer' size={15} onClick={() => setIsTable(true)} />
                            <BiFilter size={15} className={'mr-2 cursor-pointer ' + (agentFilters?.histoActions.updated ? 'text-danger' : ' ')} onClick={() => openFilter('histoActions')} />
                            <GrExpand size={15} className='mr-2 cursor-pointer' onClick={() => seeDetail('actionsHistorique')} />
                        </div>
                    </CardHeader>
                    <CardBody className='p-0' style={{ height: '250px' }}>
                        <div id="actionsHistoriqueChart" className='w-100 h-100'></div>
                    </CardBody>
                </Card> */}
                {/* current action or cases */}
                <Card className='w-1-5' hidden={isDetails}>
                    <CardHeader className='d-flex justify-content-between'>
                        <label>Mes actions en cours</label>
                        <div className='d-flex justify-content-end'>
                            {/* {currentChartToggle.status === 'actions' ? <BiToggleLeft className='mr-2 cursor-pointer' size={15} onClick={() => changeToggle('status', 'dossier')} /> :
                                <BiToggleRight size={15} className='mr-2 cursor-pointer' onClick={() => changeToggle('status', 'actions')} />} */}
                            <BsTable className='mr-2 cursor-pointer' size={15} onClick={() => setIsTable(true)} />
                            <BiFilter size={15} className={'mr-2 cursor-pointer ' + (agentFilters?.currentActions.updated ? 'text-danger' : ' ')} onClick={() => openFilter(currentChartToggle.status === 'actions' ? 'currentActions' : 'currentCases')} />
                            <GrExpand size={15} className='mr-2 cursor-pointer' />
                        </div>
                    </CardHeader>
                    <CardBody className='p-0'>
                        <div id="statusChart" className='w-100 h-100'></div>
                    </CardBody>
                </Card>

                {/* adg */}
                <Card className='w-1-5' hidden={isDetails}>
                    <CardHeader className='d-flex justify-content-between'>
                        <label>Mes dossiers incomplets</label>
                        <div className='d-flex justify-content-end'>
                            <BsTable className='mr-2 cursor-pointer' size={15} onClick={() => setIsTable(true)} />
                            <BiFilter size={15} className={'mr-2 cursor-pointer ' + (agentFilters?.inCompletCases.updated ? 'text-danger' : ' ')} onClick={() => openFilter('inCompletCases')} />
                            <GrExpand size={15} className='mr-2 cursor-pointer' />
                        </div>
                    </CardHeader>
                    <CardBody className='p-0'>
                        <div id="caseAdgId" className='w-100 h-100'></div>
                    </CardBody>
                </Card>
            </div>}
            {/* display details */}
            <div className='d-flex mt-3'>
                <Card className='w-100' hidden={!isDetails}>
                    <CardHeader className='d-flex justify-content-between'>
                        <label>Details Total by Sites</label>
                        <div className='d-flex justify-content-end'>
                            <BsTable className='mr-2 cursor-pointer' size={15} onClick={() => setIsTable(true)} />
                            <FiMinimize size={15} className='mr-2 cursor-pointer' onClick={() => setIsDetails(false)} />
                        </div>
                    </CardHeader>
                    <CardBody className='p-0' style={{ height: '350px' }}>
                        <div id="detailChart" className='w-100 h-100'></div>
                    </CardBody>
                </Card>
            </div>
            {/* Table */}
            {isTable &&
                <Card className='d-flex w-100 flex-column'>
                    <div className='d-flex justify-content-end pr-4 pt-3'>
                        <BiHide size={20} className='mr-2 cursor-pointer' onClick={() => setIsTable(false)} />
                        <AiOutlineDownload size={20} className='mr-2 cursor-pointer' />
                    </div>
                    <CardBody>
                        <BootstrapTable data={mockTableData}
                            columns={columns}
                            keyField='actionId' />
                    </CardBody>
                </Card>}
            {/* dashboard filters modal */}
            <Modal show={displayDashFilter} onHide={() => { setDisplayDashFilter(false) }} contentClassName={"lg"} dialogClassName="lg">
                <Modal.Header closeButton onHide={() => { setDisplayDashFilter(false) }} className={"border-bottom"}
                    style={{ backgroundColor: "#E8E8E8" }}>
                    <span className="icon-gradient font-size-xl icon-conversations mr-2" />
                    {currentFilter.length > 0 && agentFilters && agentFilters[currentFilter] ?
                        <h4>Filters pour {filterNameDictionary[currentFilter]}</h4> :
                        <h4>Select Costum Filters</h4>}
                </Modal.Header>
                <ModalBody className="histo-rapide__modal-body">
                    {currentFilter.length > 0 && agentFilters && agentFilters[currentFilter] ?
                        <div className='w-75 d-flex flex-column pl-4 pt-2'>
                            {profile === 'admin' && <Select
                                className='w-100 mb-3'
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti={true}
                                options={sitesToSelect}
                                onChange={(e) => updateAgentFilters(e, 'sites')}
                                value={agentFilters[currentFilter]?.sites}
                            />}
                            <Select
                                className='w-100 mb-3'
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti={true}
                                options={activityToSelect}
                                onChange={(e) => updateAgentFilters(e, 'activities')}
                                value={agentFilters[currentFilter]?.activities}
                            />
                            {!['histoCases', 'histoActions'].includes(currentFilter) &&
                                <div className='d-flex justify-content-between w-100 mb-3'>
                                    <ReactDatePicker
                                        onChange={(e) => updateAgentFilters(e, 'startDate')}
                                        selected={agentFilters[currentFilter]?.startDate}
                                        maxDate={agentFilters[currentFilter]?.endDate}
                                        className='date-input'
                                        placeholderText='start date'
                                    />
                                    <ReactDatePicker
                                        onChange={(e) => updateAgentFilters(e, 'endDate')}
                                        selected={agentFilters[currentFilter]?.endDate}
                                        maxDate={maxDate}
                                        className='date-input'
                                        placeholderText='end date'
                                    />
                                </div>}
                            {['histoCases', 'histoActions'].includes(currentFilter) &&
                                <div className='w-50'>
                                    <FormGroup>
                                        <select className='form-control w-75' value={getHistoPeriod(currentFilter)} onChange={(e) => updatePeriod(e.target.value)}>
                                            <option value='5' selected>5 derniers jours</option>
                                            <option value='10'>10 derniers jours</option>
                                            <option value='15'>15 derniers jours</option>
                                        </select>
                                    </FormGroup>

                                </div>}
                            <div className='d-flex justify-content-center'>
                                <button className='w-50 btn btn-primary'>Search</button>
                            </div>
                        </div> :
                        <h2>Failed to load filters</h2>}
                </ModalBody>
            </Modal>
        </div>
    )
}

export default DashboardV2