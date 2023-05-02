import moment from "moment";

interface TREEITEM {
    name: string;
    value?: number;
    children?: TREEITEM[];
}
interface TreeAncestore { name: string, index: number }
let siteData: TREEITEM = {
    "name": "actions",
    "children": [
        {
            value: 1048, name: 'LYON - SAINT-PRIEST', children: [
                { value: 55, name: 'reprser', children: [{ name: 'theme 1', value: 55 }] },
                { value: 155, name: 'plus 5j' }
            ]
        },
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
export const dataLoaderBySite = (siteName: string) => {
    const childrens = siteData?.children && siteData?.children.map(item => {
        if (item.name === siteName) {
            item.children = [{ value: 56, name: 'à reprendre' }, { value: 256, name: 'plus 5J' }];
            return item;
        }
        return item;
    });

    siteData = { ...siteData, children: childrens };
    return dataMaker(siteData);

}
export const dataLoaderByAction = (treeAncestors: TreeAncestore[]) => {
    const childrens = siteData.children && siteData.children.map(item => {
        if (item.name === treeAncestors[2].name) {
            item.children?.map(child => {
                if (child.name === treeAncestors[3].name) {
                    return child.children = [{ value: 56, name: 'theme 1' }, { value: 256, name: 'theme 2' }]
                }
                return item;
            });
        }
        return item;
    });
    siteData = { ...siteData, children: childrens };
    return dataMaker(siteData);
}
export const dataMaker = (data) => {
    return {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },

        series: [
            {
                type: 'tree',
                data: [data],
                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',
                symbolSize: 7,
                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 9
                },
                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                },
                emphasis: {
                    focus: 'descendant'
                },
                expandAndCollapse: true,
                animationDuration: 200,
                animationDurationUpdate: 350
            }
        ]
    }
}
export const treeFilterMockData = {
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
    },

    series: [
        {
            type: 'tree',
            data: [siteData],
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 9
            },
            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                }
            },
            emphasis: {
                focus: 'descendant'
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
        }
    ]
}

// V2 MOCK DATA

export const SITE_TOTAL = {
    title: {
        text: '',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        show: true
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: ['INTELCIA CASABLANCA']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'dossiers',
            type: 'bar',
            data: [10]
        },
        {
            name: 'actions',
            type: 'bar',
            data: [33]
        }
    ]
};

export const getLastFiveDays = (limit: number) => {
    const today = moment().subtract(1, 'day').format('DD/MMM')
    let daysList = [today.toString()];
    let i = 2;
    while (i < limit) {
        daysList = [...daysList, moment().subtract(i, 'day').format('DD/MMM').toString()];
        i++;
    }
    return daysList.reverse();
}
export const getHistoCasesSerieByActivitieLength = (depth: number, period: number = 5) => {
    switch (period) {
        case 5:
            if (depth === 0 || depth === 3) {
                return [
                    {
                        name: 'fermee',
                        type: 'line',
                        data: [0, 5, 1, 3, 3]
                    },
                    {
                        name: 'prise en charge',
                        type: 'line',
                        data: [5, 1, 6, 0, 3]
                    },
                    {
                        name: 'résolu',
                        type: 'line',
                        data: [1, 15, 2, 3, 2]
                    },
                    {
                        name: 'Non résolu',
                        type: 'line',
                        data: [1, 0, 0, 0, 3]
                    },
                ]
            }
            if (depth === 1) {
                return [
                    {
                        name: 'fermee',
                        type: 'line',
                        data: [0, 2, 1, 1, 1]
                    },
                    {
                        name: 'prise en charge',
                        type: 'line',
                        data: [2, 0, 1, 0, 2]
                    },
                    {
                        name: 'résolu',
                        type: 'line',
                        data: [1, 5, 0, 1, 0]
                    },
                    {
                        name: 'Non résolu',
                        type: 'line',
                        data: [1, 0, 0, 0, 0]
                    },
                ]
            }
            if (depth === 2) {
                return [
                    {
                        name: 'fermee',
                        type: 'line',
                        data: [0, 4, 1, 2, 2]
                    },
                    {
                        name: 'prise en charge',
                        type: 'line',
                        data: [4, 0, 4, 0, 2]
                    },
                    {
                        name: 'résolu',
                        type: 'line',
                        data: [1, 10, 1, 2, 0]
                    },
                    {
                        name: 'Non résolu',
                        type: 'line',
                        data: [1, 0, 0, 0, 2]
                    },
                ]
            }

        case 10:
            if (depth === 0 || depth === 3) {
                return [
                    {
                        name: 'fermee',
                        type: 'line',
                        data: [0, 5, 1, 3, 3, 0, 5, 1, 3, 3]
                    },
                    {
                        name: 'prise en charge',
                        type: 'line',
                        data: [5, 1, 6, 0, 3, 5, 1, 6, 0, 3]
                    },
                    {
                        name: 'résolu',
                        type: 'line',
                        data: [1, 15, 2, 3, 2, 1, 15, 2, 3, 2]
                    },
                    {
                        name: 'Non résolu',
                        type: 'line',
                        data: [1, 0, 0, 0, 3, 1, 0, 0, 0, 3]
                    },
                ]
            }
            if (depth === 1) {
                return [
                    {
                        name: 'fermee',
                        type: 'line',
                        data: [0, 2, 1, 1, 1, 0, 2, 1, 1, 1]
                    },
                    {
                        name: 'prise en charge',
                        type: 'line',
                        data: [2, 0, 1, 0, 2, 2, 0, 1, 0, 2]
                    },
                    {
                        name: 'résolu',
                        type: 'line',
                        data: [1, 5, 0, 1, 0, 1, 5, 0, 1, 0]
                    },
                    {
                        name: 'Non résolu',
                        type: 'line',
                        data: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
                    },
                ]
            }
            if (depth === 2) {
                return [
                    {
                        name: 'fermee',
                        type: 'line',
                        data: [0, 4, 1, 2, 2, 0, 4, 1, 2, 2]
                    },
                    {
                        name: 'prise en charge',
                        type: 'line',
                        data: [4, 0, 4, 0, 2, 4, 0, 4, 0, 2]
                    },
                    {
                        name: 'résolu',
                        type: 'line',
                        data: [1, 10, 1, 2, 0, 1, 10, 1, 2, 0]
                    },
                    {
                        name: 'Non résolu',
                        type: 'line',
                        data: [1, 0, 0, 0, 2, 1, 0, 0, 0, 2]
                    },
                ]
            }
        case 15:
            if (depth === 0 || depth === 3) {
                return [
                    {
                        name: 'fermee',
                        type: 'line',
                        data: [0, 5, 1, 3, 3, 0, 5, 1, 3, 3, 0, 5, 1, 3, 3]
                    },
                    {
                        name: 'prise en charge',
                        type: 'line',
                        data: [5, 1, 6, 0, 3, 5, 1, 6, 0, 3, 5, 1, 6, 0, 3]
                    },
                    {
                        name: 'résolu',
                        type: 'line',
                        data: [1, 15, 2, 3, 2, 1, 15, 2, 3, 2, 1, 15, 2, 3, 2]
                    },
                    {
                        name: 'Non résolu',
                        type: 'line',
                        data: [1, 0, 0, 0, 3, 1, 0, 0, 0, 3, 1, 0, 0, 0, 3]
                    },
                ]
            }
            if (depth === 1) {
                return [
                    {
                        name: 'fermee',
                        type: 'line',
                        data: [0, 2, 1, 1, 1, 0, 2, 1, 1, 1, 0, 2, 1, 1, 1]
                    },
                    {
                        name: 'prise en charge',
                        type: 'line',
                        data: [2, 0, 1, 0, 2, 2, 0, 1, 0, 2, 2, 0, 1, 0, 2]
                    },
                    {
                        name: 'résolu',
                        type: 'line',
                        data: [1, 5, 0, 1, 0, 1, 5, 0, 1, 0, 1, 5, 0, 1, 0]
                    },
                    {
                        name: 'Non résolu',
                        type: 'line',
                        data: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
                    },
                ]
            }
            if (depth === 2) {
                return [
                    {
                        name: 'fermee',
                        type: 'line',
                        data: [0, 4, 1, 2, 2, 0, 4, 1, 2, 2, 0, 4, 1, 2, 2]
                    },
                    {
                        name: 'prise en charge',
                        type: 'line',
                        data: [4, 0, 4, 0, 2, 4, 0, 4, 0, 2, 4, 0, 4, 0, 2]
                    },
                    {
                        name: 'résolu',
                        type: 'line',
                        data: [1, 10, 1, 2, 0, 1, 10, 1, 2, 0, 1, 10, 1, 2, 0]
                    },
                    {
                        name: 'Non résolu',
                        type: 'line',
                        data: [1, 0, 0, 0, 2, 1, 0, 0, 0, 2, 1, 0, 0, 0, 2]
                    },
                ]
            }
        default:
            switch (depth) {
                case 0 || 3:
                    return [
                        {
                            name: 'fermee',
                            type: 'line',
                            data: [0, 5, 1, 3, 3]
                        },
                        {
                            name: 'prise en charge',
                            type: 'line',
                            data: [5, 1, 6, 0, 3]
                        },
                        {
                            name: 'résolu',
                            type: 'line',
                            data: [1, 15, 2, 3, 2]
                        },
                        {
                            name: 'Non résolu',
                            type: 'line',
                            data: [1, 0, 0, 0, 3]
                        },
                    ]
                case 1:
                    return [
                        {
                            name: 'fermee',
                            type: 'line',
                            data: [0, 2, 1, 1, 1]
                        },
                        {
                            name: 'prise en charge',
                            type: 'line',
                            data: [2, 0, 1, 0, 2]
                        },
                        {
                            name: 'résolu',
                            type: 'line',
                            data: [1, 5, 0, 1, 0]
                        },
                        {
                            name: 'Non résolu',
                            type: 'line',
                            data: [1, 0, 0, 0, 0]
                        },
                    ]
                case 2:
                    return [
                        {
                            name: 'fermee',
                            type: 'line',
                            data: [0, 4, 1, 2, 2]
                        },
                        {
                            name: 'prise en charge',
                            type: 'line',
                            data: [4, 0, 4, 0, 2]
                        },
                        {
                            name: 'résolu',
                            type: 'line',
                            data: [1, 10, 1, 2, 0]
                        },
                        {
                            name: 'Non résolu',
                            type: 'line',
                            data: [1, 0, 0, 0, 2]
                        },
                    ]

                default:
                    return [
                        {
                            name: 'fermee',
                            type: 'line',
                            data: [0, 5, 1, 3, 3]
                        },
                        {
                            name: 'prise en charge',
                            type: 'line',
                            data: [5, 1, 6, 0, 3]
                        },
                        {
                            name: 'résolu',
                            type: 'line',
                            data: [1, 15, 2, 3, 2]
                        },
                        {
                            name: 'Non résolu',
                            type: 'line',
                            data: [1, 0, 0, 0, 3]
                        },
                    ]
                    break;
            }
            break;
    }

}
export const HISTO_CASES = {
    title: {
        text: '',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        show: true
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getLastFiveDays(6)
    },
    yAxis: {
        type: 'value'
    },
    series: getHistoCasesSerieByActivitieLength(0, 5)
};


export const HISTO_CASES_DETAILS = {
    title: {
        text: '',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        show: true
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: getLastFiveDays(15)
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'fermee',
            type: 'line',
            data: [0, 5, 1, 2, 3, 7, 6, 8, 1, 0, 5, 7, 9, 3, 5]
        },
        {
            name: 'prise en charge',
            type: 'line',
            data: [5, 1, 6, 0, 3, 7, 0, 2, 5, 9, 11, 6, 11, 8, 0]
        },
        {
            name: 'résolu',
            type: 'line',
            data: [1, 15, 2, 3, 0, 8, 1, 11, 0, 1, 2, 5, 7, 6, 5]
        },
        {
            name: 'Non résolu',
            type: 'line',
            data: [1, 0, 0, 0, 2, 5, 1, 2, 0, 5, 1, 3, 5, 0, 8]
        },
    ]
};

export const getHistoActionsSerieByActivitieLength = (depth: number, period: number = 5) => {
    switch (depth) {
        case 0 || 3:
            return [
                {
                    name: 'à reprendre en charge',
                    type: 'bar',
                    stack: 'total',
                    data: period === 5 ? [4, 7, 3, 2, 5]
                        : period === 10 ? [4, 7, 3, 2, 5, 4, 7, 3, 2, 5]
                            : period === 15 ? [4, 7, 3, 2, 5, 4, 7, 3, 2, 5, 4, 7, 3, 2, 5] : [4, 7, 3, 2, 5]
                },
                {
                    name: 'prise en charge',
                    type: 'bar',
                    stack: 'total',
                    data: period === 5 ? [6, 4, 2, 3, 3]
                        : period === 10 ? [6, 4, 2, 3, 3, 6, 4, 2, 3, 3]
                            : period === 15 ? [6, 4, 2, 3, 3, 6, 4, 2, 3, 3, 6, 4, 2, 3, 3] : [6, 4, 2, 3, 3]
                }
            ]
        case 1:
            return [
                {
                    name: 'à reprendre en charge',
                    type: 'bar',
                    stack: 'total',
                    data: period === 5 ? [2, 3, 1, 0, 2]
                        : period === 10 ? [2, 3, 1, 0, 2, 2, 3, 1, 0, 2]
                            : [2, 3, 1, 0, 2, 2, 3, 1, 0, 2, 2, 3, 1, 0, 2]
                },
                {
                    name: 'prise en charge',
                    type: 'bar',
                    stack: 'total',
                    data: period === 5 ? [1, 3, 0, 1, 1]
                        : period === 10 ? [1, 3, 0, 1, 1, 1, 3, 0, 1, 1]
                            : [1, 3, 0, 1, 1, 1, 3, 0, 1, 1, 1, 3, 0, 1, 1]
                }
            ]
        case 2:
            return [
                {
                    name: 'à reprendre en charge',
                    type: 'bar',
                    stack: 'total',
                    data: period === 5 ? [3, 5, 2, 0, 2]
                        : period === 10 ? [3, 5, 2, 0, 2, 3, 5, 2, 0, 2]
                            : [3, 5, 2, 0, 2, 3, 5, 2, 0, 2]
                },
                {
                    name: 'prise en charge',
                    type: 'bar',
                    stack: 'total',
                    data: period === 5 ? [4, 3, 1, 2, 1]
                        : period === 10 ? [4, 3, 1, 2, 1, 4, 3, 1, 2, 1]
                            : [4, 3, 1, 2, 1, 4, 3, 1, 2, 1, 4, 3, 1, 2, 1]
                }
            ]

        default:
            return [
                {
                    name: 'à reprendre en charge',
                    type: 'bar',
                    stack: 'total',
                    data: period === 5 ? [4, 7, 3, 2, 5]
                        : period === 10 ? [4, 7, 3, 2, 5, 4, 7, 3, 2, 5]
                            : period === 15 ? [4, 7, 3, 2, 5, 4, 7, 3, 2, 5, 4, 7, 3, 2, 5] : [4, 7, 3, 2, 5]
                },
                {
                    name: 'prise en charge',
                    type: 'bar',
                    stack: 'total',
                    data: period === 5 ? [6, 4, 2, 3, 3]
                        : period === 10 ? [6, 4, 2, 3, 3, 6, 4, 2, 3, 3]
                            : period === 15 ? [6, 4, 2, 3, 3, 6, 4, 2, 3, 3, 6, 4, 2, 3, 3] : [6, 4, 2, 3, 3]
                }
            ]
            break;
    }
}

export const HISTO_ACTIONS = {
    title: {
        text: '',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        show: true
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getLastFiveDays(6)
    },
    yAxis: {
        type: 'value'
    },
    series: getHistoActionsSerieByActivitieLength(0)
};


export const SITE_TOTAL_DETAILS = {
    title: {
        text: '',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        show: true
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: [
            'INTELCIA CASABLANCA',
            'RANDSTAD OFFSHORE',
            'ALTICE CAMPUS',
            'INTELCIA - GP SC - COTE D"IVOIRE',
            'INTELCIA - GP SC - PORTUGAL',
            'INTELCIA - GP SC - CAMEROUN',
            'INTELCIA - GP SC - FRANCE - ESP',
            'INTELCIA - GP SC - MAROC',
            'FWS_FRONT_VENTE_RC'
        ]
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'dossiers',
            type: 'bar',
            data: [10, 12, 19, 54, 2, 7, 6, 8, 11]
        },
        {
            name: 'actions',
            type: 'bar',
            data: [16, 10, 29, 34, 22, 11, 6, 5, 1]
        }
    ]
};
export const getCaseStatusDataByActivitiesLength = (depth: number = 0) => {
    switch (depth) {
        case 0 || 3:
            return [
                { value: 2, name: 'Non résolu' },
                { value: 7, name: 'Fermé' },
                { value: 2, name: 'Résolu' },
                { value: 2, name: 'prise en charge' },
                { value: 4, name: 'Créé' },
                {
                    // make an record to fill the bottom 50%
                    value: 2 + 7 + 2 + 2 + 4,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]
        case 1:
            return [
                { value: 0, name: 'Non résolu' },
                { value: 3, name: 'Fermé' },
                { value: 1, name: 'Résolu' },
                { value: 1, name: 'prise en charge' },
                { value: 2, name: 'Créé' },
                {
                    // make an record to fill the bottom 50%
                    value: 0 + 3 + 1 + 1 + 2,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]
        case 2:
            return [
                { value: 1, name: 'Non résolu' },
                { value: 4, name: 'Fermé' },
                { value: 2, name: 'Résolu' },
                { value: 1, name: 'prise en charge' },
                { value: 2, name: 'Créé' },
                {
                    // make an record to fill the bottom 50%
                    value: 1 + 4 + 2 + 1 + 2,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]

        default:
            return [
                { value: 2, name: 'Non résolu' },
                { value: 7, name: 'Fermé' },
                { value: 2, name: 'Résolu' },
                { value: 2, name: 'prise en charge' },
                { value: 4, name: 'Créé' },
                {
                    // make an record to fill the bottom 50%
                    value: 2 + 7 + 2 + 2 + 4,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]
            break;
    }
}
export const CASES_STATUS = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center',
        // doesn't perfectly work with our tricks, disable it
        selectedMode: false,
        show: true
    },
    series: [
        {
            name: 'Statut',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '98%'],
            // adjust the start angle
            startAngle: 180,
            label: {
                show: true,
                formatter(param) {
                    // correct the percentage
                    return param.percent + '%';
                }
            },
            data: getCaseStatusDataByActivitiesLength(0)
        }
    ]
};

export const getActionStatusDataByActivitiesLength = (depth: number = 0) => {
    switch (depth) {
        case 0 || 3:
            return [
                { value: 5, name: 'à reprendre en charge' },
                { value: 2, name: 'prise en charge' },
                { value: 1, name: 'modifier +5j' },
                { value: 2, name: 'prise en charge dépassée' },
                { value: 3, name: 'NPTA dépassé' },
                {
                    // make an record to fill the bottom 50%
                    value: 5 + 2 + 1 + 2 + 3,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]
        case 1:
            return [
                { value: 2, name: 'à reprendre en charge' },
                { value: 1, name: 'prise en charge' },
                { value: 0, name: 'modifier +5j' },
                { value: 0, name: 'prise en charge dépassée' },
                { value: 2, name: 'NPTA dépassé' },
                {
                    // make an record to fill the bottom 50%
                    value: 2 + 1 + 0 + 0 + 2,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]
        case 2:
            return [
                { value: 4, name: 'à reprendre en charge' },
                { value: 2, name: 'prise en charge' },
                { value: 0, name: 'modifier +5j' },
                { value: 1, name: 'prise en charge dépassée' },
                { value: 2, name: 'NPTA dépassé' },
                {
                    // make an record to fill the bottom 50%
                    value: 4 + 2 + 0 + 1 + 2,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]

        default:
            return [
                { value: 5, name: 'à reprendre en charge' },
                { value: 2, name: 'prise en charge' },
                { value: 1, name: 'modifier +5j' },
                { value: 2, name: 'prise en charge dépassée' },
                { value: 3, name: 'NPTA dépassé' },
                {
                    // make an record to fill the bottom 50%
                    value: 5 + 2 + 1 + 2 + 3,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]
            break;
    }
}
export const ACTION_STATUS = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center',
        // doesn't perfectly work with our tricks, disable it
        selectedMode: false,
        show: true
    },
    series: [
        {
            name: 'Actions',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '98%'],
            // adjust the start angle
            startAngle: 180,
            label: {
                show: true,
                formatter(param) {
                    // correct the percentage
                    return param.percent + '%';
                }
            },
            data: getActionStatusDataByActivitiesLength(0)
        }
    ]
};


export const ACTION_ACTIVITY = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center',
        // doesn't perfectly work with our tricks, disable it
        selectedMode: false,
        show: true
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '98%'],
            // adjust the start angle
            startAngle: 180,
            label: {
                show: false,
                // formatter(param) {
                //     // correct the percentage
                //     return param.name + ' (' + param.percent! * 2 + '%)';
                // }
            },
            data: [
                { value: 18, name: 'FRONT CO' },
                { value: 3, name: 'RCC CSU HV' },
                { value: 1, name: 'RECLA ENC SIMPLE' },
                { value: 1, name: 'Support incident Fixe' },
                { value: 5, name: 'BACK CO SOLUTION' },
                { value: 4, name: 'BACK CO CRG' },
                { value: 4, name: 'FTT Mobile' },
                { value: 1, name: 'FRONT RET HO' },
                {
                    // make an record to fill the bottom 50%
                    value: 18 + 3 + 1 + 1 + 5 + 4 + 4 + 1,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]
        }
    ]
};


export const ACTION_PROGRESS = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center',
        // doesn't perfectly work with our tricks, disable it
        selectedMode: false,
        show: true
    },
    series: [
        {
            name: 'Avencement',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '98%'],
            // adjust the start angle
            startAngle: 180,
            label: {
                show: false,
                // formatter(param) {
                //     // correct the percentage
                //     return param.name + ' (' + param.percent! * 2 + '%)';
                // }
            },
            data: [
                { value: 2, name: 'fin de traitement' },
                { value: 16, name: 'analyse en cours' },
                { value: 2, name: 'en attente process/validation' },
                { value: 10, name: 'analyse non démarrée' },
                { value: 1, name: 'en attante téchnicien' },
                {
                    // make an record to fill the bottom 50%
                    value: 2 + 16 + 2 + 10 + 1,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]
        }
    ]
};

export const getCaseAdgDataByActivitiesLength = (depth: number = 0) => {
    switch (depth) {
        case 0 || 3:
            return [
                { value: 10, name: 'Sans adg' },
                { value: 7, name: 'Avec adg' },
                {
                    // make an record to fill the bottom 50%
                    value: 10 + 7,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]
        case 1:
            return [
                { value: 2, name: 'Sans adg' },
                { value: 4, name: 'Avec adg' },
                {
                    // make an record to fill the bottom 50%
                    value: 2 + 4,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]
        case 2:
            return [
                { value: 5, name: 'Sans adg' },
                { value: 6, name: 'Avec adg' },
                {
                    // make an record to fill the bottom 50%
                    value: 5 + 6,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]

        default:
            return [
                { value: 10, name: 'Sans adg' },
                { value: 7, name: 'Avec adg' },
                {
                    // make an record to fill the bottom 50%
                    value: 10 + 7,
                    itemStyle: {
                        // stop the chart from rendering this piece
                        color: 'none',
                        decal: {
                            symbol: 'none'
                        }
                    },
                    label: {
                        show: false
                    }
                }
            ]
            break;
    }
}

export const CASES_V2_ADG = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center',
        // doesn't perfectly work with our tricks, disable it
        selectedMode: false,
        show: true
    },
    series: [
        {
            name: 'Dossiers',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '98%'],
            // adjust the start angle
            startAngle: 180,
            label: {
                show: true,
                formatter(param) {
                    // correct the percentage
                    return param.name + '\n (' + param.percent! * 2 + '%)';
                }
            },
            data: getCaseAdgDataByActivitiesLength(0)
        }
    ]
};



export const mockTableData = [
    {
        creationDate: "03/21/2023 12:37",
        label: "1.OFFRES & SERVICES/Contestation Offre/Contenu/",
        statut: "Fermé",
        lastUpdate: "04/05/2023 12:38",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/21/2023 12:37",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 12:08",
        activity: "FRONT CO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/21/2023 12:37",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Non Résolu",
        lastUpdate: "04/05/2023 11:56",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/22/2023 11:48",
        label: "1.OFFRES & SERVICES/Contestation Offre/Tarif/",
        statut: "Fermé",
        lastUpdate: "04/05/2023 11:49",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/22/2023 11:28",
        label: "3.CONSO & FACTURES/Contestation Facture/Remise/Remise RET/Fidé NPEC/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:41",
        activity: "FRONT CO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/23/2023 11:28",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/5.RM (Renouvellement Mobile)/Changer de Mobile/Terminal/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:27",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/23/2023 11:28",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:02",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/23/2023 11:28",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 10:35",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/24/2023 10:14",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 10:15",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/24/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 9:54",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/25/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/1.Offres/Changer d'offre/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 9:53",
        activity: "FRONT CO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/26/2023 9:53",
        label: "1.OFFRES & SERVICES/Contestation Offre/RMC SPORT/",
        statut: "Fermé",
        lastUpdate: "04/05/2023 9:43",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/26/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Fermé",
        lastUpdate: "04/05/2023 9:19",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/26/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Non Résolu",
        lastUpdate: "04/04/2023 17:24",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/27/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 16:47",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/27/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Non Résolu",
        lastUpdate: "04/04/2023 16:38",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/27/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 16:09",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/27/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/5.RM (Renouvellement Mobile)/Changer de Mobile/Terminal/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 15:45",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/27/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 14:41",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/28/2023 9:53",
        label: "1.OFFRES & SERVICES/Contestation Offre/Contenu/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 12:38",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/29/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 12:08",
        activity: "FRONT CO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/29/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Non Résolu",
        lastUpdate: "04/05/2023 11:56",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/30/2023 9:53",
        label: "1.OFFRES & SERVICES/Contestation Offre/Tarif/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:49",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/30/2023 9:53",
        label: "3.CONSO & FACTURES/Contestation Facture/Remise/Remise RET/Fidé NPEC/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:41",
        activity: "FRONT CO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/30/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/5.RM (Renouvellement Mobile)/Changer de Mobile/Terminal/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:27",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/31/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:02",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "03/31/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 10:35",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "04/01/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 10:15",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "04/02/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 9:54",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "04/02/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/1.Offres/Changer d'offre/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 9:53",
        activity: "FRONT CO",
        handledBy: "fmaison"
    },
    {
        creationDate: "04/02/2023 9:53",
        label: "1.OFFRES & SERVICES/Contestation Offre/RMC SPORT/",
        statut: "Non Résolu",
        lastUpdate: "04/05/2023 9:43",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "04/03/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 9:19",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "04/03/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Non Résolu",
        lastUpdate: "04/04/2023 17:24",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "04/03/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 16:47",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "04/04/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Non Résolu",
        lastUpdate: "04/04/2023 16:38",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "04/04/2023 16:08",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 16:09",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "04/05/2023 16:08",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/5.RM (Renouvellement Mobile)/Changer de Mobile/Terminal/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 15:45",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    },
    {
        creationDate: "04/05/2023 16:08",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 14:41",
        activity: "FRONT RET HO",
        handledBy: "fmaison"
    }
]

export const mockTableSuperViseur = [
    {
        creationDate: "03/21/2023 12:37",
        label: "1.OFFRES & SERVICES/Contestation Offre/Contenu/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 12:38",
        activity: "FRONT RET HO",
        handledBy: "jboudot"
    },
    {
        creationDate: "03/21/2023 12:37",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 12:08",
        activity: "FRONT CO",
        handledBy: "jboudot"
    },
    {
        creationDate: "03/21/2023 12:37",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Non Résolu",
        lastUpdate: "04/05/2023 11:56",
        activity: "FRONT RET HO",
        handledBy: "jboudot"
    },
    {
        creationDate: "03/22/2023 11:48",
        label: "1.OFFRES & SERVICES/Contestation Offre/Tarif/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:49",
        activity: "FRONT RET HO",
        handledBy: "jboudot"
    },
    {
        creationDate: "03/22/2023 11:28",
        label: "3.CONSO & FACTURES/Contestation Facture/Remise/Remise RET/Fidé NPEC/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:41",
        activity: "FRONT CO",
        handledBy: "jboudot"
    },
    {
        creationDate: "03/23/2023 11:28",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/5.RM (Renouvellement Mobile)/Changer de Mobile/Terminal/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:27",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "03/23/2023 11:28",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:02",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "03/23/2023 11:28",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 10:35",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "03/24/2023 10:14",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 10:15",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "03/24/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 9:54",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "03/25/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/1.Offres/Changer d'offre/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 9:53",
        activity: "FRONT CO",
        handledBy: "gpivin"
    },
    {
        creationDate: "03/26/2023 9:53",
        label: "1.OFFRES & SERVICES/Contestation Offre/RMC SPORT/",
        statut: "Non Résolu",
        lastUpdate: "04/05/2023 9:43",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "03/26/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 9:19",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "03/26/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Non Résolu",
        lastUpdate: "04/04/2023 17:24",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "03/27/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 16:47",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "03/27/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Non Résolu",
        lastUpdate: "04/04/2023 16:38",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "03/27/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 16:09",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "03/27/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/5.RM (Renouvellement Mobile)/Changer de Mobile/Terminal/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 15:45",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "03/27/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 14:41",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "03/28/2023 9:53",
        label: "1.OFFRES & SERVICES/Contestation Offre/Contenu/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 12:38",
        activity: "FRONT RET HO",
        handledBy: "jboudot"
    },
    {
        creationDate: "03/29/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 12:08",
        activity: "FRONT CO",
        handledBy: "jboudot"
    },
    {
        creationDate: "03/29/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Non Résolu",
        lastUpdate: "04/05/2023 11:56",
        activity: "FRONT RET HO",
        handledBy: "jboudot"
    },
    {
        creationDate: "03/30/2023 9:53",
        label: "1.OFFRES & SERVICES/Contestation Offre/Tarif/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:49",
        activity: "FRONT RET HO",
        handledBy: "jboudot"
    },
    {
        creationDate: "03/30/2023 9:53",
        label: "3.CONSO & FACTURES/Contestation Facture/Remise/Remise RET/Fidé NPEC/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:41",
        activity: "FRONT CO",
        handledBy: "jboudot"
    },
    {
        creationDate: "03/30/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/5.RM (Renouvellement Mobile)/Changer de Mobile/Terminal/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:27",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "03/31/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 11:02",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "03/31/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 10:35",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "04/01/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 10:15",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "04/02/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 9:54",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "04/02/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/1.Offres/Changer d'offre/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 9:53",
        activity: "FRONT CO",
        handledBy: "gpivin"
    },
    {
        creationDate: "04/02/2023 9:53",
        label: "1.OFFRES & SERVICES/Contestation Offre/RMC SPORT/",
        statut: "Non Résolu",
        lastUpdate: "04/05/2023 9:43",
        activity: "FRONT RET HO",
        handledBy: "gpivin"
    },
    {
        creationDate: "04/03/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/05/2023 9:19",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "04/03/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Non Résolu",
        lastUpdate: "04/04/2023 17:24",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "04/03/2023 9:53",
        label: "1.OFFRES & SERVICES/1.4 Annuler/Résilier/1.Résilier Offre/Démarches pour résilier/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 16:47",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "04/04/2023 9:53",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Non Résolu",
        lastUpdate: "04/04/2023 16:38",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "04/04/2023 16:08",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 16:09",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "04/05/2023 16:08",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/5.RM (Renouvellement Mobile)/Changer de Mobile/Terminal/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 15:45",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    },
    {
        creationDate: "04/05/2023 16:08",
        label: "1.OFFRES & SERVICES/1.1 S'informer/Modifier/2.Options/Options et bouquets TV/",
        statut: "Résolu",
        lastUpdate: "04/04/2023 14:41",
        activity: "FRONT RET HO",
        handledBy: "lgirardeau"
    }
]

export const HISTO_CASES_V2 = {
    title: {
        text: '',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        show: true
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getLastFiveDays(15)
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'Fermé',
            type: 'bar',
            stack: 'total',
            data: [1, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'Résolu',
            type: 'bar',
            stack: 'total',
            data: [1, 2, 2, 1, 1, 3, 1, 1, 3, 2, 1, 2, 2, 1, 2]
        },
        {
            name: 'Non résolu',
            type: 'bar',
            stack: 'total',
            data: [1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1]
        },
    ]
};

export const counter = (activities: string[]) => {
    const results = activities.length > 0 ? mockTableData.filter(a => activities.includes(a.activity)) : mockTableData;
    const dates = getLastFiveDays(15);
    const allActivities = mockTableData.map(item => item.activity);
    const activityCounter = {};
    mockTableData.forEach(item => {
        activityCounter[item.activity] = activityCounter[item.activity] ? activityCounter[item.activity] = activityCounter[item.activity] + 1 : 1
    });
    let statusCounter = {}
    dates.forEach(date => {
        statusCounter[date] = {}
    })
    results.forEach(item => {
        const tt = moment(item.creationDate).format('DD/MMM');
        console.log(tt);
    })
    const currentActivities = Array.from(new Set(allActivities));
    return { results, currentActivities, activityCounter };
}