export interface BillsResponseDTO {
    lineNumber?: string,
    billNumber?: string,
    date?: string,
    amount?: number,
    type?: string,
    dmsItems?: Array<DmsItem>
}


export interface DmsItem {
    label?: string,
    from?: string,
    to?: string,
    amount?: number
    dmsCategories?: Array<Category>
}


export interface Category {
    label?:string,
    amount?: number
    dmsDetails?: Array<Detail>
}

export interface Detail {
    label?:string,
    from?: string,
    to?: string,
    amount?: number
}