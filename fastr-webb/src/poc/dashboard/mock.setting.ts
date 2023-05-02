import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;
export const colorPalette = ['#1c4e80', '#D32d41', '#9dd3e2', '#6AB187', '#0091D5', '#80cee0', '#cf82b0', '#ff6361', '#ed6425', '#aa4dbb'];
export interface DashBoardSettingLevel {
    name: string;
    colors?: string[];
}
export interface DashBoardSetting {
    firstLevel: DashBoardSettingLevel,
    secondLevel: DashBoardSettingLevel,
    type: 'ACTIONS' | 'CASES'
}

export interface DashBoardFirstLevelDTO {
    data: { name: string, value: number }[]
}

export interface DashDetailSeries {
    name: string;
    type: string;
    stack: string;
    label: {
        show: boolean
    };
    emphasis: {
        focus: string
    };
    data: []
}
export interface BarSerie {
    name: string;
    type: string;
    stack: string;
    label: {
        show: boolean;
    };
    emphasis: {
        focus: string;
    };
    data: number[]
}
/-------------------------------------/

export const firstCallToRetrieveSettings = (profile?: string): DashBoardSetting => {
    switch (profile) {
        case 'admin':
            return { firstLevel: { name: 'site', colors: colorPalette }, secondLevel: { name: 'status' }, type: 'ACTIONS' }
        case 'user':
            return { firstLevel: { name: 'site', colors: colorPalette }, secondLevel: { name: 'service' }, type: 'ACTIONS' }
        default:
            return { firstLevel: { name: 'site', colors: colorPalette }, secondLevel: { name: 'status' }, type: 'ACTIONS' }
    }
}

export const retirveDashDataFirstLevel = (name: string, type: string): DashBoardFirstLevelDTO => {
    console.info(`-----RETRIVE TOTAL OF ${type} BY ${name} `);
    return {
        data: [
            { value: 1048, name: 'LYON - SAINT-PRIEST' },
            { value: 735, name: 'INTELCIA CASABLANCA' },
            { value: 580, name: 'RANDSTAD OFFSHORE' },
            { value: 484, name: 'ALTICE CAMPUS' },
            { value: 300, name: 'INTELCIA - GP SC - COTE D"IVOIRE' },
            { value: 735, name: 'INTELCIA - GP SC - PORTUGAL' },
            { value: 580, name: 'INTELCIA - GP SC - CAMEROUN' },
            { value: 735, name: 'INTELCIA - GP SC - FRANCE - ESP' },
            { value: 580, name: 'INTELCIA - GP SC - MAROC' },
            { value: 869, name: 'FWS_FRONT_VENTE_RC' }
        ]
    }

}

export const retirveDashDataSecondLevel = (dashSetting: DashBoardSetting, valueFirstLevel: string): DashBoardFirstLevelDTO => {
    console.info(`-----RETRIVE TOTAL OF ${dashSetting.type} BY ${valueFirstLevel} BY ${dashSetting.secondLevel.name} `);
    if (dashSetting.secondLevel.name === 'status') {
        return {
            data: [
                { value: 15, name: 'à reprendre en charge' },
                { value: 65, name: 'prise en charge' },
                { value: 88, name: 'modifier +5j' },
                { value: 44, name: 'prise en charge dépassée' },
                { value: 3, name: 'NPTA dépassé' }
            ]
        }
    } else {
        return {
            data: [
                { value: 15, name: 'ADSL' },
                { value: 65, name: 'FTTH' },
                { value: 88, name: 'MOBILE' },
                { value: 44, name: 'FTTB' }
            ]
        }
    }


}
export const barSerieItemMaker = (name: string): BarSerie => {
    return {
        name,
        type: 'bar',
        stack: 'total',
        label: {
            show: true
        },
        emphasis: {
            focus: 'series'
        },
        data: []
    };
}
export const barSeriesMaker = (series: BarSerie[], values: DashBoardFirstLevelDTO) => {
    let newSeries = [...series];
    if (newSeries.length === 0) {
        values.data.forEach(item => {
            const serie = barSerieItemMaker(item.name);
            serie.data = [...serie.data, item.value];
            newSeries = [...newSeries, serie];
        })
    } else {
        newSeries.map(serie => {
            values.data.forEach(item => {
                if (serie.name === item.name) {
                    return { ...serie, data: [...serie.data, item.value] }
                } else {
                    return serie;
                }
            })
        });
    }
    return newSeries;
}

export const barSeriesMakerV2 = (dataDictionary: { [id: string]: { value: number, name: string }[] }) => {
    const keys = Object.keys(dataDictionary);
    let mySeries: { [id: string]: BarSerie } = {};
    if (keys.length > 0) {
        dataDictionary[keys[0]].forEach(item => {
            mySeries = {
                ...mySeries, [item.name]: {
                    name: item.name,
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: []
                }
            }
        });
        keys.forEach(key => {
            dataDictionary[key].forEach(values => {
                mySeries[values.name] = { ...mySeries[values.name], data: [...mySeries[values.name].data, values.value] }
            });
        })
    }
    return mySeries;

}


export const PIE_OPTIONS = {
    title: {
        text: "EXAMPLE",
        subtext: 'Fake Data',
        left: 'center',
        top: '3%'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '15%',
        orient: 'horizontal',
        left: '2%',
    },
    series: [
        {
            name: 'Total',
            type: 'pie',
            radius: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: 25,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [],
            top: '56%',
            left: '15%',
            width: '75%'
        }
    ]
} as EChartsOption;


export const BAR_OPTIONS = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {
        type: 'value',
    },
    series: []
} as any;