import * as React from "react";
import DetailedHeader from "./DetailedHeader";
import SupervisorDetailedHeader from "./SupervisorDetailedHeader";
import SyntheticHeader from "./SyntheticHeader";
import {CaseAmountIndicators} from "../../../model/Tray/CaseAmountIndicators";
import {ApplicationInitialState} from "../../../model/ApplicationInitialState";

interface Props {
    detailed
    isSupervisor
    isAssignDisable: boolean
    onChangeTypeahead?: (selected) => void
    assignCase: () => void
    caseAmountIndicators: CaseAmountIndicators
    appInitialState?: ApplicationInitialState
    onSiteFilterChange: (value) => void
}

const index: React.FunctionComponent<Props> = (props: Props) => {
    const {detailed, isSupervisor, onChangeTypeahead, isAssignDisable, assignCase, caseAmountIndicators, appInitialState} = props;

    if (detailed) {
        if (isSupervisor) {
            return (
                <SupervisorDetailedHeader
                    isAssignDisable={isAssignDisable}
                    caseAmountIndicators={caseAmountIndicators}
                    onChangeTypeahead={onChangeTypeahead}
                    appInitialState={appInitialState}
                    onSiteFilterChange={(site) => props.onSiteFilterChange(site)}
                    assignCase={assignCase} />
            )
        } else {
            return (
                <DetailedHeader caseAmountIndicators={caseAmountIndicators}
                    assignCase={assignCase} appInitialState={appInitialState} />)
        }
    } else {
        return (
            <SyntheticHeader caseAmountIndicators={caseAmountIndicators}
                assignCase={assignCase} appInitialState={appInitialState} />
        )
    }

}
export default index;