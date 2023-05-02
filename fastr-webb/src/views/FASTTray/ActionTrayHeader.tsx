import * as React from "react";
import { ActionAmountIndicators } from "../../model/Tray/ActionAmountIndicators";
import SupervisorActionDetailedHeader from "./Headers/SupervisorActionDetailedHeader";
import ActionDetailedHeader from "./ActionDetailedHeader";

interface Props {
    detailed
    isSupervisor
    isAssignDisable: boolean
    onChangeTypeahead?: (selected) => void
    assignAction: () => void;
    onSiteFilterChange: (site: string) => void
    actionAmountIndicators: ActionAmountIndicators
}

const ActionTrayHeader: React.FunctionComponent<Props> = (props: Props) => {
    const { detailed, isSupervisor, onChangeTypeahead, isAssignDisable, assignAction, actionAmountIndicators } = props;
    if (detailed) {
        if (isSupervisor) {
            return (
                <SupervisorActionDetailedHeader isAssignDisable={isAssignDisable}
                    actionAmountIndicators={actionAmountIndicators}
                    onChangeTypeahead={onChangeTypeahead}
                    assignAction={assignAction}
                    onSiteFilterChange={props.onSiteFilterChange}
                />
            )
        } else {
            return (
                <ActionDetailedHeader actionAmountIndicators={actionAmountIndicators}
                    assignAction={assignAction} />)
        }
    } else {
        return <React.Fragment />
    }

}
export default ActionTrayHeader;