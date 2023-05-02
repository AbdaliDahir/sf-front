export interface CheckIbanBicResponseDTO {

    bankName: string;

    validBic: boolean;

    cityHeading: string;

    branchInformation: string;

    countryCode: string;

    getPhysicalAddress1: string;

    setPhysicalAddress1: void;

    errorMessage?: string;

}
