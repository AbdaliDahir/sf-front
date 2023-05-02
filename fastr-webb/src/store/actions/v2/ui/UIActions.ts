import * as actionsTypes from "./UIActionsTypes"

export const setBlockingUIV2 = (value : boolean) => (
    {
        type: actionsTypes.SET_BLOCKING_UI_V2,
        payload: value

    }
)
