import { format } from "date-fns";
import * as React from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { customFilter, FILTER_TYPES } from 'react-bootstrap-table2-filter';
import paginationFactory from "react-bootstrap-table2-paginator";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import DateFilter from "../../Elements/DateFilter";
import { FormattedMessage } from "react-intl";

import { UncontrolledTooltip } from 'reactstrap';
import { translate } from "src/components/Intl/IntlGlobalProvider";
import { TrayHeaderFilterEnum } from "../../../../model/Tray/TrayHeaderFilterEnum";
import "../trayTable.scss";
import {Action} from "../../../../model/actions/Action";
import {default as FastService, FastMessage} from "../../../../service/FastService";
import {ServiceType} from "../../../../model/ServiceType";
import {useEffect} from "react";
import {Activity} from "../../../../model/Activity";
import {TableSort} from "../../../../model/TableFilters/TableSort";
import TextFilter from "../../Elements/TextFilter";
import SelectFilter from "../../Elements/SelectFilter";
import {ActionsSuiviesTableFilters} from "../../../../model/TableFilters/actionsSuivies/ActionsSuiviesTableFilters";



interface Props {
    actions: Action[]
    trayHeaderFilter: TrayHeaderFilterEnum
    onSelectAction?: (row, isSelect: boolean) => void
    selected?: string[]
    onTableChange?: (type, object) => void
    page?: number
    sizePerPage?: number
    totalSize?: number
    userActivity: Activity
    onExport: () => void
    exporting: boolean
    isSupervisor: boolean
    initialFilters?: ActionsSuiviesTableFilters
    initialSort?:TableSort
    progressStatusOptions:{}
    themeSelection: string[]
}

const DetailedActionsSuiviesTrayTable: React.FunctionComponent<Props> = (props) => {
    const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm'
    const DATE_FORMAT = 'dd/MM/yyyy';
    const themeFormatter = (cell: Array<string>, row) => {
        return (
            cell && <div>
                <span id={`tooltip${row.caseId}`}>{cell[0]}</span>
                <UncontrolledTooltip placement="right" delay={0} target={`tooltip${row.caseId}`}>
                    {`${cell.join('/')}`}
                </UncontrolledTooltip>
            </div>
        );
    };

    const dateFormatter = cell => cell ? format(new Date(cell), DATE_FORMAT) : "";
    const dateTimeFormatter = cell => cell ? format(new Date(cell), DATETIME_FORMAT) : "";
    const statusFormatter = cell => cell ? translate.formatMessage({ id: cell }) : "";

    const serviceTypeOptions = {}
    Object.keys(ServiceType).forEach(type => serviceTypeOptions[type] = translate.formatMessage({ id: type }));
    const statusOptions = {
        "ONGOING": translate.formatMessage({ id: "STATUS.ONGOING" }),
        "UNRESOLVED": translate.formatMessage({ id: "STATUS.UNRESOLVED" }),
        "QUALIFIED": translate.formatMessage({ id: "STATUS.QUALIFIED" }),
        "RESOLVED": translate.formatMessage({ id: "STATUS.RESOLVED" }),
        "RESOLVED_REASSIGNED": translate.formatMessage({ id: "STATUS.RESOLVED_REASSIGNED" })
    };
    const monitoringCurrentStateStartDate= {
        dataField: 'monitoringCurrentState.startDate',
        text: translate.formatMessage({ id: "tray.action.monitoring.table.header.startDate" }),
        sort: true,
        formatter: dateFormatter,
        headerClasses: 'filter-select',
        filter: customFilter({
            type: FILTER_TYPES.DATE
        }),
        filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <DateFilter
                    onFilter={onFilter}
                    column={column}
                    initialDate={props.initialFilters?.["monitoringCurrentState.startDate"]?
                        new Date(props.initialFilters?.["monitoringCurrentState.startDate"]!.filterVal.date)
                        : undefined
                    }
                    initialComparator={props.initialFilters?.["monitoringCurrentState.startDate"]?
                        props.initialFilters?.["monitoringCurrentState.startDate"]!.filterVal.comparator
                        : undefined
                    }
                />
            </div>
    }
    const monitoringCurrentStateAssigneeLogin= {
        dataField: 'monitoringCurrentState.assignee.login',
        text: translate.formatMessage({ id: "tray.action.monitoring.table.header.assignee.login" }),
        sort: true,
        filter: customFilter({
            type: FILTER_TYPES.TEXT
        }),
        filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <TextFilter
                    onFilter={onFilter}
                    column={column}
                    initialValue={props.initialFilters?.["monitoringCurrentState.assignee.login"] ?
                        props.initialFilters?.["monitoringCurrentState.assignee.login"].filterVal
                        :''
                    }
                    disabled={props.trayHeaderFilter === TrayHeaderFilterEnum.TO_MONITOR ||
                        props.trayHeaderFilter === TrayHeaderFilterEnum.MONITORED ||
                        props.trayHeaderFilter === TrayHeaderFilterEnum.MONITORING_TO_FINALIZE }
                />
            </div>
    }
    const creationDate={
        dataField: 'creationDate',
        text: translate.formatMessage({ id: "tray.action.monitoring.table.header.creationDate" }),
        sort: true,
        formatter: props.isSupervisor ?dateFormatter: dateTimeFormatter,
        headerClasses: 'filter-select',
        filter: customFilter({
            type: FILTER_TYPES.DATE
        }),
        filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <DateFilter
                    onFilter={onFilter}
                    column={column}
                    initialDate={props.initialFilters?.creationDate?
                        new Date(props.initialFilters?.creationDate!.filterVal.date)
                        : undefined
                    }
                    initialComparator={props.initialFilters?.creationDate?
                        props.initialFilters?.creationDate!.filterVal.comparator
                        : undefined
                    }
                />
            </div>
    }
    const actionId={
        dataField: 'actionId',
        text: translate.formatMessage({ id: "tray.action.monitoring.table.header.actionId" }),
        sort: true,
        filter: customFilter({
            type: FILTER_TYPES.TEXT
        }),
        filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <TextFilter
                    onFilter={onFilter}
                    column={column}
                    initialValue={props.initialFilters?.actionId ?
                        props.initialFilters?.actionId.filterVal
                        :''
                    }
                />
            </div>
    }
    const themeQualificationTags={
        dataField: 'themeQualification.tags',
        text: translate.formatMessage({ id: "tray.action.monitoring.table.header.themeQualification.tags" }),
        sort: true,
        formatter: themeFormatter,
        classes: 'theme',
        headerClasses: 'theme',
        filter: customFilter({
            type: FILTER_TYPES.TEXT
        }),
        filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <TextFilter
                    onFilter={onFilter}
                    column={column}
                    initialValue={props.initialFilters?.["themeQualification.tags"] ?
                        props.initialFilters?.["themeQualification.tags"].filterVal
                        :''
                    }
                    disabled={!!(
                        props.themeSelection[0] &&
                        props.themeSelection[0] !== translate.formatMessage({id: "tray.cases.filter.themes.all"}))
                    }
                />
            </div>
    }
    const processCurrentStateAssigneeActivityLabel = {
        dataField: 'processCurrentState.assignee.activity.label',
        text: translate.formatMessage({ id: "tray.action.table.header.assignee.login" }),
        sort: true,
        filter: customFilter({
            type: FILTER_TYPES.TEXT
        }),
        filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <TextFilter
                    onFilter={onFilter}
                    column={column}
                    initialValue={props.initialFilters?.["processCurrentState.assignee.activity.label"] ?
                        props.initialFilters?.["processCurrentState.assignee.activity.label"].filterVal
                        :''
                    }
                />
            </div>

    }
    const processCurrentStateStatus={
        dataField: 'processCurrentState.status',
        text: translate.formatMessage({ id: "tray.action.monitoring.table.header.status" }),
        sort: true,
        formatter: statusFormatter,
        // filterValue: statusFormatter,
        filter: customFilter({
            type: FILTER_TYPES.SELECT,
        }),
        filterRenderer: (onFilter, column) =>
            <SelectFilter
                onFilter={onFilter}
                column={column}
                options={statusOptions}
                initialOption={props.initialFilters?.["processCurrentState.status"]?
                    props.initialFilters?.["processCurrentState.status"]!.filterVal
                    :translate.formatMessage({id: "global.default.option"})
                }
                disabled={props.trayHeaderFilter === TrayHeaderFilterEnum.MONITORING_TO_FINALIZE}
            />
    }
    const processCurrentStateProgressStatusCode={
        dataField: 'processCurrentState.progressStatus.code',
        text: translate.formatMessage({id: "tray.action.table.header.progressStatus"}),
        sort: true,
        formatter: statusFormatter,
        filterValue: statusFormatter,
        filter: customFilter({
            type: FILTER_TYPES.SELECT,
        }),
        filterRenderer: (onFilter, column) =>
            <SelectFilter
                onFilter={onFilter}
                column={column}
                options={props.progressStatusOptions}
                initialOption={props.initialFilters?.["processCurrentState.progressStatus.code"]?
                    props.initialFilters?.["processCurrentState.progressStatus.code"]!.filterVal
                    :translate.formatMessage({id: "global.default.option"})
                }
            />

    }
    const processCurrentStateConclusionLabel={
        dataField: 'processCurrentState.conclusion.label',
        text: translate.formatMessage({ id: "tray.action.monitoring.table.header.conclusion" }),
        sort: true,
        filter: customFilter({
            type: FILTER_TYPES.TEXT
        }),
        filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <TextFilter
                    onFilter={onFilter}
                    column={column}
                    initialValue={props.initialFilters?.["processCurrentState.conclusion.label"] ?
                        props.initialFilters?.["processCurrentState.conclusion.label"].filterVal
                        :''
                    }
                />
            </div>
    }
    const processCurrentStateUpdateDate={
        dataField: 'processCurrentState.updateDate',
        text: translate.formatMessage({ id: "tray.action.monitoring.table.header.updateDate" }),
        sort: true,
        formatter: props.isSupervisor ?dateFormatter: dateTimeFormatter,
        headerClasses: 'filter-select',
        filter: customFilter({
            type: FILTER_TYPES.DATE
        }),
        filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <DateFilter
                    onFilter={onFilter}
                    column={column}
                    initialDate={props.initialFilters?.["processCurrentState.updateDate"]?
                        new Date(props.initialFilters?.["processCurrentState.updateDate"]!.filterVal.date)
                        : undefined
                    }
                    initialComparator={props.initialFilters?.["processCurrentState.updateDate"]?
                        props.initialFilters?.["processCurrentState.updateDate"]!.filterVal.comparator
                        : undefined
                    }
                />
            </div>
    }
    const processCurrentStateDoNotResolveBeforeDate={
        dataField: 'processCurrentState.doNotResolveBeforeDate',
        text: translate.formatMessage({ id: "tray.action.table.header.doNotResolveBeforeDate" }),
        sort: true,
        formatter: props.isSupervisor ?dateFormatter: dateTimeFormatter,
        headerClasses: 'filter-select',
        filter: customFilter({
            type: FILTER_TYPES.DATE
        }),
        filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <DateFilter
                    onFilter={onFilter}
                    column={column}
                    initialDate={props.initialFilters?.["processCurrentState.doNotResolveBeforeDate"]?
                        new Date(props.initialFilters?.["processCurrentState.doNotResolveBeforeDate"]!.filterVal.date)
                        : undefined
                    }
                    initialComparator={props.initialFilters?.["processCurrentState.doNotResolveBeforeDate"]?
                        props.initialFilters?.["processCurrentState.doNotResolveBeforeDate"]!.filterVal.comparator
                        : undefined
                    }
                />
            </div>
    }
    const supervisorTrayColumns = props.isSupervisor ?
        [
            monitoringCurrentStateStartDate,
            monitoringCurrentStateAssigneeLogin,
            creationDate,
            actionId,
            themeQualificationTags,
            processCurrentStateAssigneeActivityLabel,
            processCurrentStateStatus,
            processCurrentStateProgressStatusCode,
            processCurrentStateConclusionLabel,
            processCurrentStateUpdateDate,
            processCurrentStateDoNotResolveBeforeDate
        ]:
        [
            creationDate,
            actionId,
            themeQualificationTags,
            processCurrentStateAssigneeActivityLabel,
            processCurrentStateStatus,
            processCurrentStateProgressStatusCode,
            processCurrentStateConclusionLabel,
            processCurrentStateUpdateDate,
            processCurrentStateDoNotResolveBeforeDate
        ]


    const paginationOptions = {
        page: props.page,
        sizePerPage: props.sizePerPage,
        totalSize: props.totalSize,
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '20', value: 20
        }, {
            text: '50', value: 50
        }],
        firstPageText: translate.formatMessage({ id: "tray.table.pagination.firstPageText" }),
        prePageText: translate.formatMessage({ id: "tray.table.pagination.prePageText" }),
        nextPageText: translate.formatMessage({ id: "tray.table.pagination.nextPageText" }),
        lastPageText: translate.formatMessage({ id: "tray.table.pagination.lastPageText" }),
        hidePageListOnlyOnePage: true
    };

    const onSelect = (row, isSelect) => {
        if(props.onSelectAction) {
            props.onSelectAction([row], isSelect)
        }
    };

    const onSelectAll = (isSelect, rows) => {
        if(props.onSelectAction) {
            props.onSelectAction(rows, isSelect)
        }
    };

    const selectOptions = {
        mode: 'checkbox',
        clickToSelect: false,
        onSelect,
        selected: props.selected,
        onSelectAll
    };

    const rowEvents = {
        onDoubleClick: (e, row: Action) => {
            const jsonMessage: FastMessage = {
                event: "clickOnAssignedCase",
                error: false,
                idCase: row.caseId,
                serviceId: row.serviceId
            };
            FastService.postRedirectMessage(jsonMessage)
        }
    };
    useEffect(() => {
        onSelect([],false)
    },[props.actions])

    return (
        <Card className="mt-1">
            <CardHeader>
                <span className="icon-gradient icon-multi-apps mr-2" />
                <FormattedMessage id="tray.actions.table.supervisor.title" /> {`: ${props?.totalSize ? props.totalSize : '' }` }
                <button onClick={props.onExport} disabled={props.exporting} className="btn btn-sm btn-primary float-right" color="secondary">
                    {props.exporting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : "Extract CSV"}
                </button>
            </CardHeader>
            <CardBody className={"detailed-tray-body"}>
                {props.isSupervisor ?
                    <>
                        <span><FormattedMessage id="tray.actions.table.supervisor.NBSelected"/>{` : ${props.selected?.length}`} </span>
                        <BootstrapTable
                            condensed
                            hover
                            bootstrap4
                            remote
                            keyField='actionId'
                            data={props.actions}
                            columns={supervisorTrayColumns}
                            pagination={paginationFactory(paginationOptions)}
                            filter={filterFactory()}
                            onTableChange={props.onTableChange}
                            selectRow={selectOptions}
                            rowEvents={rowEvents}
                            sort={props.initialSort?? undefined}
                        />
                    </>
                :
                    <BootstrapTable
                        condensed
                        hover
                        bootstrap4
                        remote
                        keyField='actionId'
                        data={props.actions}
                        columns={supervisorTrayColumns}
                        pagination={paginationFactory(paginationOptions)}
                        filter={filterFactory()}
                        onTableChange={props.onTableChange}
                        rowEvents={rowEvents}
                        sort={props.initialSort?? undefined}
                    />
                }
            </CardBody>
        </Card>);

};

export default DetailedActionsSuiviesTrayTable;
