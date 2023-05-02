import * as React from "react";
import {Case} from "../../../../model/Case";
import SyntheticTrayTable from "./SyntheticTrayTable";
import {UncontrolledPopover} from "reactstrap";
import {FormattedMessage} from "react-intl";
import moment from "moment";
import {useTypedSelector} from "../../../../components/Store/useTypedSelector";
import {translate} from "../../../../components/Intl/IntlGlobalProvider";
import {EMaxwellIncidentStatus} from "../../../../model/maxwell/enums/EMaxwellIncidentStatus";
import RemoteCaseTrayTable from "./RemoteCaseTrayTable";

interface Props {
    detailed?: boolean
    isSupervisor: boolean
    onSelectCase?: (row, isSelect) => void
    selectedCases?: string[]
    cases: Case[]
    activitySelected: string
    site?: string | null
}

const caseTrayTable: React.FunctionComponent<Props> = (props: Props) => {

    const isCCMaxwell = useTypedSelector((state => state.store.applicationInitialState.authorizations.indexOf("ADG_MAXWELL") !== -1));
    const prioritySetting = useTypedSelector((state => state.store.applicationInitialState.incidentPrioritySetting?.settingDetail));
    const DATE_FORMAT = process.env.REACT_APP_FASTR_MOMENT_DATE_FORMAT;

    const maxwellIncidentFormatter = (cell, row) => {
        if (!cell) {
            return;
        }
        const clfyTTTicketId = row.lastOngoingIncident?.actDetail?.incident?.ticketId;
        const creationDate = row.resources.find((ress) => ress.id === row.lastOngoingIncident?.actId)?.creationDate;
        return (
            <div id={`popover${row.caseId}`} className={'synthetic-tray__actid-cell'}>
                {clfyTTTicketId &&
                <span>{clfyTTTicketId}</span>
                }
                <UncontrolledPopover trigger={'hover'} delay={0} target={`popover${row.caseId}`}>
                    <section className={"synthetic-tray__popover"}>
                        <section>
                            <label className={"mr-1"}>{cell}</label>
                            <label className={"ml-1"}>{clfyTTTicketId ? '/ ' + clfyTTTicketId : ""}</label>
                        </section>
                        <section>
                            <label
                                className={"mr-1"}>{row.lastOngoingIncident?.actDetail?.paramIncident?.incident?.priority}</label>
                            <label className={"ml-1"}>{row.lastOngoingIncident?.actDetail?.incident?.status}</label>
                        </section>
                        <label><FormattedMessage
                            id={"cases.get.details.created.date"}/> {moment(creationDate).format(DATE_FORMAT)}</label>
                        <section>{row.lastOngoingIncident?.actDetail?.incident?.technicalResult}</section>
                    </section>
                </UncontrolledPopover>
            </div>
        );
    }

    const maxwellDatePrioFormatter = (cell, row, rowIndex, extra) => {
        if (extra && extra() && row.lastOngoingIncident) {
            const settingObject = extra();
            const prioSetting = settingObject[cell];
            const creationDate = row.resources.find((ress) => ress.id === row.lastOngoingIncident?.actId)?.creationDate;
            if (creationDate && prioSetting) {
                return <label>{moment(creationDate).add(prioSetting, "days").format(DATE_FORMAT)}</label>
            } else {
                return null;
            }
        }
        return null
    }

    const handleDate = () => {
        return prioritySetting?.reduce((prev, curr, index) => {
            if (index === 1) {
                prev[prev.code] = prev.value;
                delete prev.value;
                delete prev.code;
            }
            prev[curr.code] = curr.value
            return prev;
        });
    }

    const formattedStatus = (incidentStatus) => {
        if (incidentStatus && Object.values(EMaxwellIncidentStatus).includes(incidentStatus.toUpperCase())) {
            return translate.formatMessage({id: "maxwellV2.incident.list.status." + incidentStatus.toUpperCase()});
        }
        return incidentStatus;
    }
    const trayColumnsForMaxwell = [
        {
            dataField: 'lastOngoingIncident.actDetail.paramIncident.incident.priority',
            text: translate.formatMessage({id: "tray.table.header.incident.prio"}),
            sort: true
        },
        {
            dataField: 'lastOngoingIncident.actDetail.paramIncident.incident.priority',
            text: translate.formatMessage({id: "tray.table.header.incident.dateprio"}),
            sort: true,
            formatter: maxwellDatePrioFormatter,
            formatExtraData: handleDate
        },
        {
            dataField: 'lastOngoingIncident.actId',
            text: translate.formatMessage({id: "tray.table.header.incident.ticketId"}),
            sort: true,
            formatter: maxwellIncidentFormatter,
        },
        {
            dataField: 'lastOngoingIncident.actDetail.incident.status',
            text: translate.formatMessage({id: "tray.table.header.incident.status"}),
            formatter: formattedStatus,
            sort: true
        }
    ]

    if (props.detailed) {
            return(
                <RemoteCaseTrayTable
                    activitySelected={props.activitySelected}
                    onSelectCase={props.onSelectCase}
                    selected={props.selectedCases}
                    isCCMaxwell={isCCMaxwell}
                    site={props.site}
                    trayColumnsForMaxwell={trayColumnsForMaxwell}
                    isSupervisor={props.isSupervisor}
                />
            )
    } else {
        return (
            <SyntheticTrayTable
                cases={props.cases}
                isCCMaxwell={isCCMaxwell}
                trayColumnsForMaxwell={trayColumnsForMaxwell}
                isSupervisor={props.isSupervisor}
            />
        )
    }

}
export default caseTrayTable;