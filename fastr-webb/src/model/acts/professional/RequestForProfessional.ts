export default interface RequestForProfessional {
    legalPersonDto: {
        companyName: string
        chorusFlag: boolean
        chorusLegalEngagement?:  string | undefined
        chorusServiceCode?:  string | undefined
        siret: string
        legalCategoryCode?: string
        apeCode?: string
        legalCategoryName?: string
        legalCreationDate: string
        legalStatus?: string
        taxSystem: string
        vtaNumber?: string
    }
}