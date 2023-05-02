import {GingerMedia} from "./GingerTemplateModel"

export interface SendCommunicationRequestDTO {
    templateName?: string
    adresse?: string,
    yourRef?: string,
    templateMedia?: GingerMedia,
    messageParameters?: Array<{ name: string, value?: string }>
}


export interface ModelRequestDTO {
    activityCode?: string
    idPerson: string
    idService: string
    notificationTypeCode: string
}

export interface RecipientRequestDTO {
    clientId: string
    serviceId: string
    templateId: number | string
}

export interface TemplatePreviewRequestDTO {
    templateName?: string
    previewParameters?: PreviewParameters
    templateMedia?: GingerMedia
}

export type PreviewParameters = Array<{ name: string, value?: string }>

