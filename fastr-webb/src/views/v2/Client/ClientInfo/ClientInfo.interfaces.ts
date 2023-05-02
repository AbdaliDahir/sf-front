export interface BasicClientInfoElement {
    value: string;
    icon: any;
    isBold?: boolean;
    extraInfo?: string;
}
export interface BasicClientInfo {
    companyName?: BasicClientInfoElement;
    fullName?: BasicClientInfoElement;
    phone: BasicClientInfoElement;
    adress: BasicClientInfoElement;
    email: BasicClientInfoElement;
    type: BasicClientInfoElement;
    birthDate: BasicClientInfoElement;
    siren?: BasicClientInfoElement;
}