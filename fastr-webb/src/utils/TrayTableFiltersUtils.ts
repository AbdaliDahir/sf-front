
export const fillTableFiltersFromSessionStorage = (sessionTableFilters, filters ) => {
    /**
     * CASES
     */
    if(sessionTableFilters?.progressStatus && ( !filters.progressStatus || filters.progressStatus.filterVal === undefined)){
        filters.progressStatus = sessionTableFilters?.progressStatus
    }
    if(sessionTableFilters?.status && ( !filters.status || filters.status.filterVal === undefined)){
        filters.status = sessionTableFilters?.status
    }

    if(sessionTableFilters?.caseId &&  filters.caseId?.filterVal === undefined){
        filters.caseId = sessionTableFilters?.caseId
    }
    if(sessionTableFilters?.["caseOwner.login"] && (  filters["caseOwner.login"]?.filterVal === undefined)){
        filters["caseOwner.login"] = sessionTableFilters?.["caseOwner.login"]
    }
    if(sessionTableFilters?.["caseCreator.activity.label"] && (  filters["caseCreator.activity.label"]?.filterVal === undefined)){
        filters["caseCreator.activity.label"] = sessionTableFilters?.["caseCreator.activity.label"]
    }
    if(sessionTableFilters?.["qualification.tags"] && (  filters["qualification.tags"]?.filterVal === undefined)){
        filters["qualification.tags"] = sessionTableFilters?.["qualification.tags"]
    }

    if(sessionTableFilters?.["resources.resourceType"] && ( !filters["resources.resourceType"] || filters["resources.resourceType"].filterVal === undefined)){
        filters["resources.resourceType"] = sessionTableFilters?.["resources.resourceType"]
    }
    /**
     * ACTIONS
     */

    if(sessionTableFilters?.["processCurrentState.assignee.login"] && (  filters["processCurrentState.assignee.login"]?.filterVal === undefined)){
        filters["processCurrentState.assignee.login"] = sessionTableFilters?.["processCurrentState.assignee.login"]
    }

    if(sessionTableFilters?.["creationAuthor.activity.label"] && (  filters["creationAuthor.activity.label"]?.filterVal === undefined)){
        filters["creationAuthor.activity.label"] = sessionTableFilters?.["creationAuthor.activity.label"]
    }
    /**
     * ACTIONS SUIVIES
     */
    if(sessionTableFilters?.["monitoringCurrentState.assignee.login"] && (  filters["monitoringCurrentState.assignee.login"]?.filterVal === undefined)){
        filters["monitoringCurrentState.assignee.login"] = sessionTableFilters?.["monitoringCurrentState.assignee.login"]
    }

    if(sessionTableFilters?.["processCurrentState.assignee.activity.label"] && (  filters["processCurrentState.assignee.activity.label"]?.filterVal === undefined)){
        filters["processCurrentState.assignee.activity.label"] = sessionTableFilters?.["processCurrentState.assignee.activity.label"]
    }

    if(sessionTableFilters?.["processCurrentState.conclusion.label"] && (  filters["processCurrentState.conclusion.label"]?.filterVal === undefined)){
        filters["processCurrentState.conclusion.label"] = sessionTableFilters?.["processCurrentState.conclusion.label"]
    }
    /**
     * CASES ACTIONS
     */

    if(sessionTableFilters?.serviceType && ( !filters.serviceType || filters.serviceType.filterVal === undefined)){
        filters.serviceType = sessionTableFilters?.serviceType
    }
    /**
     * ACTIONS ACTIONS SUIVIES
     */
    if(sessionTableFilters?.actionId &&  filters.actionId?.filterVal === undefined){
        filters.actionId = sessionTableFilters?.actionId
    }
    if(sessionTableFilters?.["processCurrentState.status"] && ( !filters["processCurrentState.status"] || filters["processCurrentState.status"].filterVal === undefined)){
        filters["processCurrentState.status"] = sessionTableFilters?.["processCurrentState.status"]
    }
    if(sessionTableFilters?.["processCurrentState.progressStatus.code"] && ( !filters["processCurrentState.progressStatus.code"] || filters["processCurrentState.progressStatus.code"].filterVal === undefined)){
        filters["processCurrentState.progressStatus.code"] = sessionTableFilters?.["processCurrentState.progressStatus.code"]
    }

    /**
     * CASES ACTIONS ACTIONS SUIVIES
     */
    if(sessionTableFilters?.["themeQualification.tags"] && (  filters["themeQualification.tags"]?.filterVal === undefined)){
        filters["themeQualification.tags"] = sessionTableFilters?.["themeQualification.tags"]
    }
    return filters

}

export const  checkAndCorrectFilters = (filters) => {
    /**
     * CASES
     */
    if (filters.caseId && filters.caseId?.filterVal !== undefined) {
        const value = filters.caseId.filterVal.value
        filters.caseId.filterVal = value
    } else {
        delete filters.caseId
    }

    if (filters["caseOwner.login"] && filters["caseOwner.login"]?.filterVal !== undefined) {
        const value = filters["caseOwner.login"].filterVal.value
        filters["caseOwner.login"].filterVal = value
    } else {
        delete filters["caseOwner.login"]
    }
    if (filters["caseCreator.activity.label"] && filters["caseCreator.activity.label"]?.filterVal !== undefined) {
        const value = filters["caseCreator.activity.label"].filterVal.value
        filters["caseCreator.activity.label"].filterVal = value
    } else {
        delete filters["caseCreator.activity.label"]
    }

    if (filters["qualification.tags"] && filters["qualification.tags"]?.filterVal !== undefined) {
        const value = filters["qualification.tags"].filterVal.value
        filters["qualification.tags"].filterVal = value
    } else {
        delete filters["qualification.tags"]
    }

    if (filters["themeQualification.tags"] && filters["themeQualification.tags"]?.filterVal !== undefined) {
        const value = filters["themeQualification.tags"].filterVal.value
        filters["themeQualification.tags"].filterVal = value
    } else {
        delete filters["themeQualification.tags"]
    }
    if (filters.progressStatus?.filterVal !== undefined) {
        const value = filters.progressStatus.filterVal.option
        filters.progressStatus.filterVal = value
    } else {
        delete filters.progressStatus
    }
    if (filters.status?.filterVal !== undefined) {
        const value = filters.status.filterVal.option
        filters.status.filterVal = value
    } else {
        delete filters.status
    }
    // CASES ACTIONS
    if (filters.serviceType?.filterVal !== undefined) {
        const value = filters.serviceType.filterVal.option
        filters.serviceType.filterVal = value
    } else {
        delete filters.serviceType
    }
    if (filters["resources.resourceType"]?.filterVal !== undefined) {
        const value = filters["resources.resourceType"].filterVal.option
        filters["resources.resourceType"].filterVal = value
    } else {
        delete filters["resources.resourceType"]
    }
    /**
     * ACTIONS
     */
    if (filters.actionId && filters.actionId?.filterVal !== undefined) {
        const value = filters.actionId.filterVal.value
        filters.actionId.filterVal = value
    } else {
        delete filters.actionId
    }

    if (filters["processCurrentState.status"]?.filterVal !== undefined) {
        const value = filters["processCurrentState.status"].filterVal.option
        filters["processCurrentState.status"].filterVal = value
    } else {
        delete filters["processCurrentState.status"]
    }

    if (filters["processCurrentState.progressStatus.code"]?.filterVal !== undefined) {
        const value = filters["processCurrentState.progressStatus.code"].filterVal.option
        filters["processCurrentState.progressStatus.code"].filterVal = value
    } else {
        delete filters["processCurrentState.progressStatus.code"]
    }

    if (filters["processCurrentState.assignee.login"] && filters["processCurrentState.assignee.login"]?.filterVal !== undefined) {
        const value = filters["processCurrentState.assignee.login"].filterVal.value
        filters["processCurrentState.assignee.login"].filterVal = value
    } else {
        delete filters["processCurrentState.assignee.login"]
    }

    if (filters["creationAuthor.activity.label"] && filters["creationAuthor.activity.label"]?.filterVal !== undefined) {
        const value = filters["creationAuthor.activity.label"].filterVal.value
        filters["creationAuthor.activity.label"].filterVal = value
    } else {
        delete filters["creationAuthor.activity.label"]
    }
    /**
     * ACIONS SUIVIES
     */
    if (filters["monitoringCurrentState.assignee.login"] && filters["monitoringCurrentState.assignee.login"]?.filterVal !== undefined) {
        const value = filters["monitoringCurrentState.assignee.login"].filterVal.value
        filters["monitoringCurrentState.assignee.login"].filterVal = value
    } else {
        delete filters["monitoringCurrentState.assignee.login"]
    }

    if (filters["processCurrentState.assignee.activity.label"]?.filterVal !== undefined) {
        const value = filters["processCurrentState.assignee.activity.label"].filterVal.value
        filters["processCurrentState.assignee.activity.label"].filterVal = value
    } else {
        delete filters["processCurrentState.assignee.activity.label"]
    }

    if (filters["processCurrentState.conclusion.label"] && filters["processCurrentState.conclusion.label"]?.filterVal !== undefined) {
        const value = filters["processCurrentState.conclusion.label"].filterVal.value
        filters["processCurrentState.conclusion.label"].filterVal = value
    } else {
        delete filters["processCurrentState.conclusion.label"]
    }
    return filters
}