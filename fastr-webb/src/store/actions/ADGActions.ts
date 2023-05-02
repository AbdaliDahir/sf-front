import {ADD_MODIFIED_SERVICE_ID, REMOVE_MODIFIED_SERVICE_ID} from "./actionsTypes";

export function addModifiedServiceId(id: string) {
    return {type: ADD_MODIFIED_SERVICE_ID, payload: id}
}

export function removeModifiedServiceId(id: string) {
    return {type: REMOVE_MODIFIED_SERVICE_ID, payload: id}
}