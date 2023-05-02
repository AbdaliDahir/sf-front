export enum EMaxwellIncidentStatus {
    WAITING = 'WAITING',
    CLOSED = 'CLOSED',
    RESOLVED = 'RESOLVED',
    CREATED = 'CREATED',
    CREE = 'CREE',
    FERME = 'Fermé',
    IN_PROGRESS = 'IN_PROGRESS',
    CANCELED = 'CANCELED',
    REOPENED = 'REOPENED',
}

export const MaxwellIncidentStatusOrder = {}
MaxwellIncidentStatusOrder[EMaxwellIncidentStatus.WAITING] = 1;
MaxwellIncidentStatusOrder[EMaxwellIncidentStatus.REOPENED] = 1;
MaxwellIncidentStatusOrder[EMaxwellIncidentStatus.CLOSED] = 7;
MaxwellIncidentStatusOrder[EMaxwellIncidentStatus.CREATED] = 2;
MaxwellIncidentStatusOrder[EMaxwellIncidentStatus.CREE] = 3;
MaxwellIncidentStatusOrder[EMaxwellIncidentStatus.FERME] = 4;
MaxwellIncidentStatusOrder[EMaxwellIncidentStatus.IN_PROGRESS] = 5;
MaxwellIncidentStatusOrder[EMaxwellIncidentStatus.CANCELED] = 6;