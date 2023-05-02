export interface Page<T> {

    content: T[]
    size: number
    totalElements: number
    totalPages: number
    numberOfElements: number
    first: boolean
    last: boolean
}