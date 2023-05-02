export interface EngagementCurrentStatus {
    status: EngagementStatus;
    currentEngagementStatusLabel: string;
    engagementDate: string;
}


export enum EngagementStatus {
    ENGAGED = 'ENGAGED',
    DISENGAGED = 'DISENGAGED',
    WITHOUT_ENGAGEMENT = 'WITHOUT_ENGAGEMENT'
}