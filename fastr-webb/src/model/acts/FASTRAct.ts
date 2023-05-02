import Act from "./Act";

export default interface FASTRAct<T extends Act> {
    act?: T;
    personId: string;
    pro?: boolean;
    serviceId: string;
    accountId?: string;
    dueDate?: Date;
    caseId?: string;
    notification?: boolean;
    /**
     * @deprecated
     */
    scs?: string
    /**
     * @deprecated
     */
    csu?: string
    actName?: string;
    contactId?: string;
}