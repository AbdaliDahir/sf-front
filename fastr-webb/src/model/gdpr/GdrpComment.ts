import { GdprCommentDetails } from "./GdprCommentDetails";

export interface GdprComment {
    comment: GdprCommentDetails,
    objectId: string;
    objectType: 'DOSSIER' | 'ACTION' | 'DEMANDE' | 'SUPPORT_TECHNIQUE' | 'ACTIVITE' | string;
    qualification: string;
    index: number;
    isPersisted?: boolean;
}