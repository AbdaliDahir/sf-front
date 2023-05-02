import { GdprCommentDetails } from "./GdprCommentDetails";

export interface GdprCommentDto {
    objectId: string;
    objectType: 'DOSSIER' | 'ACTION' | 'DEMANDE' | 'SUPPORT_TECHNIQUE' | 'ACTIVITE' | string;
    qualification: string;
    commentDetails: GdprCommentDetails[]
}
