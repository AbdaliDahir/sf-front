
export interface BillsRequestDTO {
    dmsIdBills: Array<BillsRequest>
}

export interface BillsRequest {
    date?: string
    billReference?: string
}