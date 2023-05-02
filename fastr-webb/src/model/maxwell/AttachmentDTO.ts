import {EAttachmentType} from "./enums/EAttachmentType";

export interface AttachmentDTO {
    name    : string,
    fullPath: string,
    type    : EAttachmentType;
}