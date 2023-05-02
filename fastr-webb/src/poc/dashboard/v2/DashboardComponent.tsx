import * as echarts from 'echarts';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { ACTION_STATUS, CASES_V2_ADG, HISTO_ACTIONS, HISTO_CASES } from '../mock-dashboard';
import { DashSetting, GlobalFilter } from './DashboardContainer';

interface DashboardComponentProps {
    dashSetting: DashSetting;
    globalFilter?: GlobalFilter
}

const DashboardComponent = (props: DashboardComponentProps) => {
    const { dashSetting, globalFilter } = props;
    const rondomId = (Math.random() + 1).toString(36).substring(7);

    // const dashService = new DashBoardService();
    const [chartData, setChartData] = useState<any>();
    useEffect(() => {
        // dashService[props.function](filters)
        switch (dashSetting.name) {
            case 'histoCases':
                setChartData(HISTO_CASES)
                break;
            case 'histoActions':
                setChartData(HISTO_ACTIONS)
                break;
            case 'currentCases':
                setChartData(CASES_V2_ADG)
                break;
            case 'currentActions':
                setChartData(ACTION_STATUS)
                break;

            default:
                break;
        }
    }, [dashSetting.name, globalFilter]);

    useEffect(() => {
        if (chartData) {
            const chartId = document.getElementById(rondomId);
            makeIT(chartId, chartData)
        }
    }, [chartData])

    const makeIT = (id, data) => {
        if (id) {
            const pieChart = echarts.init(id);
            pieChart.clear();
            pieChart.setOption(data);
        }
    }
    return (
        <Card className='w-1-5' style={{ height: '250px' }}>
            <CardHeader className='d-flex justify-content-between'>
                <label>{dashSetting.title}</label>
            </CardHeader>
            <CardBody className='p-0' >
                <div id={rondomId} className='w-100 h-100'></div>
            </CardBody>
        </Card>
    )
}

export default DashboardComponent