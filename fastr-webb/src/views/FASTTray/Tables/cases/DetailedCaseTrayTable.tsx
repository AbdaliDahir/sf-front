import {format} from "date-fns";
import * as React from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {customFilter, FILTER_TYPES} from 'react-bootstrap-table2-filter';
import paginationFactory from "react-bootstrap-table2-paginator";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import CardHeader from "reactstrap/lib/CardHeader";
import {Case} from "../../../../model/Case";
import {default as FastService, FastMessage} from "../../../../service/FastService";
import DateFilter from "../../Elements/DateFilter";
import {FormattedMessage} from "react-intl";

import {UncontrolledTooltip} from 'reactstrap';
import {translate} from "src/components/Intl/IntlGlobalProvider";
import {CaseProgressStatus} from "../../../../model/CaseProgressStatus";
import {TrayHeaderFilterEnum} from "../../../../model/Tray/TrayHeaderFilterEnum";
import CsvFileExport from "./CsvFileExport";
import {ServiceType} from "../../../../model/ServiceType";

import "../trayTable.scss";
import SelectFilter from "../../Elements/SelectFilter";
import {CaseTableFilters} from "../../../../model/TableFilters/cases/CaseTableFilters";
import {TableSort} from "../../../../model/TableFilters/TableSort";
import TextFilter from "../../Elements/TextFilter";
import {useEffect} from "react";
import CasesTooltip from "./CasesTooltip";
import {ApplicationMode} from "../../../../model/ApplicationMode";


interface Props {
    cases: Case[]
    onSelectCase?: (row, isSelect: boolean) => void
    selected?: string[]
    trayHeaderFilter: TrayHeaderFilterEnum
    isSupervisor: boolean
    onTableChange?: (type, object) => void
    page?: number
    sizePerPage?: number
    totalSize?: number

    trayColumnsForMaxwell
    isCCMaxwell: boolean
    initialFilters?:CaseTableFilters
    initialSort?:TableSort
    themeSelection: string[],
    onDoubleClickCase?: (row) => void,
    sessionIsFrom?
}

const DetailedCaseTrayTable: React.FunctionComponent<Props> = (props) => {
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
    const dateTimeFormatter = cell => cell ? format(new Date(cell), DATETIME_FORMAT) : "";
    const dateFormatter = cell => cell ? format(new Date(cell), DATE_FORMAT) : "";

    const statusFormatter = cell => cell ? translate.formatMessage({id: cell}) : "";
    const serviceTypeFormatter = cell => cell ? translate.formatMessage({id: cell}) : "";
    const qualificationFormatter = cell => cell ? cell[cell.length - 1] : "";

    const getDefaultForStatus = () => {
        if (props.trayHeaderFilter === TrayHeaderFilterEnum.QUALIFIED) {
            return translate.formatMessage({id: "QUALIFIED"})
        } else if (props.trayHeaderFilter === TrayHeaderFilterEnum.ONGOING) {
            return translate.formatMessage({id: "ONGOING"})
        } else {
            return translate.formatMessage({id: "global.default.option"});
        }
    }
    const getDefaultForProgressStatus = () => {
        if (props.trayHeaderFilter === TrayHeaderFilterEnum.REOPENED) {
            return translate.formatMessage({id: "REOPENED"})
        } else {
            return translate.formatMessage({id: "global.default.option"});
        }
    }

    const statusOptions = {
        "ONGOING": translate.formatMessage({id: "ONGOING"}),
        "QUALIFIED": translate.formatMessage({id: "QUALIFIED"})
    };

    const getProgressStatusOptions = () => {
        const progressStatusOptions = {};
        Object.keys(CaseProgressStatus).forEach(status => progressStatusOptions[status] = translate.formatMessage({id: status}));
        return progressStatusOptions;
    };

    const serviceTypeOptions = {}
    Object.keys(ServiceType).forEach(type => serviceTypeOptions[type] = translate.formatMessage({id: type}));
    const actionOptions ={
        "ACTION_FASTR": translate.formatMessage({id: "ACTION_FASTR"}),
    }

    const resourceTypeFormatter = (cell, row) => {
        const showButton= row.resources.filter(data => data.resourceType === 'ACTION_FASTR').length > 0
        return  showButton ?(
            <div id={"case"+row.caseId} className="case-action-cell">
                <span>OUI</span>
                <UncontrolledTooltip
                    target={"case" + row.caseId}
                    placement={"right-end"}
                    trigger={"click"}
                    popperClassName="case-action-tooltips-popper"
                    innerClassName="case-action-tooltips"
                >
                <div>
                    <CasesTooltip
                        caseId={row.caseId}
                    />
                </div>
                </UncontrolledTooltip>
            </div>
        ):(
            <></>
        );
    }
    const creationDate = {
        dataField: 'creationDate',
            text: translate.formatMessage({id: "tray.table.header.creationDate"}),
            sort: true,
            formatter: props.isSupervisor ?dateFormatter :dateTimeFormatter,
            filter: customFilter({
            type: FILTER_TYPES.DATE
        }),
            filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <DateFilter
                    onFilter={onFilter}
                    column={column}
                    initialDate={props.initialFilters?.creationDate? new Date(props.initialFilters?.creationDate!.filterVal.date) : undefined}
                    initialComparator={props.initialFilters?.creationDate? props.initialFilters?.creationDate!.filterVal.comparator : undefined}
                />
            </div>
    }
    const caseId = {
        dataField: 'caseId',
            text: translate.formatMessage({id: "tray.table.header.caseId"}),
            filter: customFilter({
            type: FILTER_TYPES.TEXT
        }),
            filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <TextFilter
                    onFilter={onFilter}
                    column={column}
                    initialValue={props.initialFilters?.caseId ? props.initialFilters?.caseId.filterVal:''}
                />
            </div>
    }
    const status = {
        dataField: 'status',
            text: translate.formatMessage({id: "tray.table.header.status"}),
            sort: true,
            formatter: statusFormatter,
            filterValue: statusFormatter,
            filter: customFilter({
            type: FILTER_TYPES.SELECT,
            disabled: props.trayHeaderFilter !== TrayHeaderFilterEnum.NONE,
        }),
            filterRenderer: (onFilter, column) =>
            <SelectFilter
                onFilter={onFilter}
                column={column}
                options={statusOptions}
                initialOption={props.initialFilters?.status? props.initialFilters?.status!.filterVal:getDefaultForStatus()}
                disabled={props.trayHeaderFilter !== TrayHeaderFilterEnum.NONE}
            />
    }
    const progressStatus = {
        dataField: 'progressStatus',
            text: translate.formatMessage({id: "tray.table.header.progressStatus"}),
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
                options={getProgressStatusOptions()}
                initialOption={props.initialFilters?.progressStatus? props.initialFilters?.progressStatus.filterVal: getDefaultForProgressStatus()}
                disabled={props.trayHeaderFilter !== TrayHeaderFilterEnum.NONE}
            />

    }
    const caseCreatorActivityLabel= {
        dataField: 'caseCreator.activity.label',
            text: translate.formatMessage({id: "tray.table.header.caseCreator.activity.label"}),
            sort: true,
            filter: customFilter({
            type: FILTER_TYPES.TEXT
        }),
            filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <TextFilter
                    onFilter={onFilter}
                    column={column}
                    initialValue={props.initialFilters?.["caseCreator.activity.label"] ? props.initialFilters?.["caseCreator.activity.label"].filterVal:''}
                />
            </div>
    }
    const resourcesResourceType= {
        dataField: 'resources.resourceType',
            text: translate.formatMessage({id: "tray.table.header.resources.resourceType"}),
            formatter: resourceTypeFormatter,
            filter: customFilter({
            type: FILTER_TYPES.SELECT,
        }),
            filterRenderer: (onFilter, column) =>
            <SelectFilter
                onFilter={onFilter}
                column={column}
                options={actionOptions}
                initialOption={props.initialFilters?.["resources.resourceType"] ? props.initialFilters?.["resources.resourceType"].filterVal: 'default'}
            />
    }
    const updateDate = {
        dataField: 'updateDate',
            text: translate.formatMessage({id: "tray.table.header.updateDate"}),
            sort: true,
            formatter: props.isSupervisor ?dateFormatter :dateTimeFormatter,
            filter: customFilter({
            type: FILTER_TYPES.DATE,
        }),
            filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <DateFilter
                    onFilter={onFilter}
                    column={column}
                    initialDate={ props.initialFilters?.updateDate ? new Date(props.initialFilters?.updateDate!.filterVal.date): undefined}
                    initialComparator={  props.initialFilters?.updateDate ? props.initialFilters?.updateDate!.filterVal.comparator: undefined}

                />
            </div>
    }
    const caseOwnerLogin= {
        dataField: 'caseOwner.login',
            text: translate.formatMessage({id: "tray.table.header.caseOwner.login"}),
            sort: true,
            filter: customFilter({
            type: FILTER_TYPES.TEXT
        }),
            filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <TextFilter
                    onFilter={onFilter}
                    column={column}
                    initialValue={props.initialFilters?.["caseOwner.login"] ? props.initialFilters?.["caseOwner.login"].filterVal:''}
                />
            </div>
    }
    const qualificationTags= {
        dataField: 'qualification.tags',
            text: translate.formatMessage({id: "tray.table.header.qualification.tags"}),
        sort: true,
        formatter: qualificationFormatter,
        filter: customFilter({
        type: FILTER_TYPES.TEXT
    }),
        filterRenderer: (onFilter, column) =>
        <div className="d-flex flex-wrap-reverse justify-content-center">
            <TextFilter
                onFilter={onFilter}
                column={column}
                initialValue={props.initialFilters?.["qualification.tags"] ? props.initialFilters?.["qualification.tags"].filterVal:''}
            />
        </div>
    }
    const themeQualificationTags= {
        dataField: 'themeQualification.tags',
            text: translate.formatMessage({id: "tray.table.header.themeQualification.tags"}),
            sort: true,
            formatter: themeFormatter,
            filter: customFilter({
            type: FILTER_TYPES.TEXT
        }),
            filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <TextFilter
                    onFilter={onFilter}
                    column={column}
                    initialValue={props.initialFilters?.["themeQualification.tags"]  ? props.initialFilters?.["themeQualification.tags"] .filterVal:''}
                    disabled={!!(
                        props.themeSelection[0] &&
                        props.themeSelection[0] !== translate.formatMessage({id: "tray.cases.filter.themes.all"}))
                    }
                />
            </div>
    }
    const doNotResolveBeforeDate = {
        dataField: 'doNotResolveBeforeDate',
            text: translate.formatMessage({id: "tray.table.header.doNotResolveBeforeDate"}),
            sort: true,
            formatter: dateFormatter,
            filter: customFilter({
            type: FILTER_TYPES.DATE,
        }),
            filterRenderer: (onFilter, column) =>
            <div className="d-flex flex-wrap-reverse justify-content-center">
                <DateFilter
                    onFilter={onFilter}
                    column={column}
                    initialDate={props.initialFilters?.doNotResolveBeforeDate ? new Date(props.initialFilters?.doNotResolveBeforeDate!.filterVal.date) : undefined}
                    initialComparator={props.initialFilters?.doNotResolveBeforeDate ? props.initialFilters?.doNotResolveBeforeDate!.filterVal.comparator : undefined}
                />
            </div>
    }
    const serviceType = {
        dataField: 'serviceType',
        text: translate.formatMessage({id: "tray.table.header.serviceType"}),
        sort: true,
        formatter: serviceTypeFormatter,
        filter: customFilter({
            type: FILTER_TYPES.SELECT,
        }),
        filterRenderer: (onFilter, column) =>
            <SelectFilter
                onFilter={onFilter}
                column={column}
                options={serviceTypeOptions}
                initialOption={props.initialFilters?.serviceType ? props.initialFilters?.serviceType.filterVal: 'default'}
            />
    }
    const trayColumns = props.isSupervisor ?
        [
            creationDate,
            caseId,
            status,
            progressStatus,
            resourcesResourceType,
            updateDate,
            caseOwnerLogin,
            qualificationTags,
            themeQualificationTags,
            doNotResolveBeforeDate,
            serviceType
        ] :
        [
            creationDate,
            caseId,
            progressStatus,
            caseCreatorActivityLabel,
            resourcesResourceType,
            updateDate,
            qualificationTags,
            themeQualificationTags,
            doNotResolveBeforeDate,
            serviceType
        ];

    const trayColumnsForMaxwell = [...trayColumns];
    props.isSupervisor ? trayColumnsForMaxwell.splice(4,0,...props.trayColumnsForMaxwell): trayColumnsForMaxwell.splice(3,0,...props.trayColumnsForMaxwell);;

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
        firstPageText: translate.formatMessage({id: "tray.table.pagination.firstPageText"}),
        prePageText: translate.formatMessage({id: "tray.table.pagination.prePageText"}),
        nextPageText: translate.formatMessage({id: "tray.table.pagination.nextPageText"}),
        lastPageText: translate.formatMessage({id: "tray.table.pagination.lastPageText"}),
        hidePageListOnlyOnePage: true
    };

    const onSelect = (row, isSelect) => {
        if(props.onSelectCase){
            props.onSelectCase([row], isSelect)
        }

    };

    const onSelectAll = (isSelect, rows) => {
        if(props.onSelectCase) {
            props.onSelectCase(rows, isSelect)
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
        onDoubleClick: (e, row: Case) => {
            const {sessionIsFrom, onDoubleClickCase} = props;
            if (sessionIsFrom === ApplicationMode.GOFASTR && onDoubleClickCase) {
                onDoubleClickCase(row);
            } else {
                const jsonMessage: FastMessage = {
                    event: "clickOnAssignedCase",
                    error: false,
                    idCase: row.caseId,
                    serviceId: row.serviceId
                };
                FastService.postRedirectMessage(jsonMessage)
            }
        }
    };
    useEffect(() => {
        onSelect([],false)
    },[props.cases])

    return (

        <Card className="mt-1">
            <CardHeader>
                <span className="icon-gradient icon-multi-apps mr-2"/>
                <FormattedMessage id="tray.cases.table.supervisor.title"/>{`: ${props?.totalSize ? props.totalSize: '' }` }
                {props.cases && props.cases.length > 0 ?
                    <CsvFileExport
                        cases={props.cases}
                        isCCMaxwell={props.isCCMaxwell}
                        isSupervisor={props.isSupervisor}
                    />
                    : null
                }
            </CardHeader>
            <CardBody className={"detailed-tray-body"}>
                {props.isSupervisor ?
                    <>
                        <span>
                            <FormattedMessage id="tray.cases.table.supervisor.NBSelected"/>
                            {` : ${props.selected?.length}`}
                        </span>
                        <BootstrapTable
                            condensed
                            hover
                            bootstrap4
                            remote
                            keyField='caseId'
                            data={props.cases}
                            columns={props.isCCMaxwell ? trayColumnsForMaxwell : trayColumns}
                            pagination={paginationFactory(paginationOptions)}
                            filter={filterFactory()}
                            selectRow={selectOptions}
                            rowEvents={rowEvents}
                            onTableChange={props.onTableChange}
                            sort={props.initialSort?? undefined}
                        />
                    </>
                    :
                    <BootstrapTable
                        condensed
                        hover
                        bootstrap4
                        remote
                        keyField='caseId'
                        data={props.cases}
                        columns={props.isCCMaxwell ? trayColumnsForMaxwell : trayColumns}
                        pagination={paginationFactory(paginationOptions)}
                        filter={filterFactory()}
                        rowEvents={rowEvents}
                        onTableChange={props.onTableChange}
                        sort={props.initialSort?? undefined}
                    />
                }
            </CardBody>
        </Card>);

};

export default DetailedCaseTrayTable;