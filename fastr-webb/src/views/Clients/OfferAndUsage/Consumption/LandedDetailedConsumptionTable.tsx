import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import {format} from "date-fns";
import * as React from 'react';
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {textFilter, customFilter, FILTER_TYPES, selectFilter, numberFilter} from 'react-bootstrap-table2-filter';
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import {FormattedMessage} from "react-intl";

import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import DateFilter from "../../../FASTTray/Elements/DateFilter";
import ClientService from "../../../../service/ClientService";
import {useEffect} from "react";
import {useState} from "react";
import {
    DetailedLandedConsumption
} from "../../../../model/service/consumption/CurrentLandedConsumption";

interface Props {
    refClient?: string
}

const LandedDetailedConsumptionTable: React.FunctionComponent<Props> = (props) => {

    const [consumptionTableData, setConsumptionTableData] = useState(Array());
    const [consumptionJuridictionData, setConsumptionJuridictionData] = useState(Array());
    const [consumptionTypeUsageData, setConsumptionTypeUsageData] = useState(Array());

    useEffect(() => {
        loadLandedDetailedConsumptionData()
    }, [])


    const clientService: ClientService = new ClientService();

    const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

    const dateFormatter = cell => cell ? format(new Date(cell), DATETIME_FORMAT) : "";

    const selectFormatter = cell => cell ? translate.formatMessage({id: cell}) : "";

    const consumptionTypeOptions = {}
    const consumptionJuridictionOptions = {}
    consumptionTypeUsageData.forEach(item => consumptionTypeOptions[`${item}`] = `${item}`)
    consumptionJuridictionData.forEach(item => consumptionJuridictionOptions[`${item}`] = `${item}`)


    const formatTableData = (list) => {
        return list.map((item, index) => {
            const obj = Object.assign({}, item);
            obj["id"] = index;
            obj["numeroAppelant"] = obj["numeroAppelant"].toString().replace(/\d{2}(?=.)/g, '$& ');
            obj["numeroAppele"] = obj["numeroAppele"].toString().replace(/\d{2}(?=.)/g, '$& ');
            return obj;
        });
    }

    const loadLandedDetailedConsumptionData = async () => {
        const detailedLandedConsumption: DetailedLandedConsumption = await clientService.getdetailedLandedConsumption(props.refClient)
        setConsumptionTableData(formatTableData(detailedLandedConsumption.infoConsoItemList))
        setConsumptionJuridictionData(detailedLandedConsumption.juridictionOptions)
        setConsumptionTypeUsageData(detailedLandedConsumption.typeUsageOptions)
    }
    
    const consumptionColumns = [{
        dataField: 'dateCommunication',
        text: translate.formatMessage({id: "consumption.table.header.creationDate"}),
        sort: true,
        formatter: dateFormatter,
        filter: customFilter({
            type: FILTER_TYPES.DATE
        }),
        filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center"><DateFilter onFilter={onFilter} column={column}/></div>,
        headerClasses: 'dateCommunication',
    }, {
        dataField: 'typeUsage',
        text: translate.formatMessage({id: "consumption.table.header.type"}),
        sort: true,
        formatter: selectFormatter,
        filter: selectFilter({
            options: consumptionTypeOptions,
            placeholder: translate.formatMessage({id: "global.all"}),
        }),
        headerClasses: 'typeUsage',
    }, {
        dataField: 'juridiction',
        text: translate.formatMessage({id: "consumption.table.header.juridiction"}),
        sort: true,
        formatter: selectFormatter,
        filter: selectFilter({
            options: consumptionJuridictionOptions,
            placeholder: translate.formatMessage({id: "global.all"}),
        }),
        headerClasses: 'juridiction',
    }, {
        dataField: 'numeroAppele',
        text: translate.formatMessage({id: "consumption.table.header.number.called"}),
        filter: textFilter(),
        classes: 'numeroAppele',
        sort: true
    },  {
        dataField: 'dureeCommunication',
        text: translate.formatMessage({id: "consumption.table.header.call.duration"}),
        sort: true
    }, {
        dataField: 'montantTTC',
        text: translate.formatMessage({id: "consumption.table.header.amount"}),
        classes: 'amount',
        headerClasses: 'amount',
        sort: true,
        filter: numberFilter()
    }, {
        dataField: 'numeroAppelant',
        text: translate.formatMessage({id: "consumption.table.header.number.calling"}),
        filter: textFilter(),
        sort: true,
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
            <Card className="mt-1">
                <CardHeader>
                    <span className="icon-gradient icon-multi-apps mr-2"/>
                    <FormattedMessage id="consumption.table.title"/>
                </CardHeader>
                <CardBody>
                    <BootstrapTable
                        hover
                        condensed
                        bootstrap4
                        keyField='id'
                        data={consumptionTableData}
                        columns={consumptionColumns}
                        pagination={paginationFactory(paginationOptions)}
                        filter={filterFactory()}
                        noDataIndication={<span className="font-italic"><FormattedMessage id="global.table.nothing"/></span>}
                    />
                </CardBody>
            </Card>
        </React.Fragment>
    )
};

export default LandedDetailedConsumptionTable;