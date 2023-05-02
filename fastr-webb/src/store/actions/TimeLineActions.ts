import { TimeLineRegularisationItem } from "src/model/TimeLine/Regularisation";
import { SET_TIME_LINE_REGULARISATION } from "./actionsTypes";


export function setTimeLineRegularisation(regularisation: TimeLineRegularisationItem[]) {
    return { type: SET_TIME_LINE_REGULARISATION, payload: regularisation }
}