export interface DiagAnalysisRequestCLO {
    caseId: string
    loginCC?: string
    siebelCode?: string
    billingAccountId?: string
    doNotApplyFilters?:boolean
    serviceId: string
    actId?: string
}