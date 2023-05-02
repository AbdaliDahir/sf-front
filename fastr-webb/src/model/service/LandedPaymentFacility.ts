export interface LandedPaymentFacilityInfos {
    offerCode: string;
    engagementEndDate: string;
    anticipatedPurchaseDate: string;
    totalDurationInMonths: number;
    remainingPaymentMonths: number;
    remainingPaymentDays: number;
    anticipatedPurchaseEligibility: boolean;
    totalAmountTTC: number;
    monthlyPaiementAmountTTC: number;
    remainingAmountTTC: number;
    label: string;
}
