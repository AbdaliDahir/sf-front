export enum TrayHeaderFilterEnum {
    QUALIFIED = "QUALIFIED",
    ONGOING = "ONGOING",
    NOT_UPDATED_IN_5_DAYS = "NOT_UPDATED_IN_5_DAYS",
    ASSIGNMENT_EXCEED = "ASSIGNMENT_EXCEED",
    NOT_BEFORE_EXCEED = "NOT_BEFORE_EXCEED",
    NONE = "NONE",
    REOPENED = "REOPENED", // !_! +custom pour gérer les monitorings (of power)
    TO_MONITOR = "TO_MONITOR",
    MONITORED = "MONITORED",
    MONITORING_TO_FINALIZE = "MONITORING_TO_FINALIZE"
}