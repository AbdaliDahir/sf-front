export default interface OrderStep {
    number: number;
    label: string;
    details: string;
    date: string;
    finish: boolean;
    active: boolean;
}
