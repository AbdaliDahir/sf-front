// TODO: to externilize

export interface CommentLimits {
    min: number;
    max: number;
}

// TODO: verifier
export const COMMENTS_LIMITS_DICTIONARY: { [id: string]: CommentLimits } = {
    DOSSIER: { min: 10, max: 1000 },
    ACTION: { min: 10, max: 1000 },
    DEMANDE: { min: 10, max: 1000 },
    SUPPORT_TECHNIQUE: { min: 10, max: 1000 },
    ACTIVITE: { min: 10, max: 1000 },
    DEFAULT: { min: 10, max: 1000 }
};
