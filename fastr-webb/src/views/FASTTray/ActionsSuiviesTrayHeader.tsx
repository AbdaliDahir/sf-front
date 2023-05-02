import * as React from "react";
import { ActionMonitoringAmountIndicators } from "../../model/Tray/ActionMonitoringAmountIndicators";
import SupervisorActionMonitoringDetailedHeader from "./Headers/SupervisorActionMonitoringDetailedHeader";
import ActionMonitoringDetailedHeader from "./ActionMonitoringDetailedHeader";

interface Props {
    detailed
    isSupervisor
    selectedActions?
    isAssignDisable: boolean
    onChangeTypeahead?: (selected) => void
    assignActionMonitoring: () => void
    actionMonitoringAmountIndicators: ActionMonitoringAmountIndicators;
    onSiteFilterChange: (value: string) => void;
}

const ActionsSuiviesTrayHeader: React.FunctionComponent<Props> = (props: Props) => {
    const { detailed, isSupervisor, onChangeTypeahead, isAssignDisable, assignActionMonitoring, actionMonitoringAmountIndicators, onSiteFilterChange } = props;

    if (detailed) {
        if (isSupervisor) {
            return (
                <SupervisorActionMonitoringDetailedHeader isAssignDisable={isAssignDisable}
                    actionMonitoringAmountIndicators={actionMonitoringAmountIndicators}
                    onChangeTypeahead={onChangeTypeahead}
                    assignAction={assignActionMonitoring}
                    onSiteFilterChange={onSiteFilterChange} />
            )
        } else {
            return (
                <ActionMonitoringDetailedHeader actionMonitoringAmountIndicators={actionMonitoringAmountIndicators}
                    isAssignDisable={isAssignDisable}
                    assignAction={assignActionMonitoring} />)
        }
    } else {
        return <React.Fragment />
    }

}
export default ActionsSuiviesTrayHeader;