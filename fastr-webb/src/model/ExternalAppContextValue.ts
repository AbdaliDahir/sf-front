/*
 * IMPORTANT: enum value refers to mongo field "settingDetail.paramFunctions.FASTR.function"
 * (collection "settings", "settingName"="boExternalApplications")
 *
 * Exceptions :
 *  - SERVICE_ID
 */
export enum ExternalAppContextValue {
    SERVICE_ID = "serviceId",
    ID_EXTERNE_PERSONNE = "idExternePersonne",
    CODE_ADG_EXTRANET = "codeAdgExtranet",
    CASE_ID = "caseId",
    ACT_ID = "actId",
    CONTACT_ID = "contactId",
    ID_APP = "idApp",
    PASSWORD = "auiPassword",
    PASSWORD_SIMPLE = "password",
    PER_ID = "perId",
    Code_TAC = "CodeTAC",
    AUTHORIZATION = "authorization",
    IDSRC_DEM = "idsrc_dem"
}
