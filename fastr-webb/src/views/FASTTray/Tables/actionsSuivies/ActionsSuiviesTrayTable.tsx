import * as React from "react";
import RemoteActionsSuiviesTrayTable from "./RemoteActionsSuiviesTrayTable";

interface Props {
    activitySelected: string
    onSelectAction?: (row, isSelect) => void
    selectedActions?: string[]
    isSupervisor: boolean
    userLogin?: string
}

const ActionsSuiviesTrayTable: React.FunctionComponent<Props> = (props: Props) => {
        return (
            <RemoteActionsSuiviesTrayTable
                onSelectAction={props.onSelectAction}
                selected={props.selectedActions}
                isSupervisor={props.isSupervisor}
                userLogin={props.userLogin}
            />
        )

}
export default ActionsSuiviesTrayTable;