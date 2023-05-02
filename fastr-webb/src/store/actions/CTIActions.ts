import * as actionTypes from './actionsTypes'

export interface CTIActionsProps {
    setCTIToFinished: () => void
    setCTIToOngoing: () => void
}


export function setCTIToFinished() {
    return {
        type: actionTypes.CTI_FINISHED
    }
}

export function setCTIToOngoing() {
    return {
        type: actionTypes.CTI_ONGOING
    }
}