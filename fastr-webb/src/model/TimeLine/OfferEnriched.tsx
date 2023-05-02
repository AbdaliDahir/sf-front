export interface OfferEnriched {
    actionCode: string;
    actionStatus: string;
    activationOfferServiceDate: Date;
    associationType: string;
    commercialStatus: string;
    creationOfferServiceDate: Date;
    effectiveDate: Date;
    fees: string;
    feesWithoutTaxes: string;
    id: string;
    occursNumber: string;
    offerId: string;
    offerName: string;
    parameterName: string;
    parameterValue: string;
    recurrentFees: string;
    recurrentFeesWithoutTaxes: string;
    refSiebel: string;
    serviceId: string;
    siebelRefService: string;
    technicalStatus: string;
    terminationDate: Date;
    updateDate: Date;
    offerFamily: string;
}