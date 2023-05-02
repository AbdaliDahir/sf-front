import {Address} from './Address';

export interface Corporation {

    name: string;

    apeCode?: string;

    vtaNumber?: string;

    legalCategoryCode?: string;

    address: Address;

    legalCreationDate: string;

    legalCategoryName?: string;

    chorusFlag: boolean;

    chorusServiceCode?: string;

    chorusLegalEngagement?: string;

    legalStatus?: string;

    treasurer?: string;

    creditLimit?: number;

}
