import {AddNoteRequestDTO} from "../model/AddNoteRequestDTO";


export function getEmptyScalingConclusion() {
    return {
        unresolutionCause: "",
        clientForwarned: "",
        treatmentType: "",
        clientConfirmation: "",
        dysfuntionCause: "",
        resolutionAction: "",
        informingWay: "",
        isUnjustified: "",
        unjustificationCause: ""
    }
}


export function buildScalingConclusion(dto: AddNoteRequestDTO) {
    return {
        unresolutionCause: dto.unresolutionCause,
        clientForwarned: dto.clientForwarned,
        treatmentType: dto.treatmentType,
        clientConfirmation: dto.clientConfirmation,
        dysfuntionCause: dto.dysfuntionCause,
        resolutionAction: dto.resolutionAction,
        informingWay: dto.informingWay,
        isUnjustified: dto.isUnjustified,
        unjustificationCause: dto.unjustificationCause
    }
}