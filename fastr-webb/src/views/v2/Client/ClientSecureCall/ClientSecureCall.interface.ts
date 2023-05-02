
export interface ClientSecureCall {
    birthDate: ClientSecureCallItem,
    birthPlace: ClientSecureCallItem,
    address: ClientSecureCallItem,
    email:ClientSecureCallItem,
    contactNumber:ClientSecureCallItem,
    banqueName:ClientSecureCallItem

}
export interface ClientSecureCallItem {
    title: string,
    value: string
}
export interface ClientSecureCallStateItem {
    clientId: string,
    secured: boolean
}