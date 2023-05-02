export interface ArbeoActDetailData {
    diagId: string
    startDate
    guidelines: string[]
    qualifTags: string[]
    themeTags: string[]
    act: {
        description: string,
        code: string,
        label: string,
        parameters: [
            {
                name: string,
                value: string
            }
        ]
    }
    diagStatus: string
    transfert:{
        activityCode:string,
        activityLabel:string
    }
    processing: boolean
    processConclusion: string
    callReason: string
    finalAction: string
}