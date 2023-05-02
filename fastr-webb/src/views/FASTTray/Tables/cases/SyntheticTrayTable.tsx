import * as React from 'react';

import {format} from "date-fns";
import Table from "react-bootstrap-table-next";
import {UncontrolledTooltip} from 'reactstrap';
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import "../../tray.scss"
import {Case} from "../../../../model/Case";
import FastService, {FastMessage} from "../../../../service/FastService";
import {fetchAndStoreTrayCaseAmountIndicators} from "../../../../store/actions";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../../store";
import {useEffect} from "react";

interface Props {
    cases: Case[],
    trayColumnsForMaxwell,
    isCCMaxwell: boolean,
    isSupervisor: boolean
}

const SyntheticTrayTable: React.FunctionComponent<Props> = (props) => {
    const dispatch = useDispatch();
    const userActivity= useSelector((state: AppState) => state.session.userActivity)
    const traySite =  useSelector((state: AppState) =>state.tray.site)
    const getActivityCode = () => {
        return userActivity ? userActivity.code : ""
    }
    useEffect(() => {
        if(userActivity?.code ) {
            updateIndicators().then()
        }
    }, [userActivity])
    const updateIndicators = async () => {
        dispatch(fetchAndStoreTrayCaseAmountIndicators(getActivityCode(), '', props.isSupervisor, props.isCCMaxwell, traySite?.code ?? undefined));
    }
    const themeFormatter = (cell: Array<string>, row) => {
        if (!cell) {
            return;
        }
        return (
            <div>
                <span id={`tooltip${row.caseId}`}>{cell[cell.length - 1]}</span>
                <UncontrolledTooltip placement="right" delay={0} target={`tooltip${row.caseId}`}>
                    {`${cell.join('/')}`}
                </UncontrolledTooltip>
            </div>
        );
    }

    const dateFormatter = cell => cell ? format(new Date(cell), 'dd/MM/yyyy') : ""

    const defaultTrayColumns = [
        {
            dataField: 'creationDate',
            text: translate.formatMessage({id: "tray.table.header.creationDate"}),
            sort: true,
            formatter: dateFormatter
        }, {
            dataField: 'caseId',
            text: translate.formatMessage({id: "tray.table.header.caseId"}),
        }, {
            dataField: 'updateDate',
            text: translate.formatMessage({id: "tray.table.header.updateDate"}),
            formatter: dateFormatter
        },
        {
            dataField: 'themeQualification.tags',
            text: translate.formatMessage({id: "tray.table.header.themeQualification.tags"}),
            formatter: themeFormatter,
            classes: 'theme',
            headerClasses: 'theme'
        }, {
            dataField: 'doNotResolveBeforeDate',
            text: translate.formatMessage({id: "tray.table.header.doNotResolveBeforeDate"}),
            sort: true,
            formatter: dateFormatter
        }];

    const defaultSorted = [{
        dataField: 'creationDate',
        order: 'asc'
    }];

    const rowEvents = {
        onClick: (e, row: Case) => {
            const jsonMessage: FastMessage = {
                event: "clickOnAssignedCase",
                error: false,
                idCase: row.caseId,
                serviceId: row.serviceId
            }
            FastService.postRedirectMessage(jsonMessage)
        }
    };

    const trayColumns = [...defaultTrayColumns];
    const trayColumnsForMaxwell = [...trayColumns];
    trayColumnsForMaxwell.splice(3,0,...props.trayColumnsForMaxwell);

    const casesToDisplay = props.cases.slice(0, 5)

    return <Table
        bootstrap4
        hover
        keyField='caseId'
        data={casesToDisplay}
        columns={props.isCCMaxwell ? trayColumnsForMaxwell : trayColumns}
        defaultSorted={defaultSorted}
        rowEvents={rowEvents}
        classes="synthetic"
    />
};

export default SyntheticTrayTable;
