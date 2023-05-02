export interface FadetContext {
    ndi: string
    fadets?: Fadet[]
}

export interface Fadet {
    section?: string
    type?: string
    detail?: string
    caller?: string
    destination?: string
    callerNumber?: string
    callStart?: string
    callDuration?: string
    billedDuration?: string
    amoutTTC?: string
}