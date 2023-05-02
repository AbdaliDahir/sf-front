import * as actionTypes from './actionsTypes'

export interface UIProps {
    toggleBlockingUI: () => void
}

export function toggleBlockingUI() {
    return {
        type: actionTypes.TOGGLE_BLOCKING_UI
    }
}
