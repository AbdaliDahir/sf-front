export interface Alert {
    title: string;
    description: string;
    criticity: Criticity;
}


export enum Criticity {
    INFO,
    WARNING,
    DANGER
}