import * as actionTypes from "./actionsTypes";

export interface PersistedActionsProps {
    showGCOInTimeLine: () => void
    hideGCOInTimeLine: () => void
    showSOCOInTimeLine: () => void
    hideSOCOInTimeLine: () => void

    showREGULInTimeLine: () => void
    hideREGULInTimeLine: () => void
}


export function showGCOInTimeLine() {
    return {
        type: actionTypes.SHOW_GCO
    }
}

export function hideGCOInTimeLine() {
    return {
        type: actionTypes.HIDE_GCO
    }
}

export function showSOCOInTimeLine() {
    return {
        type: actionTypes.SHOW_SOCO
    }
}

export function hideSOCOInTimeLine() {
    return {
        type: actionTypes.HIDE_SOCO
    }
}

export function showREGULInTimeLine() {
    return {
        type: actionTypes.SHOW_REGUL
    }
}

export function hideREGULInTimeLine() {
    return {
        type: actionTypes.HIDE_REGUL
    }
}
