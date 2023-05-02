import AbstractService from "./AbstractService";

export default class AuthorizationService extends AbstractService {

    public async getAuthorizations(sessionId: string): Promise<Array<string>> {
        return this.get<Array<string>>(`/fastr-auth/user/authorizations/${sessionId}`);
    }

}
