export interface GdprCommentDetails {
    id          : string;
    creationDate: string;
    updateDate  : string;
    value       : string;
    type        : string;
    status      ?: 'UPDATED' | 'WATCHED'
}