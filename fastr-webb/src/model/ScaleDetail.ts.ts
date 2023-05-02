export interface ScaleDetail {

    step;
    dateTime;

    // Progress + Date not resolve before
    doNotResolveBeforeDate;
    progressStatus;

    // Contact
    initialContact;
    cancelContact;

    // Act / Site
    requestedActivite;
    site;

    // Ctx
    assignmentContext;
    reopenedContext;

    // Theme
    themeQualification;

    // Conclusion
    finishingTreatmentConclusion;

    // Additional data
    data;
    context?:string;
}
