export default interface ErrorModel {
    status: number;
    message: string;
    fieldsErrors: FieldErrorModel[];
}

export interface FieldErrorModel {
    field: string;
    message: string;
}