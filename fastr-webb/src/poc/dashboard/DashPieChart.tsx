import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader } from 'reactstrap';
import * as echarts from 'echarts';
import './DashboardCases.css';
const DashPieChart = (props) => {
    const main = document.getElementById('main');
    const [firstLoad, setFirstLoad] = useState(true);
    const [chart, setchart] = useState<echarts.ECharts>();
    useEffect(() => {
        if (main) {
            const pieChart = echarts.init(main);
            pieChart.setOption(props.data);
            if (firstLoad) {
                pieChart.on('click', props.chartClick)
            }
            setchart(pieChart);
            setFirstLoad(false);
        }
    }, [props.data])
    const resize = () => {
        if (chart) {
            chart.resize({ width: 100, height: 100 })
        }
        return false
    }
    return (
        <Card className='w-1-3 h-100' >
            <CardHeader className='d-flex justify-content-end'><button className='btn btn-sm' onClick={resize}>X</button></CardHeader>
            <CardBody id="main" />
        </Card>
    )
}

export default DashPieChart