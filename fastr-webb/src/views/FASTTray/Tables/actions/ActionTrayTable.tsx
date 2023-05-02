import * as React from "react";
import RemoteActionTrayTable from "./RemoteActionTrayTable";

interface Props {
    onSelectAction?: (row, isSelect) => void
    selectedActions?: string[]
    site?: string | null;
    isSupervisor: boolean
    userLogin?: string
}

const ActionTrayTable: React.FunctionComponent<Props> = (props: Props) => {
    return (
            <RemoteActionTrayTable
                onSelectAction={props.onSelectAction}
                selected={props.selectedActions}
                isSupervisor={props.isSupervisor}
                userLogin={props.userLogin}
            />
        )
}
export default ActionTrayTable;