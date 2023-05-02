export default interface BillDocument {
    id: string;
    url: string;
    type: BillType;
    format: BillFormat;
}

export enum BillFormat {
    PDF, XML
}

export type BillType =
    "OVERVIEW" | "FULL" | "GLO"