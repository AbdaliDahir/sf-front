import * as echarts from 'echarts';
import React, { useEffect, useState } from 'react';
import { Card } from 'reactstrap';
import './DashboardCases.css';
const DashBarDetails = (props) => {
    const main = document.getElementById('detailChart');
    const [firstLoad, setFirstLoad] = useState(true);
    useEffect(() => {
        if (main) {
            const pieChart = echarts.init(main);
            pieChart.setOption(props.data);
            if (firstLoad) {
                pieChart.on('click', props.chartClick)
            }
            setFirstLoad(false);
        }
    }, [props.data]);

    useEffect(() => {
        if (props.sites.length === 0) {
            setFirstLoad(true);
        }
    }, [props.sites]);

    return (
        (props.sites.length > 0 ? <Card className='w-1-3 h-100' id="detailChart" ></Card> : null)
    )
}

export default DashBarDetails