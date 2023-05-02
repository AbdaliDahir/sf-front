export interface GingerTemplateModel {
    name: string
    id: number
    activities: Array<string>
    description: string
    tags: Array<string>
    availableMedia?: Array<GingerMedia>
    media: GingerMedia
    parameters: Array<GingerParameter>
}

export interface GingerParameter {
    description: string
    mandatory: boolean
    auto: boolean | null
    name: string
    sizeMax?: number | null
    sizeMin?: number | null
    type: GingerParamType
    values: Array<{ key: string, label: string }>
    value?: string
    valid?: boolean
}

export type GingerParamType =
    "msisdn"
    | "string"
    | "date"
    | "reel"
    | "int"
    | "heure"
    | "boolean"
    | "email"
    | "liste"
    | "list"
    | "datetime";


export interface RecipientMedia {
    media?: GingerMedia
    recipientByMediaMap?: {
        EMAIL: string
        SMS: string
    }
}

export type GingerMedia = 'EMAIL' | 'SMS' | string;