import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import React from 'react';
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {textFilter, selectFilter} from 'react-bootstrap-table2-filter';
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import {FormattedMessage} from "react-intl";

import {translate} from "../../../../../components/Intl/IntlGlobalProvider";

import './Fadet.css'
import {Fadet} from "../../../../../model/service/billing/Fadet";


interface Props {
    fadetData?: Fadet[]
    options?: any
}

const FadetTable: React.FunctionComponent<Props> = (props) => {

    const {fadetData, options} = props;

    const formatOptions = (str) => {
        const temp: any[] = [];
        if(options) {
            const optionsArr = options[`${str}`];
            optionsArr.forEach(option => {
                if(option) {
                    temp.push({value: option , label: option})
                }
            })
        }
        return temp
    }

    const returnFormatedOptions = () => {
        const formattedOptions = {}
        formattedOptions['types']= formatOptions('types');
        formattedOptions['details'] = formatOptions('details');
        formattedOptions['destinations'] = formatOptions('destinations');
        return formattedOptions
    }

    const tableOptions: any = returnFormatedOptions();

    // Array options
    const fadetTypesOptions = tableOptions?.types.length ? tableOptions?.types : [];
    const fadetDetailsOptions =  tableOptions?.details.length ? tableOptions?.details : [];
    const fadetDestinationsOptions = tableOptions?.destinations.length ? tableOptions?.destinations : [];

    const fadetColumns = [{
        dataField: 'type',
        text: translate.formatMessage({id: "fadet.table.header.type"}),
        sort: true,
        headerStyle: () => {
            return {width: '17%'}
        },
        filter: selectFilter({
            options: fadetTypesOptions,
            placeholder: translate.formatMessage({id: "global.all"}),
        }),
    }, {
        dataField: 'detail',
        text: translate.formatMessage({id: "fadet.table.header.detail"}),
        sort: true,
        filter: selectFilter({
            options: fadetDetailsOptions,
            placeholder: translate.formatMessage({id: "global.all"}),
        }),
        headerStyle: () => {
            return {width: '15%'};
        },
        headerClasses: 'detail',
    }, {
        dataField: 'caller',
        text: translate.formatMessage({id: "fadet.table.header.caller"}),
        filter: textFilter(),
        sort: true,
    }, {
        dataField: 'destination',
        text: translate.formatMessage({id: "fadet.table.header.destination"}),
        sort: true,
        filter: selectFilter({
            options: fadetDestinationsOptions,
            placeholder: translate.formatMessage({id: "global.all"}),
        }),
        headerClasses: 'destination',
    }, {
        dataField: 'callerNumber',
        text: translate.formatMessage({id: "fadet.table.header.number.called"}),
        sort: true,
        filter: textFilter(),
    }, {
        dataField: 'callStart',
        text: translate.formatMessage({id: "fadet.table.header.callStart"}),
        sort: true,
        headerStyle: () => {
            return {width: '12%'};
        },
    }, {
        dataField: 'callDuration',
        text: translate.formatMessage({id: "fadet.table.header.callDuration"}),
        classes: 'callDuration',
        headerClasses: 'callDuration',
        sort: true,
        headerStyle: () => {
            return {width: '9%'};
        },
    }, {
        dataField: 'billedDuration',
        text: translate.formatMessage({id: "fadet.table.header.billedDuration"}),
        sort: true,
        headerStyle: () => {
            return {width: '10%'};
        },
    }, {
        dataField: 'amoutTTC',
        text: translate.formatMessage({id: "fadet.table.header.amount"}),
        sort: true,
        headerStyle: () => {
            return {width: '9%'};
        },
    }];

    const paginationOptions = {
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '20', value: 20
        }, {
            text: '50', value: 50
        }],
        firstPageText: translate.formatMessage({id: "tray.table.pagination.firstPageText"}),
        prePageText: translate.formatMessage({id: "tray.table.pagination.prePageText"}),
        nextPageText: translate.formatMessage({id: "tray.table.pagination.nextPageText"}),
        lastPageText: translate.formatMessage({id: "tray.table.pagination.lastPageText"}),
        hidePageListOnlyOnePage: true
    }

    return (
        <React.Fragment>
            <Card className="mt-0 mb-5">
                <CardHeader>
                    <span className="icon-gradient icon-multi-apps mr-2"/>
                    <FormattedMessage id="fadet.table.title"/>
                </CardHeader>
                <CardBody>
                    {fadetData && options &&
                        <BootstrapTable
                            hover
                            striped
                            condensed
                            bootstrap4
                            keyField='id'
                            classes="fadetTable"
                            data={fadetData}
                            columns={fadetColumns}
                            pagination={paginationFactory(paginationOptions)}
                            filter={filterFactory()}
                            noDataIndication={<span className="font-italic"><FormattedMessage
                                id="global.table.nothing"/></span>}
                        />
                    }
                </CardBody>
            </Card>
        </React.Fragment>
    )
};

export default FadetTable;