import {Address} from '../Address';

export interface SEPAMethod {

    owner: string;

    iban: string;

    bic: string;

    bankName: string;

    idRUM: string;

    mandateStatus: SEPAMethodMandateStatus;

    mandateSignatureStatus: SEPAMethodSignatureStatus;

    mandateSignatureDate: string;

    mandateCreationDate: string;

    mandateRevocationDate: string;

    mandateEndDate: string;

    mandateReminderDate: string;

    mandateNumberOfReminders: number;

    mandateAddress: Address;

}

export type SEPAMethodMandateStatus = 'SUSPENDED' | 'CREATED' | 'OBSOLETE' | 'REVOCATED' | 'VALID';

export type SEPAMethodSignatureStatus = 'ELECTRONIC' | 'WAITING' | 'PAPER' | 'PARK';
