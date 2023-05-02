import * as echarts from 'echarts';
import React, { useEffect, useMemo, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import Modal from "react-bootstrap/Modal";
import { BiFilter } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Card, CardBody } from 'reactstrap';
import ModalBody from "reactstrap/lib/ModalBody";
import { translate } from 'src/components/Intl/IntlGlobalProvider';
import DashBarDetails from './DashBarDetails';
import DashPieChart from './DashPieChart';
import {
    barSeriesMakerV2, BAR_OPTIONS, colorPalette, DashBoardFirstLevelDTO, DashBoardSetting, PIE_OPTIONS, retirveDashDataFirstLevel, retirveDashDataSecondLevel
} from './mock.setting';

type EChartsOption = echarts.EChartsOption;
const animatedComponents = makeAnimated();
const DashBoardGeneric = () => {
    const [dashBoardSetting, setDashBoardSetting] = useState<DashBoardSetting>();
    const [firstLevelData, setFirstLevelData] = useState<DashBoardFirstLevelDTO>();
    const [pieChartData, setPieChartData] = useState<EChartsOption>();
    const [barChartData, setBarChartData] = useState<any>();
    const [firstLevelFilters, setfirstLevelFilters] = useState<string[]>([]);
    const [firstLevelCurrentFilter, setFirstLevelCurrentFilter] = useState<string>('');
    const [secondLevelDataDictionnary, setSecondLevelDataDictionnary] = useState<any>({});
    const [secondLevelCurrentDictionnary, setSecondLevelCurrentDictionnary] = useState<any>({});
    const [secondLevelFilters, setSecondLevelFilters] = useState<string[]>([]);
    const [secondLevelCurrentFilter, setSecondLevelCurrentFilter] = useState<string>('');
    const [displayTable, setDisplayTable] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState<any[]>([]);
    const [openCustomFilters, setOpenCustomFilters] = useState<boolean>(false);
    // chargement des dashboard settings
    useEffect(() => {
        // setDashBoardSetting(firstCallToRetrieveSettings(profile));
        setBarChartData(BAR_OPTIONS);
    }, []);
    // rertive first level data 
    useEffect(() => {
        if (dashBoardSetting) {
            setFirstLevelData(retirveDashDataFirstLevel(dashBoardSetting?.firstLevel.name, dashBoardSetting?.type));
        }
    }, [dashBoardSetting]);

    // prepar first dashboard data; 
    useEffect(() => {
        if (firstLevelData) {
            let options = PIE_OPTIONS;
            options.color = dashBoardSetting?.firstLevel.colors ?? colorPalette;
            options.title = { ...options.title, text: `Total des ${dashBoardSetting?.type} par ${dashBoardSetting?.firstLevel.name}` };
            if (options.series) {
                options.series[0].data = firstLevelData.data;
            }
            setPieChartData(options);
        }
    }, [firstLevelData]);

    // clear second level filters if first level filters is empty
    useEffect(() => {
        if (firstLevelFilters.length === 0) {
            setSecondLevelFilters([]);
            setSecondLevelCurrentFilter('');
            setSecondLevelDataDictionnary({});
        }
    }, [firstLevelFilters]);

    // set first level filter from current memo filter
    useEffect(() => {
        if (firstLevelCurrentFilter.length > 0 && firstLevelFilters.length < 3 && !firstLevelFilters.find(a => a === firstLevelCurrentFilter) && dashBoardSetting) {
            setfirstLevelFilters([...firstLevelFilters, firstLevelCurrentFilter]);
            loadSecondLevelData(firstLevelCurrentFilter, dashBoardSetting);
        }
    }, [firstLevelCurrentFilter]);

    // set first second filter from current memo filter
    useEffect(() => {
        if (secondLevelCurrentFilter.length > 0 && !secondLevelFilters.find(a => a === secondLevelCurrentFilter)) {
            setSecondLevelFilters([...secondLevelFilters, secondLevelCurrentFilter]);
            // load detauils;
        }
    }, [secondLevelCurrentFilter]);


    useEffect(() => {
        if (secondLevelFilters.length > 0) {
            setDisplayTable(true);
            console.info(`retrieve details of data for ACTIONS by ${firstLevelFilters} by ${secondLevelFilters}`)
        } else {
            setDisplayTable(false);
        }
    }, [secondLevelFilters]);
    // second level dashboard data dictionnary
    useEffect(() => {
        setSecondLevelDataDictionnary({ ...secondLevelDataDictionnary, ...secondLevelCurrentDictionnary });
    }, [secondLevelCurrentDictionnary]);

    // prepare second level dashboard chart data 
    useEffect(() => {
        if (secondLevelDataDictionnary) {
            const barLabelsData = barSeriesMakerV2(secondLevelDataDictionnary);
            let series: any[] = [];
            Object.keys(barLabelsData).forEach(key => {
                series = [...series, barLabelsData[key]];
            });
            setBarChartData({ ...BAR_OPTIONS, xAxis: { ...BAR_OPTIONS.xAxis, data: firstLevelFilters }, series });

        }
    }, [secondLevelDataDictionnary]);

    // update first level filter
    const search = (params) => {
        setFirstLevelCurrentFilter(params.name);
    }
    // update second level filter
    const searchDetails = (params) => {
        setSecondLevelCurrentFilter(params.seriesName);
    }
    // update second level data dictionary
    const loadSecondLevelData = (firstFilterValue: string, dashBoardSetting: DashBoardSetting) => {
        if (!secondLevelDataDictionnary[firstFilterValue]) {
            const secondData = retirveDashDataSecondLevel(dashBoardSetting, firstFilterValue);
            setSecondLevelCurrentDictionnary({ [firstFilterValue]: secondData.data });
        }
    }

    const clearItemFromFirstLevelFilter = (index: number) => {
        setfirstLevelFilters([...firstLevelFilters.slice(0, index), ...firstLevelFilters.slice(index + 1)]);
        setFirstLevelCurrentFilter('');
    }

    const clearItemFromSecondLevelFilter = (index: number) => {
        const newDetails = [...secondLevelFilters.slice(0, index), ...secondLevelFilters.slice(index + 1)];
        setSecondLevelFilters(newDetails);
        setSecondLevelCurrentFilter('');
    }

    const clearAllFilters = () => {
        setfirstLevelFilters([]);
        setFirstLevelCurrentFilter('');
        clearSecondLevelFilters();
    }
    const clearSecondLevelFilters = () => {
        setSecondLevelFilters([]);
        setSecondLevelCurrentFilter('');
    }


    const tableDATA = [{
        creationDate: '09/09/2022',
        actionId: '650',
        theme: 'Recherche Remboursement',
        status: 'Pris En Charge',
        progressStatus: 'Analyse non démarrée',
        updateDate: '03/10/2022',
        handledBy: 'lgirardeau',
        doNotResolveBeforeDate: '',
        serviceType: 'ADSL'
    }, {
        creationDate: '09/09/2022',
        actionId: '652',
        theme: 'Recherche Remboursement',
        status: 'Pris En Charge',
        progressStatus: 'Analyse non démarrée',
        updateDate: '03/10/2022',
        handledBy: 'lgirardeau',
        doNotResolveBeforeDate: '',
        serviceType: 'ADSL'
    }, {
        creationDate: '09/09/2022',
        actionId: '630',
        theme: 'Recherche Remboursement',
        status: 'Pris En Charge',
        progressStatus: 'Analyse non démarrée',
        updateDate: '03/10/2022',
        handledBy: 'lgirardeau',
        doNotResolveBeforeDate: '',
        serviceType: 'ADSL'
    }, {
        creationDate: '09/09/2022',
        actionId: '655',
        theme: 'Recherche Remboursement',
        status: 'Pris En Charge',
        progressStatus: 'Analyse non démarrée',
        updateDate: '03/10/2022',
        handledBy: 'lgirardeau',
        doNotResolveBeforeDate: '',
        serviceType: 'ADSL'
    }];
    const columns = [
        {
            dataField: 'creationDate',
            text: translate.formatMessage({ id: "tray.action.table.header.creationDate" })
        },
        {
            dataField: 'actionId',
            text: translate.formatMessage({ id: "tray.action.table.header.actionId" })

        },
        {
            dataField: 'tags',
            text: translate.formatMessage({ id: "tray.action.table.header.themeQualification.tags" })
        },
        {
            dataField: 'status',
            text: translate.formatMessage({ id: "tray.action.table.header.status" })
        },
        {
            dataField: 'progressStatus',
            text: translate.formatMessage({ id: "tray.action.table.header.progressStatus" })
        },
        {
            dataField: 'processCurrentState.updateDate',
            text: translate.formatMessage({ id: "tray.action.table.header.updateDate" })
        },
        {
            dataField: 'handledBy',
            text: translate.formatMessage({ id: "tray.action.table.header.assignee.login" })
        },
        {
            dataField: 'doNotResolveBeforeDate',
            text: translate.formatMessage({ id: "tray.action.table.header.doNotResolveBeforeDate" })
        },
        {
            dataField: 'serviceType',
            text: translate.formatMessage({ id: "tray.action.table.header.serviceType" })
        }
    ]
    const options = [
        { value: 'site', label: 'site' },
        { value: 'status', label: 'status' },
        { value: 'service', label: 'service' },
        { value: 'activity', label: 'activity' }
    ]

    const onSelectChange = (newValue, action) => {
        if (selectedStyle.length < 2 || action.action === 'remove-value') {
            setSelectedStyle([...newValue]);
        }
    }
    const generateDashboardMainSetting = () => {
        const dashBoardSetting: DashBoardSetting = {
            firstLevel: { name: selectedStyle[0].label },
            secondLevel: { name: selectedStyle[1].label },
            type: 'ACTIONS'
        }
        setDashBoardSetting(dashBoardSetting);
    }
    const memoPieChart = useMemo(() => <DashPieChart data={pieChartData} chartClick={search} />, [pieChartData]);
    const memoBarChartDetails = useMemo(() => <DashBarDetails data={barChartData} chartClick={searchDetails} sites={firstLevelFilters} />, [barChartData, firstLevelFilters]);
    return (
        <div className='w-100 d-flex flex-column'>
            <div className='w-1-3 d-flex mb-2 justify-content-between'>
                <Select
                    className='w-75'
                    closeMenuOnSelect={false}
                    value={selectedStyle}
                    onChange={onSelectChange}
                    components={animatedComponents}
                    isMulti={selectedStyle.length < 3}
                    options={options}
                />
                <button className='btn btn-sm btn-primary' disabled={selectedStyle.length !== 2} onClick={generateDashboardMainSetting}>generate</button>
            </div>


            <div className='w-100 d-flex h-100 justify-content-between' style={{ gap: '10px' }}>
                {dashBoardSetting && memoPieChart}
                {memoBarChartDetails}
                {dashBoardSetting && firstLevelFilters.length > 0 &&
                    <Card className='filter-bloc d-flex mb-2'>
                        <CardBody className='d-flex flex-column'>
                            {/* block sites */}
                            {firstLevelFilters.length > 0 ?
                                <div className='d-flex flex-column mb-2'>
                                    <div className=' w-100 d-flex justify-content-between'>
                                        <label>{dashBoardSetting?.firstLevel.name}:</label>
                                        <button
                                            className='btn btn-link btn-sm'
                                            onClick={() => clearAllFilters()}>
                                            <GrClose />
                                        </button>
                                    </div>
                                    <div>
                                        {firstLevelFilters.map((filter, index) => (
                                            <div className='d-flex mr-2 justify-content-between mb-2 px-2 py-1 fw-semibold text-success-emphasis bg-success-subtle border border-success-subtle rounded-2'>
                                                <span className='mr-2'>{filter}</span><span className='cursor-pointer' onClick={() => clearItemFromFirstLevelFilter(index)}><FaTrash color='red' /></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                : <div></div>}
                            {/* block site details */}
                            {secondLevelFilters.length > 0 ?
                                <div className='d-flex flex-column mb-2'>
                                    <div className='w-100 d-flex justify-content-between'>
                                        <label>{dashBoardSetting?.secondLevel.name}:</label>
                                        <button
                                            className='btn btn-link btn-sm'
                                            onClick={() => clearSecondLevelFilters()}>
                                            <GrClose />
                                        </button>
                                    </div>
                                    <div>
                                        {secondLevelFilters.map((filter, index) => (
                                            <div className='d-flex mr-2 justify-content-between mb-2 px-2 py-1 fw-semibold text-success-emphasis bg-success-subtle border border-success-subtle rounded-2'>
                                                <span className='mr-2'>{filter}</span><span className='cursor-pointer' onClick={() => clearItemFromSecondLevelFilter(index)}><FaTrash color='red' /></span>
                                            </div>
                                        ))}
                                    </div>
                                </div> :
                                <div></div>}
                        </CardBody>
                    </Card>}
            </div>
            <div className='w-100 mt-4'>
                {displayTable && <div className='w-100'>
                    <Card>
                        <CardBody className='d-flex flex-column'>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-sm btn-link' onClick={() => { setOpenCustomFilters(true) }}><BiFilter size={30} /></button>
                            </div>
                            <BootstrapTable data={tableDATA}
                                columns={columns}
                                keyField='actionId' />
                        </CardBody>
                    </Card>
                </div>}
            </div>
            <Modal show={openCustomFilters} onHide={() => { setOpenCustomFilters(false) }} contentClassName={"vlg"} dialogClassName="vlg">
                <Modal.Header closeButton onHide={() => { setOpenCustomFilters(false) }} className={"border-bottom"}
                    style={{ backgroundColor: "#E8E8E8" }}>
                    <span className="icon-gradient font-size-xl icon-conversations mr-2" />
                    <h4>Select Costum Filters</h4>
                </Modal.Header>
                <ModalBody className="histo-rapide__modal-body">
                    <h2>FILTERS .....</h2>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default DashBoardGeneric