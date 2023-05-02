import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import React, {useEffect, useState} from 'react';
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {textFilter} from 'react-bootstrap-table2-filter';
import {FormattedMessage} from "react-intl";
import {translate} from "../../../components/Intl/IntlGlobalProvider";
import {LandedDevice} from "../../../model/service/Devices";
import "./RetourEquipment.scss"
import Loading from "../../../components/Loading";

interface Props {
    devices?: LandedDevice[]
    rawData: LandedDevice[]
    nonSelectable?: string[]
    enableButton: () => void
    disableButton: () => void
    saveSelectedEquipments: (selectedEquipments: LandedDevice[]) => void
}


const EquipmentsTable = (props:Props) => {
    const {devices, nonSelectable, enableButton, disableButton, saveSelectedEquipments, rawData} = props
    const [selected, setSelected] = useState([]);

    if (!devices) {
        return <Loading />
    }

    useEffect(() => {
        if(selected?.length) {
            const selectedEquipments: LandedDevice[] = []
            selected.forEach(elem => selectedEquipments.push(rawData[elem]))
            saveSelectedEquipments(selectedEquipments)
            enableButton()
        } else {
            saveSelectedEquipments([])
            disableButton()
        }
    }, [selected])

    const typeTextFormatter = cell => <>{cell.map((label, i) => <><span className={i === 0 ? "font-weight-bold" : ""}>{label}</span><br/></>)}</>;

    const equipmentColumns = [{
        dataField: 'typeEqpt',
        text: translate.formatMessage({id: "return.equipment.table.header.type"}),
        formatter: typeTextFormatter,
        sort: true,
        headerStyle: {
            width: '15%'
        }
    }, {
        dataField: 'status',
        text: translate.formatMessage({id: "return.equipment.table.header.status"}),
        sort: true
    }, {
        dataField: 'sendDate',
        text: translate.formatMessage({id: "return.equipment.table.header.send.date"}),
        sort: true
    }, {
        dataField: 'returnDeadline',
        text: translate.formatMessage({id: "return.equipment.table.header.return.deadline"}),
        sort: true
    },  {
        dataField: 'penaltiesAmount',
        text: translate.formatMessage({id: "return.equipment.table.header.penalties.amount"}),
        sort: true
    }, {
        dataField: 'warrantyDeposit',
        text: translate.formatMessage({id: "return.equipment.table.header.warranty.deposit"}),
        sort: true
    }, {
        dataField: 'warrantyEndDate',
        text: translate.formatMessage({id: "return.equipment.table.header.warranty.end.date"}),
        sort: true
    }, {
        dataField: 'returnRequest',
        text: translate.formatMessage({id: "return.equipment.table.header.return.request"}),
        sort: true
    }, {
        dataField: 'serialNumber',
        text: translate.formatMessage({id: "return.equipment.table.header.serial.number"}),
        filter: textFilter(),
        sort: true,
        headerStyle: {
            width: '15%',
            paddingRight: "15px"
        }
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

    const handleSelection = (rows, isSelect) => {
        const rowIds: [] = rows.map(row => row.id);
        if (isSelect ) {
            setSelected([...selected, ...rowIds]);
        } else {
            setSelected(selected.filter(x => !rowIds.includes(x)));
        }
    }

    const onSelect = (row, isSelect) => {
        handleSelection([row], isSelect);
    };

    const onSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r?.id);
        if (isSelect) {
            setSelected(ids)
        } else {
            setSelected([])
        }
    };

    const selectOptions = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: onSelect,
        onSelectAll: onSelectAll,
        selected: selected,
        nonSelectable: nonSelectable
    };

    return (
        <BootstrapTable
            hover
            condensed
            striped
            bordered={ false }
            bootstrap4
            keyField='id'
            data={devices}
            columns={equipmentColumns}
            pagination={paginationFactory(paginationOptions)}
            filter={filterFactory()}
            selectRow={selectOptions}
            headerClasses="thead-dark"
            wrapperClasses="tableEqpt"
            noDataIndication={<span className="font-italic"><FormattedMessage id="global.table.nothing"/></span>}/>
    )
};

export default EquipmentsTable;