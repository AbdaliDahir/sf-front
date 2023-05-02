import AbstractService from "./AbstractService";
import {ActivationFlag} from "../model/activationFlag/ActivationFlag";

export default class ActivationFlagService extends AbstractService {

    constructor() {
        super(true);
    }
    public async getAllActivationFlag(): Promise<ActivationFlag[]> {
        return this.get<ActivationFlag[]>(`/fastr-auth/activationFlags`);
    }

}
