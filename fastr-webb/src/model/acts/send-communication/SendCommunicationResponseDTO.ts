import {GingerMedia, GingerParameter} from "./GingerTemplateModel"


export interface RecipientResponseDTO {
    defaultMedia: GingerMedia
    recipientByMediaMap: {
        EMAIL: string
        SMS: string
    }
}

export interface TemplatePreviewResponseDTO {
    content: string
    valid: boolean
    parameters: Array<GingerParameter>
}